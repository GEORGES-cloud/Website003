import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import ScrollReveal from '@/components/ScrollReveal';
import ParallaxImage from '@/components/ParallaxImage';
import CTAFinal from '@/components/CTAFinal';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.pages.about' });
  return { title: t('title'), description: t('description') };
}

export default function NosotrosPage() {
  const t = useTranslations('about');
  const tc = useTranslations('home.cta');

  const values = ['v1', 'v2', 'v3'] as const;

  return (
    <>
      <PageHero
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        image="/images/about.jpg"
      />

      {/* Story */}
      <section className="py-24 md:py-36 bg-bone">
        <div className="max-w-[1480px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <ScrollReveal direction="right">
              <ParallaxImage
                src="/images/life-1.jpg"
                alt="Navegando por el Mediterráneo"
                sizes="(max-width: 1024px) 100vw, 50vw"
                strength={44}
                kenBurns
                className="aspect-[4/5]"
              />
            </ScrollReveal>

            <ScrollReveal>
              <div>
                <p className="eyebrow mb-7">{t('story.title')}</p>
                <p className="display text-2xl md:text-3xl text-ink leading-snug mb-7">
                  {t('story.p1')}
                </p>
                <p className="font-sans text-lg text-muted leading-relaxed mb-5">{t('story.p2')}</p>
                <p className="font-sans text-lg text-muted leading-relaxed">{t('story.p3')}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-36 bg-sand">
        <div className="max-w-[1480px] mx-auto px-6 md:px-10">
          <ScrollReveal>
            <h2 className="display text-ink mb-16" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              {t('values.title')}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {values.map((key, i) => (
              <ScrollReveal key={key} delay={i * 0.1}>
                <div className="border-t border-line pt-8">
                  <h3 className="display text-2xl text-ink mb-4">
                    {t(`values.${key}.title`)}
                  </h3>
                  <p className="font-sans text-base text-muted leading-relaxed">{t(`values.${key}.desc`)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <CTAFinal
        eyebrow={tc('eyebrow')}
        title={tc('title')}
        description={tc('description')}
        button={tc('button')}
        image="/images/life-6.jpg"
      />
    </>
  );
}
