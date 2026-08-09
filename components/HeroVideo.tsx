'use client';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import RevealText from './RevealText';

interface HeroVideoProps {
  /** Video source. Defaults to the top hero clip. */
  src?: string;
  /** Poster frame shown before the video loads. */
  poster?: string;
  /** Render the sr-only <h1> (top hero only — avoid duplicating it). */
  showHeading?: boolean;
  /** Pide a la barra que arranque en blanco. Solo vale si esta sección abre la
   *  página: la Navbar busca la marca en todo el documento, así que dejarla
   *  puesta más abajo teñía la barra de blanco sobre un fondo claro. */
  navbarOnDark?: boolean;
  /** Height utility class. Defaults to a full-viewport hero. */
  heightClass?: string;
  /** Copy sobre el vídeo. Con `title` el hero deja de ser mudo y ese titular
   *  pasa a ser el h1 (en vez del sr-only). */
  eyebrow?: string;
  title?: string;
  body?: string;
  cta?: { href: string; label: string };
}

export default function HeroVideo({
  src = '/videos/hero.mp4',
  poster = '/images/hero-poster.jpg',
  showHeading = true,
  navbarOnDark = true,
  heightClass = 'h-[100svh] min-h-[640px]',
  eyebrow,
  title,
  body,
  cta,
}: HeroVideoProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  // Cinematic: the video zooms in slightly as you scroll past.
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08]);
  // El texto se queda atrás mientras el vídeo sigue: da profundidad sin 3D.
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '34%']);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  return (
    <section
      ref={ref}
      data-navbar-on-dark={navbarOnDark || undefined}
      className={`relative w-full overflow-hidden bg-ink ${heightClass}`}
    >
      {/* Sin copy visible el h1 va oculto: la marca la lleva el lockup del header. */}
      {showHeading && !title && (
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

      {title && (
        <>
          {/* Velo bajo el texto: el agua brillante se comía el blanco */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/75 via-ink/30 to-transparent"
          />

          <motion.div
            style={{ y: copyY, opacity: copyOpacity }}
            className="relative h-full max-w-[1480px] mx-auto px-6 md:px-10 flex flex-col justify-end pb-20 md:pb-28"
          >
            {eyebrow && <p className="eyebrow-invert mb-5 animate-hero">{eyebrow}</p>}
            <h1 className="display text-white max-w-3xl text-balance display-1">
              <RevealText delay={0.12}>{title}</RevealText>
            </h1>
            {body && (
              <p className="font-sans text-lg text-white/75 max-w-xl leading-relaxed mt-7 animate-hero animate-hero-d2">
                {body}
              </p>
            )}
            {cta && (
              <div className="mt-10 animate-hero animate-hero-d2">
                <Link
                  href={cta.href}
                  className="inline-flex items-center gap-2 font-sans text-[12px] font-semibold uppercase tracking-wide2 text-white border-b border-white/40 pb-1 transition-colors hover:border-white"
                >
                  {cta.label}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </section>
  );
}
