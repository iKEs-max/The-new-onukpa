// models/Booking.js
const db = require('../config/database');

class Booking {
    // Create new booking
    static async create(bookingData) {
        const {
            route_id,
            passenger_name,
            passenger_email,
            passenger_phone,
            travel_date,
            departure_time,
            passengers,
            total_amount,
            ticket_code
        } = bookingData;

        const [result] = await db.execute(
            `INSERT INTO bookings 
            (route_id, passenger_name, passenger_email, passenger_phone, 
             travel_date, departure_time, passengers, total_amount, ticket_code) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [route_id, passenger_name, passenger_email, passenger_phone, 
             travel_date, departure_time, passengers, total_amount, ticket_code]
        );

        return result.insertId;
    }

    // Get booking by ID
    static async findById(id) {
        const [rows] = await db.execute(
            `SELECT b.*, r.destination, r.price 
             FROM bookings b
             JOIN routes r ON b.route_id = r.id
             WHERE b.id = ?`,
            [id]
        );
        return rows[0];
    }

    // Update payment status
    static async updatePaymentStatus(bookingId, status, transactionId) {
        const [result] = await db.execute(
            `UPDATE bookings 
             SET payment_status = ?, hubtel_transaction_id = ? 
             WHERE id = ?`,
            [status, transactionId, bookingId]
        );
        return result.affectedRows > 0;
    }

    // Get bookings by date range
    static async getByDateRange(startDate, endDate) {
        const [rows] = await db.execute(
            `SELECT b.*, r.destination 
             FROM bookings b
             JOIN routes r ON b.route_id = r.id
             WHERE b.travel_date BETWEEN ? AND ?
             ORDER BY b.travel_date DESC`,
            [startDate, endDate]
        );
        return rows;
    }
}

module.exports = Booking;