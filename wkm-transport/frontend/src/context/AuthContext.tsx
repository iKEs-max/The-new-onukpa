import React, { createContext, useContext, type ReactNode } from 'react';
import { useAuthStore } from '@/store/auth.store';

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
};

interface AuthContextValue {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  logout: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
