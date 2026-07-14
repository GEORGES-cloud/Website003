'use client';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

interface HeroVideoProps {
  /** Video source. Defaults to the top hero clip. */
  src?: string;
  /** Poster frame shown before the video loads. */
  poster?: string;
  /** Render the sr-only <h1> (top hero only — avoid duplicating it). */
  showHeading?: boolean;
  /** Height utility class. Defaults to a full-viewport hero. */
  heightClass?: string;
}

export default function HeroVideo({
  src = '/videos/hero.mp4',
  poster = '/images/hero-poster.jpg',
  showHeading = true,
  heightClass = 'h-[100svh] min-h-[640px]',
}: HeroVideoProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  // Cinematic: the video zooms in slightly as you scroll past.
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.18]);

  return (
    <section ref={ref} className={`relative w-full overflow-hidden bg-ink ${heightClass}`}>
      {/* Main heading kept for SEO/a11y; the visible brand lives in the header lockup (Wally-style). */}
      {showHeading && (
        <h1 className="sr-only">Flamingo Yacht Club — Club náutico de membresía en Puerto Banús, Marbella</h1>
      )}

      {/* Cinematic background video */}
      <motion.video
        style={{ scale: videoScale }}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
        preload="metadata"
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </motion.video>

      {/* Legibility overlay — weighted to the top so the header lockup stays readable over bright water */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/40" />
    </section>
  );
}
