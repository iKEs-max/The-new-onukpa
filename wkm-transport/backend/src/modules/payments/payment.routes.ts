import express from 'express';
import { initPayment } from './payment.controller';
import { auth } from '../auth/auth.middleware';

const router = express.Router();

router.use(auth());
router.post('/init', initPayment);

export default router;
