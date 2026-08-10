'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { getLenis } from '@/lib/lenis';

/* Carrete horizontal: se recorre con el dedo (scroll nativo + snap) y en
   escritorio con rueda/drag o flechas — las flechas solo existen con puntero
   fino, en táctil manda el gesto. Tocar una foto abre el visor a pantalla
   completa, que también se pasa deslizando. Con `auto`, el carrete avanza solo
   a velocidad media mientras nadie lo toca (petición del cliente; se pausa con
   hover/gesto y respeta prefers-reduced-motion). */
/* Encuadre por foto: las verticales se recortaban por el centro en el carril
   4:3 y perdían lo importante (proa, motores, casco). Se declara aquí y no en
   cada llamada porque depende de la foto, no de dónde se use. */
const OBJECT_POSITION: Record<string, string> = {
  '/images/blue-vertical.jpg': '50% 70%',
  '/images/navan-vertical.jpg': '50% 45%',
};

export default function BoatGallery({
  images,
  name,
  auto = false,
  alts,
}: {
  images: string[];
  name: string;
  auto?: boolean;
  /** Descripción por foto, en el mismo orden que `images`. Sin ella se cae al
   *  patrón numerado, que no describe nada para quien usa lector de pantalla. */
  alts?: string[];
}) {
  const altFor = (i: number) => alts?.[i] ?? `${name} ${i + 1}`;
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedUntil = useRef(0);
  const hovering = useRef(false);

  const close = useCallback(() => setOpen(null), []);
  const go = useCallback(
    (dir: number) => setOpen((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length]
  );

  const nudge = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>('[data-slide]');
    el.scrollBy({ left: dir * ((slide?.offsetWidth ?? 480) + 12), behavior: 'smooth' });
  };

  // Autoplay: avanza solo mientras nadie interactúa; cualquier gesto lo pausa
  // unos segundos. El snap se suspende durante el avance para que no "pelee"
  // con el scroll programático y se restaura al tocar.
  useEffect(() => {
    const el = trackRef.current;
    if (!auto || !el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const SPEED = 45; // px/s — velocidad media
    let raf = 0;
    let last = performance.now();
    let visible = false;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.25 });
    io.observe(el);

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const idle = visible && now > pausedUntil.current && !hovering.current && open === null && !document.hidden;
      if (idle) {
        el.style.scrollSnapType = 'none';
        const max = el.scrollWidth - el.clientWidth;
        el.scrollLeft = el.scrollLeft >= max - 1 ? 0 : el.scrollLeft + SPEED * dt;
      } else {
        el.style.scrollSnapType = '';
      }
      raf = requestAnimationFrame(tick);
    };

    const pause = () => { pausedUntil.current = performance.now() + 4000; };
    const enter = () => { hovering.current = true; };
    const leave = () => { hovering.current = false; pause(); };
    el.addEventListener('pointerdown', pause);
    el.addEventListener('wheel', pause, { passive: true });
    el.addEventListener('touchmove', pause, { passive: true });
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.style.scrollSnapType = '';
      el.removeEventListener('pointerdown', pause);
      el.removeEventListener('wheel', pause);
      el.removeEventListener('touchmove', pause);
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
    };
  }, [auto, open]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    getLenis()?.stop();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      getLenis()?.start();
    };
  }, [open, close, go]);

  return (
    <>
      <div className="relative group/reel">
        <div
          ref={trackRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide overscroll-x-contain -mx-6 md:-mx-10 px-6 md:px-10"
        >
          {images.map((src, i) => (
            <button
              key={src}
              data-slide
              onClick={() => setOpen(i)}
              aria-label={altFor(i)}
              className="group relative overflow-hidden flex-none snap-start w-[78vw] sm:w-[440px] md:w-[540px] aspect-[4/3]"
            >
              {/* Cada foto asienta al entrar en pantalla — también las que
                  llegan deslizando en horizontal. Una sola vez por foto. */}
              <motion.div
                initial={reduce ? false : { opacity: 0, scale: 1.14 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 1.15, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={src}
                  alt={altFor(i)}
                  fill
                  sizes="(max-width: 640px) 78vw, 540px"
                  style={{ objectPosition: OBJECT_POSITION[src] }}
                  className="img-grade object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.05]"
                />
              </motion.div>
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors" />
            </button>
          ))}
        </div>

        {/* Flechas solo con puntero fino (escritorio); en táctil, el dedo */}
        <button
          onClick={() => nudge(-1)}
          aria-label="Anterior"
          className="hidden [@media(pointer:fine)]:flex items-center justify-center absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-bone/90 text-ink hover:bg-bone transition-all opacity-0 group-hover/reel:opacity-100 text-2xl"
        >
          ‹
        </button>
        <button
          onClick={() => nudge(1)}
          aria-label="Siguiente"
          className="hidden [@media(pointer:fine)]:flex items-center justify-center absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-bone/90 text-ink hover:bg-bone transition-all opacity-0 group-hover/reel:opacity-100 text-2xl"
        >
          ›
        </button>

      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-ink/95 flex items-center justify-center p-4 md:p-10"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={name}
          >
            <button
              onClick={close}
              aria-label="Cerrar"
              className="absolute top-5 right-5 text-white/70 hover:text-white p-2 z-10"
            >
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <line x1="2" y1="2" x2="24" y2="24" stroke="currentColor" strokeWidth="1.5" />
                <line x1="24" y1="2" x2="2" y2="24" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              aria-label="Anterior"
              className="hidden [@media(pointer:fine)]:block absolute left-3 md:left-8 text-white/60 hover:text-white text-3xl p-3 z-10"
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); go(1); }}
              aria-label="Siguiente"
              className="hidden [@media(pointer:fine)]:block absolute right-3 md:right-8 text-white/60 hover:text-white text-3xl p-3 z-10"
            >
              ›
            </button>

            {/* En el visor también se pasa con el dedo */}
            <motion.div
              key={open}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(1);
                else if (info.offset.x > 60) go(-1);
              }}
              className="relative w-full max-w-5xl aspect-[3/2] touch-pan-y"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={images[open]} alt={altFor(open)} fill sizes="100vw" className="object-contain pointer-events-none" />
            </motion.div>

            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-sans text-[11px] tracking-wide2 uppercase text-white/60">
              {open + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
