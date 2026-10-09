// controllers/webhookController.js
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { generateAndSendTicket } = require('../utils/generateTicket');

// Handle Hubtel callback
exports.handleHubtelCallback = async (req, res) => {
    try {
        const paymentData = req.body;
        
        console.log('Hubtel Callback Received:', paymentData);

        // Always respond to Hubtel immediately
        res.status(200).json({ 
            status: 'success', 
            message: 'Callback received' 
        });

        // Process payment asynchronously
        processPayment(paymentData).catch(error => {
            console.error('Error processing payment:', error);
        });

    } catch (error) {
        console.error('Callback error:', error);
        // Still return 200 to Hubtel
        res.status(200).json({ 
            status: 'error', 
            message: 'Error processing callback' 
        });
    }
};

// Process payment (async)
async function processPayment(paymentData) {
    // Check if payment was successful
    const isSuccess = paymentData.Status === 'Success' || 
                     paymentData.ResponseCode === '0000';

    const clientReference = paymentData.ClientReference || paymentData.Data?.ClientReference;
    const transactionId = paymentData.TransactionId || paymentData.Data?.TransactionId;

    if (isSuccess && clientReference) {
        // Find payment record
        const payment = await Payment.findByTransactionId(clientReference);
        
        if (payment) {
            // Update payment status
            await Payment.updateStatus(clientReference, 'success');
            
            // Update booking status
            await Booking.updatePaymentStatus(
                payment.booking_id, 
                'paid', 
                transactionId
            );

            // Get booking details
            const booking = await Booking.findById(payment.booking_id);
            
            // Generate and send ticket
            if (booking) {
                await generateAndSendTicket(booking);
            }
        }
    } else {
        // Payment failed
        if (clientReference) {
            await Payment.updateStatus(clientReference, 'failed');
            // Optionally update booking status
        }
    }
}