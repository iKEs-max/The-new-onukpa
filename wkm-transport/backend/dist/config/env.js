"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const joi_1 = __importDefault(require("joi"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const envVarsSchema = joi_1.default.object()
    .keys({
    NODE_ENV: joi_1.default.string()
        .valid('production', 'development', 'test')
        .required(),
    PORT: joi_1.default.number().default(5000),
    DATABASE_URL: joi_1.default.string().required().description('Postgres DB url'),
    REDIS_URL: joi_1.default.string().required().description('Redis url'),
    JWT_SECRET: joi_1.default.string().required().description('JWT secret key'),
    FRONTEND_URL: joi_1.default.string().required().description('Frontend URL for CORS'),
})
    .unknown();
const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
exports.env = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    dbUrl: envVars.DATABASE_URL,
    redisUrl: envVars.REDIS_URL,
    jwtSecret: envVars.JWT_SECRET,
    frontendUrl: envVars.FRONTEND_URL,
};
