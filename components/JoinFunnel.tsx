'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { getTiers } from '@/lib/localize';
import { useJoinFunnel } from './JoinFunnelProvider';

const EASE = [0.22, 1, 0.36, 1] as const;
const TOTAL_Q = 3;

export default function JoinFunnel({ locale }: { locale: string }) {
  const { open, closeFunnel } = useJoinFunnel();
  const t = useTranslations('funnel');
  const reduce = useReducedMotion();
  // Single membership — the quiz captures preferences for the lead handoff.
  const membership = getTiers(locale)[0];
  const phone = process.env.NEXT_PUBLIC_WHATSAPP ?? '34600000000';

  // step: 0 intro · 1..3 questions · 4 result
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [name, setName] = useState('');
  const closeRef = useRef<HTMLButtonElement>(null);

  // Fresh quiz each time the modal opens
  useEffect(() => {
    if (!open) return;
    setAnswers([]);
    setStep(0);
    setName('');
  }, [open]);

  // Body scroll lock + Escape to close
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeFunnel();
    document.addEventListener('keydown', onKey);
    const id = window.setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(id);
    };
  }, [open, closeFunnel]);

  if (!open) return null;

  const choose = (optIndex: number) => {
    const next = [...answers];
    next[step - 1] = optIndex;
    setAnswers(next);
    setStep(step < TOTAL_Q ? step + 1 : 4);
  };

  const restart = () => {
    setAnswers([]);
    setStep(1);
  };

  // WhatsApp handoff message — greeting + quiz preferences
  const waMessage = (() => {
    const hello = name.trim() ? t('wa.hello', { name: name.trim() }) : t('wa.helloAnon');
    const summary = answers
      .slice(0, TOTAL_Q)
      .map((a, i) => (t.raw(`q${i + 1}.options`) as string[])[a])
      .join(' · ');
    return `${hello} ${t('wa.body', { summary })}`;
  })();
  const waHref = `https://wa.me/${phone}?text=${encodeURIComponent(waMessage)}`;

  const panelInit = reduce ? { opacity: 0 } : { opacity: 0, y: 22 };
  const panelShown = reduce ? { opacity: 1 } : { opacity: 1, y: 0 };
  const panelT = { duration: reduce ? 0.2 : 0.42, ease: EASE };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[90] bg-bone flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={t('title')}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 md:px-10 h-[72px] border-b border-line flex-none">
        <span className="eyebrow">{t('title')}</span>
        <button
          ref={closeRef}
          onClick={closeFunnel}
          aria-label={t('close')}
          className="p-2 -mr-2 text-ink/50 hover:text-ink transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <line x1="1" y1="1" x2="21" y2="21" stroke="currentColor" strokeWidth="1.5" />
            <line x1="21" y1="1" x2="1" y2="21" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      {/* Progress (questions only) */}
      {step >= 1 && step <= TOTAL_Q && (
        <div className="h-[3px] bg-line flex-none">
          <div
            className="h-full bg-sea transition-all duration-500 ease-out"
            style={{ width: `${(step / TOTAL_Q) * 100}%` }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto flex items-center justify-center px-6 py-12">
        <motion.div
          key={step}
          initial={panelInit}
          animate={panelShown}
          transition={panelT}
          className="w-full max-w-xl mx-auto text-center"
        >
          {/* INTRO */}
          {step === 0 && (
            <>
              <p className="eyebrow mb-6">{t('intro.eyebrow')}</p>
              <h2 className="display text-ink mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                {t('intro.title')}
              </h2>
              <p className="font-sans text-lg text-muted leading-relaxed mb-10 max-w-md mx-auto">
                {t('intro.subtitle')}
              </p>
              <button onClick={() => setStep(1)} className="btn-primary">
                {t('intro.start')}
              </button>
            </>
          )}

          {/* QUESTIONS */}
          {step >= 1 && step <= TOTAL_Q && (
            <>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-wide2 text-muted mb-5">
                {t('progress', { current: step, total: TOTAL_Q })}
              </p>
              <h2 className="display text-ink mb-10" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)' }}>
                {t(`q${step}.title`)}
              </h2>
              <div className="flex flex-col gap-3.5 text-left">
                {(t.raw(`q${step}.options`) as string[]).map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => choose(i)}
                    className={`group flex items-center justify-between gap-4 w-full rounded-2xl border px-6 py-5 transition-colors duration-200 ${
                      answers[step - 1] === i ? 'border-sea bg-sand' : 'border-line hover:border-sea hover:bg-sand'
                    }`}
                  >
                    <span className="font-sans text-[15px] sm:text-base text-ink leading-snug">{opt}</span>
                    <span className="flex-none text-sea opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(step - 1)}
                className="mt-8 font-sans text-[12px] font-semibold uppercase tracking-wide2 text-muted hover:text-ink transition-colors"
              >
                {t('back')}
              </button>
            </>
          )}

          {/* RESULT */}
          {step === 4 && (
            <>
              <p className="eyebrow mb-4">{t('result.eyebrow')}</p>
              <h2 className="font-sans font-medium text-ink mb-3" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.25rem)' }}>
                {membership.name}
              </h2>
              <p className="font-sans text-lg text-muted mb-8">{membership.tagline}</p>

              <ul className="space-y-3 mb-9 text-left max-w-sm mx-auto">
                {membership.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-sea flex-none" />
                    <span className="font-sans text-[15px] leading-snug text-ink/80">{f}</span>
                  </li>
                ))}
              </ul>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('result.namePlaceholder')}
                aria-label={t('result.namePlaceholder')}
                className="w-full max-w-sm mx-auto block bg-transparent border-b border-line focus:border-sea outline-none text-center font-sans text-base text-ink py-3 mb-7 transition-colors placeholder:text-muted/70"
              />

              <div className="flex flex-col items-center gap-4">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeFunnel}
                  className="btn-primary inline-flex items-center gap-2.5"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.52 11.97c-.25-.12-1.47-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42l-.48-.01c-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
                  </svg>
                  {t('result.whatsapp')}
                </a>
                <div className="flex items-center gap-6">
                  <Link
                    href={`/${locale}/membresia`}
                    onClick={closeFunnel}
                    className="font-sans text-[12px] font-semibold uppercase tracking-wide2 text-muted hover:text-ink transition-colors"
                  >
                    {t('result.allPlans')}
                  </Link>
                  <button
                    onClick={restart}
                    className="font-sans text-[12px] font-semibold uppercase tracking-wide2 text-muted hover:text-ink transition-colors"
                  >
                    {t('result.restart')}
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
