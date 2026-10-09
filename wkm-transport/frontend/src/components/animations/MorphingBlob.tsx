import React from 'react';
import { motion } from 'framer-motion';

interface MorphingBlobProps {
  color?: string;
  size?: number;
  className?: string;
}

// A simple morphing blob using CSS keyframes or Framer Motion border-radius
export const MorphingBlob: React.FC<MorphingBlobProps> = ({ 
  color = 'rgba(245, 158, 11, 0.2)', // Sunset Orange default
  size = 300,
  className = ''
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        borderRadius: [
          "60% 40% 30% 70% / 60% 30% 70% 40%",
          "30% 70% 70% 30% / 30% 30% 70% 70%",
          "60% 40% 30% 70% / 60% 30% 70% 40%"
        ],
        rotate: [0, 90, 180, 270, 360]
      }}
      transition={{
        duration: 8,
        ease: "linear",
        repeat: Infinity,
      }}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        filter: 'blur(10px)',
        position: 'absolute',
        zIndex: 0
      }}
    />
  );
};
