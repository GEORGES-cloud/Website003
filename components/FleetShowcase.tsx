'use client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getActiveFleet } from '@/lib/localize';
import ParallaxImage from './ParallaxImage';
import ScrollReveal from './ScrollReveal';
import ImageReveal from './ImageReveal';

/* Presentación editorial de la flota: una pieza a gran formato por barco.
   La foto entra con cortina (ImageReveal) y responde al hover con un zoom
   lentísimo; la ficha se coreografía en tres tiempos (cabecera → datos → CTA).
   El modelo corto protagoniza la tipografía (patrón range-page De Antonio). */
export default function FleetShowcase({ locale }: { locale: string }) {
  const fleet = getActiveFleet(locale);
  const t = useTranslations('boatDetail');
  const tf = useTranslations('fleet');
  const total = String(fleet.length).padStart(2, '0');

  return (
    <section className="py-4 md:py-8 bg-bone">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        {fleet.map((boat, i) => {
          const even = i % 2 === 0;
          // Solo las cifras clave; la motorización vive en la ficha completa
          const specs = [
            { label: t('length'), value: boat.specs.length },
            { label: t('beam'), value: boat.specs.beam },
            { label: t('maxSpeed'), value: boat.specs.maxSpeed },
            { label: t('capacity'), value: String(boat.capacity) },
          ].filter((s): s is { label: string; value: string } => Boolean(s.value));

          return (
            <article
              key={boat.slug}
              className={`grid lg:grid-cols-12 gap-10 lg:gap-x-20 items-end py-20 md:py-28 xl:py-36 ${i > 0 ? 'border-t border-line' : ''}`}
            >
              {/* Foto — cortina de entrada + zoom lento al hover */}
              <ImageReveal className={`lg:col-span-7 ${even ? '' : 'lg:order-2'}`}>
                <Link
                  href={`/${locale}/flota/${boat.slug}`}
                  aria-label={boat.name}
                  className="group block relative overflow-hidden aspect-[4/3] md:aspect-[16/10] bg-sand"
                >
                  <div className="absolute inset-0 transition-transform duration-[1400ms] ease-smooth group-hover:scale-[1.035] will-change-transform">
                    {/* alt vacío: el Link ya se anuncia con aria-label={boat.name} */}
                    <ParallaxImage
                      src={boat.image}
                      alt=""
                      strength={36}
                      priority={i === 0}
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="absolute inset-0"
                    />
                  </div>
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-ink/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <span
                    aria-hidden
                    className="absolute bottom-6 left-6 eyebrow-invert translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-smooth"
                  >
                    {tf('viewDetails')}
                  </span>
                </Link>
              </ImageReveal>

              {/* Ficha — coreografía en tres tiempos */}
              <div className={`lg:col-span-5 ${even ? '' : 'lg:order-1'}`}>
                <ScrollReveal delay={0.05}>
                  <div className="flex items-center gap-4 mb-5">
                    <span aria-hidden className="display-num text-[13px] text-ink">
                      {String(i + 1).padStart(2, '0')} <span className="text-ink/35">/ {total}</span>
                    </span>
                    <span aria-hidden className="h-px w-12 bg-ink/25" />
                    <p className="eyebrow !text-ink/55">{boat.name}</p>
                  </div>
                  <h2 className="display text-ink" style={{ fontSize: 'clamp(2.75rem, 5.2vw, 4.6rem)' }}>
                    {boat.shortName ?? boat.name}
                  </h2>
                  <p className="font-sans text-lg font-extralight text-ink/75 leading-snug mt-5">{boat.tagline}</p>
                </ScrollReveal>

                <ScrollReveal delay={0.15}>
                  <p className="font-sans text-[15px] text-muted leading-[1.8] mt-6 max-w-[46ch] line-clamp-3">
                    {boat.description}
                  </p>

                  {/* Regla de cifras: valor primero, hairlines verticales en md+ */}
                  <dl className="mt-12 border-t border-line grid grid-cols-2 md:flex md:divide-x md:divide-line">
                    {specs.map((s) => (
                      <div
                        key={s.label}
                        className="flex flex-col-reverse gap-1 py-5 pr-5 md:px-6 md:first:pl-0 md:flex-1 border-b border-line md:border-b-0"
                      >
                        <dt className="eyebrow !text-[9px] !text-ink/45">{s.label}</dt>
                        <dd className="display text-xl md:text-[1.6rem] text-ink whitespace-nowrap">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </ScrollReveal>

                <ScrollReveal delay={0.25}>
                  <Link
                    href={`/${locale}/flota/${boat.slug}`}
                    aria-label={`${tf('viewDetails')} — ${boat.name}`}
                    className="group/cta inline-flex items-center gap-3 font-sans text-[12px] font-semibold uppercase tracking-wide2 text-ink mt-12"
                  >
                    <span className="border-b border-ink/30 pb-1 transition-colors duration-300 group-hover/cta:border-ink">
                      {tf('viewDetails')}
                    </span>
                    <svg
                      width="18"
                      height="10"
                      viewBox="0 0 18 10"
                      fill="none"
                      aria-hidden
                      className="transition-transform duration-500 ease-smooth group-hover/cta:translate-x-1.5"
                    >
                      <path d="M12.5 1 17 5l-4.5 4M0 5h17" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  </Link>
                </ScrollReveal>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
