// test-api.js
const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function testHealth() {
    try {
        const response = await axios.get(`${API_URL}/health`);
        console.log('Health check:', response.data);
    } catch (error) {
        console.error('Health check failed:', error.message);
    }
}

async function testInitiatePayment() {
    try {
        const response = await axios.post(`${API_URL}/api/payments/initiate`, {
            bookingId: 'TEST-123',
            amount: 120.00,
            passengerName: 'John Doe',
            passengerPhone: '0541234567',
            destination: 'Kumasi'
        });
        console.log('Payment initiation:', response.data);
    } catch (error) {
        console.error('Payment test failed:', error.response?.data || error.message);
    }
}

// Run tests
testHealth();
// testInitiatePayment();