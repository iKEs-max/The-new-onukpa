"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBooking = exports.getBooking = exports.getUserBookings = exports.createBooking = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const database_1 = __importDefault(require("../../config/database"));
const generateTicket_1 = require("../../utils/generateTicket");
const createBooking = async (req, res) => {
    const { routeId, numberOfTickets } = req.body;
    const userId = req.user.id; // user guaranteed by auth middleware
    const route = await database_1.default.route.findUnique({ where: { id: routeId } });
    if (!route || route.status !== 'ACTIVE') {
        return res.status(http_status_codes_1.default.NOT_FOUND).json({ message: 'Route not found or inactive' });
    }
    if (route.availableSeats < numberOfTickets) {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Not enough seats available' });
    }
    // Create booking and decrease available seats atomically
    const result = await database_1.default.$transaction(async (tx) => {
        const booking = await tx.booking.create({
            data: {
                userId,
                routeId,
                numberOfTickets,
                totalAmount: Number(route.price) * numberOfTickets,
                ticketNumber: (0, generateTicket_1.generateTicketNumber)(),
                status: 'PENDING',
            },
        });
        await tx.route.update({
            where: { id: routeId },
            data: { availableSeats: { decrement: numberOfTickets } },
        });
        return booking;
    });
    res.status(http_status_codes_1.default.CREATED).send(result);
};
exports.createBooking = createBooking;
const getUserBookings = async (req, res) => {
    const bookings = await database_1.default.booking.findMany({
        where: { userId: req.user.id },
        include: { route: true, payment: true },
        orderBy: { createdAt: 'desc' }
    });
    res.send(bookings);
};
exports.getUserBookings = getUserBookings;
const getBooking = async (req, res) => {
    const booking = await database_1.default.booking.findFirst({
        where: {
            id: req.params.bookingId,
            userId: req.user.id // Only allow users to see their own
        },
        include: { route: true, payment: true }
    });
    if (!booking) {
        return res.status(http_status_codes_1.default.NOT_FOUND).send({ message: 'Booking not found' });
    }
    res.send(booking);
};
exports.getBooking = getBooking;
const cancelBooking = async (req, res) => {
    const booking = await database_1.default.booking.findFirst({
        where: { id: req.params.bookingId, userId: req.user.id }
    });
    if (!booking || booking.status === 'CANCELLED') {
        return res.status(http_status_codes_1.default.BAD_REQUEST).send({ message: 'Valid booking not found' });
    }
    const result = await database_1.default.$transaction(async (tx) => {
        const cancelled = await tx.booking.update({
            where: { id: booking.id },
            data: { status: 'CANCELLED' }
        });
        await tx.route.update({
            where: { id: booking.routeId },
            data: { availableSeats: { increment: booking.numberOfTickets } }
        });
        return cancelled;
    });
    res.send(result);
};
exports.cancelBooking = cancelBooking;
