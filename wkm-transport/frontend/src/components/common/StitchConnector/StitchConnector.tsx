import React from 'react';
import { motion } from 'framer-motion';

interface StitchConnectorProps {
  direction?: 'vertical' | 'horizontal';
  className?: string;
}

export const StitchConnector: React.FC<StitchConnectorProps> = ({ 
  direction = 'vertical',
  className = ''
}) => {
  return (
    <div className={`stitch-container ${className}`} style={{ 
      display: 'flex', 
      justifyContent: 'center',
      padding: '2rem 0',
      opacity: 0.6
    }}>
      <svg 
        width={direction === 'vertical' ? "40" : "100%"} 
        height={direction === 'vertical' ? "120" : "40"}
        viewBox={direction === 'vertical' ? "0 0 40 120" : "0 0 400 40"}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {direction === 'vertical' ? (
          <motion.path
            d="M20 0V120"
            stroke="var(--brand-primary)"
            strokeWidth="2"
            strokeDasharray="8 8"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="stitch-path"
          />
        ) : (
          <motion.path
            d="M0 20H400"
            stroke="var(--brand-primary)"
            strokeWidth="2"
            strokeDasharray="8 8"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="stitch-path"
          />
        )}
      </svg>
    </div>
  );
};
