import { useTranslations } from 'next-intl';
import HeroVideo from '@/components/HeroVideo';
import ClubManifesto from '@/components/ClubManifesto';
import Stats from '@/components/Stats';
import AppShowcase from '@/components/AppShowcase';
import LifestyleGallery from '@/components/LifestyleGallery';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTAFinal from '@/components/CTAFinal';

// The home keeps only landing-specific content. Fleet, How-it-works, Membership/Prices
// and Destinations live solely in their menu pages (/flota, /como-funciona, /precios,
// /puerto-base) — no duplicated information on the home.
export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('home');

  return (
    <>
      {/* Hero: el metraje del SPX a pantalla completa con el lockup en grande.
          El plano en movimiento baja al split del manifiesto. */}
      <HeroVideo src="/videos/spx.mp4" poster="/images/spx-poster.jpg" showLogo />

      <ClubManifesto locale={locale} />

      <Stats locale={locale} />

      <AppShowcase />

      <LifestyleGallery title={t('gallery.title')} />

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
