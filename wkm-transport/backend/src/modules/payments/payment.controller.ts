import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import crypto from 'crypto';
import prisma from '../../config/database';
import { FakeHubtelProvider } from './providers/hubtel.provider';

const providers = {
  hubtel: new FakeHubtelProvider(),
  // easy to add stripe, paystack etc later
};

export const initPayment = async (req: Request, res: Response) => {
  const { bookingId, provider = 'hubtel' } = req.body;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { user: true }
  });

  if (!booking || booking.status !== 'PENDING') {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Invalid or already processed booking' });
  }

  const selectedProvider = providers[provider as keyof typeof providers];
  if (!selectedProvider) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Invalid payment provider' });
  }

  const reference = `PAY-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  const initResult = await selectedProvider.initializePayment(
    Number(booking.totalAmount),
    'GHS',
    reference,
    booking.user
  );

  if (!initResult.success) {
    return res.status(httpStatus.BAD_GATEWAY).json({ message: 'Payment gateway error' });
  }

  const payment = await prisma.payment.create({
    data: {
      bookingId,
      amount: booking.totalAmount,
      provider,
      reference,
      status: 'PENDING',
    }
  });

  res.send({ payment, ...initResult });
};
