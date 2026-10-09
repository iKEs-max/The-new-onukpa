// controllers/routeController.js
const Route = require('../models/Route');

// ── Helper ──────────────────────────────────────────────────────────────────
const parseRoute = (route) => ({
    ...route,
    departure_times: route.departure_times
        ? (typeof route.departure_times === 'string'
            ? (() => { try { return JSON.parse(route.departure_times); } catch { return [route.departure_times]; } })()
            : route.departure_times)
        : []
});

// Get all routes (public)
exports.getAllRoutes = async (req, res) => {
    try {
        const routes = await Route.getAll();
        res.json({ success: true, routes: routes.map(parseRoute) });
    } catch (error) {
        console.error('Get routes error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get route by ID (public)
exports.getRoute = async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);
        if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
        res.json({ success: true, route: parseRoute(route) });
    } catch (error) {
        console.error('Get route error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Create route (admin only)
exports.createRoute = async (req, res) => {
    try {
        const { destination, origin, price, base_price, departure_times, departure_time, total_seats, available_seats, status } = req.body;

        if (!destination || !(base_price || price)) {
            return res.status(400).json({
                success: false,
                message: 'Destination and price are required'
            });
        }

        const routeId = await Route.create({
            origin,
            destination,
            price,
            base_price,
            departure_times,
            departure_time,
            total_seats,
            available_seats,
            status
        });

        res.status(201).json({ success: true, message: 'Route created successfully', routeId });
    } catch (error) {
        console.error('Create route error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update route (admin only) — full update
exports.updateRoute = async (req, res) => {
    try {
        const routeId = req.params.id;
        const existing = await Route.findById(routeId);
        if (!existing) return res.status(404).json({ success: false, message: 'Route not found' });

        const updated = await Route.update(routeId, req.body);
        if (updated) {
            const fresh = await Route.findById(routeId);
            res.json({ success: true, message: 'Route updated', route: parseRoute(fresh) });
        } else {
            res.status(500).json({ success: false, message: 'Update failed' });
        }
    } catch (error) {
        console.error('Update route error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Toggle route status ACTIVE/INACTIVE (admin only)
exports.updateRouteStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['ACTIVE', 'INACTIVE'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Status must be ACTIVE or INACTIVE' });
        }

        const updated = await Route.updateStatus(req.params.id, status);
        if (!updated) return res.status(404).json({ success: false, message: 'Route not found' });

        res.json({ success: true, message: `Route is now ${status}`, status });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update seat availability (admin only)
// Admin sets total_seats and available_seats directly
exports.updateRouteSeats = async (req, res) => {
    try {
        const { total_seats, available_seats } = req.body;

        if (available_seats === undefined && total_seats === undefined) {
            return res.status(400).json({ success: false, message: 'Provide total_seats and/or available_seats' });
        }

        const existing = await Route.findById(req.params.id);
        if (!existing) return res.status(404).json({ success: false, message: 'Route not found' });

        const newTotal = total_seats ?? existing.total_seats;
        const newAvailable = available_seats ?? existing.available_seats;

        if (newAvailable > newTotal) {
            return res.status(400).json({ success: false, message: 'Available seats cannot exceed total seats' });
        }

        await Route.updateSeats(req.params.id, newTotal, newAvailable);

        // Derive human-readable availability label
        const pct = newTotal > 0 ? (newAvailable / newTotal) * 100 : 0;
        let availabilityLabel;
        if (newAvailable === 0) availabilityLabel = 'Full';
        else if (newAvailable === 1) availabilityLabel = '1 Seat Left';
        else if (pct <= 20) availabilityLabel = 'Filling Fast';
        else availabilityLabel = 'Available';

        res.json({
            success: true,
            message: 'Seat availability updated',
            totalSeats: newTotal,
            availableSeats: newAvailable,
            availabilityLabel
        });
    } catch (error) {
        console.error('Update seats error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete route (admin only)
exports.deleteRoute = async (req, res) => {
    try {
        const deleted = await Route.delete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Route not found' });
        res.json({ success: true, message: 'Route deleted successfully' });
    } catch (error) {
        console.error('Delete route error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Dashboard stats (admin only)
exports.getDashboardStats = async (req, res) => {
    try {
        const db = require('../config/database');

        const [[{ totalRoutes }]] = await db.execute('SELECT COUNT(*) AS totalRoutes FROM routes');
        const [[{ activeRoutes }]] = await db.execute("SELECT COUNT(*) AS activeRoutes FROM routes WHERE status = 'ACTIVE'");
        const [[{ totalBookings }]] = await db.execute('SELECT COUNT(*) AS totalBookings FROM bookings');
        const [[{ totalRevenue }]] = await db.execute("SELECT COALESCE(SUM(total_amount), 0) AS totalRevenue FROM bookings WHERE status != 'CANCELLED'");
        const [[{ confirmedBookings }]] = await db.execute("SELECT COUNT(*) AS confirmedBookings FROM bookings WHERE status = 'CONFIRMED'");
        const [[{ pendingBookings }]] = await db.execute("SELECT COUNT(*) AS pendingBookings FROM bookings WHERE status = 'PENDING'");

        // Last 7 days bookings for chart
        const [chartData] = await db.execute(`
            SELECT DATE(created_at) AS date, COUNT(*) AS count, SUM(total_amount) AS revenue
            FROM bookings
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `);

        // Recent bookings (last 10)
        const [recentBookings] = await db.execute(`
            SELECT b.*, r.origin, r.destination
            FROM bookings b
            LEFT JOIN routes r ON b.route_id = r.id
            ORDER BY b.created_at DESC
            LIMIT 10
        `);

        // Routes with fill %
        const [routesFill] = await db.execute(`
            SELECT id, origin, destination, total_seats, available_seats, status, base_price
            FROM routes
            ORDER BY origin, destination
        `);

        res.json({
            success: true,
            stats: {
                totalRoutes,
                activeRoutes,
                totalBookings,
                totalRevenue: parseFloat(totalRevenue),
                confirmedBookings,
                pendingBookings,
                chartData,
                recentBookings,
                routesFill
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
