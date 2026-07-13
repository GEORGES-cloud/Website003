'use client';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { MARK_PATH } from './Logo';

export default function HeroVideo() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  // Cinematic: video zooms in slightly and the lockup drifts up + fades as you scroll past.
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  return (
    <section ref={ref} className="relative w-full h-[100svh] min-h-[640px] overflow-hidden bg-ink">
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

      {/* Minimal legibility overlays — keep it clean and bright */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/55" />
      <div className="absolute inset-0 bg-black/15" />

      {/* Centered brand lockup */}
      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-white"
        >
          <svg
            viewBox="0 0 318 273"
            fill="currentColor"
            aria-hidden
            className="w-[78px] sm:w-[96px] h-auto mb-6 opacity-95"
          >
            <path fillRule="evenodd" d={MARK_PATH} />
          </svg>
          <h1 className="font-light uppercase text-white leading-none flex flex-col items-center">
            <span
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', letterSpacing: '0.14em' }}
            >
              Flamingo
            </span>
            <span
              className="font-sans text-white/85 mt-4 sm:mt-5"
              style={{ fontSize: 'clamp(0.72rem, 1.7vw, 1.25rem)', letterSpacing: '0.42em' }}
            >
              Yacht Club
            </span>
          </h1>
        </motion.div>
      </motion.div>
    </section>
  );
}
