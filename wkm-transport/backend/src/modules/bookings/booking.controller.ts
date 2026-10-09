import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import prisma from '../../config/database';
import { generateTicketNumber } from '../../utils/generateTicket';

export const createBooking = async (req: Request, res: Response) => {
  const { routeId, numberOfTickets } = req.body;
  const userId = (req.user as any).id; // user guaranteed by auth middleware

  const route = await prisma.route.findUnique({ where: { id: routeId } });
  
  if (!route || route.status !== 'ACTIVE') {
    return res.status(httpStatus.NOT_FOUND).json({ message: 'Route not found or inactive' });
  }

  if (route.availableSeats < numberOfTickets) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Not enough seats available' });
  }

  // Create booking and decrease available seats atomically
  const result = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.create({
      data: {
        userId,
        routeId,
        numberOfTickets,
        totalAmount: Number(route.price) * numberOfTickets,
        ticketNumber: generateTicketNumber(),
        status: 'PENDING',
      },
    });

    await tx.route.update({
      where: { id: routeId },
      data: { availableSeats: { decrement: numberOfTickets } },
    });

    return booking;
  });

  res.status(httpStatus.CREATED).send(result);
};

export const getUserBookings = async (req: Request, res: Response) => {
  const bookings = await prisma.booking.findMany({
    where: { userId: (req.user as any).id },
    include: { route: true, payment: true },
    orderBy: { createdAt: 'desc' }
  });
  res.send(bookings);
};

export const getBooking = async (req: Request, res: Response) => {
  const booking = await prisma.booking.findFirst({
    where: { 
      id: req.params.bookingId,
      userId: (req.user as any).id // Only allow users to see their own
    },
    include: { route: true, payment: true }
  });

  if (!booking) {
    return res.status(httpStatus.NOT_FOUND).send({ message: 'Booking not found' });
  }
  res.send(booking);
};

export const cancelBooking = async (req: Request, res: Response) => {
  const booking = await prisma.booking.findFirst({
    where: { id: req.params.bookingId, userId: (req.user as any).id }
  });

  if (!booking || booking.status === 'CANCELLED') {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'Valid booking not found' });
  }

  const result = await prisma.$transaction(async (tx) => {
    const cancelled = await tx.booking.update({
      where: { id: booking.id },
      data: { status: 'CANCELLED' }
    });

    await tx.route.update({
      where: { id: booking.routeId },
      data: { availableSeats: { increment: booking.numberOfTickets } }
    });
    return cancelled;
  });

  res.send(result);
};

export const trackBooking = async (req: Request, res: Response) => {
  const { ticketCode } = req.params;
  const booking = await prisma.booking.findFirst({
    where: { ticketNumber: ticketCode },
    include: { route: true },
  });

  if (!booking) {
    return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Ticket not found' });
  }

  // Simulated real-time status logic
  const now = new Date();
  const travelDate = new Date(booking.createdAt); // Using createdAt as travelDate for demo if not present
  let status = 'Scheduled';
  let eta = 'N/A';

  // Basic ETA calculation
  const departure = new Date(travelDate);
  // Assuming a static departure for simulation
  departure.setHours(10, 0, 0); 

  if (now > departure) {
    status = 'In Transit';
    const hoursSinceDeparture = (now.getTime() - departure.getTime()) / (1000 * 60 * 60);
    if (hoursSinceDeparture > 5) status = 'Arrived';
    else eta = '2-3 hours';
  }

  res.send({ 
    success: true, 
    status, 
    eta,
    booking: {
      ticket_code: booking.ticketNumber,
      destination: booking.route.destination,
      departure_time: "10:00 AM", // Placeholder since departure_time isn't on the model
      travel_date: travelDate
    }
  });
};
