import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Search } from 'lucide-react';
import { useAdminStore } from '@/store/admin.store';
import { formatCurrency, formatDate } from '@/utils/formatters';
import styles from './AdminBookings.module.css';

type StatusFilter = 'ALL' | 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';

const STATUS_TABS: { label: string; value: StatusFilter; color: string }[] = [
  { label: 'All',       value: 'ALL',       color: '#94a3b8' },
  { label: 'Confirmed', value: 'CONFIRMED', color: '#10b981' },
  { label: 'Pending',   value: 'PENDING',   color: '#f59e0b' },
  { label: 'Cancelled', value: 'CANCELLED', color: '#ef4444' },
  { label: 'Completed', value: 'COMPLETED', color: '#6366f1' },
];

const exportToCsv = (data: any[]) => {
  if (!data.length) return;
  const headers = ['Reference', 'Passenger', 'Route', 'Amount', 'Status', 'Date'];
  const rows = data.map((b) => [
    b.booking_reference ?? b.ticketNumber ?? b.id,
    b.passenger_name ?? b.passengerName ?? '–',
    `${b.origin ?? b.departure ?? '?'} → ${b.destination ?? '?'}`,
    b.total_amount ?? b.totalAmount ?? 0,
    b.status,
    b.created_at ?? b.createdAt ?? '',
  ]);
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bookings-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const AdminBookings: React.FC = () => {
  const { allBookings, liveStats, isLoading, fetchDashboardStats } = useAdminStore();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchDashboardStats(); }, [fetchDashboardStats]);

  // Use liveStats.recentBookings if allBookings is empty
  const bookings: any[] = allBookings.length > 0
    ? allBookings
    : (liveStats?.recentBookings ?? []);

  const filtered = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const q = search.toLowerCase();
    const name = (b.passenger_name ?? b.passengerName ?? '').toLowerCase();
    const ref = (b.booking_reference ?? b.ticketNumber ?? '').toLowerCase();
    const route = `${b.origin ?? ''}${b.destination ?? ''}`.toLowerCase();
    const matchesSearch = !q || name.includes(q) || ref.includes(q) || route.includes(q);
    return matchesStatus && matchesSearch;
  });

  const counts: Record<StatusFilter, number> = {
    ALL: bookings.length,
    CONFIRMED: bookings.filter((b) => b.status === 'CONFIRMED').length,
    PENDING: bookings.filter((b) => b.status === 'PENDING').length,
    CANCELLED: bookings.filter((b) => b.status === 'CANCELLED').length,
    COMPLETED: bookings.filter((b) => b.status === 'COMPLETED').length,
  };

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <h1 className={styles.title}>Bookings</h1>
        <button className={styles.exportBtn} onClick={() => exportToCsv(filtered)}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* ── Status tabs ── */}
      <div className={styles.tabs}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`${styles.tab} ${statusFilter === tab.value ? styles.tabActive : ''}`}
            style={{ '--tab-color': tab.color } as any}
            onClick={() => setStatusFilter(tab.value)}
          >
            {tab.label}
            <span className={styles.tabCount}>{counts[tab.value]}</span>
          </button>
        ))}
      </div>

      {/* ── Search ── */}
      <div className={styles.searchWrap}>
        <Search size={15} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="Search by name, reference, or route…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── Table ── */}
      {isLoading ? (
        <div className={styles.empty}>Loading bookings…</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>No bookings found.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Reference</th>
              <th>Passenger</th>
              <th>Route</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b: any, i: number) => {
              const statusClass: Record<string, string> = {
                CONFIRMED: styles.badgeCONFIRMED,
                PENDING:   styles.badgePENDING,
                CANCELLED: styles.badgeCANCELLED,
                COMPLETED: styles.badgeCOMPLETED,
              };
              return (
                <motion.tr
                  key={b.id ?? i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#94a3b8' }}>
                    {b.booking_reference ?? b.ticketNumber ?? b.id}
                  </td>
                  <td>{b.passenger_name ?? b.passengerName ?? '–'}</td>
                  <td>{(b.origin ?? b.departure ?? '?')} → {b.destination ?? '?'}</td>
                  <td style={{ color: '#fbbf24', fontWeight: 600 }}>
                    {formatCurrency(b.total_amount ?? b.totalAmount ?? 0)}
                  </td>
                  <td>
                    <span className={statusClass[b.status] ?? styles.badgePENDING}>{b.status}</span>
                  </td>
                  <td style={{ opacity: 0.5, fontSize: '0.78rem' }}>
                    {formatDate ? formatDate(b.created_at ?? b.createdAt) : (b.created_at ?? b.createdAt ?? '–')}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
