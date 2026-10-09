import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@/components/common/Modal/Modal';
import { Button } from '@/components/common/Button/Button';
import type { Route, CreateRoutePayload } from '@/types/route.types';
import styles from './RouteForm.module.css';

interface RouteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRoutePayload) => void;
  editingRoute?: Route | null;
  isLoading?: boolean;
}

export const RouteForm: React.FC<RouteFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingRoute,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRoutePayload>();

  useEffect(() => {
    if (editingRoute) {
      reset({
        departure: editingRoute.departure,
        destination: editingRoute.destination,
        price: Number(editingRoute.price),
        departureTime: editingRoute.departureTime,
        totalSeats: editingRoute.totalSeats,
      });
    } else {
      reset({ departure: '', destination: '', price: 0, departureTime: '', totalSeats: 0 });
    }
  }, [editingRoute, reset]);

  const handleFormSubmit = (data: CreateRoutePayload) => {
    onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingRoute ? 'Edit Route' : 'Add New Route'}
      size="lg"
      footer={
        <div className={styles.footer}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit(handleFormSubmit)} isLoading={isLoading}>
            {editingRoute ? 'Update Route' : 'Create Route'}
          </Button>
        </div>
      }
    >
      <form className={styles.form}>
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Departure City</label>
            <input
              className={styles.input}
              placeholder="e.g. Kumasi"
              {...register('departure', { required: 'Departure city is required' })}
            />
            {errors.departure && <span className={styles.error}>{errors.departure.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Destination City</label>
            <input
              className={styles.input}
              placeholder="e.g. Accra"
              {...register('destination', { required: 'Destination city is required' })}
            />
            {errors.destination && <span className={styles.error}>{errors.destination.message}</span>}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Price (GHS)</label>
            <input
              type="number"
              step="0.01"
              className={styles.input}
              placeholder="0.00"
              {...register('price', { required: 'Price is required', valueAsNumber: true, min: { value: 0.01, message: 'Must be greater than 0' } })}
            />
            {errors.price && <span className={styles.error}>{errors.price.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Total Seats</label>
            <input
              type="number"
              className={styles.input}
              placeholder="0"
              {...register('totalSeats', { required: 'Total seats is required', valueAsNumber: true, min: { value: 1, message: 'At least 1 seat' } })}
            />
            {errors.totalSeats && <span className={styles.error}>{errors.totalSeats.message}</span>}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Departure Time</label>
            <input
              type="datetime-local"
              className={styles.input}
              {...register('departureTime', { required: 'Departure time is required' })}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
