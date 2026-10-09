import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, ArrowRight } from 'lucide-react';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { TimeBadge } from '@/components/routes/TimeBadge/TimeBadge';
import { formatCurrency } from '@/utils/formatters';
import type { Route } from '@/store/route.store';
import styles from './RouteCard.module.css';

interface RouteCardProps {
  route: Route;
}

export const RouteCard: React.FC<RouteCardProps> = ({ route }) => {
  const navigate = useNavigate();
  const isAvailable = route.availableSeats > 0;

  const handleBook = () => {
    navigate(`/booking/${route.id}`);
  };

  return (
    <Card hoverable className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.locations}>
          <div className={styles.locationPoint}>
            <MapPin size={18} className={styles.iconAccent} />
            <span className={styles.city}>{route.departure}</span>
          </div>
          <ArrowRight size={20} className={styles.iconMuted} />
          <div className={styles.locationPoint}>
            <MapPin size={18} className={styles.iconPrimary} />
            <span className={styles.city}>{route.destination}</span>
          </div>
        </div>
        <div className={styles.price}>
          {formatCurrency(Number(route.price))}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.times}>
          <div className={styles.timeBlock}>
            <span className={styles.timeLabel}>Departs</span>
            <TimeBadge time={route.departureTime} variant="primary" />
          </div>
          <div className={styles.timeLine} />
          <div className={styles.timeBlock}>
            <span className={styles.timeLabel}>Arrives</span>
            <TimeBadge time={route.arrivalTime} variant="neutral" />
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.seats}>
          <Users size={16} className={isAvailable ? styles.iconPrimary : styles.iconError} />
          <span className={isAvailable ? styles.textNormal : styles.textError}>
            {route.availableSeats} / {route.totalSeats} seats left
          </span>
        </div>
        <Button 
          variant={isAvailable ? 'primary' : 'secondary'} 
          disabled={!isAvailable}
          onClick={handleBook}
        >
          {isAvailable ? 'Book Ticket' : 'Sold Out'}
        </Button>
      </div>
    </Card>
  );
};
