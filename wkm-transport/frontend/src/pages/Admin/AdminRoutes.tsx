import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X, Clock, Pencil, Trash2, Save } from 'lucide-react';
import { useAdminStore } from '@/store/admin.store';
import { formatCurrency } from '@/utils/formatters';
import type { Route } from '@/types/route.types';
import styles from './AdminRoutes.module.css';

/* ── Helpers ──────────────────────────────────────────────────────────────*/
const getAvailInfo = (total: number, available: number) => {
  if (available === 0) return { label: 'Full', cls: styles.availFull };
  if (available === 1) return { label: '1 Seat Left', cls: styles.availLast };
  const pct = total > 0 ? (available / total) * 100 : 100;
  if (pct <= 20) return { label: 'Filling Fast', cls: styles.availFilling };
  return { label: 'Available', cls: styles.availAvailable };
};

/* ── Seat stepper ─────────────────────────────────────────────────────────*/
const SeatStepper: React.FC<{
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}> = ({ value, onChange, min = 0, max = 100 }) => (
  <div className={styles.seatControl}>
    <button className={styles.stepBtn} onClick={() => onChange(Math.max(min, value - 1))}>−</button>
    <span className={styles.seatNum}>{value}</span>
    <button className={styles.stepBtn} onClick={() => onChange(Math.min(max, value + 1))}>+</button>
  </div>
);

/* ── Time chip input ──────────────────────────────────────────────────────*/
const TimeChips: React.FC<{
  times: string[];
  onChange: (times: string[]) => void;
}> = ({ times, onChange }) => {
  const [adding, setAdding] = useState(false);
  const [val, setVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTime = () => {
    if (val && !times.includes(val)) onChange([...times, val]);
    setVal('');
    setAdding(false);
  };

  return (
    <div className={styles.chips}>
      {times.map((t) => (
        <span key={t} className={styles.chip}>
          <Clock size={10} /> {t}
          <button className={styles.chipRemove} onClick={() => onChange(times.filter((x) => x !== t))}>×</button>
        </span>
      ))}
      {adding ? (
        <input
          ref={inputRef}
          type="time"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={addTime}
          onKeyDown={(e) => e.key === 'Enter' && addTime()}
          style={{ width: 100, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(99,102,241,0.4)', color: '#f1f5f9', borderRadius: 8, padding: '2px 6px', fontSize: '0.78rem', outline: 'none' }}
          autoFocus
        />
      ) : (
        <button className={styles.addChipBtn} onClick={() => setAdding(true)}>+ Add Time</button>
      )}
    </div>
  );
};

/* ── Detail slide-in panel ───────────────────────────────────────────────*/
interface PanelProps {
  route: Route | null;
  onClose: () => void;
  onSave: (id: string, data: Partial<Route>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const RouteDetailPanel: React.FC<PanelProps> = ({ route, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState<Partial<Route & { departure_times: string[] }>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (route) {
      setForm({
        departure: (route as any).departure ?? (route as any).origin ?? '',
        destination: route.destination ?? '',
        price: route.price ?? (route as any).base_price ?? 0,
        total_seats: (route as any).totalSeats ?? (route as any).total_seats ?? 45,
        available_seats: (route as any).availableSeats ?? (route as any).available_seats ?? 45,
        status: route.status ?? 'ACTIVE',
        departure_times: (route as any).departureTimes ?? (route as any).departure_times ?? [],
      });
    }
  }, [route]);

  if (!route) return null;

  const totalSeats = (form.total_seats as number) ?? 45;
  const availSeats = (form.available_seats as number) ?? 0;
  const { label: availLabel, cls: availCls } = getAvailInfo(totalSeats, availSeats);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(String(route.id), {
        ...form,
        origin: form.departure as any,
        base_price: form.price as any,
        total_seats: totalSeats as any,
        available_seats: availSeats as any,
      } as any);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <motion.div
        className={styles.detailPanel}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 200 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className={styles.panelTitle}>Edit Route</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={16} /></button>
        </div>

        {/* Origin / Destination */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>From (Origin)</label>
          <input className={styles.formInput} value={form.departure as string ?? ''} onChange={(e) => setForm((f) => ({ ...f, departure: e.target.value }))} placeholder="e.g. Accra (Circle)" />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>To (Destination)</label>
          <input className={styles.formInput} value={form.destination ?? ''} onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))} placeholder="e.g. Kumasi (Kejetia)" />
        </div>

        {/* Price */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Price (GHS)</label>
          <input className={styles.formInput} type="number" min={0} value={form.price as number ?? ''} onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) }))} />
        </div>

        {/* Departure times */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Departure Times</label>
          <TimeChips
            times={(form.departure_times as string[]) ?? []}
            onChange={(times) => setForm((f) => ({ ...f, departure_times: times }))}
          />
        </div>

        {/* Seat control */}
        <div className={styles.seatRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Total Seats</label>
            <SeatStepper
              value={totalSeats}
              onChange={(v) => setForm((f) => ({ ...f, total_seats: v, available_seats: Math.min((f.available_seats as number) ?? v, v) }))}
              min={1} max={100}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Available Seats</label>
            <SeatStepper
              value={availSeats}
              onChange={(v) => setForm((f) => ({ ...f, available_seats: v }))}
              min={0} max={totalSeats}
            />
          </div>
        </div>

        {/* Availability preview */}
        <div className={styles.availSliderRow}>
          <div className={styles.availSliderLabel}>
            <span style={{ opacity: 0.55, fontSize: '0.75rem' }}>Seat Availability</span>
            <span className={`${styles.availBadge} ${availCls}`}>{availLabel}</span>
          </div>
          <input
            type="range"
            className={styles.availSlider}
            min={0}
            max={totalSeats}
            value={availSeats}
            onChange={(e) => setForm((f) => ({ ...f, available_seats: parseInt(e.target.value) }))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', opacity: 0.4 }}>
            <span>Full (0)</span>
            <span>1 Seat Left</span>
            <span>Filling Fast</span>
            <span>Available ({totalSeats})</span>
          </div>
        </div>

        {/* Status */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Status</label>
          <select className={styles.formInput} value={form.status ?? 'ACTIVE'} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as any }))}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {/* Actions */}
        <div className={styles.panelActions}>
          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            <Save size={15} style={{ marginRight: 6 }} />
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <button className={styles.deleteBtn} onClick={() => onDelete(String(route.id)).then(onClose)}>
            <Trash2 size={15} />
          </button>
        </div>
      </motion.div>
    </>
  );
};

