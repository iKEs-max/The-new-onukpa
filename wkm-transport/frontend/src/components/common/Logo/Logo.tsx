import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className, size = 40, showText = true }) => {
  return (
    <div className={className} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Circle/Pin Base */}
        <path
          d="M50 95C50 95 85 65 85 40C85 20.67 69.33 5 50 5C30.67 5 15 20.67 15 40C15 65 50 95 50 95Z"
          fill="#1e3a8a"
        />
        
        {/* Shuttle Silhouette */}
        <rect
          x="30"
          y="35"
          width="40"
          height="20"
          rx="4"
          fill="white"
        />
        <rect
          x="35"
          y="40"
          width="10"
          height="10"
          rx="1"
          fill="#bfdbfe"
        />
        <rect
          x="55"
          y="40"
          width="10"
          height="10"
          rx="1"
          fill="#bfdbfe"
        />
        
        {/* Speed Lines */}
        <path
          d="M20 45H10M18 55H8M22 35H12"
          stroke="#f59e0b"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Wheels */}
        <circle cx="40" cy="55" r="4" fill="#f59e0b" />
        <circle cx="60" cy="55" r="4" fill="#f59e0b" />
      </svg>
      
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'inherit' }}>Onukpa</span>
          <span style={{ fontWeight: 600, fontSize: '0.8rem', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Express Ride
          </span>
        </div>
      )}
    </div>
  );
};
