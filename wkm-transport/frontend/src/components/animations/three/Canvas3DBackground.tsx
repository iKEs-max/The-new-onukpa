import React from 'react';
import styles from './Canvas3DBackground.module.css';

/**
 * Animated CSS-only background replacing the WebGL canvas.
 * @react-three/fiber conflicts with React's bundled reconciler in this setup.
 * This provides a visually rich animated background without any WebGL dependency.
 */
export const Canvas3DBackground: React.FC = () => {
  return (
    <div className={styles.bg} aria-hidden>
      {/* Animated gradient orbs */}
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />
      <div className={`${styles.orb} ${styles.orb3}`} />
      {/* Bus silhouette SVG on the right */}
      <svg
        className={styles.busSvg}
        viewBox="0 0 220 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* Body */}
        <rect x="10" y="20" width="180" height="60" rx="12" fill="#f59e0b" opacity="0.92" />
        {/* Roof */}
        <rect x="20" y="12" width="160" height="16" rx="6" fill="#fbbf24" opacity="0.85" />
        {/* Windows */}
        <rect x="25" y="28" width="32" height="24" rx="4" fill="#bfdbfe" opacity="0.7" />
        <rect x="65" y="28" width="32" height="24" rx="4" fill="#bfdbfe" opacity="0.7" />
        <rect x="105" y="28" width="32" height="24" rx="4" fill="#bfdbfe" opacity="0.7" />
        <rect x="145" y="28" width="28" height="24" rx="4" fill="#bfdbfe" opacity="0.7" />
        {/* Door */}
        <rect x="21" y="50" width="20" height="28" rx="3" fill="#fbbf24" opacity="0.6" />
        {/* Wheels */}
        <circle cx="52" cy="82" r="14" fill="#1e293b" />
        <circle cx="52" cy="82" r="7" fill="#475569" />
        <circle cx="158" cy="82" r="14" fill="#1e293b" />
        <circle cx="158" cy="82" r="7" fill="#475569" />
        {/* Headlights */}
        <rect x="185" y="30" width="12" height="16" rx="4" fill="#fef3c7" />
      </svg>
      {/* Road lines */}
      <div className={styles.road}>
        <div className={`${styles.roadLine} ${styles.line1}`} />
        <div className={`${styles.roadLine} ${styles.line2}`} />
        <div className={`${styles.roadLine} ${styles.line3}`} />
      </div>
    </div>
  );
};
