import { useTranslations } from 'next-intl';
import PageHero from '@/components/PageHero';
import ScrollReveal from '@/components/ScrollReveal';
import ParallaxImage from '@/components/ParallaxImage';
import Faq from '@/components/Faq';
import CTAFinal from '@/components/CTAFinal';

export default function ComoFuncionaPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('howItWorks');
  const tc = useTranslations('home.cta');
  const steps = ['step1', 'step2', 'step3'] as const;

  return (
    <>
      <PageHero
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        image="/images/membership.jpg"
      />

      {/* Steps */}
      <section className="py-24 md:py-36 bg-bone">
        <div className="max-w-[1480px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10">
            {steps.map((s, i) => (
              <ScrollReveal key={s} delay={i * 0.12}>
                <div className="border-t border-ink/10 pt-8 md:pr-10">
                  <span className="display-num text-ink/10 block mb-5" style={{ fontSize: 'clamp(2.75rem, 4.5vw, 4rem)' }}>
                    {t(`${s}.number`)}
                  </span>
                  <h2 className="display text-2xl md:text-3xl text-ink mb-4">{t(`${s}.title`)}</h2>
                  <p className="font-sans text-base text-muted leading-relaxed max-w-xs">{t(`${s}.desc`)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Licence — mandatory requirement */}
      <section className="py-24 md:py-36 bg-sand">
        <div className="max-w-[1480px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <ScrollReveal direction="right">
              <ParallaxImage
                src="/images/life-3.jpg"
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
