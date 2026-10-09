// middleware/validation.js
const { isValidPhone, isValidEmail } = require('../utils/helpers');

// Validate booking data
const validateBooking = (req, res, next) => {
    const { route_id, passenger_name, passenger_phone, travel_date, departure_time, passengers } = req.body;

    const errors = [];

    if (!route_id) errors.push('Route is required');
    if (!passenger_name || passenger_name.trim().length < 2) errors.push('Valid passenger name is required');
    if (!passenger_phone) errors.push('Phone number is required');
    else if (!isValidPhone(passenger_phone)) errors.push('Invalid Ghana phone number');
    if (!travel_date) errors.push('Travel date is required');
    if (!departure_time) errors.push('Departure time is required');
    if (!passengers || passengers < 1 || passengers > 10) errors.push('Passengers must be between 1 and 10');

    // Check travel date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(travel_date) < today) {
        errors.push('Travel date cannot be in the past');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }

    next();
};

// Validate payment data
const validatePayment = (req, res, next) => {
    const { bookingId, amount } = req.body;

    const errors = [];

    if (!bookingId) errors.push('Booking ID is required');
    if (!amount || amount <= 0) errors.push('Valid amount is required');

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }

    next();
};

// Validate login data
const validateLogin = (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }

    next();
};

module.exports = { validateBooking, validatePayment, validateLogin };
