"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAuthTokens = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const generateToken = (userId, role, expires, type = 'access', secret = env_1.env.jwtSecret) => {
    const payload = {
        sub: userId,
        type,
        role: role,
    };
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: Math.floor(expires.getTime() / 1000) - Math.floor(Date.now() / 1000) });
};
exports.generateToken = generateToken;
const generateAuthTokens = async (user) => {
    const accessTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const refreshTokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    const accessToken = (0, exports.generateToken)(user.id, user.role, accessTokenExpires, 'access');
    const refreshToken = (0, exports.generateToken)(user.id, user.role, refreshTokenExpires, 'refresh');
    // In a real app we would save the refresh token to DB or Redis here
    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires,
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires,
        },
    };
};
exports.generateAuthTokens = generateAuthTokens;
