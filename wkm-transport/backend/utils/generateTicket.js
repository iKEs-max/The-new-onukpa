// utils/generateTicket.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { sendEmail } = require('./sendEmail');

async function generateAndSendTicket(booking) {
    try {
        // Create PDF document
        const doc = new PDFDocument();
        const ticketPath = path.join(__dirname, `../temp/ticket-${booking.ticket_code}.pdf`);
        
        // Ensure temp directory exists
        if (!fs.existsSync(path.join(__dirname, '../temp'))) {
            fs.mkdirSync(path.join(__dirname, '../temp'));
        }

        // Write to file
        const stream = fs.createWriteStream(ticketPath);
        doc.pipe(stream);

        // Generate ticket content
        doc.fontSize(20).text('ONUKPA EXPRESS', { align: 'center' });
        doc.fontSize(16).text('E-TICKET', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Ticket Code: ${booking.ticket_code}`);
        doc.text(`Passenger: ${booking.passenger_name}`);
        doc.text(`Destination: ${booking.destination}`);
        doc.text(`Travel Date: ${booking.travel_date}`);
        doc.text(`Departure Time: ${booking.departure_time}`);
        doc.text(`Passengers: ${booking.passengers}`);
        doc.text(`Amount Paid: GHS ${booking.total_amount}`);
        doc.moveDown();
        doc.text('Thank you for choosing Onukpa Express!', { align: 'center' });

        doc.end();

        // Wait for file to be written
        await new Promise(resolve => stream.on('finish', resolve));

        // Send email
        if (booking.passenger_email) {
            await sendEmail({
                to: booking.passenger_email,
                subject: 'Your Onukpa Express Ticket',
                text: `Your ticket is attached. Ticket Code: ${booking.ticket_code}`,
                attachments: [{
                    filename: `ticket-${booking.ticket_code}.pdf`,
                    path: ticketPath
                }]
            });
        }

        // Clean up temp file
        fs.unlinkSync(ticketPath);

        return true;
    } catch (error) {
        console.error('Ticket generation error:', error);
        return false;
    }
}

module.exports = { generateAndSendTicket };