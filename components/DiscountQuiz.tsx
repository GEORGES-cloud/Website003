'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const KEY = 'navigante-quiz-v1';
const OPEN_DELAY = 6000;
const TOTAL_Q = 3;
/* Índice de la opción correcta por pregunta. El orden de las opciones debe
   ser idéntico en quiz.qN.options de todos los messages/<locale>.json:
   q1 → Puerto Banús · q2 → Siete · q3 → Blue */
const CORRECT = [1, 0, 2];
const CODE = 'FLAMINGO3';
const EASE = [0.22, 1, 0.36, 1] as const;

/* Quiz de captación: aparece una vez por visitante tras unos segundos.
   Tres preguntas sobre el club; al acertarlas se desbloquea un código de
   descuento de bienvenida con handoff a WhatsApp (mismo patrón que JoinFunnel). */
export default function DiscountQuiz({ locale }: { locale: string }) {
  const t = useTranslations('quiz');
  const reduce = useReducedMotion();
  const phone = process.env.NEXT_PUBLIC_WHATSAPP ?? '34722454277';

  const [open, setOpen] = useState(false);
  // step: 0 intro · 1..3 preguntas · 4 premio
  const [step, setStep] = useState(0);
  const [missed, setMissed] = useState<number[]>([]); // opciones falladas de la pregunta actual
  const [hit, setHit] = useState<number | null>(null); // acierto en pausa breve antes de avanzar

  useEffect(() => {
    let id: number | undefined;
    try {
      if (!localStorage.getItem(KEY)) id = window.setTimeout(() => setOpen(true), OPEN_DELAY);
    } catch {
      /* storage unavailable */
    }
    return () => window.clearTimeout(id);
  }, []);

  const dismiss = useCallback(() => {
    try {
      if (localStorage.getItem(KEY) !== 'won') localStorage.setItem(KEY, 'dismissed');
    } catch {
      /* ignore */
    }
    setOpen(false);
  }, []);

  // Bloqueo de scroll + Escape para cerrar
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && dismiss();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, dismiss]);

  const choose = (i: number) => {
    if (hit !== null) return;
    if (i === CORRECT[step - 1]) {
      setHit(i);
      window.setTimeout(() => {
        setHit(null);
        setMissed([]);
        if (step === TOTAL_Q) {
          try {
            localStorage.setItem(KEY, 'won');
          } catch {
            /* ignore */
          }
          setStep(4);
        } else {
          setStep(step + 1);
        }
      }, 500);
    } else if (!missed.includes(i)) {
      setMissed([...missed, i]);
    }
  };

  const waHref = `https://wa.me/${phone}?text=${encodeURIComponent(t('wa', { code: CODE }))}`;

  const panelInit = reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 };
  const panelShown = reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-label={t('title')}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={dismiss}
            className="absolute inset-0 bg-ink/60 backdrop-blur-[2px]"
          />

          {/* Panel */}
          <motion.div
            initial={panelInit}
            animate={panelShown}
            exit={{ opacity: 0, y: reduce ? 0 : 12 }}
            transition={{ duration: reduce ? 0.2 : 0.45, ease: EASE }}
            className="relative w-full max-w-lg bg-bone border border-line max-h-[90dvh] overflow-y-auto"
          >
            <button
              onClick={dismiss}
              aria-label={t('close')}
              className="absolute top-4 right-4 p-2 text-ink/40 hover:text-ink transition-colors z-10"
            >
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                <line x1="1" y1="1" x2="21" y2="21" stroke="currentColor" strokeWidth="1.5" />
                <line x1="21" y1="1" x2="1" y2="21" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>

            {/* Barra de progreso (solo preguntas) */}
            {step >= 1 && step <= TOTAL_Q && (
              <div className="h-[3px] bg-line">
                <div
                  className="h-full bg-sea transition-[width] duration-500 ease-smooth"
                  style={{ width: `${((step - 1) / TOTAL_Q) * 100}%` }}
                />
              </div>
            )}

            <div className="px-7 py-10 sm:px-10 sm:py-12 text-center">
              <motion.div key={step} initial={panelInit} animate={panelShown} transition={{ duration: reduce ? 0.2 : 0.4, ease: EASE }}>
                {/* INTRO */}
                {step === 0 && (
                  <>
                    <p className="eyebrow mb-5">{t('eyebrow')}</p>
                    <h2 className="display text-ink mb-5" style={{ fontSize: 'clamp(1.7rem, 4.5vw, 2.4rem)' }}>
                      {t('title')}
                    </h2>
                    <p className="font-sans text-base text-muted leading-relaxed mb-9 max-w-sm mx-auto">{t('subtitle')}</p>
                    <div className="flex flex-col items-center gap-4">
                      <button onClick={() => setStep(1)} className="btn-primary">
                        {t('start')}
                      </button>
                      <button
                        onClick={dismiss}
                        className="font-sans text-[12px] font-semibold uppercase tracking-wide2 text-muted hover:text-ink transition-colors"
                      >
                        {t('dismiss')}
                      </button>
                    </div>
                  </>
                )}

                {/* PREGUNTAS */}
                {step >= 1 && step <= TOTAL_Q && (
                  <>
                    <p className="font-sans text-[11px] font-semibold uppercase tracking-wide2 text-muted mb-4">
                      {t('progress', { current: step, total: TOTAL_Q })}
                    </p>
                    <h2 className="display text-ink mb-8" style={{ fontSize: 'clamp(1.4rem, 3.6vw, 1.9rem)' }}>
                      {t(`q${step}.title`)}
                    </h2>
                    <div className="flex flex-col gap-3 text-left">
                      {(t.raw(`q${step}.options`) as string[]).map((opt, i) => {
                        const wrong = missed.includes(i);
                        const right = hit === i;
                        return (
                          <button
                            key={i}
                            onClick={() => choose(i)}
                            disabled={wrong}
                            className={`w-full border px-6 py-4 font-sans text-[15px] leading-snug transition-colors duration-200 ${
                              right
                                ? 'border-sea bg-sand text-ink'
                                : wrong
                                  ? 'border-line text-muted/40 line-through cursor-not-allowed'
                                  : 'border-line text-ink hover:border-sea hover:bg-sand'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    <p
                      aria-live="polite"
                      className={`font-sans text-sm text-sea mt-5 transition-opacity duration-300 ${missed.length > 0 ? 'opacity-100' : 'opacity-0'}`}
                    >
                      {t('wrong')}
                    </p>
                  </>
                )}

                {/* PREMIO */}
                {step === 4 && (
                  <>
                    <p className="eyebrow mb-4">{t('win.eyebrow')}</p>
                    <h2 className="display text-ink mb-4" style={{ fontSize: 'clamp(1.6rem, 4.2vw, 2.2rem)' }}>
                      {t('win.title')}
                    </h2>
                    <p className="font-sans text-base text-muted leading-relaxed mb-8 max-w-sm mx-auto">{t('win.subtitle')}</p>

                    <p className="font-sans text-[11px] font-semibold uppercase tracking-wide2 text-muted mb-3">{t('win.codeLabel')}</p>
                    <p className="inline-block font-display font-black text-2xl sm:text-3xl tracking-[0.18em] text-ink border border-dashed border-sea/50 bg-sand px-8 py-4 mb-5">
                      {CODE}
                    </p>
                    <p className="font-sans text-sm text-muted leading-relaxed mb-8 max-w-sm mx-auto">{t('win.hint')}</p>

                    <div className="flex flex-col items-center gap-4">
                      <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                        className="btn-primary inline-flex items-center gap-2.5"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.52 11.97c-.25-.12-1.47-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42l-.48-.01c-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
                        </svg>
                        {t('win.whatsapp')}
                      </a>
                      <Link
                        href={`/${locale}/precios`}
                        onClick={() => setOpen(false)}
                        className="font-sans text-[12px] font-semibold uppercase tracking-wide2 text-muted hover:text-ink transition-colors"
                      >
                        {t('win.plans')}
                      </Link>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
