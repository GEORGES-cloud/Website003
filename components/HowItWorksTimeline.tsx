'use client';
import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

/* Los tres pasos como una travesía: la sección se fija en pantalla y el scroll
   vertical desplaza los pasos en horizontal, con el numeral detrás en gran
   formato. Sobre fondo bone y con el acento marino de la página.

   Con prefers-reduced-motion o en móvil no hay fijado: los mismos pasos se
   apilan en vertical. */

const EASE = [0.22, 1, 0.36, 1] as const;

interface Step {
  number: string;
  title: string;
  desc: string;
}

interface HowItWorksTimelineProps {
  steps: Step[];
  locale: string;
  /** Index of the step that carries the "required" pill (the boating-licence step). */
  licenseStepIndex?: number;
}

const REQUIRED_LABEL: Record<string, string> = {
  es: 'Obligatorio',
  en: 'Required',
  sv: 'Obligatoriskt',
  ru: 'Обязательно',
  de: 'Pflicht',
  fr: 'Obligatoire',
};

function Panel({
  step,
  i,
  total,
  active,
  isLicense,
  requiredLabel,
  stacked = false,
}: {
  step: Step;
  i: number;
  total: number;
  active: boolean;
  isLicense: boolean;
  requiredLabel: string;
  stacked?: boolean;
}) {
  return (
    <li
      className={
        stacked
          ? 'relative border-t border-line pt-8'
          : 'relative flex-none w-[76vw] lg:w-[44vw] xl:w-[38vw] border-t border-line pt-9'
      }
    >
      {/* Índice + regla, como un pie de lámina editorial */}
      <div className="flex items-center gap-4 mb-7">
        <span
          className={`display-num text-[11px] transition-colors duration-700 ${
            active ? 'text-sea' : 'text-ink/30'
          }`}
        >
          {String(i + 1).padStart(2, '0')}
        </span>
        <span
          aria-hidden
          className={`h-px flex-1 transition-colors duration-700 ${active ? 'bg-sea/35' : 'bg-line'}`}
        />
      </div>

      <span
        className={`display-num block mb-5 transition-colors duration-700 ${
          active ? 'text-ink' : 'text-ink/20'
        }`}
        style={{ fontSize: stacked ? 'clamp(2.75rem, 13vw, 4rem)' : 'clamp(3rem, 5.6vw, 5.25rem)' }}
      >
        {step.number}
      </span>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
        <h3
          className="display text-ink text-balance"
          style={{ fontSize: stacked ? '1.5rem' : 'clamp(1.35rem, 1.9vw, 1.9rem)' }}
        >
          {step.title}
        </h3>
        {isLicense && (
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wide2 text-sea border border-sea/40 px-3 py-1">
            {requiredLabel}
          </span>
        )}
      </div>
      <p className="font-sans text-base text-muted leading-relaxed max-w-md">{step.desc}</p>

      {!stacked && (
        <span className="sr-only">
          Paso {i + 1} de {total}
        </span>
      )}
    </li>
  );
}

export default function HowItWorksTimeline({ steps, locale, licenseStepIndex = 1 }: HowItWorksTimelineProps) {
  const reduce = useReducedMotion() ?? false;
  const requiredLabel = REQUIRED_LABEL[locale] ?? REQUIRED_LABEL.en;

  const trackRef = useRef<HTMLOListElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [active, setActive] = useState(0);

  // Recorrido horizontal real = ancho del carril menos el del escenario.
  useEffect(() => {
    const measure = () => {
      if (!trackRef.current || !stageRef.current) return;
      setTravel(Math.max(0, trackRef.current.scrollWidth - stageRef.current.clientWidth));
    };
    measure();
    window.addEventListener('resize', measure);
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => {
      window.removeEventListener('resize', measure);
      ro.disconnect();
    };
  }, [steps.length]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.round(v * (steps.length - 1));
    setActive(Math.min(steps.length - 1, Math.max(0, i)));
  });

  // Apilado — móvil y prefers-reduced-motion
  const stacked = (
    <section className={`bg-bone py-24 md:py-32 ${reduce ? '' : 'md:hidden'}`}>
      <ol className="max-w-[1480px] mx-auto px-6 md:px-10 space-y-12">
        {steps.map((s, i) => (
          <Panel
            key={s.number}
            step={s}
            i={i}
            total={steps.length}
            active
            isLicense={i === licenseStepIndex}
            requiredLabel={requiredLabel}
            stacked
          />
        ))}
      </ol>
    </section>
  );

  if (reduce) return stacked;

  return (
    <>
      {stacked}

      {/* Travesía horizontal fijada al scroll — desde md */}
      <section className="hidden md:block bg-bone">
        <div ref={sectionRef} style={{ height: `${Math.max(200, steps.length * 66)}vh` }}>
          <div ref={stageRef} className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
            {/* Numeral en gran formato al fondo: cambia con el paso activo */}
            <AnimatePresence mode="popLayout">
              <motion.span
                key={steps[active].number}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 0.045, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.7, ease: EASE }}
                aria-hidden
                className="display-num pointer-events-none absolute -bottom-[8vh] right-[3vw] leading-none text-ink select-none"
                style={{ fontSize: '34vw' }}
              >
                {steps[active].number}
              </motion.span>
            </AnimatePresence>

            {/* Carril */}
            <motion.ol
              ref={trackRef}
              style={{ x }}
              className="relative flex items-start gap-10 lg:gap-16 pl-6 md:pl-10 pr-[24vw] will-change-transform"
            >
              {steps.map((s, i) => (
                <Panel
                  key={s.number}
                  step={s}
                  i={i}
                  total={steps.length}
                  active={i === active}
                  isLicense={i === licenseStepIndex}
                  requiredLabel={requiredLabel}
                />
              ))}
            </motion.ol>

            {/* Raíl de progreso con los pasos como marcas */}
            <div className="absolute inset-x-0 bottom-0 pb-10">
              <div className="max-w-[1480px] mx-auto px-6 md:px-10">
                <div className="relative h-px bg-line">
                  <motion.div
                    className="absolute inset-y-0 left-0 w-full bg-sea origin-left"
                    style={{ scaleX: railScale }}
                    aria-hidden
                  />
                </div>
                <div className="flex justify-between mt-4">
                  {steps.map((s, i) => (
                    <span
                      key={s.number}
                      className={`display-num text-[10px] transition-colors duration-500 ${
                        i === active ? 'text-sea' : 'text-ink/25'
                      }`}
                    >
                      {s.number}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
