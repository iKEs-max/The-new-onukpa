// models/Payment.js
const db = require('../config/database');

class Payment {
    // Record new payment
    static async create(paymentData) {
        const {
            booking_id,
            hubtel_transaction_id,
            amount,
            payment_method,
            status
        } = paymentData;

        const [result] = await db.execute(
            `INSERT INTO payments 
            (booking_id, hubtel_transaction_id, amount, payment_method, status) 
            VALUES (?, ?, ?, ?, ?)`,
            [booking_id, hubtel_transaction_id, amount, payment_method, status]
        );

        return result.insertId;
    }

    // Get payment by transaction ID
    static async findByTransactionId(transactionId) {
        const [rows] = await db.execute(
            'SELECT * FROM payments WHERE hubtel_transaction_id = ?',
            [transactionId]
        );
        return rows[0];
    }

    // Update payment status
    static async updateStatus(transactionId, status) {
        const [result] = await db.execute(
            'UPDATE payments SET status = ? WHERE hubtel_transaction_id = ?',
            [status, transactionId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Payment;