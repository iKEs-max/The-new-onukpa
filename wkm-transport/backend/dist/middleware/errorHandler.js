"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (!err.isOperational) {
        statusCode = 500;
        message = 'Internal Server Error';
    }
    res.locals.errorMessage = err.message;
    const response = {
        code: statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    };
    logger_1.default.error(err);
    res.status(statusCode || 500).send(response);
};
exports.errorHandler = errorHandler;
