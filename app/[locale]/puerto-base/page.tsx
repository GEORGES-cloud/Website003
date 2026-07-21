import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import ScrollReveal from '@/components/ScrollReveal';
import ParallaxImage from '@/components/ParallaxImage';
import Destinations from '@/components/Destinations';
import CTAFinal from '@/components/CTAFinal';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.pages.homePort' });
  return { title: t('title'), description: t('description') };
}

export default function PuertoBasePage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('homePort');
  const tc = useTranslations('home.cta');

  return (
    <>
      <PageHero
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        image="/images/hero.jpg"
      />

      {/* Why Puerto Banús */}
      <section className="py-24 md:py-36 bg-sand">
        <div className="max-w-[1480px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <ScrollReveal direction="right">
              <ParallaxImage
                src="/images/life-2.jpg"
                alt=""
                sizes="(max-width: 1024px) 100vw, 50vw"
                strength={44}
                kenBurns
                className="aspect-[4/5]"
              />
            </ScrollReveal>
            <ScrollReveal>
              <div>
                <p className="eyebrow mb-7">{t('why.eyebrow')}</p>
                <h2 className="display text-ink mb-7" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                  {t('why.title')}
                </h2>
                <p className="font-sans text-lg text-muted leading-relaxed mb-5">{t('why.p1')}</p>
                <p className="font-sans text-lg text-muted leading-relaxed">{t('why.p2')}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Reachable destinations (reused) */}
      <Destinations locale={locale} />

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
