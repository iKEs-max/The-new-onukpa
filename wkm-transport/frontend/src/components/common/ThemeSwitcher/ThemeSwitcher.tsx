import React from 'react';
import { Sun, Moon, Sunset } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import styles from './ThemeSwitcher.module.css';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('sunset');
    else setTheme('light');
  };

  return (
    <button
      className={styles.switcherBtn}
      onClick={cycleTheme}
      aria-label={`Current theme: ${theme}. Click to change.`}
      title="Toggle Theme"
    >
      <div className={`${styles.iconWrapper} ${theme === 'light' ? styles.active : ''}`}>
        <Sun size={20} />
      </div>
      <div className={`${styles.iconWrapper} ${theme === 'dark' ? styles.active : ''}`}>
        <Moon size={20} />
      </div>
      <div className={`${styles.iconWrapper} ${theme === 'sunset' ? styles.active : ''}`}>
        <Sunset size={20} />
      </div>
    </button>
  );
};
