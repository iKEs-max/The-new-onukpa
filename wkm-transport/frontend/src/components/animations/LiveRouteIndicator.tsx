import React from 'react';
import { motion } from 'framer-motion';
import { Bus } from 'lucide-react';

interface LiveRouteIndicatorProps {
  route: string;
  seats: number;
  className?: string;
}

export const LiveRouteIndicator: React.FC<LiveRouteIndicatorProps> = ({ route, seats, className = '' }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', delay: 0.4, stiffness: 100, damping: 20 }}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '16px',
        padding: '16px',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        width: '240px',
        pointerEvents: 'none'
      }}
      className={`animate-float ${className}`}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ 
            width: '8px', height: '8px', borderRadius: '50%', 
            background: 'var(--color-danger)', 
            boxShadow: '0 0 8px var(--color-danger)'
          }} className="animate-spin" /> {/* Or pulse */}
          <span style={{ fontWeight: 600, letterSpacing: '0.05em' }}>LIVE</span>
        </div>
        <span style={{ opacity: 0.8 }}>{route}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' 
        }}>
          <Bus size={24} />
        </div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1 }}>{seats}</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>seats available</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: i >= seats ? 0.3 : 1, scale: 1 }}
            transition={{ delay: 0.6 + (i * 0.05) }}
            style={{ 
              flex: 1, 
              height: '4px', 
              background: i >= seats ? 'rgba(255,255,255,0.3)' : 'var(--color-success)',
              borderRadius: '2px'
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
