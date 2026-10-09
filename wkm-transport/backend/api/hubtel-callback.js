// backend/api/hubtel-callback.js
const express = require('express');
const router = express.Router();

// Hubtel will POST to this URL after payment
router.post('/hubtel-callback', async (req, res) => {
  try {
    const paymentData = req.body;
    
    console.log('Hubtel Callback Received:', paymentData);
    
    // Verify the payment status
    if (paymentData.Status === 'Success' || paymentData.ResponseCode === '0000') {
      // Payment successful!
      
      // 1. Update booking status in database to 'paid'
      // await updateBookingStatus(paymentData.ClientReference, 'paid');
      
      // 2. Record transaction
      // await saveTransaction(paymentData);
      
      // 3. Generate and send ticket (email/SMS)
      // await sendTicket(paymentData);
      
      // Respond to Hubtel to acknowledge receipt
      res.status(200).json({ 
        status: 'success', 
        message: 'Callback received' 
      });
    } else {
      // Payment failed
      console.log('Payment failed:', paymentData);
      res.status(200).json({ 
        status: 'received', 
        message: 'Failed payment recorded' 
      });
    }
  } catch (error) {
    console.error('Callback error:', error);
    // Always return 200 to Hubtel even if we error
    res.status(200).json({ 
      status: 'error', 
      message: 'Error processing callback' 
    });
  }
});

module.exports = router;