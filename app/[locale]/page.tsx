import { getTranslations } from 'next-intl/server';
import HeroVideo from '@/components/HeroVideo';
import ClubManifesto from '@/components/ClubManifesto';
import AppShowcase from '@/components/AppShowcase';
import LifestyleGallery from '@/components/LifestyleGallery';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTAFinal from '@/components/CTAFinal';

// The home keeps only landing-specific content. Fleet, How-it-works, Membership/Prices
// and Destinations live solely in their menu pages (/flota, /como-funciona, /precios,
// /puerto-base) — no duplicated information on the home.
export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <>
      {/* Hero: el metraje del SPX a pantalla completa con el lockup completo
          encima (2026-09-24). La barra ya no lleva marca: el logo grande sobre
          el vídeo es ahora lo primero que ve quien entra. */}
      <HeroVideo src="/videos/spx.mp4" poster="/images/spx-poster.jpg" showLogo />

      <ClubManifesto locale={locale} />

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
