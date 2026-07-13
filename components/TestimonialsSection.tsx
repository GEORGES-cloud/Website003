'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTestimonials } from '@/lib/localize';

interface TestimonialsSectionProps {
  locale: string;
}

const EYEBROW: Record<string, string> = {
  es: 'Lo que dicen los socios',
  en: 'What members say',
  sv: 'Vad medlemmarna säger',
  ru: 'Отзывы наших членов',
  de: 'Was unsere Mitglieder sagen',
  fr: 'Ce que disent les membres',
};

export default function TestimonialsSection({ locale }: TestimonialsSectionProps) {
  const [current, setCurrent] = useState(0);
  const testimonials = useMemo(() => getTestimonials(locale), [locale]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const t = testimonials[current];

  return (
    <section className="py-24 md:py-32 bg-bone">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="eyebrow mb-10">{EYEBROW[locale] ?? EYEBROW.en}</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-sans text-2xl md:text-4xl font-light text-ink leading-snug tracking-tight mb-10">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="font-sans text-sm font-semibold text-ink tracking-wide">{t.author}</p>
                <p className="font-sans text-xs text-sea mt-1 tracking-wide2 uppercase">{t.role}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-3 mt-12">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-300 h-px ${
                  i === current ? 'w-10 bg-sea' : 'w-3 bg-ink/20 hover:bg-ink/40'
                }`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
