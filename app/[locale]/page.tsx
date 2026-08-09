import { useTranslations } from 'next-intl';
import HeroVideo from '@/components/HeroVideo';
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
  const tm = useTranslations('home.manifesto');

  return (
    <>
      {/* El vídeo panorámico abre a pantalla completa y ahora lleva encima el
          manifiesto. Antes el hero era mudo y ese texto vivía en un split
          debajo, donde el logo caía sobre la costura entre vídeo y fondo claro. */}
      <HeroVideo
        eyebrow={tm('eyebrow')}
        title={tm('title')}
        body={tm('p1')}
        cta={{ href: `/${locale}/precios`, label: tm('cta') }}
      />

      {/* El metraje real del SPX se queda como banda cinematográfica: mismo
          material, sin repetir el texto que ahora está en el hero. */}
      <section className="relative w-full aspect-[16/9] max-h-[72svh] overflow-hidden bg-ink">
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          preload="metadata"
          poster="/images/spx-poster.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/spx.mp4" type="video/mp4" />
        </video>
      </section>

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
