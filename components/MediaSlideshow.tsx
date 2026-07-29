'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useInView, useReducedMotion } from 'framer-motion';

export interface Slide {
  src: string;
  /** object-position del recorte (p. ej. '62% center'). */
  position?: string;
}

interface MediaSlideshowProps {
  slides: Slide[];
  /** ms entre diapositivas. */
  interval?: number;
  sizes?: string;
  /** priority solo para la primera diapositiva (heros LCP). */
  priority?: boolean;
  className?: string;
}

/* Pase de fotos "tipo vídeo": crossfade lento y automático entre imágenes.
   Solo avanza cuando está a la vista; con prefers-reduced-motion se queda en
   la primera. El contenedor padre define el aspecto (fill + object-cover). */
export default function MediaSlideshow({
  slides,
  interval = 5000,
  sizes = '100vw',
  priority = false,
  className = '',
}: MediaSlideshowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '80px 0px' });
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || !inView || slides.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), interval);
    return () => window.clearInterval(id);
  }, [reduce, inView, slides.length, interval]);

  return (
    <div ref={ref} className={`absolute inset-0 ${className}`}>
      {slides.map((s, i) => (
        <Image
          key={s.src}
          src={s.src}
          alt=""
          fill
          priority={priority && i === 0}
          loading={i === 0 ? undefined : 'lazy'}
          sizes={sizes}
          className={`img-grade object-cover transition-opacity duration-[1600ms] ease-smooth ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          style={s.position ? { objectPosition: s.position } : undefined}
        />
      ))}
    </div>
  );
}
