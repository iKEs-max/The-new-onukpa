import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticWrapProps {
  children: React.ReactNode;
  strength?: number; // How far it moves (default 30)
}

export const MagneticWrap: React.FC<MagneticWrapProps> = ({ children, strength = 30 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Calculate distance from center of component
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const x = (clientX - centerX) / width * strength;
    const y = (clientY - centerY) / height * strength;

    setPosition({ x, y });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 180, damping: 20, mass: 0.1 }}
      style={{ display: 'inline-block' }}
    >
      {children}
    </motion.div>
  );
};
