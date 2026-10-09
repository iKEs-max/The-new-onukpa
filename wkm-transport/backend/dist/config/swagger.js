"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const env_1 = require("./env");
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'WKM Transport API',
            version: '1.0.0',
            description: 'API Documentation for WKM Transport Application',
            license: {
                name: 'MIT',
                url: 'https://choosealicense.com/licenses/mit/',
            },
        },
        servers: [
            {
                url: `http://localhost:${env_1.env.port}/api/v1`,
                description: 'Development Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/modules/**/*.routes.ts', './src/modules/**/*.ts'],
};
const specs = (0, swagger_jsdoc_1.default)(options);
exports.default = specs;
