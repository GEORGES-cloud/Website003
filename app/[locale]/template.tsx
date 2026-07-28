'use client';
import { motion } from 'framer-motion';

/* Velo de entrada en cada navegación: cose las páginas entre sí con la curva
   de la casa. App Router no anima salidas — solo entrada, sobrio a propósito.
   Navbar y modales viven fuera del template, el transform no les afecta. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
