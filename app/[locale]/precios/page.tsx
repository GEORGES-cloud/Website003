import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import HeroLedger from '@/components/HeroLedger';
import ScrollReveal from '@/components/ScrollReveal';
import MembershipTiers from '@/components/MembershipTiers';
import CTAFinal from '@/components/CTAFinal';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.pages.prices' });
  return { title: t('title'), description: t('description') };
}

export default function PreciosPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('prices');

  return (
    <>
      {/* Hero "ledger": tipografía + regla de datos + banda panorámica */}
      <HeroLedger
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        image="/images/wake-circle.jpg"
        facts={[
          { value: t('hero.f1.value'), label: t('hero.f1.label') },
          { value: t('hero.f2.value'), label: t('hero.f2.label') },
          { value: t('hero.f3.value'), label: t('hero.f3.label') },
        ]}
      />

      {/* Intro — what's included (escala media: bloque breve, no sección completa) */}
      <section className="py-20 md:py-28 bg-bone">
        <div className="max-w-[1480px] mx-auto px-6 md:px-10">
          <div className="max-w-3xl">
            <ScrollReveal>
              <h2 className="display text-ink mb-6" style={{ fontSize: 'clamp(1.9rem, 4vw, 3.25rem)' }}>
                {t('intro.title')}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="font-sans text-lg text-muted leading-relaxed">{t('intro.body')}</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* The single membership card (features, no price) */}
      <MembershipTiers locale={locale} />

      {/* Price in person → funnel */}
      <CTAFinal
        eyebrow={t('cta.eyebrow')}
        title={t('cta.title')}
        description={t('cta.description')}
        button={t('cta.button')}
        image="/images/exp-sunset.jpg"
      />
    </>
  );
}
