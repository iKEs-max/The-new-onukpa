import { create } from 'zustand';
import { routeService } from '@/services/route.service';
import type { Route, CreateRoutePayload, UpdateRoutePayload } from '@/types/route.types';

interface DashboardChartPoint { date: string; count: number; revenue: number; }
interface RouteFill { id: string | number; origin: string; destination: string; total_seats: number; available_seats: number; status: string; base_price: number; }

interface LiveStats {
  totalRoutes: number;
  activeRoutes: number;
  totalBookings: number;
  totalRevenue: number;
  confirmedBookings: number;
  pendingBookings: number;
  chartData: DashboardChartPoint[];
  recentBookings: any[];
  routesFill: RouteFill[];
}

interface BookingRow { id: string; ticketNumber?: string; status: string; totalAmount: number; createdAt: string; route?: { departure: string; destination: string }; }

interface AdminState {
  // Legacy compat
  stats: any | null;
  liveStats: LiveStats | null;
  allBookings: BookingRow[];
  allRoutes: Route[];
  isLoading: boolean;
  error: string | null;

  fetchDashboardStats: () => Promise<void>;
  fetchAllBookings: (filters?: any) => Promise<void>;
  fetchAllRoutes: (filters?: any) => Promise<void>;
  fetchAllUsers: () => Promise<void>;
  updateBookingStatus: (id: string, status: string) => Promise<void>;
  createRoute: (payload: CreateRoutePayload) => Promise<void>;
  updateRoute: (id: string, payload: UpdateRoutePayload) => Promise<void>;
  updateRouteStatus: (id: string, status: 'ACTIVE' | 'INACTIVE') => Promise<void>;
  updateRouteSeats: (id: string, totalSeats: number, availableSeats: number) => Promise<void>;
  deleteRoute: (id: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  stats: null,
  liveStats: null,
  allBookings: [],
  allRoutes: [],
  allUsers: [],
  isLoading: false,
  error: null,

  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const liveStats = await routeService.getDashboardStats();
      // Also set legacy stats shape for existing Dashboard component
      set({
        liveStats,
        stats: {
          totalBookings: liveStats.totalBookings,
          totalRevenue: liveStats.totalRevenue,
          totalUsers: 0,
          activeRoutes: liveStats.activeRoutes,
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch stats', isLoading: false });
    }
  },

  fetchAllBookings: async (_filters) => {
    set({ isLoading: true, error: null });
    try {
      // Fetch from routes/admin/stats for now (which includes recentBookings)
      const liveStats = get().liveStats;
      if (liveStats?.recentBookings) {
        set({ allBookings: liveStats.recentBookings as any, isLoading: false });
      } else {
        const stats = await routeService.getDashboardStats();
        set({ allBookings: stats.recentBookings, liveStats: stats, isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch bookings', isLoading: false });
    }
  },

  fetchAllRoutes: async (_filters) => {
    set({ isLoading: true, error: null });
    try {
      const routes = await routeService.getRoutes();
      set({ allRoutes: routes, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch routes', isLoading: false });
    }
  },

  fetchAllUsers: async () => {
    // No user endpoint yet — no-op
    set({ isLoading: false });
  },

  updateBookingStatus: async (_id, _status) => {
    // Placeholder — no booking status endpoint yet
  },

  createRoute: async (payload) => {
    try {
      const newRoute = await routeService.createRoute(payload);
      set((state) => ({ allRoutes: [newRoute, ...state.allRoutes] }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to create route' });
      throw error;
    }
  },

  updateRoute: async (id, payload) => {
    try {
      const updated = await routeService.updateRoute(id, payload);
      set((state) => ({
        allRoutes: state.allRoutes.map((r) => (String(r.id) === String(id) ? { ...r, ...updated } : r)),
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to update route' });
      throw error;
    }
  },

  updateRouteStatus: async (id, status) => {
    try {
      await routeService.updateRouteStatus(id, status);
      set((state) => ({
        allRoutes: state.allRoutes.map((r) =>
          String(r.id) === String(id) ? { ...r, status } : r
        ),
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to update route status' });
      throw error;
    }
  },

  updateRouteSeats: async (id, totalSeats, availableSeats) => {
    try {
      await routeService.updateRouteSeats(id, totalSeats, availableSeats);
      set((state) => ({
        allRoutes: state.allRoutes.map((r) =>
          String(r.id) === String(id)
            ? { ...r, totalSeats, availableSeats, total_seats: totalSeats, available_seats: availableSeats }
            : r
        ),
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to update seats' });
      throw error;
    }
  },

  deleteRoute: async (id) => {
    try {
      await routeService.deleteRoute(id);
      set((state) => ({ allRoutes: state.allRoutes.filter((r) => String(r.id) !== String(id)) }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete route' });
      throw error;
    }
  },
}));
