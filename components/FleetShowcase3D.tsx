'use client';

/**
 * FleetShowcase3D — hero 3D a pantalla completa de la página de flota.
 * La cámara ORBITA el barco al hacer scroll; debajo continúa la grid normal.
 *
 * - El visor WebGL (Boat3DScene) se carga de forma diferida (sin SSR) para no
 *   penalizar la carga inicial ni el SEO: three.js queda en su propio chunk.
 * - Con prefers-reduced-motion se muestra una versión estática (foto + specs).
 * - El barco es un PLACEHOLDER; ver cabecera de Boat3DScene.tsx para el swap.
 */

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import { getActiveFleet } from '@/lib/localize';

const Boat3DScene = dynamic(() => import('./Boat3DScene'), { ssr: false, loading: () => null });

const STUDIO_BG =
  'radial-gradient(120% 95% at 50% 22%, #FDFCFA 0%, #F1EEE8 52%, #E7E3DA 100%)';

const L: Record<string, Record<string, string>> = {
  eyebrow: { es: 'La flota · en 3D', en: 'The fleet · in 3D' },
  length: { es: 'Eslora', en: 'Length' },
  beam: { es: 'Manga', en: 'Beam' },
  speed: { es: 'Velocidad máxima', en: 'Top speed' },
  engines: { es: 'Motorización', en: 'Engines' },
  scroll: { es: 'Desplázate para orbitar', en: 'Scroll to orbit' },
  discover: { es: 'Descúbrela', en: 'Discover her' },
  cta: { es: 'Ver ficha completa', en: 'View full details' },
};

export default function FleetShowcase3D({ locale }: { locale: string }) {
  const boat = getActiveFleet(locale)[0];
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  // Todos los hooks antes de cualquier return condicional (rules of hooks).
  const hintOpacity = useTransform(scrollYProgress, [0, 0.09], [1, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.92, 0.985], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.92, 0.985], [28, 0]);

  // El render 3D (GPU) solo corre con la sección a la vista.
  const [active, setActive] = useState(true);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '15% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const tt = (k: string) => L[k]?.[locale] ?? L[k]?.en ?? '';

  if (!boat) return null;

  const specs = [
    { label: tt('length'), value: boat.specs.length, range: [0.22, 0.28, 0.35, 0.41] },
    { label: tt('beam'), value: boat.specs.beam, range: [0.39, 0.45, 0.52, 0.58] },
    { label: tt('speed'), value: boat.specs.maxSpeed, range: [0.56, 0.62, 0.69, 0.75] },
    { label: tt('engines'), value: boat.specs.engines, range: [0.73, 0.79, 0.85, 0.9] },
  ].filter((s) => s.value) as { label: string; value: string; range: [number, number, number, number] }[];

  // --- Fallback estático (reduced-motion / sin animación) ---
  if (reduce) {
    return (
      <section className="relative" style={{ background: STUDIO_BG }}>
        <div className="relative h-[88svh] min-h-[560px] overflow-hidden">
          <Image src={boat.image} alt={boat.name} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bone/70 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-14">
            <p className="eyebrow mb-4">{boat.tagline}</p>
            <h2 className="display text-ink text-[clamp(2.5rem,8vw,5.5rem)]">{boat.name}</h2>
            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
              {specs.map((s) => (
                <div key={s.label}>
                  <span className="eyebrow block mb-1">{s.label}</span>
                  <span className="font-sans text-lg font-light text-ink">{s.value}</span>
                </div>
              ))}
            </div>
            <Link href={`/${locale}/flota/${boat.slug}`} className="btn-outline mt-9">
              {tt('cta')}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // --- Hero 3D con órbita por scroll ---
  return (
    <section ref={sectionRef} className="relative h-[400vh]" style={{ background: STUDIO_BG }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden" style={{ background: STUDIO_BG }}>
        {/* Visor 3D (llena la escena, no captura el scroll) */}
        <div className="absolute inset-0">
          <Boat3DScene progress={scrollYProgress} active={active} />
        </div>

        {/* Guía de progreso de la órbita (hairline lateral, solo escritorio) */}
        <div className="pointer-events-none absolute right-10 top-1/2 hidden h-36 w-px -translate-y-1/2 bg-line md:block">
          <motion.div className="h-full w-full origin-top bg-sea" style={{ scaleY: scrollYProgress }} />
        </div>

        {/* Cabecera de la escena */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-6 md:px-12 pt-[calc(var(--header-h)+1.5rem)]">
          <span className="eyebrow">{tt('eyebrow')}</span>
          <span className="eyebrow hidden md:block">{boat.year}</span>
        </div>

        {/* Fase 1 — nombre */}
        <div className="pointer-events-none absolute inset-x-0 top-[16vh] flex flex-col items-center px-6 text-center">
          <Reveal progress={scrollYProgress} range={[0, 0.04, 0.13, 0.2]}>
            <p className="eyebrow mb-5">{boat.tagline}</p>
            <h2 className="display text-ink text-[clamp(2.5rem,9vw,7rem)]">{boat.name}</h2>
          </Reveal>
        </div>

        {/* Fase 2 — specs, una a una en el mismo punto */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[14vh] flex justify-center">
          <div className="relative h-32 w-full max-w-xl">
            {specs.map((s) => (
              <Reveal key={s.label} progress={scrollYProgress} range={s.range} className="absolute inset-x-0 top-0 text-center">
                <span className="eyebrow mb-3 block">{s.label}</span>
                <span className="display block text-ink text-[clamp(2rem,6.5vw,4.5rem)]">{s.value}</span>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Fase 3 — CTA */}
        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="absolute inset-x-0 bottom-[16vh] flex flex-col items-center px-6 text-center"
        >
          <p className="eyebrow mb-5">{tt('discover')}</p>
          <Link href={`/${locale}/flota/${boat.slug}`} className="btn-primary pointer-events-auto">
            {tt('cta')}
          </Link>
        </motion.div>

        {/* Pista de scroll */}
        <motion.div style={{ opacity: hintOpacity }} className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-2">
          <span className="eyebrow">{tt('scroll')}</span>
          <span className="text-muted">↓</span>
        </motion.div>
      </div>
    </section>
  );
}

/** Aparece/desaparece según un tramo [in, full-in, full-out, out] del scroll. */
function Reveal({
  progress,
  range,
  y = 24,
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
