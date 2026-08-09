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
      {/* Abre el manifiesto con el metraje real del SPX; el vídeo panorámico
          pasa a segundo golpe de vista. El logo queda sobre el fondo claro,
          donde el flamenco y la serif se leen mejor que sobre agua brillante. */}
      <ClubManifesto locale={locale} asHero />

      <HeroVideo showHeading={false} navbarOnDark={false} />

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
