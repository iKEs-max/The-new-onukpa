import { create } from 'zustand';
import { bookingService } from '@/services/booking.service';
import type { Booking, CreateBookingPayload } from '@/types/booking.types';

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  createBooking: (payload: CreateBookingPayload) => Promise<Booking>;
  fetchUserBookings: () => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  setCurrentBooking: (booking: Booking | null) => void;
  clearError: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,

  createBooking: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const booking = await bookingService.createBooking(payload);
      set((state) => ({
        bookings: [booking, ...state.bookings],
        currentBooking: booking,
        isLoading: false,
      }));
      return booking;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create booking';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  fetchUserBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await bookingService.getBookings();
      set({ bookings: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch bookings',
        isLoading: false,
      });
    }
  },

  cancelBooking: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await bookingService.cancelBooking(id);
      set((state) => ({
        bookings: state.bookings.map((b) => (b.id === id ? updated : b)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to cancel booking',
        isLoading: false,
      });
    }
  },

  setCurrentBooking: (booking) => set({ currentBooking: booking }),
  clearError: () => set({ error: null }),
}));
