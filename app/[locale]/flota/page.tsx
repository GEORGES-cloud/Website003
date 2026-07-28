import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import FleetShowcase from '@/components/FleetShowcase';
import CTAFinal from '@/components/CTAFinal';
import { ACTIVE_BOAT_SLUGS } from '@/lib/data';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.pages.fleet' });
  return { title: t('title'), description: t('description') };
}

export default function FlotaPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('fleet');
  const th = useTranslations('home.cta');

  return (
    <>
      <PageHero
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        meta={{ index: String(ACTIVE_BOAT_SLUGS.length).padStart(2, '0'), label: 'Puerto Banús · Marbella' }}
      />

      <FleetShowcase locale={locale} />

      <CTAFinal
        eyebrow={th('eyebrow')}
        title={th('title')}
        description={th('description')}
        button={th('button')}
        image="/images/level-1.jpg"
      />
    </>
  );
}
