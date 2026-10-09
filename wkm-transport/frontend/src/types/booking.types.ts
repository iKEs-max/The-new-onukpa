import type { Route } from './route.types';
import type { User } from './auth.types';
import type { Payment } from './payment.types';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string;
  ticketNumber: string;
  userId: string;
  routeId: string;
  numberOfTickets: number;
  totalAmount: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  user?: User;
  route?: Route;
  payment?: Payment;
}

export interface CreateBookingPayload {
  routeId: string;
  numberOfTickets: number;
  passengers?: Passenger[];
}

export interface Passenger {
  firstName: string;
  lastName: string;
  phone?: string;
}
