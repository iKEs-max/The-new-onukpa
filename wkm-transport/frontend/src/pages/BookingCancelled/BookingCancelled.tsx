import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';
import { ROUTES } from '@/config/routes';
import styles from './BookingCancelled.module.css';

export const BookingCancelled: React.FC = () => {
  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <XCircle size={56} />
        </div>

        <h1 className={styles.title}>Booking Cancelled</h1>
        <p className={styles.subtitle}>
          Your booking has been cancelled. No charges were applied to your account.
          If this was a mistake, you can try booking again.
        </p>

        <div className={styles.actions}>
          <Link to={ROUTES.ROUTES}>
            <Button variant="primary" size="lg" leftIcon={<RefreshCw size={18} />}>
              Try Again
            </Button>
          </Link>
          <Link to={ROUTES.HOME}>
            <Button variant="ghost" size="lg" leftIcon={<ArrowLeft size={18} />}>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
