// config/hubtel.js
const crypto = require('crypto');

const hubtelConfig = {
    merchantAccount: process.env.HUBTEL_MERCHANT_ACCOUNT,
    apiId: process.env.HUBTEL_API_ID,
    apiKey: process.env.HUBTEL_API_KEY,
    callbackUrl: process.env.HUBTEL_CALLBACK_URL,
    returnUrl: process.env.HUBTEL_RETURN_URL,
    cancellationUrl: process.env.HUBTEL_CANCELLATION_URL,

    // Generate Basic Auth header
    getAuthHeader: () => {
        const credentials = `${process.env.HUBTEL_API_ID}:${process.env.HUBTEL_API_KEY}`;
        return `Basic ${Buffer.from(credentials).toString('base64')}`;
    },

    // Generate unique client reference
    generateReference: () => {
        return crypto.randomBytes(16).toString('hex');
    }
};

module.exports = hubtelConfig;