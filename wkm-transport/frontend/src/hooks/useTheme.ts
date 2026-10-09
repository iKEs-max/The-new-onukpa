import { useEffect } from 'react';
import { useUIStore } from '@/store/ui.store';

export const useTheme = () => {
  const { theme, setTheme } = useUIStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return { theme, setTheme, toggleTheme };
};
