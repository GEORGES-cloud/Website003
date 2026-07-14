'use client';

/**
 * FleetShowcase3D — "scroll de vídeo 3D" al estilo Apple (scroll-scrubbing).
 * ---------------------------------------------------------------------------
 * PROTOTIPO. Mientras haces scroll, el vídeo NO se reproduce solo: se "rebobina"
 * fotograma a fotograma en función del progreso de scroll. Encima, el nombre y
 * las specs del barco se revelan por fases.
 *
 * CÓMO CAMBIAR EL PLACEHOLDER POR EL RENDER ORBITAL DE IA
 * -------------------------------------------------------
 *  1. Genera con IA (Higgsfield / Kling / Runway) un plano ORBITAL 360° del
 *     Wajer 55: la cámara da la vuelta al barco sobre fondo limpio. 6-10 s.
 *  2. Codifícalo con MUCHOS keyframes o el scrubbing "salta". Con ffmpeg:
 *
 *       ffmpeg -i orbital.mp4 -an -vf "scale=1600:-2" \
 *         -c:v libx264 -crf 23 -pix_fmt yuv420p \
 *         -g 6 -keyint_min 6 -sc_threshold 0 \
 *         -movflags +faststart public/videos/wajer-orbital.mp4
 *
 *     (`-g 6` = un keyframe cada 6 frames → seek instantáneo en cualquier punto.)
 *  3. Cambia VIDEO_SRC abajo por '/videos/wajer-orbital.mp4' y el poster.
 *
 *  NOTA: en iOS el scrubbing de <video> puede ir justo. Si no queda fino, el
 *  siguiente paso sería la técnica de "secuencia de imágenes en <canvas>"
 *  (exportar el orbital a ~180 WebP y dibujarlas) — más fiable, algo más pesada.
 */

import { useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
} from 'framer-motion';
import { getActiveFleet } from '@/lib/localize';

// 🔁 Cambia esto por tu render orbital de IA cuando lo tengas.
const VIDEO_SRC = '/videos/hero.mp4';

// Etiquetas mínimas (mover a next-intl / messages cuando se consolide el diseño).
const L: Record<string, Record<string, string>> = {
  eyebrow: { es: 'La flota · en 360°', en: 'The fleet · in 360°' },
  length: { es: 'Eslora', en: 'Length' },
  beam: { es: 'Manga', en: 'Beam' },
  speed: { es: 'Velocidad máxima', en: 'Top speed' },
  engines: { es: 'Motorización', en: 'Engines' },
  scroll: { es: 'Desplázate', en: 'Scroll' },
  discover: { es: 'Descúbrela', en: 'Discover her' },
  cta: { es: 'Ver ficha completa', en: 'View full details' },
};

