import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { ROUTES } from '@/config/routes';
import type { LoginPayload, RegisterPayload } from '@/types/auth.types';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth, logout: storeLogout, user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user, tokens } = await authService.login(payload);
      setAuth(user, tokens);
      navigate(user.role === 'ADMIN' ? ROUTES.ADMIN_DASHBOARD : ROUTES.HOME);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user, tokens } = await authService.register(payload);
      setAuth(user, tokens);
      navigate(ROUTES.HOME);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    storeLogout();
    navigate(ROUTES.HOME);
  };

  return { login, register, logout, isLoading, error, user, isAuthenticated, clearError: () => setError(null) };
};
