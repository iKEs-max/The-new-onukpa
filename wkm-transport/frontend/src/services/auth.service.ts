import api from './api';
import type { LoginPayload, RegisterPayload, AuthResponse } from '@/types/auth.types';
import type { ApiResponse } from '@/types/api.types';

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    // The backend uses 'username' but the frontend payload has 'email'.
    // We send 'email' as 'username' to match the backend.
    const { data } = await api.post<any>('/api/auth/login', {
      username: payload.email,
      password: payload.password,
    });

    const backendUser = data.admin;

    return {
      user: {
        id: String(backendUser.id),
        email: backendUser.email,
        firstName: backendUser.username,
        lastName: 'Admin',
        role: 'ADMIN',
        createdAt: new Date().toISOString(),
      },
      tokens: {
        access: { token: data.token, expires: '2099-01-01T00:00:00Z' },
        refresh: { token: data.token, expires: '2099-01-01T00:00:00Z' },
      },
    };
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/api/auth/register', payload);
    return data.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/api/auth/refresh-token', { refreshToken });
    return data.data;
  },

  getProfile: async (): Promise<AuthResponse['user']> => {
    const { data } = await api.get<ApiResponse<AuthResponse['user']>>('/api/auth/profile');
    return data.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/api/auth/forgot-password', { email });
  },
};
