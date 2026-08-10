import { getTranslations } from 'next-intl/server';
import HeroVideo from '@/components/HeroVideo';
import ClubManifesto from '@/components/ClubManifesto';
import Stats from '@/components/Stats';
import AppShowcase from '@/components/AppShowcase';
import LifestyleGallery from '@/components/LifestyleGallery';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTAFinal from '@/components/CTAFinal';
import { getStats } from '@/lib/localize';

// The home keeps only landing-specific content. Fleet, How-it-works, Membership/Prices
// and Destinations live solely in their menu pages (/flota, /como-funciona, /precios,
// /puerto-base) — no duplicated information on the home.
export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const stats = await getStats(locale);

  return (
    <>
      {/* Hero: el metraje del SPX a pantalla completa, sin texto ni lockup —
          la marca la lleva la barra. El plano en movimiento baja al split. */}
      <HeroVideo src="/videos/spx.mp4" poster="/images/spx-poster.jpg" />

      <ClubManifesto locale={locale} />

      <Stats stats={stats} />

      <AppShowcase />

      <LifestyleGallery title={t('gallery.title')} locale={locale} />

      <TestimonialsSection locale={locale} />

      <CTAFinal
        eyebrow={t('cta.eyebrow')}
        title={t('cta.title')}
        description={t('cta.description')}
        button={t('cta.button')}
      />
    </>
  );
}
