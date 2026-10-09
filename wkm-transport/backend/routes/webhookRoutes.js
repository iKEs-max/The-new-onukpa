// routes/webhookRoutes.js
const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Hubtel callback endpoint
router.post('/hubtel', webhookController.handleHubtelCallback);

module.exports = router;