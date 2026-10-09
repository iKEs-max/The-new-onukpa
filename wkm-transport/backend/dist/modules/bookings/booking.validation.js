"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBooking = exports.getBooking = exports.createBooking = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createBooking = {
    body: joi_1.default.object().keys({
        routeId: joi_1.default.string().required(),
        numberOfTickets: joi_1.default.number().integer().min(1).required(),
    }),
};
exports.getBooking = {
    params: joi_1.default.object().keys({
        bookingId: joi_1.default.string().required(),
    }),
};
exports.cancelBooking = {
    params: joi_1.default.object().keys({
        bookingId: joi_1.default.string().required(),
    }),
};
