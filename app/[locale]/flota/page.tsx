import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import FleetGrid from '@/components/FleetGrid';
import FleetShowcase3D from '@/components/FleetShowcase3D';
import CTAFinal from '@/components/CTAFinal';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.pages.fleet' });
  return { title: t('title'), description: t('description') };
}

export default function FlotaPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('fleet');
  const th = useTranslations('home.cta');

  return (
    <>
      {/* El hero de la página es ahora el visor 3D. Mantenemos el h1 para SEO/a11y. */}
      <h1 className="sr-only">{t('hero.title')}</h1>

      {/* Hero 3D a pantalla completa: la cámara orbita el barco al hacer scroll. */}
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
