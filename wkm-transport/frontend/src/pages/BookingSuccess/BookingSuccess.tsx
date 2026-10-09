import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home, Printer } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';
import { ROUTES } from '@/config/routes';
import styles from './BookingSuccess.module.css';

export const BookingSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const ticketNumber = searchParams.get('ticket') || '';

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <CheckCircle size={56} />
        </div>

        <h1 className={styles.title}>Booking Confirmed!</h1>
        <p className={styles.subtitle}>
          Your booking has been successfully confirmed. We've sent a confirmation email with your ticket details.
        </p>

        {ticketNumber && (
          <div className={styles.ticketBox}>
            <span className={styles.ticketLabel}>Ticket Number</span>
            <span className={styles.ticketNumber}>{ticketNumber}</span>
          </div>
        )}

        <div className={styles.info}>
          <p>Please arrive at the departure point at least 15 minutes before your scheduled departure time.</p>
          <p>Present your ticket number or confirmation email at the boarding point.</p>
        </div>

        <div className={styles.actions}>
          <Link to={ROUTES.HOME}>
            <Button variant="primary" size="lg" leftIcon={<Home size={18} />}>
              Go Home
            </Button>
          </Link>
          <Button variant="outline" size="lg" leftIcon={<Printer size={18} />} onClick={() => window.print()}>
            Print Ticket
          </Button>
        </div>
      </div>
    </div>
  );
};
