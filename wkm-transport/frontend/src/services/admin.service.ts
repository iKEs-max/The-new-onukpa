import api from './api';
import type { DashboardStats, AdminFilters } from '@/types/admin.types';
import type { Booking } from '@/types/booking.types';
import type { Route } from '@/types/route.types';
import type { User } from '@/types/auth.types';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';

export const adminService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    // Backend returns { success, data: { totalBookings, ... } }
    const { data } = await api.get<ApiResponse<DashboardStats>>('/api/bookings/admin/stats');
    return data.data;
  },

  getAllBookings: async (filters?: AdminFilters): Promise<PaginatedResponse<Booking>> => {
    const { data } = await api.get<PaginatedResponse<Booking>>('/api/bookings/admin/all', {
      params: filters,
    });
    return data;
  },

  getAllRoutes: async (filters?: AdminFilters): Promise<PaginatedResponse<Route>> => {
    const { data } = await api.get<PaginatedResponse<Route>>('/api/routes', {
      params: filters,
    });
    return data;
  },

  getAllUsers: async (): Promise<PaginatedResponse<User>> => {
    // The current backend doesn't have a users table, only admins and bookings.
    // Returning an empty paginated response for now.
    return {
      success: true,
      data: [],
      pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
    };
  },

  updateBookingStatus: async (id: string, status: string): Promise<Booking> => {
    const { data } = await api.patch<ApiResponse<Booking>>(`/api/bookings/${id}/status`, { status });
    return data.data;
  },
};
