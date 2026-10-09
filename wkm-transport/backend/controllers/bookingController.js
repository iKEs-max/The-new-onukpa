// controllers/bookingController.js
const Booking = require('../models/Booking');
const Route = require('../models/Route');
const { generateTicketCode } = require('../utils/helpers');

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const {
            route_id,
            passenger_name,
            passenger_email,
            passenger_phone,
            travel_date,
            departure_time,
            passengers
        } = req.body;

        // Get route details
        const route = await Route.findById(route_id);
        if (!route) {
            return res.status(404).json({
                success: false,
                message: 'Route not found'
            });
        }

        // Calculate total amount
        const total_amount = route.price * (passengers || 1);

        // Generate unique ticket code
        const ticket_code = generateTicketCode();

        // Create booking
        const bookingId = await Booking.create({
            route_id,
            passenger_name,
            passenger_email: passenger_email || null,
            passenger_phone,
            travel_date,
            departure_time,
            passengers: passengers || 1,
            total_amount,
            ticket_code
        });

        // Return booking details
        const booking = await Booking.findById(bookingId);

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking: {
                id: bookingId,
                ticket_code: ticket_code,
                destination: route.destination,
                travel_date: travel_date,
                departure_time: departure_time,
                passengers: passengers || 1,
                total_amount: total_amount,
                payment_status: 'pending'
            }
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get booking by ID
exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.json({
            success: true,
            booking: booking
        });
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get booking by ticket code
exports.getBookingByTicket = async (req, res) => {
    try {
        const { ticketCode } = req.params;
        const db = require('../config/database');

        const [rows] = await db.execute(
            `SELECT b.*, r.destination, r.price 
             FROM bookings b
             JOIN routes r ON b.route_id = r.id
             WHERE b.ticket_code = ?`,
            [ticketCode]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.json({
            success: true,
            booking: rows[0]
        });
    } catch (error) {
        console.error('Get booking by ticket error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get all bookings (admin)
exports.getAllBookings = async (req, res) => {
    try {
        const db = require('../config/database');
        const { status, date, destination } = req.query;

        let query = `SELECT b.*, r.destination 
                     FROM bookings b 
                     JOIN routes r ON b.route_id = r.id 
                     WHERE 1=1`;
        const params = [];

        if (status) {
            query += ' AND b.payment_status = ?';
            params.push(status);
        }
        if (date) {
            query += ' AND b.travel_date = ?';
            params.push(date);
        }
        if (destination) {
            query += ' AND r.destination LIKE ?';
            params.push(`%${destination}%`);
        }

        query += ' ORDER BY b.created_at DESC';

        const [rows] = await db.execute(query, params);

        res.json({
            success: true,
            count: rows.length,
            bookings: rows
        });
    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get dashboard stats (admin)
exports.getDashboardStats = async (req, res) => {
    try {
        const db = require('../config/database');

        // Total bookings
        const [totalBookings] = await db.execute('SELECT COUNT(*) as count FROM bookings');
        
        // Today's bookings
        const [todayBookings] = await db.execute(
            'SELECT COUNT(*) as count FROM bookings WHERE DATE(created_at) = CURDATE()'
        );
        
        // Total revenue
        const [totalRevenue] = await db.execute(
            'SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE payment_status = ?',
            ['paid']
        );
        
        // Today's revenue
        const [todayRevenue] = await db.execute(
            'SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE payment_status = ? AND DATE(created_at) = CURDATE()',
            ['paid']
        );

        // Bookings by status
        const [statusBreakdown] = await db.execute(
            'SELECT payment_status, COUNT(*) as count FROM bookings GROUP BY payment_status'
        );

        // Popular routes
        const [popularRoutes] = await db.execute(
            `SELECT r.destination, COUNT(b.id) as booking_count, SUM(b.total_amount) as revenue
             FROM bookings b JOIN routes r ON b.route_id = r.id
             WHERE b.payment_status = 'paid'
             GROUP BY r.destination ORDER BY booking_count DESC`
        );

        // Recent bookings
        const [recentBookings] = await db.execute(
            `SELECT b.*, r.destination FROM bookings b 
             JOIN routes r ON b.route_id = r.id 
             ORDER BY b.created_at DESC LIMIT 10`
        );

        res.json({
            success: true,
            stats: {
                totalBookings: totalBookings[0].count,
                todayBookings: todayBookings[0].count,
                totalRevenue: totalRevenue[0].total,
                todayRevenue: todayRevenue[0].total,
                statusBreakdown: statusBreakdown,
                popularRoutes: popularRoutes,
                recentBookings: recentBookings
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
