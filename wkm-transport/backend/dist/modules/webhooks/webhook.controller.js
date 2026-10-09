"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const database_1 = __importDefault(require("../../config/database"));
const hubtel_provider_1 = require("../payments/providers/hubtel.provider");
const generatePDF_1 = require("../../utils/generatePDF");
const path_1 = __importDefault(require("path"));
const providers = {
    hubtel: new hubtel_provider_1.FakeHubtelProvider(),
};
const handleWebhook = async (req, res) => {
    const { provider, reference } = req.body; // In real life, verify webhook signatures
    const payment = await database_1.default.payment.findUnique({
        where: { reference },
        include: { booking: { include: { user: true, route: true } } }
    });
    if (!payment)
        return res.status(http_status_codes_1.default.NOT_FOUND).send();
    if (payment.status !== 'PENDING')
        return res.status(http_status_codes_1.default.OK).send(); // already processed
    const selectedProvider = providers[provider];
    const verification = await selectedProvider.verifyPayment(reference);
    if (verification.status === 'SUCCESS') {
        await database_1.default.$transaction([
            database_1.default.payment.update({
                where: { id: payment.id },
                data: { status: 'SUCCESS' }
            }),
            database_1.default.booking.update({
                where: { id: payment.bookingId },
                data: { status: 'CONFIRMED' }
            })
        ]);
        // Async tasks: Generate PDF and send email
        try {
            const outputPath = path_1.default.join(__dirname, `../../../tmp/ticket-${payment.booking.ticketNumber}.pdf`);
            await (0, generatePDF_1.generateTicketPDF)(payment.booking, outputPath);
            // await sendEmail(payment.booking.user.email, 'Your WKM Ticket', 'Please find attached your ticket', outputPath);
        }
        catch (e) {
            console.error('Failed to send ticket email', e);
        }
    }
    else if (verification.status === 'FAILED') {
        await database_1.default.$transaction([
            database_1.default.payment.update({
                where: { id: payment.id },
                data: { status: 'FAILED' }
            }),
            database_1.default.booking.update({
                where: { id: payment.bookingId },
                data: { status: 'CANCELLED' }
            }),
            database_1.default.route.update({
                where: { id: payment.booking.routeId },
                data: { availableSeats: { increment: payment.booking.numberOfTickets } }
            })
        ]);
    }
    res.status(http_status_codes_1.default.OK).send();
};
exports.handleWebhook = handleWebhook;
