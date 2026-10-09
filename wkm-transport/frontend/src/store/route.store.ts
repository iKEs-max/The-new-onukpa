import { create } from 'zustand';
import api from '@/services/api';

export interface Route {
  id: string;
  departure: string;
  destination: string;
  price: string;
  departureTime: string;
  arrivalTime: string;
  totalSeats: number;
  availableSeats: number;
  status: 'ACTIVE' | 'INACTIVE';
}

interface RouteState {
  routes: Route[];
  isLoading: boolean;
  error: string | null;
  fetchRoutes: () => Promise<void>;
  getRoute: (id: string) => Route | undefined;
}

export const useRouteStore = create<RouteState>((set, get) => ({
  routes: [],
  isLoading: false,
  error: null,
  
  fetchRoutes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/routes');
      set({ routes: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch routes',
        isLoading: false 
      });
    }
  },

  getRoute: (id: string) => {
    return get().routes.find(route => route.id === id);
  }
}));
