"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const joi_1 = __importDefault(require("joi"));
const validate = (schema) => (req, res, next) => {
    const validSchema = joi_1.default.object(schema);
    const object = Object.keys(schema).reduce((obj, key) => {
        if (Object.prototype.hasOwnProperty.call(req, key)) {
            obj[key] = req[key];
        }
        return obj;
    }, {});
    const { value, error } = validSchema.prefs({ errors: { label: 'key' } }).validate(object);
    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return next(new Error(errorMessage));
    }
    Object.assign(req, value);
    return next();
};
exports.validate = validate;
