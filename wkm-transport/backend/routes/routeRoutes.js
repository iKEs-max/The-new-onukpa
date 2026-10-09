// routes/routeRoutes.js
const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { verifyToken } = require('../middleware/auth');

// ── Public routes ──
router.get('/', routeController.getAllRoutes);
router.get('/:id', routeController.getRoute);

// ── Admin routes (protected) ──
router.post('/', verifyToken, routeController.createRoute);
router.put('/:id', verifyToken, routeController.updateRoute);
router.delete('/:id', verifyToken, routeController.deleteRoute);

// Toggle active/inactive status
router.patch('/:id/status', verifyToken, routeController.updateRouteStatus);

// Update seat availability (admin sets total + available)
router.patch('/:id/seats', verifyToken, routeController.updateRouteSeats);

// Dashboard stats
router.get('/admin/stats', verifyToken, routeController.getDashboardStats);

module.exports = router;
