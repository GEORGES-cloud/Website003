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
import { getMilestones } from '@/lib/localize';
import { FlamingoMark } from './Logo';

/* Sesenta años de Marina Marbella contados como una travesía: la sección se
   fija en pantalla y el scroll vertical desplaza los hitos en horizontal, con
   el año detrás en gran formato. Fondo tinta — un corte oscuro entre dos
   secciones claras de /nosotros. El último hito (Flamingo) cierra en rosa de
   marca, el único color de la paleta.

   Con prefers-reduced-motion o en móvil no hay fijado: los mismos hitos se
   apilan en vertical sobre el mismo fondo. */

const EASE = [0.22, 1, 0.36, 1] as const;

interface Milestone {
  year: string;
  title: string;
  desc: string;
  highlight?: boolean;
}

function Panel({
  m,
  i,
  total,
  active,
  stacked = false,
}: {
  m: Milestone;
  i: number;
  total: number;
  active: boolean;
  stacked?: boolean;
}) {
  const accent = m.highlight;
  return (
    <li
      className={
        stacked
          ? 'relative border-t border-white/15 pt-8'
          : 'relative flex-none w-[74vw] lg:w-[42vw] xl:w-[34vw] border-t border-white/15 pt-9'
      }
    >
      {/* Índice + regla, como un pie de lámina editorial */}
      <div className="flex items-center gap-4 mb-7">
        <span
          className={`display-num text-[11px] transition-colors duration-700 ${
            accent ? 'text-flamingo' : active ? 'text-white/70' : 'text-white/30'
          }`}
        >
          {String(i + 1).padStart(2, '0')}
        </span>
        <span
          aria-hidden
          className={`h-px flex-1 transition-colors duration-700 ${
            accent ? 'bg-flamingo/45' : active ? 'bg-white/25' : 'bg-white/10'
          }`}
        />
        {accent && <FlamingoMark size={30} tone="white" className="opacity-90" />}
      </div>

      <span
        className={`display-num block mb-5 transition-colors duration-700 ${
          accent ? 'text-flamingo' : active ? 'text-white' : 'text-white/25'
        }`}
        style={{ fontSize: stacked ? 'clamp(2.75rem, 13vw, 4rem)' : 'clamp(3rem, 5.6vw, 5.25rem)' }}
      >
        {m.year}
      </span>

      <h3
        className="display text-white mb-4 text-balance"
        style={{ fontSize: stacked ? '1.5rem' : 'clamp(1.35rem, 1.9vw, 1.9rem)' }}
      >
        {m.title}
      </h3>
      <p className="font-sans text-base text-white/55 leading-relaxed max-w-md">{m.desc}</p>

      {!stacked && (
        <span className="sr-only">
          Hito {i + 1} de {total}
        </span>
      )}
    </li>
  );
}

export default function MilestonesTimeline({
  locale,
  eyebrow,
  title,
  intro,
  asHero = false,
}: {
  locale: string;
  eyebrow: string;
  title: string;
  intro?: string;
  /** Abre la página en lugar de un hero: deja sitio a la barra fija y le pide
   *  que arranque en blanco (data-navbar-on-dark). */
  asHero?: boolean;
}) {
  const reduce = useReducedMotion() ?? false;
  const items = getMilestones(locale) as Milestone[];

  const trackRef = useRef<HTMLOListElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [active, setActive] = useState(0);

  // Recorrido horizontal real = ancho del carril menos el del escenario.
  // Se mide tras el montaje y en cada resize; hasta entonces el carril no viaja.
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
  }, [items.length]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.round(v * (items.length - 1));
    setActive(Math.min(items.length - 1, Math.max(0, i)));
  });

  // Abriendo la página, el titular de la sección es el h1 del documento.
  const Heading = asHero ? 'h1' : 'h2';
  const header = (
    <div className="max-w-[1480px] mx-auto px-6 md:px-10">
      <div className="max-w-2xl">
        <p className="eyebrow-invert mb-5">{eyebrow}</p>
        <Heading
          className="display text-white text-balance"
          style={{ fontSize: asHero ? 'clamp(2.5rem, 5.5vw, 4.75rem)' : 'clamp(2rem, 4.5vw, 3.75rem)' }}
        >
          {title}
        </Heading>
        {intro && <p className="font-sans text-lg text-white/55 leading-relaxed mt-7">{intro}</p>}
      </div>
    </div>
  );

  // Apilado — móvil y prefers-reduced-motion
  const stacked = (
    <section
      data-navbar-on-dark={asHero || undefined}
      className={`bg-ink pb-24 md:pb-32 ${asHero ? 'pt-[calc(var(--header-h)+3.5rem)]' : 'pt-24 md:pt-32'} ${
        reduce ? '' : 'md:hidden'
      }`}
    >
      {header}
      <ol className="max-w-[1480px] mx-auto px-6 md:px-10 mt-14 md:mt-16 space-y-12">
        {items.map((m, i) => (
          <Panel key={m.year} m={m} i={i} total={items.length} active stacked />
        ))}
      </ol>
    </section>
  );

  if (reduce) return stacked;

  return (
    <>
      {stacked}

      {/* Travesía horizontal fijada al scroll — desde md */}
      <section
        data-navbar-on-dark={asHero || undefined}
        className="hidden md:block bg-ink"
        aria-label={title}
      >
        {/* La cabecera entra con el scroll normal; el fijado empieza después,
            así el panel fijo solo carga carril y raíl y cabe en cualquier alto. */}
        <div className={`pb-4 ${asHero ? 'pt-[calc(var(--header-h)+4rem)]' : 'pt-24 lg:pt-32'}`}>
          {header}
        </div>

        <div ref={sectionRef} style={{ height: `${Math.max(240, items.length * 58)}vh` }}>
          <div ref={stageRef} className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
            {/* Año en gran formato al fondo: marca de agua que cambia con el hito */}
            <AnimatePresence mode="popLayout">
              <motion.span
                key={items[active].year}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 0.05, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.7, ease: EASE }}
                aria-hidden
                className="display-num pointer-events-none absolute -bottom-[8vh] right-[3vw] leading-none text-white select-none"
                style={{ fontSize: '34vw' }}
              >
                {items[active].year}
              </motion.span>
            </AnimatePresence>

            {/* Carril */}
            <motion.ol
              ref={trackRef}
              style={{ x }}
              className="relative flex items-start gap-10 lg:gap-16 pl-6 md:pl-10 pr-[24vw] will-change-transform"
            >
              {items.map((m, i) => (
                <Panel key={m.year} m={m} i={i} total={items.length} active={i === active} />
              ))}
            </motion.ol>

            {/* Raíl de progreso con los años como marcas */}
            <div className="absolute inset-x-0 bottom-0 pb-10">
              <div className="max-w-[1480px] mx-auto px-6 md:px-10">
                <div className="relative h-px bg-white/15">
                  <motion.div
                    className="absolute inset-y-0 left-0 w-full bg-white/60 origin-left"
                    style={{ scaleX: railScale }}
                    aria-hidden
                  />
                </div>
                <div className="flex justify-between mt-4">
                  {items.map((m, i) => (
                    <span
                      key={m.year}
                      className={`display-num text-[10px] transition-colors duration-500 ${
                        i === active ? (m.highlight ? 'text-flamingo' : 'text-white') : 'text-white/25'
                      }`}
                    >
                      {m.year}
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
