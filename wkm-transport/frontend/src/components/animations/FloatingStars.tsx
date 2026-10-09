import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export const FloatingStars: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '50px', height: '40px' }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{ position: 'absolute', color: 'var(--color-warning)' }}
          initial={{ y: 0, opacity: 0.5, scale: 0.8 }}
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 180, 360],
            opacity: [0.5, 1, 0.5],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
        >
          <Star size={i === 0 ? 24 : 16} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
};
