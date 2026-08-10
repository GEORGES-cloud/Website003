'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { waInterestHref } from '@/lib/whatsapp';
import { useJoinFunnel } from './JoinFunnelProvider';
import { FlamingoMark } from './Logo';
import ConsentCheckbox from './ConsentCheckbox';
import HoneypotField from './HoneypotField';

const EASE = [0.22, 1, 0.36, 1] as const;

/* Funnel de captación directo (el "quiz nuevo", petición del cliente):
   intro → nombre → ¿cómo quieres que te contactemos? (WhatsApp = handoff
   directo · email/llamada = deja su dato y contacta el club) + cita opcional.
   El test de 5 preguntas se eliminó a petición del cliente (ago-2026). */
export default function JoinFunnel({ locale }: { locale: string }) {
  const { open, closeFunnel } = useJoinFunnel();
  const t = useTranslations('funnel');
  const reduce = useReducedMotion();
  const phone = process.env.NEXT_PUBLIC_WHATSAPP ?? '34722454277';

  // step: 0 intro · 1 name · 2 close (canal + cita) · 3 enviado
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [day, setDay] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);
  // Canal de contacto preferido en el cierre: llamada por defecto — quien llega
  // aquí eligió "prefiero que me contactéis vosotros", y arrancar en WhatsApp
  // le lanzaba justo el handoff que acababa de descartar. El chip de WhatsApp
  // sigue en el paso 2, y sigue siendo el CTA principal de la intro.
  const [channel, setChannel] = useState<'whatsapp' | 'email' | 'phone'>('phone');
  const [contact, setContact] = useState('');
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const hpRef = useRef<HTMLInputElement>(null);

  // Fresh run each time the modal opens
  useEffect(() => {
    if (!open) return;
    setStep(0);
    setName('');
    setDay(null);
    setTime(null);
    setChannel('phone');
    setContact('');
    setConsent(false);
    setSending(false);
    setSendError(false);
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

  // Focus the name field when reaching that step
  useEffect(() => {
    if (step === 1) {
      const id = window.setTimeout(() => nameRef.current?.focus(), 120);
      return () => window.clearTimeout(id);
    }
  }, [step]);

  if (!open) return null;

  const fullName = name.trim().replace(/\s+/g, ' ');
  const firstName = fullName.split(' ')[0] ?? '';
  const nameValid = fullName.length >= 2;

  const dayOpts = t.raw('cita.day') as string[];
  const timeOpts = t.raw('cita.time') as string[];
  const hasCita = day !== null || time !== null;

  // WhatsApp handoff — saludo con nombre (+ cita cuando se elige)
  const waMessage = (() => {
    const hello = nameValid ? t('wa.hello', { name: fullName }) : t('wa.helloAnon');
    let msg = `${hello} ${t('wa.body')}`;
    if (hasCita) {
      const when = [day !== null ? dayOpts[day] : null, time !== null ? timeOpts[time] : null]
        .filter(Boolean)
        .join(', ');
      msg += ` ${t('wa.cita', { when })}`;
    }
    msg += ` ${t('wa.closing')}`;
    return msg;
  })();
  const waHref = `https://wa.me/${phone}?text=${encodeURIComponent(waMessage)}`;

  // Email / llamada: el club contacta al lead — el perfil completo viaja a /api/contact
  const isEmail = channel === 'email';
  const contactValid = isEmail
    ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact.trim())
    : contact.replace(/[^\d]/g, '').length >= 9;
  const canSend = nameValid && contactValid && consent && !sending;

  const sendLead = async () => {
    if (!canSend) return;
    setSending(true);
    setSendError(false);
    const when = [day !== null ? dayOpts[day] : null, time !== null ? timeOpts[time] : null]
      .filter(Boolean)
      .join(', ');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email: isEmail ? contact.trim() : undefined,
          phone: isEmail ? undefined : contact.trim(),
          company: hpRef.current?.value || undefined,
          message: `Lead del funnel "Únete al club" — prefiere contacto por ${isEmail ? 'email' : 'llamada'}.${when ? ` Cita: ${when}.` : ''}`,
        }),
      });
      if (!res.ok) throw new Error('send failed');
      setStep(3);
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  };

  const panelInit = reduce ? { opacity: 0 } : { opacity: 0, y: 22 };
  const panelShown = reduce ? { opacity: 1 } : { opacity: 1, y: 0 };
  const panelT = { duration: reduce ? 0.2 : 0.42, ease: EASE };

  const chip = (active: boolean) =>
    `font-sans text-[12px] px-4 py-2.5 rounded-full border transition-colors duration-200 ${
      active ? 'border-sea bg-sea text-white' : 'border-line text-ink hover:border-sea'
    }`;

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

      {/* Content — block layout + my-auto so tall steps scroll from the top
          instead of clipping (centered-flex-in-overflow bug on small phones) */}
      <div className="flex-1 overflow-y-auto flex flex-col px-6 py-12">
        <motion.div
          key={step}
          initial={panelInit}
          animate={panelShown}
          transition={panelT}
          className="w-full max-w-2xl mx-auto my-auto text-center"
        >
          {/* INTRO */}
          {step === 0 && (
            <>
              <FlamingoMark size={44} className="mx-auto mb-6" />
              <p className="eyebrow mb-6">{t('intro.eyebrow')}</p>
              <h2 className="display text-ink mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                {t('intro.title')}
              </h2>
              <p className="font-sans text-lg text-muted leading-relaxed mb-9 max-w-md mx-auto">
                {t('intro.subtitle')}
              </p>
              {/* WhatsApp manda: es la vía que el club quiere empujar. El
                  formulario queda como alternativa, un escalón por debajo. */}
              <div className="flex flex-col items-center gap-5">
                <a
                  href={waInterestHref(locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeFunnel}
                  className="btn-primary !px-10 !py-5 !text-[13px] inline-flex items-center gap-3"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.52 11.97c-.25-.12-1.47-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42l-.48-.01c-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
                  </svg>
                  {t('waNow')}
                </a>
                <button
                  onClick={() => setStep(1)}
                  className="font-sans text-[12px] font-semibold uppercase tracking-wide2 text-muted hover:text-ink transition-colors border-b border-transparent hover:border-ink/30 pb-1"
                >
                  {t('intro.start')}
                </button>
              </div>
            </>
          )}

          {/* NAME */}
          {step === 1 && (
            <>
              <h2 className="display text-ink mb-4" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)' }}>
                {t('name.title')}
              </h2>
              <p className="font-sans text-base text-muted mb-10">{t('name.subtitle')}</p>
              <input
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && nameValid && setStep(2)}
                placeholder={t('name.placeholder')}
                autoComplete="name"
                aria-label={t('name.placeholder')}
                className="w-full max-w-sm mx-auto block bg-transparent border-b border-line focus:border-sea outline-none text-center font-sans text-xl text-ink py-3 mb-10 transition-colors placeholder:text-muted/60"
              />
              <div className="flex flex-col items-center gap-5">
                <button
                  onClick={() => setStep(2)}
                  disabled={!nameValid}
                  className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t('name.continue')}
                </button>
                <button
                  onClick={() => setStep(0)}
                  className="font-sans text-[12px] font-semibold uppercase tracking-wide2 text-muted hover:text-ink transition-colors"
                >
                  {t('back')}
                </button>
              </div>
            </>
          )}

          {/* CLOSE — minimal, sin scroll: cita y canal en dos cajas compactas */}
          {step === 2 && (
            <>
              <p className="eyebrow mb-3">{t('result.eyebrow')}</p>
              <h2 className="display text-ink mb-8" style={{ fontSize: 'clamp(1.7rem, 3.6vw, 2.4rem)' }}>
                {t('result.title', { name: firstName })}
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 text-left max-w-2xl mx-auto">
                {/* Cita opcional */}
                <div className="border border-line bg-sand/50 px-5 py-5">
                  <p className="font-sans text-sm font-medium text-ink mb-4">{t('cita.title')}</p>
                  <div className="flex flex-wrap gap-2">
                    {dayOpts.map((d, i) => (
                      <button key={d} onClick={() => setDay(day === i ? null : i)} className={chip(day === i)} aria-pressed={day === i}>
                        {d}
                      </button>
                    ))}
                    {timeOpts.map((h, i) => (
                      <button key={h} onClick={() => setTime(time === i ? null : i)} className={chip(time === i)} aria-pressed={time === i}>
                        {h}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Canal de contacto */}
                <div className="border border-line px-5 py-5">
                  <p className="font-sans text-sm font-medium text-ink mb-4">{t('contact.title')}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(['whatsapp', 'email', 'phone'] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setChannel(c);
                          setSendError(false);
                        }}
                        className={chip(channel === c)}
                        aria-pressed={channel === c}
                      >
                        {t(`contact.${c}`)}
                      </button>
                    ))}
                  </div>

                  {channel === 'whatsapp' ? (
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeFunnel}
                      className="btn-primary !py-3 w-full inline-flex items-center justify-center gap-2"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.52 11.97c-.25-.12-1.47-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42l-.48-.01c-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
                      </svg>
                      {hasCita ? t('cita.cta') : t('result.whatsapp')}
                    </a>
                  ) : (
                    <form
                      className="flex flex-col gap-2.5"
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendLead();
                      }}
                    >
                      <HoneypotField ref={hpRef} />
                      <input
                        type={isEmail ? 'email' : 'tel'}
                        inputMode={isEmail ? 'email' : 'tel'}
                        autoComplete={isEmail ? 'email' : 'tel'}
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder={isEmail ? t('contact.emailPlaceholder') : t('contact.phonePlaceholder')}
                        aria-label={isEmail ? t('contact.emailPlaceholder') : t('contact.phonePlaceholder')}
                        className="w-full border border-line bg-white px-4 py-2.5 font-sans text-[14px] text-ink placeholder:text-muted/60 focus:outline-none focus:border-sea transition-colors"
                      />
                      <ConsentCheckbox checked={consent} onChange={setConsent} />
                      <button type="submit" disabled={!canSend} className="btn-primary !py-3 w-full disabled:opacity-40 disabled:cursor-not-allowed">
                        {sending ? t('contact.sending') : t('contact.send')}
                      </button>
                    </form>
                  )}
                  {sendError && (
                    <p aria-live="polite" className="font-sans text-xs text-sea mt-3">
                      {t('contact.error')}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-7">
                <Link
                  href={`/${locale}/precios`}
                  onClick={closeFunnel}
                  className="font-sans text-[12px] font-semibold uppercase tracking-wide2 text-muted hover:text-ink transition-colors"
                >
                  {t('result.allPlans')}
                </Link>
              </div>
            </>
          )}

          {/* ENVIADO — el club contacta al lead por el canal elegido */}
          {step === 3 && (
            <>
              <p className="eyebrow mb-4">{t('result.eyebrow')}</p>
              <h2 className="display text-ink mb-5" style={{ fontSize: 'clamp(1.9rem, 5vw, 2.9rem)' }}>
                {t('contact.sentTitle')}
              </h2>
              <p className="font-sans text-lg text-muted leading-relaxed mb-10 max-w-md mx-auto">
                {t('contact.sentBody')}
              </p>
              <div className="flex flex-col items-center gap-5">
                <button onClick={closeFunnel} className="btn-primary">
                  {t('contact.done')}
                </button>
                <Link
                  href={`/${locale}/precios`}
                  onClick={closeFunnel}
                  className="font-sans text-[12px] font-semibold uppercase tracking-wide2 text-muted hover:text-ink transition-colors"
                >
                  {t('result.allPlans')}
                </Link>
              </div>
            </>
          )}

          {/* Atajo en el paso del nombre: la intro ya lleva WhatsApp como CTA
              principal y el cierre tiene el suyo propio. */}
          {step === 1 && (
            <div className="mt-7">
            <a
              href={waInterestHref(locale)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeFunnel}
              className="inline-flex items-center gap-2 font-sans text-[12px] font-semibold uppercase tracking-wide2 text-sea hover:text-ink transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.52 11.97c-.25-.12-1.47-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42l-.48-.01c-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
              </svg>
              {t('waNow')}
            </a>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
