import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import { env } from './config/env';
import { jwtStrategy } from './config/passport';
import { successHandler, errorHandlerLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';

import authRoutes from './modules/auth/auth.routes';
import routeRoutes from './modules/routes/route.routes';
import bookingRoutes from './modules/bookings/booking.routes';
import paymentRoutes from './modules/payments/payment.routes';
import adminRoutes from './modules/admin/admin.routes';
import webhookRoutes from './modules/webhooks/webhook.routes';

const app: Express = express();

if (env.env !== 'test') {
  app.use(successHandler);
  app.use(errorHandlerLogger);
}

// Security and compression middlewares
app.use(helmet());
app.use(cors({ origin: env.frontendUrl || 'http://localhost:3000', credentials: true }));
app.use(compression());

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Auth
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// API Limiter
if (env.env === 'production') {
  app.use('/api', apiLimiter);
}

// Routes
const router = express.Router();
router.use('/auth', authRoutes);
router.use('/routes', routeRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/webhooks', webhookRoutes);

app.use('/api/v1', router);

// Error Handler
app.use(errorHandler);

export default app;
