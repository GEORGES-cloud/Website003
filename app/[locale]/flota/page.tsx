import { useTranslations } from 'next-intl';
import FleetGrid from '@/components/FleetGrid';
import FleetShowcase3D from '@/components/FleetShowcase3D';
import PageHero from '@/components/PageHero';
import CTAFinal from '@/components/CTAFinal';

export default function FlotaPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('fleet');
  const th = useTranslations('home.cta');

  return (
    <>
      <PageHero
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        image="/images/fleet-frauscher.jpg"
      />

      {/* Prototipo: showcase con scroll-scrubbing de vídeo (efecto "3D"). */}
      <FleetShowcase3D locale={locale} />

      <section className="py-24 md:py-36 bg-bone">
        <div className="max-w-[1480px] mx-auto px-6 md:px-10">
          <FleetGrid locale={locale} capacityLabel={t('capacity')} lengthLabel={t('length')} />
        </div>
      </section>

      <CTAFinal
        eyebrow={th('eyebrow')}
        title={th('title')}
        description={th('description')}
        button={th('button')}
        image="/images/life-5.jpg"
      />
    </>
  );
}
