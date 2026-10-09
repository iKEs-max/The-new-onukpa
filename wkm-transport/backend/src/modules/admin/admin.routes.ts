import express from 'express';
import { getDashboardStats } from './admin.controller';
import { auth } from '../auth/auth.middleware';

const router = express.Router();

// All admin routes require authentication and 'manageSystem' pseudo-right or similar
router.use(auth('manageRoutes')); // Reusing manageRoutes as basic admin boundary for now

router.get('/stats', getDashboardStats);

export default router;
