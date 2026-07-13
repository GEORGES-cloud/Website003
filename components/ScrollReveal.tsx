'use client';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  once?: boolean;
  /** add a subtle cinematic zoom-in on reveal */
  zoom?: boolean;
}

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  once = true,
  zoom = false,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-90px 0px' });
  const reduce = useReducedMotion();

  // transform + opacity only — GPU-composited, no layout/paint thrash
  const offset = 44;
  const initial = reduce
    ? { opacity: 0 }
    : {
        opacity: 0,
        y: direction === 'up' ? offset : direction === 'down' ? -offset : 0,
        x: direction === 'left' ? offset : direction === 'right' ? -offset : 0,
        scale: zoom ? 0.94 : 1,
      };
  const shown = reduce
    ? { opacity: 1 }
    : { opacity: 1, y: 0, x: 0, scale: 1 };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={isInView ? shown : initial}
      transition={{ duration: reduce ? 0.4 : 1.05, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
