import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, Map, CalendarCheck, RefreshCw,
  TrendingUp, Bus, Activity
} from 'lucide-react';
import { useAdminStore } from '@/store/admin.store';
import { formatCurrency } from '@/utils/formatters';
import styles from './AdminDashboard.module.css';

/* ── Helpers ──────────────────────────────────────────────────────────────*/
const getAvailLabel = (total: number, available: number) => {
  if (available === 0) return { label: 'Full', cls: styles.availFull };
  if (available === 1) return { label: '1 Seat Left', cls: styles.availLast };
  const pct = total > 0 ? (available / total) * 100 : 100;
  if (pct <= 20) return { label: 'Filling Fast', cls: styles.availFilling };
  return { label: 'Available', cls: styles.availAvailable };
};

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    CONFIRMED: styles.badgeCONFIRMED,
    PENDING: styles.badgePENDING,
    CANCELLED: styles.badgeCANCELLED,
    COMPLETED: styles.badgeCOMPLETED,
  };
  return <span className={map[status] ?? styles.badgePENDING}>{status}</span>;
};

/* ── Tiny CSS bar chart ───────────────────────────────────────────────────*/
const BarChart: React.FC<{ data: { date: string; count: number }[] }> = ({ data }) => {
  const max = Math.max(...data.map((d) => d.count), 1);
  const days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  return (
    <div className={styles.chartRow}>
      {data.map((d, i) => {
        const day = new Date(d.date).getDay();
        const heightPct = Math.max((d.count / max) * 100, 4);
        return (
          <div key={i} className={styles.chartBar} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', position: 'relative' }}>
            {d.count > 0 && <span className={styles.chartCount}>{d.count}</span>}
            <div className={styles.chartBarFill} style={{ height: `${heightPct}%` }} />
            <span className={styles.chartLabel}>{days[day]}</span>
          </div>
        );
      })}
      {data.length === 0 && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4, fontSize: '0.8rem' }}>
          No data for the last 7 days
        </div>
      )}
    </div>
  );
};

/* ── Main component ───────────────────────────────────────────────────────*/
export const AdminDashboard: React.FC = () => {
  const { stats, liveStats, isLoading, fetchDashboardStats } = useAdminStore();

  useEffect(() => { fetchDashboardStats(); }, [fetchDashboardStats]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const id = setInterval(fetchDashboardStats, 30_000);
    return () => clearInterval(id);
  }, [fetchDashboardStats]);

  const handleRefresh = useCallback(() => { fetchDashboardStats(); }, [fetchDashboardStats]);

  const kpis = [
    {
      label: 'Total Bookings', value: liveStats?.totalBookings ?? stats?.totalBookings ?? 0,
      icon: <CalendarCheck size={40} />, accent: '#f59e0b'
    },
    {
      label: 'Revenue', value: formatCurrency(liveStats?.totalRevenue ?? stats?.totalRevenue ?? 0),
      icon: <DollarSign size={40} />, accent: '#10b981'
    },
    {
      label: 'Active Routes', value: liveStats?.activeRoutes ?? stats?.activeRoutes ?? 0,
      icon: <Map size={40} />, accent: '#6366f1'
    },
    {
      label: 'Confirmed Today', value: liveStats?.confirmedBookings ?? 0,
      icon: <TrendingUp size={40} />, accent: '#0ea5e9'
    },
  ];

  const chartData = liveStats?.chartData ?? [];
  const recentBookings = liveStats?.recentBookings ?? [];
  const routesFill = liveStats?.routesFill ?? [];

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Control Center</h1>
          <p className={styles.subtitle}>Live dashboard — refreshes every 30 s</p>
        </div>
        <button className={styles.refreshBtn} onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
          {isLoading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <motion.div
        className={styles.statsGrid}
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
        initial="hidden" animate="show"
      >
        {kpis.map((k) => (
          <motion.div
            key={k.label}
            className={styles.kpiCard}
            style={{ '--accent': k.accent } as any}
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 160 } } }}
          >
            <span className={styles.kpiIcon}>{k.icon}</span>
            <span className={styles.kpiLabel}>{k.label}</span>
            <span className={styles.kpiValue}>{k.value}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Two-column: chart + feed ── */}
      <div className={styles.twoCol}>
        {/* 7-day booking chart */}
        <div className={styles.panel}>
          <p className={styles.panelTitle}><Activity size={14} /> Bookings — Last 7 Days</p>
          <BarChart data={chartData} />
        </div>

        {/* Live activity feed */}
        <div className={styles.panel}>
          <p className={styles.panelTitle}><Bus size={14} /> Recent Bookings</p>
          <div className={styles.feed}>
            {recentBookings.length === 0 && (
              <p style={{ opacity: 0.4, fontSize: '0.82rem' }}>No bookings yet.</p>
            )}
            {recentBookings.map((b: any, i: number) => {
              const dotColor =
                b.status === 'CONFIRMED' ? '#10b981' :
                b.status === 'PENDING'   ? '#f59e0b' :
                b.status === 'CANCELLED' ? '#ef4444' : '#94a3b8';
              return (
                <div key={b.id ?? i} className={styles.feedItem}>
                  <div className={styles.feedDot} style={{ background: dotColor }} />
                  <div className={styles.feedBody}>
                    <div className={styles.feedRoute}>
                      {b.origin ?? b.departure ?? '?'} → {b.destination ?? '?'}
                    </div>
                    <div className={styles.feedMeta}>
                      {b.passenger_name ?? b.passengerName ?? 'Guest'} · {formatCurrency(b.total_amount ?? b.totalAmount ?? 0)} · {statusBadge(b.status)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Route Fill Status ── */}
      <div className={styles.panel}>
        <p className={styles.panelTitle}><Map size={14} /> Route Seat Overview</p>
        <table className={styles.fillTable}>
          <thead>
            <tr>
              <th>Route</th>
              <th>Seats</th>
              <th>Fill</th>
              <th>Availability</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {routesFill.map((r: any) => {
              const total = r.total_seats ?? 45;
              const avail = r.available_seats ?? 0;
              const fillPct = total > 0 ? Math.round(((total - avail) / total) * 100) : 0;
              const { label, cls } = getAvailLabel(total, avail);
              const fillColor = fillPct > 80 ? '#ef4444' : fillPct > 50 ? '#f59e0b' : '#10b981';
              return (
                <tr key={r.id}>
                  <td>{r.origin} → {r.destination}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{avail}/{total}</td>
                  <td>
                    <div className={styles.fillBar}>
                      <div className={styles.fillBarInner} style={{ width: `${fillPct}%`, background: fillColor }} />
                    </div>
                  </td>
                  <td><span className={`${styles.availBadge} ${cls}`}>{label}</span></td>
                  <td>
                    <span className={r.status === 'ACTIVE' ? styles.badgeCONFIRMED : styles.badgeCOMPLETED}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {routesFill.length === 0 && (
              <tr><td colSpan={5} style={{ opacity: 0.4, paddingTop: 12 }}>No routes yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
