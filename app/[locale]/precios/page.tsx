import type { Metadata } from 'next';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import HeroLedger from '@/components/HeroLedger';
import ScrollReveal from '@/components/ScrollReveal';
import MembershipTiers from '@/components/MembershipTiers';
import HowItWorksTimeline from '@/components/HowItWorksTimeline';
import Faq from '@/components/Faq';
import CTAFinal from '@/components/CTAFinal';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.pages.prices' });
  return { title: t('title'), description: t('description') };
}

export default function PreciosPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('prices');
  // "Cómo funciona" vive ahora dentro de Membresía (petición del cliente):
  // pasos, licencia, app y FAQ se sirven desde esta misma página.
  const th = useTranslations('howItWorks');
  const steps = (['step1', 'step2', 'step3'] as const).map((s) => ({
    number: th(`${s}.number`),
    title: th(`${s}.title`),
    desc: th(`${s}.desc`),
  }));

  return (
    <>
      {/* Hero "ledger": tipografía + regla de datos + banda panorámica */}
      <HeroLedger
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        image="/images/wake-circle.jpg"
        slides={[
          { src: '/images/wake-circle.jpg' },
          { src: '/images/aerial-reef-1.jpg' },
          { src: '/images/aerial-reef-2.jpg' },
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

      {/* Cómo funciona — al principio de la página (petición del cliente).
          Sin badge de "obligatoria": la licencia se cuenta en positivo (paso 2). */}
      <HowItWorksTimeline steps={steps} locale={locale} licenseStepIndex={-1} />

      {/* La app real del club (MOXSEA) — las dos maquetas oficiales rematan
          el paso 3 ("descarga la app y reserva"). Sin img-grade: es UI. */}
      <section className="py-24 md:py-36 bg-sand">
        <div className="max-w-[1480px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
            <ScrollReveal>
              <div className="relative aspect-[1961/2339] bg-[#e4e6e9] h-full">
                <Image
                  src="/images/app-mockup-moxsea.jpg"
                  alt="La app del club: reservas, check-in y check-out desde el móvil"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="relative aspect-[3/2] lg:aspect-auto bg-white h-full min-h-[320px]">
                <Image
                  src="/images/app-mockup-moxsea-2.jpg"
                  alt="La app del club: calendario de reservas y puerto base Puerto Banús"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* The single membership card (features, no price) */}
      <MembershipTiers locale={locale} />

      <Faq locale={locale} />

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
