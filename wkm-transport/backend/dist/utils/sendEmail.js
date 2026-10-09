"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = __importDefault(require("../config/logger"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '2525', 10),
    auth: {
        user: process.env.SMTP_USERNAME || 'user',
        pass: process.env.SMTP_PASSWORD || 'pass',
    },
});
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"WKM Transport" <${process.env.EMAIL_FROM || 'noreply@wkmtransport.com'}>`,
            to,
            subject,
            text,
            html,
        });
        logger_1.default.info(`Email sent: ${info.messageId}`);
        return true;
    }
    catch (error) {
        logger_1.default.error(`Error sending email to ${to}:`, error);
        return false;
    }
};
exports.sendEmail = sendEmail;
