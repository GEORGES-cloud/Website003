'use client';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function BoatGallery({ images, name }: { images: string[]; name: string }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const go = useCallback(
    (dir: number) => setOpen((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close, go]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setOpen(i)}
            aria-label={`${name} — ${i + 1}`}
            className={`group relative overflow-hidden ${i === 0 ? 'col-span-2 aspect-[3/2] md:row-span-2 md:aspect-auto' : 'aspect-[4/3]'}`}
          >
            <Image
              src={src}
              alt={`${name} ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors" />
          </button>
        ))}
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
              className="absolute left-3 md:left-8 text-white/60 hover:text-white text-3xl p-3 z-10"
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); go(1); }}
              aria-label="Siguiente"
              className="absolute right-3 md:right-8 text-white/60 hover:text-white text-3xl p-3 z-10"
            >
              ›
            </button>

            <motion.div
              key={open}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-5xl aspect-[3/2]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={images[open]} alt={`${name} ${open + 1}`} fill sizes="100vw" className="object-contain" />
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
