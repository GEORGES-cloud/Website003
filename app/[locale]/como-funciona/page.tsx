import { useTranslations } from 'next-intl';
import PageHero from '@/components/PageHero';
import ScrollReveal from '@/components/ScrollReveal';
import ParallaxImage from '@/components/ParallaxImage';
import HowItWorksTimeline from '@/components/HowItWorksTimeline';
import Faq from '@/components/Faq';
import CTAFinal from '@/components/CTAFinal';

export default function ComoFuncionaPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('howItWorks');
  const tc = useTranslations('home.cta');
  const steps = (['step1', 'step2', 'step3'] as const).map((s) => ({
    number: t(`${s}.number`),
    title: t(`${s}.title`),
    desc: t(`${s}.desc`),
  }));

  return (
    <>
      <PageHero
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        image="/images/membership.jpg"
      />

      {/* Steps — animated vertical timeline */}
      <HowItWorksTimeline steps={steps} locale={locale} licenseStepIndex={1} />

      {/* Licence — mandatory requirement */}
      <section className="py-24 md:py-36 bg-sand">
        <div className="max-w-[1480px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <ScrollReveal direction="right">
              {/* Helm of the club's Sea Ray — you steer, hence the licence */}
              <ParallaxImage
                src="/images/searay-5.jpg"
                alt=""
                sizes="(max-width: 1024px) 100vw, 50vw"
                strength={44}
                kenBurns
                className="aspect-[4/5] lg:aspect-[5/6]"
              />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div>
                <p className="eyebrow mb-6">{t('license.eyebrow')}</p>
                <h2 className="display text-ink mb-7" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}>
                  {t('license.title')}
                </h2>
                <p className="font-sans text-lg text-muted leading-relaxed max-w-md">{t('license.body')}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Faq locale={locale} />

      <CTAFinal
        eyebrow={tc('eyebrow')}
        title={tc('title')}
        description={tc('description')}
        button={tc('button')}
        image="/images/hero.jpg"
      />
    </>
  );
}
