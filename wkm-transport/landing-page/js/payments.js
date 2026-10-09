// js/payment.js

class WKMPayment {
  constructor() {
    this.checkout = new HubtelCheckoutSdk(); // Initialize Hubtel SDK
  }

  // Call your backend to initiate payment
  async initiatePayment(bookingData) {
    try {
      const response = await fetch('http://localhost:5000/api/v1/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();
      
      if (data.success) {
        // Open Hubtel modal with the checkout URL
        this.openPaymentModal(data.checkoutUrl);
      } else {
        alert('Payment initiation failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    }
  }

  // Open Hubtel payment modal
  openPaymentModal(checkoutUrl) {
    // Hubtel's modal method
    this.checkout.openModal({
      checkoutUrl: checkoutUrl,
      callBacks: {
        onPaymentSuccess: (response) => {
          console.log('Payment successful:', response);
          // Redirect to success page or show success message
          window.location.href = '/booking-success.html?reference=' + response.transactionId;
        },
        onPaymentFailure: (response) => {
          console.log('Payment failed:', response);
          alert('Payment failed. Please try again.');
        },
        onClose: () => {
          console.log('Modal closed');
          // Handle modal close if needed
        }
      }
    });
  }
}

// Usage example when user clicks "Pay Now"
document.getElementById('pay-now-btn').addEventListener('click', async (e) => {
  e.preventDefault();
  
  const bookingData = {
    amount: 120.00, // Get from your booking summary
    bookingId: 'BK-' + Date.now(), // Generate or use your booking ID
    passengerName: document.getElementById('passenger-name').value,
    passengerPhone: document.getElementById('passenger-phone').value,
    destination: document.getElementById('destination').value
  };

  const payment = new WKMPayment();
  await payment.initiatePayment(bookingData);
});