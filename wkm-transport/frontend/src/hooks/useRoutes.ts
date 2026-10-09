import { useEffect } from 'react';
import { useRouteStore } from '@/store/route.store';

export const useRoutes = () => {
  const { routes, isLoading, error, fetchRoutes, getRoute } = useRouteStore();

  useEffect(() => {
    if (routes.length === 0) {
      fetchRoutes();
    }
  }, [routes.length, fetchRoutes]);

  return { routes, isLoading, error, fetchRoutes, getRoute };
};
