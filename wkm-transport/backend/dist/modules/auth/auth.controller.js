"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("../../config/database"));
const auth_service_1 = require("./auth.service");
const register = async (req, res) => {
    const { email, password, firstName, lastName, phone } = req.body;
    if (await database_1.default.user.findUnique({ where: { email } })) {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Email already taken' });
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 8);
    const user = await database_1.default.user.create({
        data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phone,
        },
    });
    const tokens = await (0, auth_service_1.generateAuthTokens)(user);
    res.status(http_status_codes_1.default.CREATED).send({
        user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
        tokens
    });
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await database_1.default.user.findUnique({ where: { email } });
    if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
        return res.status(http_status_codes_1.default.UNAUTHORIZED).json({ message: 'Incorrect email or password' });
    }
    const tokens = await (0, auth_service_1.generateAuthTokens)(user);
    res.send({
        user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
        tokens
    });
};
exports.login = login;
const getMe = async (req, res) => {
    res.send({ user: req.user });
};
exports.getMe = getMe;
