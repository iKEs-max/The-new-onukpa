"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTicketNumber = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateTicketNumber = () => {
    const prefix = 'WKM';
    const timestamp = Date.now().toString().slice(-6);
    const randomStr = crypto_1.default.randomBytes(3).toString('hex').toUpperCase();
    return `${prefix}-${timestamp}-${randomStr}`;
};
exports.generateTicketNumber = generateTicketNumber;
