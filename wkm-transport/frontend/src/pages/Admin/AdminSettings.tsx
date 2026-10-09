import React from 'react';
import { useForm } from 'react-hook-form';
import { Settings, Save } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';
import styles from './AdminSettings.module.css';

interface SettingsFormData {
  siteName: string;
  contactEmail: string;
  defaultCurrency: string;
  paymentProvider: string;
  maxSeatsPerBooking: number;
  enableEmailNotifications: boolean;
}

export const AdminSettings: React.FC = () => {
  const {
    register,
    handleSubmit,
  } = useForm<SettingsFormData>({
    defaultValues: {
      siteName: 'Onukpa Express Ride',
      contactEmail: 'support@onukpa.com',
      defaultCurrency: 'GHS',
      paymentProvider: 'paystack',
      maxSeatsPerBooking: 10,
      enableEmailNotifications: true,
    },
  });

  const onSubmit = (data: SettingsFormData) => {
    console.log('Settings saved:', data);
    // TODO: connect to admin settings API
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Settings size={24} className={styles.icon} />
        <h1 className={styles.title}>Settings</h1>
      </div>

      <Card padding="lg">
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.group}>
            <label className={styles.label}>Site Name</label>
            <input className={styles.input} {...register('siteName')} />
          </div>

          <div className={styles.group}>
            <label className={styles.label}>Contact Email</label>
            <input type="email" className={styles.input} {...register('contactEmail')} />
          </div>

          <div className={styles.row}>
            <div className={styles.group}>
              <label className={styles.label}>Default Currency</label>
              <select className={styles.input} {...register('defaultCurrency')}>
                <option value="GHS">GHS (Ghana Cedi)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="NGN">NGN (Naira)</option>
              </select>
            </div>

            <div className={styles.group}>
              <label className={styles.label}>Payment Provider</label>
              <select className={styles.input} {...register('paymentProvider')}>
                <option value="paystack">Paystack</option>
                <option value="hubtel">Hubtel</option>
                <option value="stripe">Stripe</option>
              </select>
            </div>
          </div>

          <div className={styles.group}>
            <label className={styles.label}>Max Seats Per Booking</label>
            <input type="number" min={1} max={50} className={styles.input} {...register('maxSeatsPerBooking', { valueAsNumber: true })} />
          </div>

          <div className={styles.checkboxGroup}>
            <input type="checkbox" id="emailNotifs" {...register('enableEmailNotifications')} />
            <label htmlFor="emailNotifs" className={styles.checkboxLabel}>
              Enable email notifications
            </label>
          </div>

          <Button type="submit" variant="primary" leftIcon={<Save size={16} />}>
            Save Settings
          </Button>
        </form>
      </Card>
    </div>
  );
};
