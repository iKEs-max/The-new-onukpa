import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MapPin, ArrowRight, Users, CreditCard } from 'lucide-react';
import { useRouteStore } from '@/store/route.store';
import { useBookingStore } from '@/store/booking.store';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';
import { Loader } from '@/components/common/Loader/Loader';
import { TimeBadge } from '@/components/routes/TimeBadge/TimeBadge';
import { formatCurrency } from '@/utils/formatters';
import styles from './BookingForm.module.css';

interface BookingFormData {
  numberOfTickets: number;
}

export const BookingForm: React.FC = () => {
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();
  const getRoute = useRouteStore((s) => s.getRoute);
  const { createBooking, isLoading, error } = useBookingStore();

  const route = routeId ? getRoute(routeId) : undefined;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    defaultValues: { numberOfTickets: 1 },
  });

  const ticketCount = watch('numberOfTickets');
  const totalPrice = route ? Number(route.price) * (ticketCount || 1) : 0;

  const onSubmit = async (data: BookingFormData) => {
    if (!routeId) return;
    try {
      await createBooking({
        routeId,
        numberOfTickets: data.numberOfTickets,
      });
      navigate('/booking/success');
    } catch {
      // error is handled by the store
    }
  };

  if (!route) {
    return (
      <div className={styles.loaderWrapper}>
        <Loader size="lg" />
        <p>Loading route details...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Complete Your Booking</h1>

      <div className={styles.layout}>
        {/* Route Details */}
        <Card className={styles.routeDetails}>
          <h2 className={styles.sectionTitle}>Route Details</h2>
          <div className={styles.routeHeader}>
            <div className={styles.locations}>
              <div className={styles.locationPoint}>
                <MapPin size={20} className={styles.iconAccent} />
                <span className={styles.city}>{route.departure}</span>
              </div>
              <ArrowRight size={20} className={styles.iconMuted} />
              <div className={styles.locationPoint}>
                <MapPin size={20} className={styles.iconPrimary} />
                <span className={styles.city}>{route.destination}</span>
              </div>
            </div>
          </div>

          <div className={styles.timeRow}>
            <div className={styles.timeBlock}>
              <span className={styles.timeLabel}>Departure</span>
              <TimeBadge time={route.departureTime} variant="primary" />
            </div>
            <div className={styles.timeBlock}>
              <span className={styles.timeLabel}>Arrival</span>
              <TimeBadge time={route.arrivalTime} variant="neutral" />
            </div>
          </div>

          <div className={styles.infoRow}>
            <Users size={16} />
            <span>{route.availableSeats} seats available</span>
          </div>
        </Card>

        {/* Booking Form */}
        <Card className={styles.formCard}>
          <h2 className={styles.sectionTitle}>Booking Details</h2>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="numberOfTickets" className={styles.label}>
                Number of Tickets
              </label>
              <input
                id="numberOfTickets"
                type="number"
                min={1}
                max={route.availableSeats}
                className={styles.input}
                {...register('numberOfTickets', {
                  required: 'Number of tickets is required',
                  min: { value: 1, message: 'At least 1 ticket required' },
                  max: { value: route.availableSeats, message: `Maximum ${route.availableSeats} tickets` },
                  valueAsNumber: true,
                })}
              />
              {errors.numberOfTickets && (
                <span className={styles.errorText}>{errors.numberOfTickets.message}</span>
              )}
            </div>

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Price per ticket</span>
                <span>{formatCurrency(Number(route.price))}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Tickets</span>
                <span>× {ticketCount || 1}</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span className={styles.totalPrice}>{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            {error && <div className={styles.errorBanner}>{error}</div>}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              leftIcon={<CreditCard size={20} />}
            >
              Proceed to Payment
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
