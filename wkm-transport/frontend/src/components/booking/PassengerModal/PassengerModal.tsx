import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@/components/common/Modal/Modal';
import { Button } from '@/components/common/Button/Button';
import styles from './PassengerModal.module.css';

interface PassengerData {
  firstName: string;
  lastName: string;
  phone: string;
}

interface PassengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PassengerData) => void;
  passengerIndex: number;
}

export const PassengerModal: React.FC<PassengerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  passengerIndex,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PassengerData>();

  const handleFormSubmit = (data: PassengerData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Passenger ${passengerIndex + 1} Details`}
      size="sm"
      footer={
        <div className={styles.footer}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit(handleFormSubmit)}>Save</Button>
        </div>
      }
    >
      <form className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>First Name</label>
          <input
            className={styles.input}
            placeholder="Enter first name"
            {...register('firstName', { required: 'First name is required' })}
          />
          {errors.firstName && <span className={styles.error}>{errors.firstName.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Last Name</label>
          <input
            className={styles.input}
            placeholder="Enter last name"
            {...register('lastName', { required: 'Last name is required' })}
          />
          {errors.lastName && <span className={styles.error}>{errors.lastName.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Phone (optional)</label>
          <input
            className={styles.input}
            placeholder="Enter phone number"
            {...register('phone')}
          />
        </div>
      </form>
    </Modal>
  );
};