export default function FleetShowcase3D({ locale }: { locale: string }) {
  const boat = getActiveFleet(locale)[0];
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // --- Scroll ➜ video.currentTime, con suavizado (lerp) para un scrub sedoso ---
  const targetTime = useRef(0);
  const durationRef = useRef(0);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const d = durationRef.current;
    if (d) targetTime.current = Math.min(d, Math.max(0, p * d));
  });

  useEffect(() => {
    if (reduce) return;
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const readDuration = () => {
      if (Number.isFinite(video.duration)) durationRef.current = video.duration;
    };
    video.addEventListener('loadedmetadata', readDuration);
    video.addEventListener('durationchange', readDuration);
    readDuration();

    // "Prime" para iOS: algunos navegadores no permiten seek hasta reproducir.
    video.play().then(() => video.pause()).catch(() => {});

    let raf = 0;
    let running = false;
    const tick = () => {
      if (!durationRef.current) readDuration();
      if (durationRef.current && video.readyState >= 2) {
        const cur = video.currentTime;
        const next = cur + (targetTime.current - cur) * 0.16;
        if (Math.abs(next - cur) > 0.0015) {
          try {
            video.currentTime = next;
          } catch {
            /* seek aún no disponible */
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // El bucle de scrubbing (seeks del vídeo = caro) solo corre con la sección a la vista.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: '10% 0px' }
    );
    io.observe(section);

    return () => {
      stop();
      io.disconnect();
      video.removeEventListener('loadedmetadata', readDuration);
      video.removeEventListener('durationchange', readDuration);
    };
  }, [reduce]);

  // NB: todos los hooks van ANTES de cualquier return condicional (rules of hooks).
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.87, 0.96], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.87, 0.96], [30, 0]);
  // El velo se aclara un poco en el "clímax" central y vuelve a cerrar al final.
  const veil = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.85, 1], [0.5, 0.28, 0.18, 0.28, 0.55]);

  const tt = (k: string) => L[k]?.[locale] ?? L[k]?.en ?? '';

  if (!boat) return null;

  const specs = [
    { label: tt('length'), value: boat.specs.length, range: [0.24, 0.3, 0.37, 0.43] },
    { label: tt('beam'), value: boat.specs.beam, range: [0.4, 0.46, 0.53, 0.59] },
    { label: tt('speed'), value: boat.specs.maxSpeed, range: [0.56, 0.62, 0.69, 0.75] },
    { label: tt('engines'), value: boat.specs.engines, range: [0.72, 0.78, 0.85, 0.9] },
  ].filter((s) => s.value) as { label: string; value: string; range: [number, number, number, number] }[];

  // --- Fallback estático (reduced-motion / SEO-friendly) ---
  if (reduce) {
    return (
      <section className="relative bg-ink text-white">
        <div className="relative h-[80svh] min-h-[520px] overflow-hidden">
          <Image src={boat.image} alt={boat.name} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink/75" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="eyebrow-invert mb-5">{boat.tagline}</p>
            <h2 className="display text-[clamp(2.5rem,8vw,5.5rem)]">{boat.name}</h2>
            <div className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-4">
              {specs.map((s) => (
                <div key={s.label} className="text-center">
                  <span className="eyebrow-invert block mb-1.5">{s.label}</span>
                  <span className="font-sans text-lg font-light">{s.value}</span>
                </div>
              ))}
            </div>
            <Link href={`/${locale}/flota/${boat.slug}`} className="btn-outline mt-10 border-white/40 text-white hover:bg-white hover:text-ink">
              {tt('cta')}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // --- Versión con scroll-scrubbing ---
  return (
    <section ref={sectionRef} className="relative h-[340vh] bg-ink">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Vídeo (scrubbing) */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          poster={boat.image}
          aria-hidden
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>

        {/* Velo de legibilidad, animado con el scroll */}
        <motion.div style={{ opacity: veil }} className="absolute inset-0 bg-ink" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-ink/60" />

        {/* Cabecera fija de la escena */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 md:px-12 pt-[calc(var(--header-h)+1.5rem)]">
          <span className="eyebrow-invert">{tt('eyebrow')}</span>
          <span className="eyebrow-invert hidden md:block">{boat.year}</span>
        </div>

        {/* Fase 1 — nombre */}
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <Reveal progress={scrollYProgress} range={[0, 0.04, 0.13, 0.2]}>
            <p className="eyebrow-invert mb-6">{boat.tagline}</p>
            <h2 className="display text-white text-[clamp(2.75rem,10vw,8rem)]">{boat.name}</h2>
          </Reveal>
        </div>

        {/* Fase 2 — specs, una a una en el mismo punto */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[16vh] flex justify-center">
          <div className="relative h-40 w-full max-w-xl">
            {specs.map((s) => (
              <Reveal
                key={s.label}
                progress={scrollYProgress}
                range={s.range}
                className="absolute inset-x-0 top-0 text-center"
              >
                <span className="eyebrow-invert mb-4 block">{s.label}</span>
                <span className="display block text-white text-[clamp(2.25rem,7vw,5rem)]">{s.value}</span>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Fase 3 — CTA */}
        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <p className="eyebrow-invert mb-6">{tt('discover')}</p>
          <Link
            href={`/${locale}/flota/${boat.slug}`}
            className="btn-outline border-white/40 text-white hover:bg-white hover:text-ink"
          >
            {tt('cta')}
          </Link>
        </motion.div>

        {/* Pista de scroll */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-2"
        >
          <span className="eyebrow-invert">{tt('scroll')}</span>
          <span className="text-white/70">↓</span>
        </motion.div>
      </div>
    </section>
  );
}

/** Bloque que aparece y desaparece según un tramo [in, full-in, full-out, out] del scroll. */
function Reveal({
  progress,
  range,
  y = 26,
  className,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number, number, number];
  y?: number;
  className?: string;
  children: ReactNode;
}) {
  const [a, b, c, d] = range;
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  const ty = useTransform(progress, [a, b, c, d], [y, 0, 0, -y]);
  return (
    <motion.div style={{ opacity, y: ty }} className={className}>
      {children}
    </motion.div>
  );
}
