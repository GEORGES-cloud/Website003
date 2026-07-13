import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getTiers } from '@/lib/localize';
import ScrollReveal from './ScrollReveal';

export default function MembershipTiers({ locale }: { locale: string }) {
  const t = useTranslations('membership.tiers');
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL ?? `/${locale}/contacto`;
  const tiers = getTiers(locale);

  return (
    <section className="py-20 md:py-28 bg-sand">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-16">
          <ScrollReveal>
            <p className="eyebrow mb-5">{t('eyebrow')}</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="display text-ink" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.75rem)' }}>
              {t('title')}
            </h2>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {tiers.map((tier, i) => {
            const featured = tier.featured;
            const features = tier.features;
            const numeric = /^[\d.]+$/.test(tier.price);
            return (
              <ScrollReveal key={tier.id} delay={i * 0.1} zoom>
                <div
                  className={`relative h-full flex flex-col p-8 lg:p-10 rounded-3xl border transition-colors ${
                    featured ? 'bg-ink text-white border-ink shadow-2xl md:-translate-y-3' : 'bg-bone text-ink border-line'
                  }`}
                >
                  {featured && (
                    <span className="absolute top-6 right-6 font-sans text-[10px] font-semibold uppercase tracking-wide2 text-sea-light">
                      {t('popular')}
                    </span>
                  )}
                  <h3 className="font-sans text-2xl font-medium mb-2">{tier.name}</h3>
                  <p className={`font-sans text-sm mb-7 ${featured ? 'text-white/60' : 'text-muted'}`}>
                    {tier.tagline}
                  </p>

                  <div className="mb-8">
                    {numeric ? (
                      <>
                        <span className={`font-sans text-[11px] uppercase tracking-wide2 ${featured ? 'text-white/50' : 'text-muted'}`}>
                          {t('from')}
                        </span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="font-sans text-4xl font-light tracking-tight">{tier.price}€</span>
                          <span className={`font-sans text-sm ${featured ? 'text-white/50' : 'text-muted'}`}>
                            {tier.period}
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className="font-sans text-4xl font-light tracking-tight">{tier.price}</span>
                    )}
                  </div>

                  <ul className="space-y-3.5 mb-10 flex-1">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <span
                          className={`mt-[7px] w-1.5 h-1.5 rounded-full flex-none ${featured ? 'bg-sea-light' : 'bg-sea'}`}
                        />
                        <span className={`font-sans text-[15px] leading-snug ${featured ? 'text-white/85' : 'text-ink/80'}`}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={bookingUrl}
                    className={`font-sans text-[12px] font-semibold uppercase tracking-wide2 text-center px-8 py-4 transition-colors duration-300 ${
                      featured
                        ? 'bg-white text-ink hover:bg-sea-light'
                        : 'bg-ink text-white hover:bg-sea'
                    }`}
                  >
                    {t('cta')}
                  </Link>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <p className="text-center font-sans text-sm text-muted mt-10">{t('note')}</p>
      </div>
    </section>
  );
}
