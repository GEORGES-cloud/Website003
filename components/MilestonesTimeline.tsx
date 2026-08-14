'use client';
import { useRef } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { FlamingoMark } from './Logo';
import ScrollReveal from './ScrollReveal';
import RevealText from './RevealText';

/* Sesenta años de Marina Marbella sobre un raíl vertical que se dibuja con el
   scroll: cada hito enciende su nodo al entrar en cuadro y el último —Flamingo—
   cierra en el rosa de marca. Fondo blanco (petición del cliente 2026-08-14:
   antes era tinta): el hero de vídeo entra en oscuro, la sección respira en
   blanco y la historia de abajo vuelve al crema. */

// El raíl va en el centro de la columna de nodos: 44px → 22px, 64px → 32px.
const RAIL_LEFT = 'left-[22px] md:left-[32px]';

interface Milestone {
  year: string;
  title: string;
  desc: string;
  highlight?: boolean;
}

function MilestoneRow({ m, reduce }: { m: Milestone; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-30% 0px -40% 0px' });
  const active = reduce || inView;
  const accent = m.highlight;

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-[44px_1fr] md:grid-cols-[64px_1fr] gap-5 md:gap-9 pb-16 md:pb-24 last:pb-0"
    >
      {/* Nodo sobre el raíl — el hito de Flamingo lleva anillo doble en rosa */}
      <div className="relative flex justify-center pt-3 md:pt-4">
        <span
          className={`relative z-10 block rounded-full transition-all duration-500 ${
            accent
              ? 'h-4 w-4 bg-flamingo ring-[6px] ring-flamingo/20'
              : active
                ? 'h-3.5 w-3.5 bg-ink ring-4 ring-ink/10'
                : 'h-3 w-3 bg-white border border-ink/30'
          }`}
          aria-hidden
        />
      </div>

      <ScrollReveal delay={0.05}>
        <div>
          <span
            className={`display-num block mb-3 transition-colors duration-500 ${
              accent ? 'text-flamingo' : active ? 'text-ink' : 'text-ink/20'
            }`}
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.25rem)' }}
          >
            {m.year}
          </span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
            <h3 className="display text-2xl md:text-4xl text-ink">{m.title}</h3>
            {accent && <FlamingoMark size={30} className="opacity-90" />}
          </div>
          <p className="font-sans text-base md:text-lg text-muted leading-relaxed max-w-md">{m.desc}</p>
        </div>
      </ScrollReveal>
    </div>
  );
}

export default function MilestonesTimeline({
  items,
  eyebrow,
  title,
  intro,
  asHero = false,
}: {
  /** Hitos ya localizados: llegan por props desde la página (server). */
  items: Milestone[];
  eyebrow: string;
  title: string;
  intro?: string;
  /** Abre la página en lugar de un hero: deja sitio a la barra fija y sube el
   *  titular a h1. La barra ya no necesita señal: la sección es clara. */
  asHero?: boolean;
}) {
  const reduce = useReducedMotion() ?? false;
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: railRef, offset: ['start center', 'end center'] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const dotTop = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Abriendo la página, el titular de la sección es el h1 del documento.
  const Heading = asHero ? 'h1' : 'h2';

  return (
    <section
      className={`bg-white overflow-hidden pb-24 md:pb-36 ${
        asHero ? 'pt-[calc(var(--header-h)+4rem)]' : 'pt-24 md:pt-36'
      }`}
    >
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        <div className="max-w-2xl section-head">
          <ScrollReveal>
            <p className="eyebrow mb-5">{eyebrow}</p>
          </ScrollReveal>
          <Heading className={`display text-ink text-balance ${asHero ? 'display-1' : 'display-2'}`}>
            <RevealText delay={0.08}>{title}</RevealText>
          </Heading>
          {intro && (
            <ScrollReveal delay={0.2}>
              <p className="font-sans text-lg text-muted leading-relaxed mt-7">{intro}</p>
            </ScrollReveal>
          )}
        </div>

        <div ref={railRef} className="relative max-w-3xl">
          {/* Raíl estático */}
          <div className={`absolute ${RAIL_LEFT} top-2 bottom-2 w-px bg-line`} aria-hidden />
          {/* Raíl que se dibuja con el scroll */}
          <motion.div
            className={`absolute ${RAIL_LEFT} top-2 bottom-2 w-px bg-ink/70 origin-top`}
            style={{ scaleY: reduce ? 1 : scaleY }}
            aria-hidden
          />
          {/* Punto guía */}
          <motion.span
            className={`absolute ${RAIL_LEFT} h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-ink shadow-[0_0_0_4px_rgba(26,25,22,0.12)]`}
            style={{ top: dotTop, opacity: reduce ? 0 : 1 }}
            aria-hidden
          />

          {items.map((m) => (
            <MilestoneRow key={m.year} m={m} reduce={reduce} />
          ))}
        </div>
      </div>
    </section>
  );
}
