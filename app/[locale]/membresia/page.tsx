import { useTranslations } from 'next-intl';
import PageHero from '@/components/PageHero';
import JoinCTA from '@/components/JoinCTA';
import ScrollReveal from '@/components/ScrollReveal';
import MembershipTiers from '@/components/MembershipTiers';
import Faq from '@/components/Faq';
import CTAFinal from '@/components/CTAFinal';

export default function MembresiaPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('membership');

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
      <section className="py-24 md:py-36 bg-bone">
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
                <JoinCTA className="btn-primary">{t('cta')}</JoinCTA>
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
      <CTAFinal
        eyebrow={t('plans.eyebrow')}
        title={t('plans.title')}
        description={t('plans.contact')}
        button={t('cta')}
        image="/images/life-1.jpg"
      />
    </>
  );
}
