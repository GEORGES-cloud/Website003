'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CONSENT_EVENT, hasAcceptedCookies } from '@/lib/consent';

/* El iframe de Google Maps planta cookies de Google en cuanto carga, así que
   solo se monta si el visitante aceptó las cookies en el banner — o si pulsa
   "Cargar mapa" expresamente (válido solo para esa visita). Antes cargaba
   siempre, con el consentimiento rechazado incluido. */
export default function ConsentAwareMap({ src, title }: { src: string; title: string }) {
  const t = useTranslations('map');
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(hasAcceptedCookies());
    const onDecision = () => setAllowed((a) => a || hasAcceptedCookies());
    window.addEventListener(CONSENT_EVENT, onDecision);
    return () => window.removeEventListener(CONSENT_EVENT, onDecision);
  }, []);

  if (allowed) {
    return (
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full border-0"
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-sand px-6 text-center">
      <button onClick={() => setAllowed(true)} className="btn-primary">
        {t('load')}
      </button>
      <p className="font-sans text-xs text-muted max-w-xs leading-relaxed">{t('note')}</p>
    </div>
  );
}
