import React from 'react';
import { motion } from 'framer-motion';

interface FloatingCharacterProps {
  src: string;
  alt: string;
  size?: number | string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  delay?: number;
  duration?: number;
  isWaving?: boolean;
  className?: string;
}

export const FloatingCharacter: React.FC<FloatingCharacterProps> = ({
  src,
  alt,
  size = 120,
  top,
  left,
  right,
  bottom,
  delay = 0,
  duration = 3,
  isWaving = true,
  className = '',
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      style={{
        position: 'absolute',
        top,
        left,
        right,
        bottom,
        width: size,
        height: 'auto',
        zIndex: 5,
        pointerEvents: 'none',
      }}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{ width: '100%', height: 'auto' }}
        animate={{
          y: [0, -10, 0],
          rotate: isWaving ? [0, -2, 2, -2, 0] : [0, -1, 1, -1, 0],
        }}
        transition={{
          y: {
            duration,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: isWaving ? 2 : 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
          delay,
        }}
      />
    </motion.div>
  );
};
