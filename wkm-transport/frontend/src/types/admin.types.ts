export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  activeRoutes: number;
  recentBookings: number;
  bookingsTrend: number;    // percentage change
  revenueTrend: number;
  usersTrend: number;
}

export interface AdminFilters {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
