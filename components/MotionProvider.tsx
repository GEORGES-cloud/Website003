'use client';
import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

/* Con reducedMotion="user", framer-motion degrada automáticamente todos los
   transforms a opacity para usuarios con prefers-reduced-motion — cubre de una
   vez los componentes que no consultan useReducedMotion individualmente. */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
