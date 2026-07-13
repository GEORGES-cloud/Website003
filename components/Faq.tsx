'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { getFaqs } from '@/lib/localize';
import ScrollReveal from './ScrollReveal';

export default function Faq({ locale }: { locale: string }) {
  const t = useTranslations('membership.faq');
  const faqs = getFaqs(locale);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 md:py-28 bg-bone">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <div className="mb-12 md:mb-14">
          <ScrollReveal>
            <p className="eyebrow mb-5">{t('eyebrow')}</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="display text-ink" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}>
              {t('title')}
            </h2>
          </ScrollReveal>
        </div>

        <div className="divide-y divide-line border-t border-line">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <h3>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                  >
                    <span className="font-sans text-lg md:text-xl font-light text-ink group-hover:text-sea transition-colors">
                      {f.q}
                    </span>
                    <span
                      className={`flex-none w-6 h-6 relative transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                      aria-hidden
                    >
                      <span className="absolute top-1/2 left-0 w-full h-px bg-ink -translate-y-1/2" />
                      <span className="absolute left-1/2 top-0 h-full w-px bg-ink -translate-x-1/2" />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="font-sans text-base text-muted leading-relaxed pb-7 max-w-2xl">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
