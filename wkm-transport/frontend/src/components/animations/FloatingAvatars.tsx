import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Mock avatars for the floating bubbles
const AVATARS = [
  { id: 1, src: 'https://i.pravatar.cc/150?img=1', name: 'Ama', uni: 'KNUST' },
  { id: 2, src: 'https://i.pravatar.cc/150?img=12', name: 'Kofi', uni: 'UG' },
  { id: 3, src: 'https://i.pravatar.cc/150?img=5', name: 'Abena', uni: 'UCC' },
  { id: 4, src: 'https://i.pravatar.cc/150?img=8', name: 'Kwame', uni: 'UMaT' },
  { id: 5, src: 'https://i.pravatar.cc/150?img=9', name: 'Yaa', uni: 'KNUST' },
];

export const FloatingAvatars: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 0, opacity: 0.15 }}>
      {AVATARS.map((avatar, i) => (
        <motion.div
          key={avatar.id}
          style={{
            position: 'absolute',
            left: `${15 + (i * 20)}%`,
            top: `${(i % 2 === 0) ? 20 : 60}%`,
            y: i % 2 === 0 ? y1 : y2, // Apply scroll parallax alternating
          }}
          animate={{
            y: [0, -20, 0], // Micro float animation
          }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--color-surface)' }}>
            <img src={avatar.src} alt={avatar.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
