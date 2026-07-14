'use client';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFleet } from '@/lib/localize';
import FleetCard from './FleetCard';

interface FleetGridProps {
  locale: string;
  capacityLabel: string;
  lengthLabel: string;
}

type Cat = 'all' | 'day' | 'sport' | 'yacht';

function categoryOf(lengthM: string): Exclude<Cat, 'all'> {
  const m = parseFloat(lengthM);
  if (m < 12) return 'day';
  if (m <= 16) return 'sport';
  return 'yacht';
}

export default function FleetGrid({ locale, capacityLabel, lengthLabel }: FleetGridProps) {
  const [cat, setCat] = useState<Cat>('all');
  const fleet = useMemo(() => getFleet(locale), [locale]);

  const allLabel: Record<string, string> = { es: 'Toda la flota', en: 'Full fleet', sv: 'Hela flottan', ru: 'Весь флот', de: 'Gesamte Flotte', fr: 'Toute la flotte' };
  const yachtLabel: Record<string, string> = { es: 'Yates', en: 'Yachts', sv: 'Yachter', ru: 'Яхты', de: 'Yachten', fr: 'Yachts' };
  const filters: { id: Cat; label: string }[] = [
    { id: 'all', label: allLabel[locale] ?? allLabel.en },
    { id: 'day', label: 'Day boats' },
    { id: 'sport', label: 'Sport' },
    { id: 'yacht', label: yachtLabel[locale] ?? yachtLabel.en },
  ];

  const visible = useMemo(
    () => (cat === 'all' ? fleet : fleet.filter((b) => categoryOf(b.lengthM) === cat)),
    [cat, fleet]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-x-8 gap-y-3 mb-12">
        {filters.map((f) => {
          const active = cat === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setCat(f.id)}
              aria-pressed={active}
              className={`font-sans text-[11px] font-semibold uppercase tracking-wide2 pb-2 border-b transition-colors ${
                active ? 'text-ink border-ink' : 'text-muted border-transparent hover:text-ink'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        <AnimatePresence mode="popLayout">
          {visible.map((boat) => (
            <motion.div
              key={boat.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <FleetCard boat={boat} locale={locale} capacityLabel={capacityLabel} lengthLabel={lengthLabel} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
