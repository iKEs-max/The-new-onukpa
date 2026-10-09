import React from 'react';
import { MapPin, ArrowRight, Calendar, Hash } from 'lucide-react';
import { Card } from '@/components/common/Card/Card';
import { formatCurrency, formatDate, formatTime } from '@/utils/formatters';
import type { Booking } from '@/types/booking.types';
import styles from './TicketCard.module.css';
import { clsx } from 'clsx';

interface TicketCardProps {
  booking: Booking;
  className?: string;
}

export const TicketCard: React.FC<TicketCardProps> = ({ booking, className }) => {
  const statusClass = styles[`status${booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}`];

  return (
    <Card className={clsx(styles.ticket, className)}>
      <div className={styles.header}>
        <div className={styles.ticketNumber}>
          <Hash size={14} />
          <span>{booking.ticketNumber}</span>
        </div>
        <span className={clsx(styles.statusBadge, statusClass)}>
          {booking.status}
        </span>
      </div>

      {booking.route && (
        <div className={styles.route}>
          <div className={styles.locationPoint}>
            <MapPin size={16} className={styles.iconAccent} />
            <span>{booking.route.departure}</span>
          </div>
          <ArrowRight size={16} className={styles.iconMuted} />
          <div className={styles.locationPoint}>
            <MapPin size={16} className={styles.iconPrimary} />
            <span>{booking.route.destination}</span>
          </div>
        </div>
      )}

      <div className={styles.details}>
        <div className={styles.detailRow}>
          <Calendar size={14} />
          <span>{formatDate(booking.createdAt)}</span>
        </div>
        {booking.route && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Departure:</span>
            <span>{formatTime(booking.route.departureTime)}</span>
          </div>
        )}
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Tickets:</span>
          <span>{booking.numberOfTickets}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalAmount}>{formatCurrency(Number(booking.totalAmount))}</span>
      </div>
    </Card>
  );
};
