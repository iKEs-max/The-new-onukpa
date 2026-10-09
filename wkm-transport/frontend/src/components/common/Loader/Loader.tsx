import React from 'react';
import { clsx } from 'clsx';
import styles from './Loader.module.css';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  fullScreen = false,
  className 
}) => {
  const loaderCore = (
    <div className={clsx(styles.spinner, styles[size], className)} role="status">
      <span className={styles.srOnly}>Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className={styles.fullscreen}>
        {loaderCore}
      </div>
    );
  }

  return loaderCore;
};
