// models/Route.js
const db = require('../config/database');

class Route {
    // Get all routes
    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM routes ORDER BY origin, destination');
        return rows;
    }

    // Get route by ID
    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM routes WHERE id = ?', [id]);
        return rows[0];
    }

    // Create route (admin only)
    static async create(routeData) {
        const {
            origin = 'Accra',
            destination,
            price,
            base_price,
            departure_times,
            departure_time,
            total_seats = 45,
            available_seats,
            status = 'ACTIVE'
        } = routeData;

        const finalPrice = base_price || price;
        const finalAvailableSeats = available_seats ?? total_seats;
        // Store departure times as JSON array, or use single departure_time
        const deptTimes = departure_times
            ? JSON.stringify(departure_times)
            : JSON.stringify([departure_time || '06:00']);

        const [result] = await db.execute(
            `INSERT INTO routes 
             (origin, destination, base_price, departure_time, total_seats, available_seats, status, departure_times)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)`,
            [
                origin,
                destination,
                finalPrice,
                departure_time || new Date().toISOString().slice(0, 19).replace('T', ' '),
                total_seats,
                finalAvailableSeats,
                status,
                deptTimes
            ]
        );

        return result.insertId;
    }

    // Update route fully (admin only)
    static async update(id, routeData) {
        const existing = await Route.findById(id);
        if (!existing) return false;

        const {
            origin,
            destination,
            price,
            base_price,
            departure_times,
            departure_time,
            total_seats,
            available_seats,
            status
        } = routeData;

        const finalPrice = base_price || price || existing.base_price;
        const deptTimesRaw = departure_times
            ? JSON.stringify(departure_times)
            : (existing.departure_times || null);

        const [result] = await db.execute(
            `UPDATE routes SET 
             origin = ?,
             destination = ?,
             base_price = ?,
             departure_time = ?,
             total_seats = ?,
             available_seats = ?,
             status = ?,
             departure_times = ?
             WHERE id = ?`,
            [
                origin || existing.origin,
                destination || existing.destination,
                finalPrice,
                departure_time || existing.departure_time,
                total_seats ?? existing.total_seats,
                available_seats ?? existing.available_seats,
                status || existing.status,
                deptTimesRaw,
                id
            ]
        );

        return result.affectedRows > 0;
    }

    // Quick status toggle
    static async updateStatus(id, status) {
        const [result] = await db.execute(
            'UPDATE routes SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    }

    // Update seat availability (admin — can bump up or reduce)
    static async updateSeats(id, totalSeats, availableSeats) {
        const [result] = await db.execute(
            'UPDATE routes SET total_seats = ?, available_seats = ? WHERE id = ?',
            [totalSeats, availableSeats, id]
        );
        return result.affectedRows > 0;
    }

    // Delete route (admin only)
    static async delete(id) {
        const [result] = await db.execute('DELETE FROM routes WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Route;