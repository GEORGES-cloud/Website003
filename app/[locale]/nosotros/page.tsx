import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import HeroOffset from '@/components/HeroOffset';
import ScrollReveal from '@/components/ScrollReveal';
import ParallaxImage from '@/components/ParallaxImage';
import CTAFinal from '@/components/CTAFinal';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.pages.about' });
  return { title: t('title'), description: t('description') };
}

export default function NosotrosPage() {
  const t = useTranslations('about');
  const tc = useTranslations('home.cta');

  const values = ['v1', 'v2', 'v3'] as const;

  return (
    <>
      {/* Hero offset: el titular solapa la proa al anochecer (estilo editorial).
          62% centra a la mujer del timón entera en el recorte 3/4. */}
      <HeroOffset
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        image="/images/bow-dusk.jpg"
        imagePosition="62% center"
        slides={[
          { src: '/images/bow-dusk.jpg', position: '62% center' },
          { src: '/images/stern-couple.jpg', position: '50% 50%' },
          { src: '/images/platform-dawn.jpg', position: '65% 50%' },
        ]}
      />

      {/* Momento de película: el helicóptero sobre el mar en calma, con deriva
          lenta generada desde la foto original (bucle ida y vuelta) */}
      <section className="relative w-full aspect-[16/9] max-h-[72svh] overflow-hidden bg-ink">
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          preload="metadata"
          poster="/images/heli-flyover-poster.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/heli-flyover.mp4" type="video/mp4" />
        </video>
      </section>

      {/* Story */}
      <section className="py-24 md:py-36 bg-bone">
        <div className="max-w-[1480px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <ScrollReveal direction="right">
              <ParallaxImage
                src="/images/fleet-navan.jpg"
                alt="Navegando por el Mediterráneo"
                sizes="(max-width: 1024px) 100vw, 50vw"
                strength={44}
                className="aspect-[4/5]"
              />
            </ScrollReveal>

            <ScrollReveal>
              <div>
                <p className="eyebrow mb-6">{t('story.title')}</p>
                <p className="display text-2xl md:text-3xl text-ink leading-snug mb-7">
                  {t('story.p1')}
                </p>
                <p className="font-sans text-lg text-muted leading-relaxed mb-5">{t('story.p2')}</p>
                <p className="font-sans text-lg text-muted leading-relaxed">{t('story.p3')}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-36 bg-sand">
        <div className="max-w-[1480px] mx-auto px-6 md:px-10">
          <ScrollReveal>
            <h2 className="display text-ink mb-14 md:mb-16" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              {t('values.title')}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {values.map((key, i) => (
              <ScrollReveal key={key} delay={i * 0.1}>
                <div className="border-t border-line pt-8">
                  <h3 className="display text-2xl text-ink mb-4">
                    {t(`values.${key}.title`)}
                  </h3>
                  <p className="font-sans text-base text-muted leading-relaxed">{t(`values.${key}.desc`)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <CTAFinal
        eyebrow={tc('eyebrow')}
        title={tc('title')}
        description={tc('description')}
        button={tc('button')}
      />
    </>
  );
}
