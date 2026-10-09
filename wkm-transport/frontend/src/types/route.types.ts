export type RouteStatus = 'ACTIVE' | 'INACTIVE';

export interface Route {
  id: string | number;
  // Frontend friendly names
  departure?: string;
  destination: string;
  price?: number | string;
  departureTime?: string;
  arrivalTime?: string;
  totalSeats?: number;
  availableSeats?: number;
  departureTimes?: string[];
  status: RouteStatus;
  createdAt?: string;
  updatedAt?: string;
  // Backend DB column names (also accepted)
  origin?: string;
  base_price?: number;
  total_seats?: number;
  available_seats?: number;
  departure_time?: string;
  departure_times?: string[];
}

export interface CreateRoutePayload {
  departure?: string;
  origin?: string;
  destination: string;
  price?: number;
  base_price?: number;
  departureTime?: string;
  departure_time?: string;
  departure_times?: string[];
  totalSeats?: number;
  total_seats?: number;
  status?: RouteStatus;
}

export interface UpdateRoutePayload extends Partial<CreateRoutePayload> {
  available_seats?: number;
  availableSeats?: number;
  status?: RouteStatus;
}
