import React from 'react';
import { clsx } from 'clsx';
import { Clock } from 'lucide-react';
import { formatTime } from '@/utils/formatters';
import styles from './TimeBadge.module.css';

interface TimeBadgeProps {
  time: string | Date;
  variant?: 'primary' | 'neutral';
  className?: string;
}

export const TimeBadge: React.FC<TimeBadgeProps> = ({ 
  time, 
  variant = 'neutral',
  className 
}) => {
  return (
    <div className={clsx(styles.badge, styles[variant], className)}>
      <Clock size={14} className={styles.icon} />
      <span className={styles.text}>{formatTime(time)}</span>
    </div>
  );
};
