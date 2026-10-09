import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bus } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { useAuthStore } from '@/store/auth.store';
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher/ThemeSwitcher';
import { Logo } from '@/components/common/Logo/Logo';
import { MagneticWrap } from '@/components/animations/MagneticWrap';
import styles from './Header.module.css';

const NAV_LINKS = [
  { name: 'Home',        path: ROUTES.HOME      },
  { name: 'About',       path: ROUTES.ABOUT     },
  { name: 'Book a Ride', path: ROUTES.BOOK_RIDE },
  { name: 'Routes',      path: ROUTES.ROUTES    },
  { name: 'Pricing',     path: ROUTES.PRICING   },
  { name: 'Contact',     path: ROUTES.CONTACT   },
];

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link to={ROUTES.HOME} className={styles.logo}>
          <Logo size={42} />
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.desktopNav}>
          {NAV_LINKS.map((l) => (
            <MagneticWrap key={l.path} strength={15}>
              <Link
                to={l.path}
                className={`${styles.navLink} ${location.pathname === l.path ? styles.active : ''}`}
              >
                {l.name}
              </Link>
            </MagneticWrap>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className={styles.actions}>
          <ThemeSwitcher />
          {isAuthenticated ? (
            <>
              {user?.role === 'ADMIN' && (
                <MagneticWrap strength={10}>
                  <Link to={ROUTES.ADMIN_DASHBOARD} className={styles.ctaOutline}>Dashboard</Link>
                </MagneticWrap>
              )}
              <MagneticWrap strength={10}>
                <button className={styles.ctaOutline} onClick={logout}>Log out</button>
              </MagneticWrap>
            </>
          ) : (
            <>
              <MagneticWrap strength={10}>
                <Link to={ROUTES.ADMIN_LOGIN} className={styles.ctaOutline}>Admin</Link>
              </MagneticWrap>
              <MagneticWrap strength={20}>
                <Link to={ROUTES.BOOK_RIDE}   className={styles.ctaPrimary}>Book Now</Link>
              </MagneticWrap>
            </>
          )}
        </div>

        {/* Mobile: theme + hamburger */}
        <div className={styles.mobileActions}>
          <ThemeSwitcher />
          <button
            className={styles.hamburger}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className={styles.mobileDrawer}>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={`${styles.mobileLink} ${location.pathname === l.path ? styles.mobileActive : ''}`}
            >
              {l.name}
            </Link>
          ))}
          <div className={styles.mobileDivider} />
          {isAuthenticated ? (
            <button className={styles.mobileCta} onClick={logout}>Log out</button>
          ) : (
            <Link to={ROUTES.BOOK_RIDE} className={styles.mobileCta}>📅 Book a Ride Now</Link>
          )}
        </div>
      )}
    </header>
  );
};
