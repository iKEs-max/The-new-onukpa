import { useEffect, useRef, useState } from 'react';

interface ScrollRevealOptions {
  threshold?: number;    // 0–1, how much of element must be visible
  rootMargin?: string;   // e.g. '0px 0px -80px 0px'
  once?: boolean;        // only trigger once
}

/**
 * Hook that returns a ref and a boolean `isVisible`.
 * Attach the ref to a DOM element; `isVisible` becomes true when it enters the viewport.
 *
 * Usage:
 *   const [ref, isVisible] = useScrollReveal();
 *   <div ref={ref} className={isVisible ? 'reveal-show' : 'reveal-hidden'}>…</div>
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
): [React.RefObject<T>, boolean] {
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, isVisible];
}

/**
 * Convenience wrapper: renders children with a scroll-reveal class applied.
 */
import React from 'react';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;   // ms
  direction?: 'up' | 'left' | 'right' | 'fade';
  style?: React.CSSProperties;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  style,
}) => {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>();

  const dirClass = `reveal-${direction}`;

  return (
    <div
      ref={ref}
      className={`${dirClass} ${isVisible ? 'reveal-show' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
};
