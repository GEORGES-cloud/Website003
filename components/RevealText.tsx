'use client';
import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

/* Titular que sube desde detrás de una máscara, palabra a palabra.
   Cada palabra va en una caja con overflow oculto, así el texto no "aparece":
   entra deslizándose desde su propia línea base, como en una portada impresa.

   El texto sigue siendo texto real — se selecciona, se traduce y los lectores
   de pantalla lo leen seguido. Con prefers-reduced-motion cae a un fundido. */
export default function RevealText({
  children,
  delay = 0,
  className = '',
  stagger = 0.045,
}: {
  children: string;
  delay?: number;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px 0px' });
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <motion.span
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay }}
        className={className}
      >
        {children}
      </motion.span>
    );
  }

  // Se respetan los saltos de línea explícitos del copy (\n).
  const lines = children.split('\n');

  return (
    <span ref={ref} className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(' ').map((word, wi, arr) => (
            <span
              key={`${li}-${wi}`}
              // leading-[1.12] + el padding evitan que la máscara recorte tildes
              // y descendentes (g, j, y) de la propia palabra.
              className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]"
            >
              <motion.span
                className="inline-block"
                initial={{ y: '110%' }}
                animate={inView ? { y: 0 } : { y: '110%' }}
                transition={{
                  duration: 0.85,
                  delay: delay + (li * arr.length + wi) * stagger,
                  ease: EASE,
                }}
              >
                {word}
                {wi < arr.length - 1 ? ' ' : ''}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
