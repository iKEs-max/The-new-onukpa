import express from 'express';
import { validate } from '../../middleware/validation';
import * as authValidation from './auth.validation';
import * as authController from './auth.controller';
import { authLimiter } from '../../middleware/rateLimiter';
import { auth } from './auth.middleware';

const router = express.Router();

router.post('/register', authLimiter, validate(authValidation.register), authController.register);
router.post('/login', authLimiter, validate(authValidation.login), authController.login);
router.get('/me', auth(), authController.getMe);
router.get('/verify', auth(), authController.getMe); // Adding verify as alias for frontend compatibility
router.put('/change-password', auth(), authController.changePassword);

export default router;
