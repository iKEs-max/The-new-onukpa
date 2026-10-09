export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRICING: '/pricing',
  LOGIN: '/login',
  REGISTER: '/register',
  ROUTES: '/routes',
  BOOK_RIDE: '/book',
  BOOKING: '/booking/:routeId',
  BOOKING_SUCCESS: '/booking/success',
  BOOKING_CANCELLED: '/booking/cancelled',
  USER_DASHBOARD: '/dashboard',
  
  // Admin Routes
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_ROUTES: '/admin/routes',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_SETTINGS: '/admin/settings',
} as const;
