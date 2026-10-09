import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import prisma from '../../config/database';
import { FakeHubtelProvider } from '../payments/providers/hubtel.provider';
import { generateTicketPDF } from '../../utils/generatePDF';
import { sendEmail } from '../../utils/sendEmail';
import path from 'path';

const providers = {
  hubtel: new FakeHubtelProvider(),
};

export const handleWebhook = async (req: Request, res: Response) => {
  const { provider, reference } = req.body; // In real life, verify webhook signatures

  const payment = await prisma.payment.findUnique({
    where: { reference },
    include: { booking: { include: { user: true, route: true } } }
  });

  if (!payment) return res.status(httpStatus.NOT_FOUND).send();
  if (payment.status !== 'PENDING') return res.status(httpStatus.OK).send(); // already processed

  const selectedProvider = providers[provider as keyof typeof providers];
  const verification = await selectedProvider.verifyPayment(reference);

  if (verification.status === 'SUCCESS') {
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'SUCCESS' }
      }),
      prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'CONFIRMED' }
      })
    ]);

    // Async tasks: Generate PDF and send email
    try {
      const outputPath = path.join(__dirname, `../../../tmp/ticket-${payment.booking.ticketNumber}.pdf`);
      await generateTicketPDF(payment.booking, outputPath);
      // await sendEmail(payment.booking.user.email, 'Your WKM Ticket', 'Please find attached your ticket', outputPath);
    } catch (e) {
      console.error('Failed to send ticket email', e);
    }

  } else if (verification.status === 'FAILED') {
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' }
      }),
      prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'CANCELLED' }
      }),
      prisma.route.update({
        where: { id: payment.booking.routeId },
        data: { availableSeats: { increment: payment.booking.numberOfTickets } }
      })
    ]);
  }

  res.status(httpStatus.OK).send();
};
