'use client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getActiveFleet } from '@/lib/localize';
import ParallaxImage from './ParallaxImage';
import ScrollReveal from './ScrollReveal';

/* Presentación editorial de la flota: una pieza a gran formato por barco, con
   la foto real (deriva parallax con el scroll normal, sin secuestrarlo),
   numeración, specs y CTA. Sustituye al antiguo visor 3D de scroll orbital. */
export default function FleetShowcase({ locale }: { locale: string }) {
  const fleet = getActiveFleet(locale);
  const t = useTranslations('boatDetail');
  const tf = useTranslations('fleet');

  return (
    <section className="bg-bone">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        {fleet.map((boat, i) => {
          const even = i % 2 === 0;
          const specs = [
            { label: t('length'), value: boat.specs.length },
            { label: t('beam'), value: boat.specs.beam },
            { label: t('maxSpeed'), value: boat.specs.maxSpeed },
            { label: t('engines'), value: boat.specs.engines },
            { label: t('capacity'), value: `${boat.capacity} ${tf('capacity')}` },
          ].filter((s): s is { label: string; value: string } => Boolean(s.value));

          return (
            <article
              key={boat.slug}
              className={`grid lg:grid-cols-12 gap-10 lg:gap-16 items-end py-16 md:py-24 ${i > 0 ? 'border-t border-line' : ''}`}
            >
              {/* Foto */}
              <ScrollReveal className={`lg:col-span-7 ${even ? '' : 'lg:order-2'}`}>
                <Link
                  href={`/${locale}/flota/${boat.slug}`}
                  aria-label={boat.name}
                  className="block relative overflow-hidden aspect-[4/3] md:aspect-[16/10] bg-sand"
                >
                  {/* alt vacío: el Link ya se anuncia con aria-label={boat.name} */}
                  <ParallaxImage
                    src={boat.image}
                    alt=""
                    strength={36}
                    priority={i === 0}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="absolute inset-0"
                  />
                </Link>
              </ScrollReveal>

              {/* Ficha */}
              <div className={`lg:col-span-5 ${even ? '' : 'lg:order-1'}`}>
                <ScrollReveal delay={0.1}>
                  <span
                    aria-hidden
                    className="display-num block text-sand-2 select-none mb-4"
                    style={{ fontSize: 'clamp(3.5rem, 7vw, 6rem)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="eyebrow mb-4">{boat.tagline}</p>
                  <h2 className="display text-ink" style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}>
                    {boat.name}
                  </h2>
                  <p className="font-sans text-base text-muted leading-relaxed mt-6 line-clamp-4">
                    {boat.description}
                  </p>

                  <dl className="grid grid-cols-1 xs:grid-cols-2 gap-x-6 mt-10">
                    {specs.map((s, j) => (
                      <div
                        key={s.label}
                        className={`border-t border-line py-3.5 ${
                          specs.length % 2 === 1 && j === specs.length - 1 ? 'xs:col-span-2' : ''
                        }`}
                      >
                        <dt className="eyebrow mb-1 break-words">{s.label}</dt>
                        <dd className="font-sans text-lg font-light text-ink">{s.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <Link
                    href={`/${locale}/flota/${boat.slug}`}
                    aria-label={`${tf('viewDetails')} — ${boat.name}`}
                    className="btn-outline mt-10"
                  >
                    {tf('viewDetails')}
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
