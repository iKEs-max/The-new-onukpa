"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const passport_1 = __importDefault(require("passport"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
    if (err || info || !user) {
        return reject(new Error('Please authenticate'));
    }
    req.user = user;
    if (requiredRights.length) {
        const userRights = user.role === 'ADMIN' ? ['manageUsers', 'manageRoutes', 'manageBookings'] : [];
        const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
        if (!hasRequiredRights && req.params.userId !== user.id) {
            return reject(new Error('Forbidden'));
        }
    }
    resolve();
};
const auth = (...requiredRights) => async (req, res, next) => {
    return new Promise((resolve, reject) => {
        passport_1.default.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
        .then(() => next())
        .catch((err) => res.status(http_status_codes_1.default.UNAUTHORIZED).json({ message: err.message }));
};
exports.auth = auth;
