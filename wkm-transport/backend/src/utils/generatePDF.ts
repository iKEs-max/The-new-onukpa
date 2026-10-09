import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateTicketPDF = async (bookingData: any, outputPath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(outputPath);

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
    } catch (error) {
      reject(error);
    }
  });
};
