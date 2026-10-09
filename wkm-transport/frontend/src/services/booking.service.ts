import api from './api';
import type { Booking, CreateBookingPayload } from '@/types/booking.types';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';

export const bookingService = {
  createBooking: async (payload: CreateBookingPayload): Promise<Booking> => {
    const { data } = await api.post<ApiResponse<Booking>>('/api/bookings', payload);
    return data.data;
  },

  getBookings: async (page = 1, limit = 10): Promise<PaginatedResponse<Booking>> => {
    const { data } = await api.get<PaginatedResponse<Booking>>('/api/bookings', {
      params: { page, limit },
    });
    return data;
  },

  getBookingById: async (id: string): Promise<Booking> => {
    const { data } = await api.get<ApiResponse<Booking>>(`/api/bookings/${id}`);
    return data.data;
  },

  getBookingByTicket: async (ticketNumber: string): Promise<Booking> => {
    const { data } = await api.get<ApiResponse<Booking>>(`/api/bookings/ticket/${ticketNumber}`);
    return data.data;
  },

  cancelBooking: async (id: string): Promise<Booking> => {
    const { data } = await api.patch<ApiResponse<Booking>>(`/api/bookings/${id}/cancel`);
    return data.data;
  },
};
