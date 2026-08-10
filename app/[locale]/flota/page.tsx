import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import FleetShowcase from '@/components/FleetShowcase';
import CTAFinal from '@/components/CTAFinal';
import { getActiveFleet } from '@/lib/localize';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.pages.fleet' });
  return { title: t('title'), description: t('description') };
}

export default async function FlotaPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'fleet' });
  const th = await getTranslations({ locale, namespace: 'home.cta' });
  const boats = await getActiveFleet(locale);

  return (
    <>
      <PageHero
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        meta={{ index: String(boats.length).padStart(2, '0'), label: 'Puerto Banús · Marbella' }}
      />

      <FleetShowcase locale={locale} boats={boats} />

      {/* Fondo monocromo: estela circular sobre azul profundo, gráfico y
          sin distracciones detrás del texto. */}
      <CTAFinal
        eyebrow={th('eyebrow')}
        title={th('title')}
        description={th('description')}
        button={th('button')}
        image="/images/reel-wake-loop.jpg"
      />
    </>
  );
}
