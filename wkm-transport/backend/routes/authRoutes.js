// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { validateLogin } = require('../middleware/validation');

// Login
router.post('/login', validateLogin, authController.login);

// Change password (protected)
router.put('/change-password', verifyToken, authController.changePassword);

// Verify token
router.get('/verify', verifyToken, authController.verifyToken);

module.exports = router;