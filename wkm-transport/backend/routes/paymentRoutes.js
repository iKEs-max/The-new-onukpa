// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { validatePayment } = require('../middleware/validation');

// Initiate payment
router.post('/initiate', validatePayment, paymentController.initiatePayment);

// Check payment status
router.get('/status/:clientReference', paymentController.checkPaymentStatus);

module.exports = router;