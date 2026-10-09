import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/config/routes';
import { authService } from '@/services/auth.service';
import styles from './AdminLogin.module.css';
import { Logo } from '@/components/common/Logo/Logo';

export const AdminLogin: React.FC = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { user, tokens } = await authService.login({ email, password });
      setAuth(user, tokens);
      navigate(ROUTES.ADMIN_DASHBOARD);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* ── Left: Brand panel ── */}
      <div className={styles.brandPanel}>
        <div className={styles.busArt}>
          <svg className={styles.busSvg} viewBox="0 0 220 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="20" width="180" height="60" rx="12" fill="#f59e0b" opacity="0.92" />
            <rect x="20" y="12" width="160" height="16" rx="6" fill="#fbbf24" opacity="0.85" />
            <rect x="25" y="28" width="32" height="24" rx="4" fill="#bfdbfe" opacity="0.7" />
            <rect x="65" y="28" width="32" height="24" rx="4" fill="#bfdbfe" opacity="0.7" />
            <rect x="105" y="28" width="32" height="24" rx="4" fill="#bfdbfe" opacity="0.7" />
            <rect x="145" y="28" width="28" height="24" rx="4" fill="#bfdbfe" opacity="0.7" />
            <rect x="21" y="50" width="20" height="28" rx="3" fill="#fbbf24" opacity="0.6" />
            <circle cx="52"  cy="82" r="14" fill="#1e293b" />
            <circle cx="52"  cy="82" r="7"  fill="#475569" />
            <circle cx="158" cy="82" r="14" fill="#1e293b" />
            <circle cx="158" cy="82" r="7"  fill="#475569" />
            <rect x="185" y="30" width="12" height="16" rx="4" fill="#fef3c7" />
          </svg>
        </div>

        <Logo size={80} className={styles.brandTitle} />
        <p className={styles.brandSub}>
          Student transport made simple. Safe. Reliable. Affordable.
        </p>
        <span className={styles.adminBadge}>
          <Shield size={12} /> Admin Control Panel
        </span>
      </div>

      {/* ── Right: Form panel ── */}
      <div className={styles.formPanel}>
        {/* Logo */}
        <div className={styles.logo}>
          <Logo size={40} />
        </div>

        <h2 className={styles.formTitle}>Welcome back, Admin</h2>
        <p className={styles.formSub}>Sign in to manage routes, bookings & settings</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Email */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="adm-email">Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail size={16} className={styles.inputIcon} />
              <input
                id="adm-email"
                type="email"
                className={styles.input}
                placeholder="admin@onukpaexpress.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="adm-password">Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                id="adm-password"
                type={showPw ? 'text' : 'password'}
                className={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPw(!showPw)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error — shake effect via CSS animation key */}
          {error && <div key={error} className={styles.errorBanner}>{error}</div>}

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading
              ? <span className={styles.spinner} />
              : <><Shield size={16} /> Sign In to Dashboard</>
            }
          </button>
        </form>
      </div>
    </div>
  );
};
