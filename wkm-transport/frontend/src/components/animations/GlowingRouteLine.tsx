import React from 'react';
import { motion } from 'framer-motion';
import styles from './GlowingRouteLine.module.css';

// Animated pulsing line for stats
export const GlowingRouteLine: React.FC = () => {
  return (
    <div className={styles.container}>
      <svg width="100" height="40" viewBox="0 0 100 40" className={styles.svg}>
        <path
          d="M 10 20 Q 50 40 90 20"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
      </svg>
      <motion.div
        className={styles.dot}
        animate={{ x: [0, 40, 80, 40, 0], y: [0, 10, 0, 10, 0] }}
        transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
      />
    </div>
  );
};
