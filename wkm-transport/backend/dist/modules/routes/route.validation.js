"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoute = exports.updateRoute = exports.createRoute = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createRoute = {
    body: joi_1.default.object().keys({
        departure: joi_1.default.string().required(),
        destination: joi_1.default.string().required(),
        price: joi_1.default.number().min(0).required(),
        departureTime: joi_1.default.date().iso().required(),
        arrivalTime: joi_1.default.date().iso().min(joi_1.default.ref('departureTime')).required(),
        totalSeats: joi_1.default.number().integer().min(1).required(),
        availableSeats: joi_1.default.number().integer().min(1).required(),
    }),
};
exports.updateRoute = {
    params: joi_1.default.object().keys({
        routeId: joi_1.default.string().required(),
    }),
    body: joi_1.default.object().keys({
        departure: joi_1.default.string(),
        destination: joi_1.default.string(),
        price: joi_1.default.number().min(0),
        departureTime: joi_1.default.date().iso(),
        arrivalTime: joi_1.default.date().iso().min(joi_1.default.ref('departureTime')),
        status: joi_1.default.string().valid('ACTIVE', 'INACTIVE'),
    }).min(1),
};
exports.deleteRoute = {
    params: joi_1.default.object().keys({
        routeId: joi_1.default.string().required(),
    }),
};
