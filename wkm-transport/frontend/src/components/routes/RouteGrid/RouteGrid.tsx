import React from 'react';
import { RouteCard } from '@/components/routes/RouteCard/RouteCard';
import { Loader } from '@/components/common/Loader/Loader';
import type { Route } from '@/store/route.store';
import styles from './RouteGrid.module.css';

interface RouteGridProps {
  routes: Route[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export const RouteGrid: React.FC<RouteGridProps> = ({
  routes,
  isLoading = false,
  emptyMessage = 'No routes available at the moment.',
}) => {
  if (isLoading) {
    return (
      <div className={styles.loaderWrapper}>
        <Loader size="lg" />
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {routes.map((route) => (
        <RouteCard key={route.id} route={route} />
      ))}
    </div>
  );
};
