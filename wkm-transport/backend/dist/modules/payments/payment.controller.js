"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPayment = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const crypto_1 = __importDefault(require("crypto"));
const database_1 = __importDefault(require("../../config/database"));
const hubtel_provider_1 = require("./providers/hubtel.provider");
const providers = {
    hubtel: new hubtel_provider_1.FakeHubtelProvider(),
    // easy to add stripe, paystack etc later
};
const initPayment = async (req, res) => {
    const { bookingId, provider = 'hubtel' } = req.body;
    const booking = await database_1.default.booking.findUnique({
        where: { id: bookingId },
        include: { user: true }
    });
    if (!booking || booking.status !== 'PENDING') {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Invalid or already processed booking' });
    }
    const selectedProvider = providers[provider];
    if (!selectedProvider) {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Invalid payment provider' });
    }
    const reference = `PAY-${crypto_1.default.randomBytes(4).toString('hex').toUpperCase()}`;
    const initResult = await selectedProvider.initializePayment(Number(booking.totalAmount), 'GHS', reference, booking.user);
    if (!initResult.success) {
        return res.status(http_status_codes_1.default.BAD_GATEWAY).json({ message: 'Payment gateway error' });
    }
    const payment = await database_1.default.payment.create({
        data: {
            bookingId,
            amount: booking.totalAmount,
            provider,
            reference,
            status: 'PENDING',
        }
    });
    res.send({ payment, ...initResult });
};
exports.initPayment = initPayment;
