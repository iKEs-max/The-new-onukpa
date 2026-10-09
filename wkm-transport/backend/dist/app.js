"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const env_1 = require("./config/env");
const passport_2 = require("./config/passport");
const requestLogger_1 = require("./middleware/requestLogger");
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimiter_1 = require("./middleware/rateLimiter");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const route_routes_1 = __importDefault(require("./modules/routes/route.routes"));
const booking_routes_1 = __importDefault(require("./modules/bookings/booking.routes"));
const payment_routes_1 = __importDefault(require("./modules/payments/payment.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const webhook_routes_1 = __importDefault(require("./modules/webhooks/webhook.routes"));
const app = (0, express_1.default)();
if (env_1.env.env !== 'test') {
    app.use(requestLogger_1.successHandler);
    app.use(requestLogger_1.errorHandlerLogger);
}
// Security and compression middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: env_1.env.frontendUrl || 'http://localhost:3000', credentials: true }));
app.use((0, compression_1.default)());
// Body parsing middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Auth
app.use(passport_1.default.initialize());
passport_1.default.use('jwt', passport_2.jwtStrategy);
// API Limiter
if (env_1.env.env === 'production') {
    app.use('/api', rateLimiter_1.apiLimiter);
}
// Routes
const router = express_1.default.Router();
router.use('/auth', auth_routes_1.default);
router.use('/routes', route_routes_1.default);
router.use('/bookings', booking_routes_1.default);
router.use('/payments', payment_routes_1.default);
router.use('/admin', admin_routes_1.default);
router.use('/webhooks', webhook_routes_1.default);
app.use('/api/v1', router);
// Error Handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