/* ── Main AdminRoutes page ───────────────────────────────────────────────*/
export const AdminRoutes: React.FC = () => {
  const { allRoutes, isLoading, fetchAllRoutes, updateRoute, updateRouteStatus, updateRouteSeats, deleteRoute } = useAdminStore();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Route | null>(null);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [priceVal, setPriceVal] = useState('');

  useEffect(() => { fetchAllRoutes(); }, [fetchAllRoutes]);

  const filtered = allRoutes.filter((r) => {
    const q = search.toLowerCase();
    const dep = ((r as any).departure ?? (r as any).origin ?? '').toLowerCase();
    const dest = (r.destination ?? '').toLowerCase();
    return !q || dep.includes(q) || dest.includes(q);
  });

  const handleStatusToggle = async (r: Route, checked: boolean) => {
    await updateRouteStatus(String(r.id), checked ? 'ACTIVE' : 'INACTIVE');
  };

  const handleSeatChange = async (r: Route, delta: number) => {
    const avail = Math.max(0, Math.min(((r as any).total_seats ?? 45), ((r as any).available_seats ?? 0) + delta));
    await updateRouteSeats(String(r.id), (r as any).total_seats ?? 45, avail);
  };

  const handlePriceBlur = async (r: Route) => {
    const newPrice = parseFloat(priceVal);
    if (!isNaN(newPrice) && newPrice !== (r.price ?? (r as any).base_price)) {
      await updateRoute(String(r.id), { price: newPrice as any, base_price: newPrice as any } as any);
    }
    setEditingPrice(null);
  };

  const handleSave = async (id: string, data: any) => {
    await updateRoute(id, data);
    await updateRouteSeats(id, data.total_seats, data.available_seats);
  };

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Routes</h1>
        <button className={styles.addBtn} onClick={() => setSelected({} as any)}>
          <Plus size={16} /> Add Route
        </button>
      </div>

      {/* ── Search ── */}
      <div className={styles.searchBar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search routes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Table ── */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>From → To</th>
            <th>Price</th>
            <th>Available Seats</th>
            <th>Availability</th>
            <th>Active</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr><td colSpan={6} className={styles.empty}>Loading…</td></tr>
          )}
          {!isLoading && filtered.length === 0 && (
            <tr><td colSpan={6} className={styles.empty}>No routes found. Add one!</td></tr>
          )}
          {filtered.map((r) => {
            const total = (r as any).total_seats ?? (r as any).totalSeats ?? 45;
            const avail = (r as any).available_seats ?? (r as any).availableSeats ?? 0;
            const dep = (r as any).departure ?? (r as any).origin ?? '–';
            const price = r.price ?? (r as any).base_price ?? 0;
            const { label, cls } = getAvailInfo(total, avail);

            return (
              <tr key={r.id}>
                <td>{dep} → {r.destination}</td>

                {/* Inline price edit */}
                <td>
                  {editingPrice === String(r.id) ? (
                    <input
                      className={styles.priceInput}
                      type="number"
                      value={priceVal}
                      onChange={(e) => setPriceVal(e.target.value)}
                      onBlur={() => handlePriceBlur(r)}
                      onKeyDown={(e) => e.key === 'Enter' && handlePriceBlur(r)}
                      autoFocus
                    />
                  ) : (
                    <span
                      className={styles.priceDisplay}
                      onClick={() => { setEditingPrice(String(r.id)); setPriceVal(String(price)); }}
                      title="Click to edit"
                    >
                      {formatCurrency(price)} <Pencil size={11} />
                    </span>
                  )}
                </td>

                {/* Seat stepper */}
                <td>
                  <div className={styles.seatControl}>
                    <button className={styles.stepBtn} onClick={() => handleSeatChange(r, -1)}>−</button>
                    <span className={styles.seatNum}>{avail}/{total}</span>
                    <button className={styles.stepBtn} onClick={() => handleSeatChange(r, 1)}>+</button>
                  </div>
                </td>

                {/* Availability label */}
                <td>
                  <span className={`${styles.availBadge} ${cls}`}>{label}</span>
                </td>

                {/* Status toggle */}
                <td>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={r.status === 'ACTIVE'}
                      onChange={(e) => handleStatusToggle(r, e.target.checked)}
                    />
                    <span className={styles.toggleSlider} />
                  </label>
                </td>

                {/* Edit button */}
                <td>
                  <button className={styles.addChipBtn} onClick={() => setSelected(r)}>
                    <Pencil size={12} /> Edit
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ── Slide-in detail panel ── */}
      <AnimatePresence>
        {selected !== null && (
          <RouteDetailPanel
            route={selected}
            onClose={() => setSelected(null)}
            onSave={handleSave}
            onDelete={async (id) => { await deleteRoute(id); setSelected(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
