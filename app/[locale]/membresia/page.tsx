import Link from 'next/link';
import { useTranslations } from 'next-intl';
import PageHero from '@/components/PageHero';
import ScrollReveal from '@/components/ScrollReveal';
import ParallaxImage from '@/components/ParallaxImage';
import MembershipTiers from '@/components/MembershipTiers';
import Faq from '@/components/Faq';

export default function MembresiaPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('membership');
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL ?? `/${locale}/contacto`;

  const benefits = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'] as const;

  return (
    <>
      <PageHero
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        image="/images/membership.jpg"
      />

      {/* How it works + benefits */}
      <section className="py-20 md:py-28 bg-bone">
        <div className="max-w-[1480px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
            <ScrollReveal>
              <div className="lg:sticky lg:top-32">
                <p className="eyebrow mb-6">{t('how.eyebrow')}</p>
                <h2 className="display text-ink mb-7" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                  {t('how.title')}
                </h2>
                <p className="font-sans text-lg text-muted leading-relaxed mb-10 max-w-md">
                  {t('how.description')}
                </p>
                <Link href={bookingUrl} className="btn-primary">{t('cta')}</Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div>
                <p className="eyebrow mb-8">{t('benefits.title')}</p>
                <ul>
                  {benefits.map((key) => (
                    <li key={key} className="flex items-center gap-4 border-b border-line py-5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sea flex-none" />
                      <span className="font-sans text-lg text-ink">{t(`benefits.${key}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Membership tiers with pricing */}
      <MembershipTiers locale={locale} />

      {/* FAQ */}
      <Faq locale={locale} />

      {/* Plans / closing CTA */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <ParallaxImage src="/images/cta.jpg" alt="" sizes="100vw" strength={70} kenBurns className="absolute inset-0" />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="relative max-w-[1480px] mx-auto px-6 md:px-10 text-center">
          <ScrollReveal>
            <p className="font-sans text-[11px] font-semibold tracking-eyebrow uppercase text-white/80 mb-6">
              {t('plans.eyebrow')}
            </p>
            <h2 className="display text-white mb-7" style={{ fontSize: 'clamp(2rem, 4.5vw, 4rem)' }}>
              {t('plans.title')}
            </h2>
            <p className="font-sans text-lg text-white/70 max-w-lg mx-auto leading-relaxed mb-10">
              {t('plans.contact')}
            </p>
            <Link
              href={bookingUrl}
              className="inline-flex items-center justify-center font-sans text-[12px] font-semibold uppercase tracking-wide2 bg-bone text-ink px-12 py-5 hover:bg-sea hover:text-white transition-colors duration-300"
            >
              {t('cta')}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
