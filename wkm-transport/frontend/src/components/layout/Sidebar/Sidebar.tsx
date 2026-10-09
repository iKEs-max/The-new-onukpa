import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, CalendarCheck, Settings, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { ROUTES } from '@/config/routes';
import { useAuthStore } from '@/store/auth.store';
import styles from './Sidebar.module.css';

export const Sidebar: React.FC = () => {
  const { logout, user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  const menuItems = isAdmin
    ? [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD },
        { icon: <Map size={20} />, label: 'Manage Routes', path: ROUTES.ADMIN_ROUTES },
        { icon: <CalendarCheck size={20} />, label: 'All Bookings', path: ROUTES.ADMIN_BOOKINGS },
        { icon: <Settings size={20} />, label: 'Settings', path: ROUTES.ADMIN_SETTINGS },
      ]
    : [
        { icon: <LayoutDashboard size={20} />, label: 'My Bookings', path: ROUTES.USER_DASHBOARD },
        { icon: <Settings size={20} />, label: 'Profile Settings', path: '/dashboard/settings' },
      ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.content}>
        <div className={styles.userSection}>
          <div className={styles.avatar}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.firstName} {user?.lastName}</p>
            <p className={styles.userRole}>{isAdmin ? 'Administrator' : 'Passenger'}</p>
          </div>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === ROUTES.ADMIN_DASHBOARD || item.path === ROUTES.USER_DASHBOARD}
                  className={({ isActive }) =>
                    clsx(styles.navLink, isActive && styles.active)
                  }
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span className={styles.label}>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={styles.footer}>
        <button className={styles.logoutBtn} onClick={() => logout()}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
