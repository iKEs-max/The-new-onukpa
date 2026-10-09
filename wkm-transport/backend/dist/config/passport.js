"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const env_1 = require("./env");
const database_1 = __importDefault(require("./database"));
const jwtOptions = {
    secretOrKey: env_1.env.jwtSecret,
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
};
const jwtVerify = async (payload, done) => {
    try {
        if (payload.type !== 'access') {
            throw new Error('Invalid token type');
        }
        const user = await database_1.default.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                email: true,
                role: true,
            }
        });
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    }
    catch (error) {
        done(error, false);
    }
};
exports.jwtStrategy = new passport_jwt_1.Strategy(jwtOptions, jwtVerify);
