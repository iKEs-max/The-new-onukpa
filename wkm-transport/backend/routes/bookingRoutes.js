// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken } = require('../middleware/auth');
const { validateBooking } = require('../middleware/validation');

// Admin routes (protected) - must be before /:id to avoid conflict
router.get('/admin/stats', verifyToken, bookingController.getDashboardStats);
router.get('/admin/all', verifyToken, bookingController.getAllBookings);

// Public routes
router.post('/', validateBooking, bookingController.createBooking);
router.get('/ticket/:ticketCode', bookingController.getBookingByTicket);
router.get('/:id', bookingController.getBooking);

module.exports = router;
