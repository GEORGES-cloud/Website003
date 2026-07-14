import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ACTIVE_BOAT_SLUGS } from '@/lib/data';
import { getBoat } from '@/lib/localize';
import PageHero from '@/components/PageHero';
import ScrollReveal from '@/components/ScrollReveal';
import BoatGallery from '@/components/BoatGallery';

interface Props {
  params: { locale: string; slug: string };
}

// Only the active boat(s) are reachable; hidden slugs 404 instead of rendering.
export const dynamicParams = false;

export function generateStaticParams() {
  return ACTIVE_BOAT_SLUGS.map((slug) => ({ slug }));
}

export default function BoatDetailPage({ params: { locale, slug } }: Props) {
  // Runtime guard: only active boats are reachable. `dynamicParams=false` covers
  // this for static generation, but the boat data for hidden slugs still exists,
  // so a dynamically-rendered request would otherwise render them — 404 explicitly.
  const boat = ACTIVE_BOAT_SLUGS.includes(slug) ? getBoat(locale, slug) : null;
  if (!boat) notFound();

  const t = useTranslations('boatDetail');
  const appStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL ?? '#';
  const playStoreUrl = process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? '#';
  const guests: Record<string, string> = { es: 'personas', en: 'guests', sv: 'gäster', ru: 'гостей', de: 'Gäste', fr: 'invités' };
  const guestsLabel = guests[locale] ?? guests.en;

  return (
    <>
      {/* Hero — shared PageHero (kenburns, svh heights, header offset) */}
      <PageHero eyebrow={`${boat.lengthM} · ${boat.capacity} ${guestsLabel}`} title={boat.name} image={boat.image} />

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
                    <Link href={appStoreUrl} className="link-underline">App Store</Link>
                    <Link href={playStoreUrl} className="link-underline">Google Play</Link>
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
                    boat.specs.beam && { label: 'Manga / Beam', value: boat.specs.beam },
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

          <div className="mt-20">
            <ScrollReveal>
              <p className="eyebrow mb-8">{({ es: 'Galería', en: 'Gallery', sv: 'Galleri', ru: 'Галерея', de: 'Galerie', fr: 'Galerie' } as Record<string, string>)[locale] ?? 'Gallery'}</p>
              {/* TODO(content): stock placeholders shared by every boat — swap for real per-boat photography when the client provides it */}
              <BoatGallery
                images={[boat.image, '/images/life-4.jpg', '/images/membership.jpg', '/images/life-3.jpg', '/images/exp-sunset.jpg']}
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
