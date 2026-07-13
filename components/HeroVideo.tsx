'use client';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

export default function HeroVideo() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  // Cinematic: the video zooms in slightly as you scroll past.
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.18]);

  return (
    <section ref={ref} className="relative w-full h-[100svh] min-h-[640px] overflow-hidden bg-ink">
      {/* Main heading kept for SEO/a11y; the visible brand lives in the header lockup (Wally-style). */}
      <h1 className="sr-only">Flamingo Yacht Club — Club náutico de membresía en Puerto Banús, Marbella</h1>

      {/* Cinematic background video (Mixkit, free for commercial use — swap for client/Higgsfield footage) */}
      <motion.video
        style={{ scale: videoScale }}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
        preload="metadata"
        poster="/images/hero-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </motion.video>

      {/* Legibility overlay — weighted to the top so the header lockup stays readable over bright water */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/40" />
    </section>
  );
}
