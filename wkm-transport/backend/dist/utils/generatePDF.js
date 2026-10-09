"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTicketPDF = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const generateTicketPDF = async (bookingData, outputPath) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new pdfkit_1.default({ margin: 50 });
            const stream = fs_1.default.createWriteStream(outputPath);
            doc.pipe(stream);
            // Add company logo/header
            doc.fontSize(25).text('WKM Transport', { align: 'center' });
            doc.moveDown();
            doc.fontSize(20).text(`Ticket: ${bookingData.ticketNumber}`, { align: 'center' });
            doc.moveDown();
            // Trip Details Table
            doc.fontSize(14).text('Passenger Details:');
            doc.fontSize(12).text(`Name: ${bookingData.user.firstName} ${bookingData.user.lastName}`);
            doc.text(`Email: ${bookingData.user.email}`);
            doc.moveDown();
            doc.fontSize(14).text('Trip Details:');
            doc.fontSize(12).text(`Route: ${bookingData.route.departure} to ${bookingData.route.destination}`);
            doc.text(`Departure Time: ${new Date(bookingData.route.departureTime).toLocaleString('en-US')}`);
            doc.text(`Arrival Time: ${new Date(bookingData.route.arrivalTime).toLocaleString('en-US')}`);
            doc.moveDown();
            doc.fontSize(14).text('Payment Details:');
            doc.fontSize(12).text(`Tickets: ${bookingData.numberOfTickets}`);
            doc.text(`Total Amount: GHS ${bookingData.totalAmount}`);
            doc.text(`Status: Paid`);
            doc.end();
            stream.on('finish', () => resolve(outputPath));
            stream.on('error', reject);
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.generateTicketPDF = generateTicketPDF;
