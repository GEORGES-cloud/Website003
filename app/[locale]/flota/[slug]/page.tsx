import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getBoat, getActiveBoatSlugs } from '@/lib/localize';
import PageHero from '@/components/PageHero';
import ScrollReveal from '@/components/ScrollReveal';
import BoatGallery from '@/components/BoatGallery';
import { appStoreUrl, playStoreUrl } from '@/lib/appLinks';

interface Props {
  params: { locale: string; slug: string };
}

/* dynamicParams abierto: las fichas de barcos que no se prerrenderizan (los
   inactivos de lib/data.ts) se resuelven bajo demanda. Los slugs inactivos o
   inexistentes siguen cayendo en 404 (guard de abajo). */
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getActiveBoatSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
  const boat = await getBoat(locale, slug);
  if (!boat || !boat.active) return {};
  // Meta description: tagline + descripción, recortada en un espacio antes de ~160 chars.
  const raw = `${boat.tagline} ${boat.description}`;
  const description = raw.length > 160 ? `${raw.slice(0, raw.lastIndexOf(' ', 157))}…` : raw;
  return { title: `${boat.name} — ${boat.lengthM}`, description };
}

export default async function BoatDetailPage({ params: { locale, slug } }: Props) {
  // Solo los barcos activos son accesibles: los ocultos existen en los datos
  // pero su ficha responde 404.
  const boat = await getBoat(locale, slug);
  if (!boat || !boat.active) notFound();

  const t = await getTranslations({ locale, namespace: 'boatDetail' });
  const guests: Record<string, string> = { es: 'personas', en: 'guests', sv: 'gäster', ru: 'гостей', de: 'Gäste', fr: 'invités' };
  const guestsLabel = guests[locale] ?? guests.en;

  return (
    <>
      {/* Hero — foto propia de ficha si existe (heroImage), si no la de catálogo */}
      <PageHero eyebrow={`${boat.lengthM} · ${boat.capacity} ${guestsLabel}`} title={boat.name} image={boat.heroImage ?? boat.image} />

      {/* Content */}
      <section className="py-24 md:py-36 bg-bone">
        <div className="max-w-[1480px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
            {/* Description */}
            <ScrollReveal>
              <div>
                <p className="display text-2xl md:text-3xl text-ink leading-snug mb-8">
                  &ldquo;{boat.tagline}&rdquo;
                </p>
                <p className="font-sans text-lg text-muted leading-relaxed">{boat.description}</p>
                {/* Booking happens in the club app, not on the web */}
                <div className="mt-12">
                  <p className="eyebrow mb-5">{t('book')}</p>
                  <div className="flex flex-wrap gap-x-8 gap-y-3">
                    <Link href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="link-underline">App Store</Link>
                    <Link href={playStoreUrl} target="_blank" rel="noopener noreferrer" className="link-underline">Google Play</Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Specs */}
            <ScrollReveal delay={0.15}>
              <div className="bg-sand p-8 md:p-10">
                <p className="eyebrow mb-8">{t('specs')}</p>
                <dl className="space-y-5">
                  {[
                    { label: t('length'), value: boat.specs.length },
                    boat.specs.beam && { label: t('beam'), value: boat.specs.beam },
                    boat.specs.maxSpeed && { label: t('maxSpeed'), value: boat.specs.maxSpeed },
                    boat.specs.engines && { label: t('engines'), value: boat.specs.engines },
                    { label: t('capacity'), value: `${boat.capacity} ${guestsLabel}` },
                  ]
                    .filter(Boolean)
                    .map((item) => (
                      <div
                        key={(item as { label: string }).label}
                        className="flex justify-between items-baseline border-b border-line pb-5"
                      >
                        <dt className="font-sans text-sm text-muted">{(item as { label: string }).label}</dt>
                        <dd className="font-sans text-lg font-medium text-ink">{(item as { value: string }).value}</dd>
                      </div>
                    ))}
                </dl>
              </div>
            </ScrollReveal>
          </div>

          {/* Vídeo oficial — banda cinematográfica (solo barcos con metraje propio) */}
          {boat.video && (
            <div className="mt-20">
              <ScrollReveal>
                <p className="eyebrow mb-8">{({ es: 'En el agua', en: 'On the water', sv: 'På vattnet', ru: 'На воде', de: 'Auf dem Wasser', fr: "Sur l'eau" } as Record<string, string>)[locale] ?? 'On the water'}</p>
                <div className="relative aspect-video overflow-hidden bg-ink">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-hidden
                    preload="metadata"
                    poster={boat.videoPoster}
                    className="absolute inset-0 h-full w-full object-cover"
                  >
                    <source src={boat.video} type="video/mp4" />
                  </video>
                </div>
              </ScrollReveal>
            </div>
          )}

          <div className="mt-20">
            <ScrollReveal>
              <p className="eyebrow mb-8">{({ es: 'Galería', en: 'Gallery', sv: 'Galleri', ru: 'Галерея', de: 'Galerie', fr: 'Galerie' } as Record<string, string>)[locale] ?? 'Gallery'}</p>
              <BoatGallery
                images={boat.gallery ?? [boat.image]}
                alts={boat.galleryAlts}
                name={boat.name}
              />
            </ScrollReveal>
          </div>

          <div className="mt-16">
            <Link
              href={`/${locale}/flota`}
              className="font-sans text-[12px] font-semibold tracking-wide2 uppercase text-muted hover:text-sea transition-colors"
            >
              {t('backToFleet')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
