'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getActiveFleet } from '@/lib/localize';
import ScrollReveal from './ScrollReveal';

interface FleetPreviewSectionProps {
  eyebrow: string;
  title: string;
  viewAll: string;
  locale: string;
}

export default function FleetPreviewSection({ eyebrow, title, viewAll, locale }: FleetPreviewSectionProps) {
  const preview = getActiveFleet(locale);

  return (
    <section className="py-24 md:py-36 bg-bone overflow-hidden">
      {/* Header */}
      <div className="max-w-[1480px] mx-auto px-6 md:px-10 mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <ScrollReveal>
            <p className="eyebrow mb-4">{eyebrow}</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="display text-ink" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 4rem)' }}>
              {title}
            </h2>
          </ScrollReveal>
        </div>
        <ScrollReveal delay={0.15}>
          <Link href={`/${locale}/flota`} className="link-underline hidden md:inline-flex">
            {viewAll}
          </Link>
        </ScrollReveal>
      </div>

      {/* Horizontal scroll */}
      <div className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pl-6 md:pl-10 pr-6 md:pr-10 pb-4">
        {preview.map((boat, i) => (
          <motion.div
            key={boat.slug}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: '-50px' }}
            className="flex-none w-[290px] md:w-[380px] snap-start"
          >
            <Link href={`/${locale}/flota/${boat.slug}`} className="group block">
              <div className="relative overflow-hidden aspect-[3/4]">
                <Image
                  src={boat.image}
                  alt={boat.name}
                  fill
                  sizes="380px"
                  className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/5 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="font-sans text-[10px] font-semibold tracking-wide2 uppercase text-white/80 mb-2">
                    {boat.lengthM} · {boat.capacity} {({ es: 'pers.', en: 'guests', sv: 'gäster', ru: 'гостей', de: 'Gäste', fr: 'invités' } as Record<string, string>)[locale] ?? 'guests'}
                  </p>
                  <h3 className="font-sans text-xl font-medium text-white leading-snug">{boat.name}</h3>
                  <p className="font-sans text-sm text-white/65 mt-1">{boat.tagline}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* View all (mobile) */}
      <div className="max-w-[1480px] mx-auto px-6 md:px-10 mt-10 md:hidden">
        <Link href={`/${locale}/flota`} className="link-underline">
          {viewAll}
        </Link>
      </div>
    </section>
  );
}
