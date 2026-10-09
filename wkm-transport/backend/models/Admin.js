// models/Admin.js
const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Admin {
    // Find admin by username
    static async findByUsername(identifier) {
        const [rows] = await db.execute(
            'SELECT * FROM admins WHERE username = ? OR email = ?',
            [identifier, identifier]
        );
        return rows[0];
    }

    // Verify password
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Change password
    static async changePassword(adminId, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const [result] = await db.execute(
            'UPDATE admins SET password_hash = ? WHERE id = ?',
            [hashedPassword, adminId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Admin;