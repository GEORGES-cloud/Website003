'use client';
import { useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/* Desvelado editorial de imagen: cortina clip-path que sube + la imagen asienta
   desde una escala 1.12 → 1. Con reduced-motion cae a un fade sencillo. */
export default function ImageReveal({ children, className = '', delay = 0 }: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-90px 0px' });
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={inView ? { clipPath: 'inset(0 0 0% 0)' } : { clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 1.1, delay, ease: EASE }}
      className={`overflow-hidden ${className}`}
    >
      <motion.div
        initial={{ scale: 1.12 }}
        animate={inView ? { scale: 1 } : { scale: 1.12 }}
        transition={{ duration: 1.4, delay, ease: EASE }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
