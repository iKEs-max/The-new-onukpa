// utils/helpers.js
const crypto = require('crypto');

// Generate unique ticket code (OER-XXXXXX)
function generateTicketCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'OER-';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Format date for display
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// Format currency (GHS)
function formatCurrency(amount) {
    return `GHS ${parseFloat(amount).toFixed(2)}`;
}

// Validate phone number (Ghana format)
function isValidPhone(phone) {
    const ghanaPhoneRegex = /^(0[235]\d{8}|233[235]\d{7})$/;
    return ghanaPhoneRegex.test(phone.replace(/\s/g, ''));
}

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Generate a random reference
function generateReference() {
    return crypto.randomBytes(16).toString('hex');
}

module.exports = {
    generateTicketCode,
    formatDate,
    formatCurrency,
    isValidPhone,
    isValidEmail,
    generateReference
};
