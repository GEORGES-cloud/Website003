'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion';
import { getMilestones } from '@/lib/localize';
import ScrollReveal from './ScrollReveal';

/* Línea del tiempo de la casa: sesenta años de Marina Marbella desembocando
   en Flamingo. Comparte el lenguaje visual de HowItWorksTimeline (raíl que se
   dibuja con el scroll + nodo que se enciende al entrar en cuadro), pero aquí
   el numeral es el año y el último hito se destaca como cierre. */

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

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-[44px_1fr] md:grid-cols-[64px_1fr] gap-5 md:gap-9 pb-14 md:pb-20 last:pb-0"
    >
      {/* Nodo sobre el raíl — el hito de Flamingo lleva anillo doble */}
      <div className="relative flex justify-center pt-3 md:pt-4">
        <span
          className={`relative z-10 block rounded-full transition-all duration-500 ${
            m.highlight
              ? 'h-4 w-4 bg-sea ring-[6px] ring-sea/20'
              : active
                ? 'h-3.5 w-3.5 bg-sea ring-4 ring-sea/15'
                : 'h-3 w-3 bg-bone border border-sea/40'
          }`}
          aria-hidden
        />
      </div>

      <ScrollReveal delay={0.05}>
        <div>
          <span
            className={`display-num block mb-2.5 transition-colors duration-500 ${
              m.highlight ? 'text-sea' : active ? 'text-ink' : 'text-ink/20'
            }`}
            style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}
          >
            {m.year}
          </span>
          <h3 className="display text-xl md:text-2xl text-ink mb-3">{m.title}</h3>
          <p className="font-sans text-base text-muted leading-relaxed max-w-lg">{m.desc}</p>
        </div>
      </ScrollReveal>
    </div>
  );
}

export default function MilestonesTimeline({
  locale,
  eyebrow,
  title,
  intro,
}: {
  locale: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  const reduce = useReducedMotion() ?? false;
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: railRef, offset: ['start center', 'end center'] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const dotTop = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const items = getMilestones(locale);

  return (
    <section className="py-24 md:py-36 bg-bone overflow-hidden">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        <div className="max-w-2xl mb-14 md:mb-20">
          <ScrollReveal>
            <p className="eyebrow mb-5">{eyebrow}</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="display text-ink" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.75rem)' }}>
              {title}
            </h2>
          </ScrollReveal>
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
            className={`absolute ${RAIL_LEFT} top-2 bottom-2 w-px bg-sea origin-top`}
            style={{ scaleY: reduce ? 1 : scaleY }}
            aria-hidden
          />
          {/* Punto guía */}
          <motion.span
            className={`absolute ${RAIL_LEFT} h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-sea shadow-[0_0_0_4px_rgba(44,74,79,0.12)]`}
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
