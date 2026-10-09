// controllers/paymentController.js
const hubtelConfig = require('../config/hubtel');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// Initiate payment
exports.initiatePayment = async (req, res) => {
    try {
        const { bookingId, amount, passengerName, passengerPhone, destination } = req.body;

        const clientReference = hubtelConfig.generateReference();

        // Prepare payment data for Hubtel
        const paymentData = {
            title: "WKM Transport Booking",
            totalAmount: amount,
            description: `Bus ticket from Accra to ${destination}`,
            callbackUrl: hubtelConfig.callbackUrl,
            returnUrl: hubtelConfig.returnUrl,
            merchantAccountNumber: hubtelConfig.merchantAccount,
            cancellationUrl: hubtelConfig.cancellationUrl,
            clientReference: clientReference,
            metadata: {
                bookingId: bookingId,
                passengerName: passengerName,
                passengerPhone: passengerPhone
            }
        };

        // Call Hubtel API
        const response = await fetch('https://payproxyapi.hubtel.com/items/initiate', {
            method: 'POST',
            headers: {
                'Authorization': hubtelConfig.getAuthHeader(),
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });

        const data = await response.json();

        if (response.ok && data.status === 'Success') {
            // Store payment record in database
            await Payment.create({
                booking_id: bookingId,
                hubtel_transaction_id: clientReference,
                amount: amount,
                payment_method: 'hubtel',
                status: 'pending'
            });

            res.json({
                success: true,
                checkoutUrl: data.data.checkoutUrl,
                clientReference: clientReference
            });
        } else {
            res.status(400).json({
                success: false,
                message: data.message || 'Payment initiation failed'
            });
        }
    } catch (error) {
        console.error('Payment initiation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Check payment status
exports.checkPaymentStatus = async (req, res) => {
    try {
        const { clientReference } = req.params;

        const payment = await Payment.findByTransactionId(clientReference);
        
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        res.json({
            success: true,
            status: payment.status,
            payment: payment
        });
    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};