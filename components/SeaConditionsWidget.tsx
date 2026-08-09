'use client';
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { SeaConditions } from '@/lib/marine';
import { compassPoint, beaufort } from '@/lib/marine';

const EASE = [0.22, 1, 0.36, 1] as const;

const T: Record<string, Record<string, string>> = {
  es: { title: 'Puerto Banús ahora', wind: 'Viento', gust: 'Racha', wave: 'Ola', air: 'Aire', sea: 'Agua', force: 'Fuerza', open: 'Ver condiciones de mar', close: 'Cerrar' },
  en: { title: 'Puerto Banús now', wind: 'Wind', gust: 'Gusts', wave: 'Swell', air: 'Air', sea: 'Water', force: 'Force', open: 'See sea conditions', close: 'Close' },
  sv: { title: 'Puerto Banús nu', wind: 'Vind', gust: 'Byar', wave: 'Våg', air: 'Luft', sea: 'Vatten', force: 'Styrka', open: 'Se sjöförhållanden', close: 'Stäng' },
  ru: { title: 'Пуэрто-Банус сейчас', wind: 'Ветер', gust: 'Порывы', wave: 'Волна', air: 'Воздух', sea: 'Вода', force: 'Сила', open: 'Условия на море', close: 'Закрыть' },
  de: { title: 'Puerto Banús jetzt', wind: 'Wind', gust: 'Böen', wave: 'Welle', air: 'Luft', sea: 'Wasser', force: 'Stärke', open: 'Seebedingungen ansehen', close: 'Schließen' },
  fr: { title: 'Puerto Banús maintenant', wind: 'Vent', gust: 'Rafales', wave: 'Houle', air: 'Air', sea: 'Eau', force: 'Force', open: 'Voir les conditions', close: 'Fermer' },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-t border-white/12 pt-2.5">
      <span className="font-sans text-[10px] font-semibold uppercase tracking-eyebrow text-white/45">{label}</span>
      <span className="display-num text-[15px] text-white tabular-nums">{value}</span>
    </div>
  );
}

/* Gadget flotante de condiciones de mar. Cerrado es una píldora con el viento
   y una aguja apuntando a su procedencia; abierto despliega racha, ola y
   temperaturas. Monocromo, abajo a la izquierda para no pelearse con el botón
   de WhatsApp, y por debajo del aviso de cookies en la pila de capas. */
export default function SeaConditionsWidget({
  data,
  locale,
}: {
  data: SeaConditions;
  locale: string;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const t = T[locale] ?? T.en;
  const dir = compassPoint(data.windDeg, locale);
  const bft = beaufort(data.windKn);

  return (
    <div className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-5 z-[70] print:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.42, ease: EASE }}
            className="absolute bottom-full left-0 mb-3 w-[248px] origin-bottom-left bg-ink/95 backdrop-blur-md border border-white/12 px-5 py-4"
          >
            <p className="font-sans text-[10px] font-semibold uppercase tracking-eyebrow text-white/45 mb-4">
              {t.title}
            </p>
            <div className="space-y-2.5">
              <Row label={t.wind} value={`${data.windKn} kn ${dir}`} />
              {data.gustKn !== null && <Row label={t.gust} value={`${data.gustKn} kn`} />}
              {data.waveM !== null && <Row label={t.wave} value={`${data.waveM.toFixed(1)} m`} />}
              <Row label={t.air} value={`${data.airC}°`} />
              {data.seaC !== null && <Row label={t.sea} value={`${data.seaC}°`} />}
              <Row label={t.force} value={`${bft} Bft`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? t.close : t.open}
        className="flex items-center gap-2.5 bg-ink text-white pl-3 pr-4 py-2.5 rounded-full border border-white/15 hover:bg-sea transition-colors duration-300"
      >
        {/* Aguja: apunta hacia donde va el viento (procedencia + 180°) */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          aria-hidden
          className="flex-none"
          style={{ transform: `rotate(${data.windDeg + 180}deg)` }}
        >
          <path d="M8 1.5 L11.4 13 L8 10.4 L4.6 13 Z" fill="currentColor" />
        </svg>
        <span className="display-num text-[12px] tabular-nums">{data.windKn}</span>
        <span className="font-sans text-[10px] font-semibold uppercase tracking-wide2 text-white/70 -ml-1">
          {`kn · ${dir}`}
        </span>
      </button>
    </div>
  );
}
