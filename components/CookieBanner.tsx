'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

const KEY = 'navigante-cookie-consent';

export default function CookieBanner({ locale }: { locale: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const decide = (value: 'accepted' | 'rejected') => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  const TEXTS: Record<string, { text: string; more: string; accept: string; reject: string }> = {
    es: { text: 'Usamos cookies propias y de terceros para mejorar tu experiencia. Puedes aceptarlas o rechazar las no esenciales.', more: 'Política de privacidad', accept: 'Aceptar', reject: 'Rechazar' },
    en: { text: 'We use our own and third-party cookies to improve your experience. You can accept them or reject non-essential ones.', more: 'Privacy policy', accept: 'Accept', reject: 'Reject' },
    sv: { text: 'Vi använder egna och tredjepartscookies för att förbättra din upplevelse. Du kan acceptera dem eller avvisa icke-nödvändiga.', more: 'Integritetspolicy', accept: 'Acceptera', reject: 'Avvisa' },
    ru: { text: 'Мы используем собственные и сторонние файлы cookie, чтобы улучшить ваш опыт. Вы можете принять их или отклонить необязательные.', more: 'Политика конфиденциальности', accept: 'Принять', reject: 'Отклонить' },
    de: { text: 'Wir verwenden eigene und Cookies von Drittanbietern, um Ihr Erlebnis zu verbessern. Sie können sie akzeptieren oder nicht notwendige ablehnen.', more: 'Datenschutzrichtlinie', accept: 'Akzeptieren', reject: 'Ablehnen' },
    fr: { text: 'Nous utilisons des cookies propres et tiers pour améliorer votre expérience. Vous pouvez les accepter ou refuser les non essentiels.', more: 'Politique de confidentialité', accept: 'Accepter', reject: 'Refuser' },
  };
  const t = TEXTS[locale] ?? TEXTS.en;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-label="Cookies"
          className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-[90] bg-ink text-white p-6 md:p-7 border border-white/15"
        >
          <p className="font-sans text-sm text-white/80 leading-relaxed">
            {t.text}{' '}
            <Link href={`/${locale}/privacidad`} className="underline underline-offset-2 hover:text-white">
              {t.more}
            </Link>
            .
          </p>
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => decide('accepted')}
              className="font-sans text-[11px] font-semibold uppercase tracking-wide2 bg-white text-ink px-6 py-3 hover:bg-sea-light transition-colors"
            >
              {t.accept}
            </button>
            <button
              onClick={() => decide('rejected')}
              className="font-sans text-[11px] font-semibold uppercase tracking-wide2 border border-white/30 text-white/80 px-6 py-3 hover:border-white hover:text-white transition-colors"
            >
              {t.reject}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
