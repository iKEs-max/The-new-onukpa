import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ROUTES } from '@/config/routes';
import { MainLayout, DashboardLayout } from '@/components/layout/MainLayout';
import { useAuthStore } from '@/store/auth.store';
import { Loader } from '@/components/common/Loader/Loader';
import { ToastContainer } from '@/components/common/Toast/Toast';

// ── Lazy-loaded Public Pages ──
const Home        = React.lazy(() => import('@/pages/Home/Home').then((m) => ({ default: m.Home })));
const About       = React.lazy(() => import('@/pages/About/About').then((m) => ({ default: m.About })));
const RoutesPage  = React.lazy(() => import('@/pages/RoutesPage/RoutesPage').then((m) => ({ default: m.RoutesPage })));
const Pricing     = React.lazy(() => import('@/pages/Pricing/Pricing').then((m) => ({ default: m.Pricing })));
const Contact     = React.lazy(() => import('@/pages/Contact/Contact').then((m) => ({ default: m.Contact })));
const BookRide    = React.lazy(() => import('@/pages/BookRide/BookRide').then((m) => ({ default: m.BookRide })));
const BookingSuccess   = React.lazy(() => import('@/pages/BookingSuccess/BookingSuccess').then((m) => ({ default: m.BookingSuccess })));
const BookingCancelled = React.lazy(() => import('@/pages/BookingCancelled/BookingCancelled').then((m) => ({ default: m.BookingCancelled })));

// ── Lazy-loaded Admin Pages ──
const AdminLogin    = React.lazy(() => import('@/pages/Admin/AdminLogin').then((m) => ({ default: m.AdminLogin })));
const AdminDashboard = React.lazy(() => import('@/pages/Admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminRoutes   = React.lazy(() => import('@/pages/Admin/AdminRoutes').then((m) => ({ default: m.AdminRoutes })));
const AdminBookings = React.lazy(() => import('@/pages/Admin/AdminBookings').then((m) => ({ default: m.AdminBookings })));
const AdminSettings = React.lazy(() => import('@/pages/Admin/AdminSettings').then((m) => ({ default: m.AdminSettings })));

// ── Route Guard ──
const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to={ROUTES.ADMIN_LOGIN} replace />;
  if (requireAdmin && user?.role !== 'ADMIN') return <Navigate to={ROUTES.HOME} replace />;
  return <>{children}</>;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* ── Public routes with header + footer ── */}
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME}      element={<Home />} />
          <Route path={ROUTES.ABOUT}     element={<About />} />
          <Route path={ROUTES.ROUTES}    element={<RoutesPage />} />
          <Route path={ROUTES.PRICING}   element={<Pricing />} />
          <Route path={ROUTES.CONTACT}   element={<Contact />} />
          <Route path={ROUTES.BOOK_RIDE} element={<BookRide />} />
          <Route path={ROUTES.BOOKING}   element={<BookRide />} />
          <Route path={ROUTES.BOOKING_SUCCESS}   element={<BookingSuccess />} />
          <Route path={ROUTES.BOOKING_CANCELLED} element={<BookingCancelled />} />
          <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
        </Route>

        {/* ── Admin dashboard (protected) ── */}
        <Route element={<DashboardLayout />}>
          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>}
          />
          <Route
            path={ROUTES.ADMIN_ROUTES}
            element={<ProtectedRoute requireAdmin><AdminRoutes /></ProtectedRoute>}
          />
          <Route
            path={ROUTES.ADMIN_BOOKINGS}
            element={<ProtectedRoute requireAdmin><AdminBookings /></ProtectedRoute>}
          />
          <Route
            path={ROUTES.ADMIN_SETTINGS}
            element={<ProtectedRoute requireAdmin><AdminSettings /></ProtectedRoute>}
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Suspense fallback={<Loader fullScreen />}>
      <AnimatedRoutes />
    </Suspense>
    <ToastContainer />
  </BrowserRouter>
);

// Root error boundary to surface JS errors instead of blank screen
interface RootErrorState { error: Error | null; }
export class RootErrorBoundary extends React.Component<{ children: React.ReactNode }, RootErrorState> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[Root Error Boundary]', error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: 'monospace', color: '#ef4444', background: '#18181b', minHeight: '100vh' }}>
          <h2>⚠️ Application Error</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: 16 }}>{this.state.error.message}</pre>
          <pre style={{ opacity: 0.6, fontSize: 12, marginTop: 8 }}>{this.state.error.stack}</pre>
          <button style={{ marginTop: 24, padding: '8px 16px', cursor: 'pointer' }} onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}
