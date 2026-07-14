'use client';

/**
 * VirtualTour360 — visor 360° real del barco (escaneo del partner 3d-boats).
 * Patrón click-to-load, igual que el embed oficial del partner: hasta que el
 * usuario pulsa Play no se hace NINGUNA petición a terceros (privacidad + LCP).
 * Al pulsar, se monta el iframe del visor (misma URL y attrs que usa su web).
 */

import Image from 'next/image';
import { useState } from 'react';

const L: Record<string, Record<string, string>> = {
  eyebrow: {
    es: 'Visita virtual · 360°',
    en: 'Virtual tour · 360°',
    sv: 'Virtuell rundtur · 360°',
    ru: 'Виртуальный тур · 360°',
    de: 'Virtueller Rundgang · 360°',
    fr: 'Visite virtuelle · 360°',
  },
  cta: {
    es: 'Iniciar visita',
    en: 'Start tour',
    sv: 'Starta rundtur',
    ru: 'Начать тур',
    de: 'Rundgang starten',
    fr: 'Lancer la visite',
  },
  hint: {
    es: 'Explora el barco real, escaneado en 3D',
    en: 'Explore the real boat, scanned in 3D',
    sv: 'Utforska den riktiga båten, 3D-skannad',
    ru: 'Осмотрите настоящую лодку в 3D',
    de: 'Erkunden Sie das echte Boot, 3D-gescannt',
    fr: 'Explorez le vrai bateau, scanné en 3D',
  },
};

interface VirtualTour360Props {
  url: string;
  title: string;
  poster: string;
  locale: string;
}

export default function VirtualTour360({ url, title, poster, locale }: VirtualTour360Props) {
  const [started, setStarted] = useState(false);
  const tt = (k: string) => L[k]?.[locale] ?? L[k]?.en ?? '';

  return (
    <div className="relative h-[75svh] min-h-[480px] w-full overflow-hidden bg-ink">
      {started ? (
        <iframe
          src={url}
          title={`${tt('eyebrow')} — ${title}`}
          allow="xr-spatial-tracking; fullscreen; accelerometer; gyroscope"
          allowFullScreen
          className="h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setStarted(true)}
          aria-label={`${tt('cta')} — ${title}`}
          className="group relative block h-full w-full text-left"
        >
          <Image
            src={poster}
            alt={title}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-ink/30" />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center">
            {/* Aro de play — esquinas rectas fuera, aro fino dentro (política de radios) */}
            <span className="flex h-20 w-20 items-center justify-center border border-white/40 transition-colors duration-300 group-hover:border-white group-hover:bg-white/10">
              <svg width="22" height="26" viewBox="0 0 22 26" aria-hidden className="translate-x-[2px] fill-white">
                <path d="M0 0 L22 13 L0 26 Z" />
              </svg>
            </span>
            <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-white">
              {tt('cta')}
            </span>
            <span className="font-sans text-sm text-white/70">{tt('hint')}</span>
          </div>
        </button>
      )}
    </div>
  );
}
