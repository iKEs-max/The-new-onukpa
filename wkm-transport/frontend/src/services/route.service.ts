import api from './api';
import type { Route, CreateRoutePayload, UpdateRoutePayload } from '@/types/route.types';

const parseRoutes = (raw: any[]): Route[] =>
  raw.map((r) => ({
    ...r,
    // Normalize field names from backend (backend uses base_price, frontend uses price)
    price: r.price ?? r.base_price,
    departure: r.departure ?? r.origin,
    totalSeats: r.totalSeats ?? r.total_seats,
    availableSeats: r.availableSeats ?? r.available_seats,
    departureTimes: r.departureTimes ?? r.departure_times ?? [],
  }));

export const routeService = {
  getRoutes: async (): Promise<Route[]> => {
    const { data } = await api.get('/api/routes');
    const routes = data.routes ?? data.data ?? [];
    return parseRoutes(routes);
  },

  getRouteById: async (id: string): Promise<Route> => {
    const { data } = await api.get(`/api/routes/${id}`);
    const r = data.route ?? data.data;
    return parseRoutes([r])[0];
  },

  createRoute: async (payload: CreateRoutePayload): Promise<Route> => {
    const { data } = await api.post('/api/routes', payload);
    const r = data.route ?? data.data ?? { id: data.routeId, ...payload };
    return parseRoutes([r])[0];
  },

  updateRoute: async (id: string, payload: UpdateRoutePayload): Promise<Route> => {
    const { data } = await api.put(`/api/routes/${id}`, payload);
    const r = data.route ?? data.data ?? { id, ...payload };
    return parseRoutes([r])[0];
  },

  // Toggle ACTIVE / INACTIVE
  updateRouteStatus: async (id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<void> => {
    await api.patch(`/api/routes/${id}/status`, { status });
  },

  // Update available_seats and/or total_seats
  updateRouteSeats: async (
    id: string,
    totalSeats: number,
    availableSeats: number
  ): Promise<{ availabilityLabel: string }> => {
    const { data } = await api.patch(`/api/routes/${id}/seats`, {
      total_seats: totalSeats,
      available_seats: availableSeats,
    });
    return { availabilityLabel: data.availabilityLabel };
  },

  deleteRoute: async (id: string): Promise<void> => {
    await api.delete(`/api/routes/${id}`);
  },

  // Admin dashboard stats
  getDashboardStats: async () => {
    const { data } = await api.get('/api/routes/admin/stats');
    return data.stats;
  },
};
