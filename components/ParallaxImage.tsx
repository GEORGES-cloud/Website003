'use client';
import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  sizes?: string;
  /** parallax travel in px (image drifts +/- this as it crosses the viewport) */
  strength?: number;
  /** slow continuous zoom (ken-burns) */
  kenBurns?: boolean;
  priority?: boolean;
  className?: string;
  overlayClassName?: string;
}

/**
 * A cover image with a smooth scroll-driven parallax drift (and optional slow
 * zoom). The inner layer is over-scanned so the drift never reveals an edge.
 */
export default function ParallaxImage({
  src,
  alt,
  sizes = '(max-width: 1024px) 100vw, 50vw',
  strength = 48,
  kenBurns = false,
  priority = false,
  className = '',
  overlayClassName,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -strength, reduce ? 0 : strength]);
  const positioned = /\b(absolute|fixed)\b/.test(className);

  return (
    <div ref={ref} className={`overflow-hidden ${positioned ? '' : 'relative'} ${className}`}>
      <motion.div style={{ y }} className="absolute -inset-y-[22%] inset-x-0">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${kenBurns && !reduce ? 'animate-kenburns' : ''}`}
        />
      </motion.div>
      {overlayClassName && <div className={`absolute inset-0 ${overlayClassName}`} />}
    </div>
  );
}
