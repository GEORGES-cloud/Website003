'use client';
import { motion, useScroll, useReducedMotion } from 'framer-motion';

/* Hilo de progreso en el borde superior: 2 px que se dibujan según lo que
   llevas leído de la página. Sin números ni fondo — solo la línea. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-sea/70 pointer-events-none"
    />
  );
}
