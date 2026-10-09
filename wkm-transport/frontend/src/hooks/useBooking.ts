import { useBookingStore } from '@/store/booking.store';
import type { CreateBookingPayload } from '@/types/booking.types';

export const useBooking = () => {
  const {
    bookings,
    currentBooking,
    isLoading,
    error,
    createBooking,
    fetchUserBookings,
    cancelBooking,
    setCurrentBooking,
    clearError,
  } = useBookingStore();

  const handleCreateBooking = async (payload: CreateBookingPayload) => {
    return createBooking(payload);
  };

  return {
    bookings,
    currentBooking,
    isLoading,
    error,
    createBooking: handleCreateBooking,
    fetchUserBookings,
    cancelBooking,
    setCurrentBooking,
    clearError,
  };
};
