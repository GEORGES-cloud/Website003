import { useTranslations } from 'next-intl';
import FleetGrid from '@/components/FleetGrid';
import FleetShowcase3D from '@/components/FleetShowcase3D';
import VirtualTour360 from '@/components/VirtualTour360';
import CTAFinal from '@/components/CTAFinal';
import { getActiveFleet } from '@/lib/localize';

const TOUR_HEADING: Record<string, { eyebrow: string; title: string }> = {
  es: { eyebrow: 'El barco real', title: 'Súbete a bordo desde aquí.' },
  en: { eyebrow: 'The real boat', title: 'Step on board from here.' },
  sv: { eyebrow: 'Den riktiga båten', title: 'Kliv ombord härifrån.' },
  ru: { eyebrow: 'Настоящая лодка', title: 'Поднимитесь на борт отсюда.' },
  de: { eyebrow: 'Das echte Boot', title: 'Gehen Sie von hier an Bord.' },
  fr: { eyebrow: 'Le vrai bateau', title: 'Montez à bord d’ici.' },
};

export default function FlotaPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('fleet');
  const th = useTranslations('home.cta');
  const boat = getActiveFleet(locale)[0];
  const heading = TOUR_HEADING[locale] ?? TOUR_HEADING.en;

  return (
    <>
      {/* El hero de la página es ahora el visor 3D. Mantenemos el h1 para SEO/a11y. */}
      <h1 className="sr-only">{t('hero.title')}</h1>

      {/* Hero 3D a pantalla completa: la cámara orbita el barco al hacer scroll. */}
      <FleetShowcase3D locale={locale} />

      {/* Visita virtual 360°: el barco REAL escaneado (partner 3d-boats), click-to-load. */}
      {boat?.tour360 && (
        <section className="bg-ink py-24 md:py-32">
          <div className="max-w-[1480px] mx-auto px-6 md:px-10">
            <p className="eyebrow-invert mb-5">{heading.eyebrow}</p>
            <h2 className="display text-white text-3xl md:text-5xl mb-12">{heading.title}</h2>
            <VirtualTour360 url={boat.tour360} title={boat.name} poster={boat.image} locale={locale} />
          </div>
        </section>
      )}

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
