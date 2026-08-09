import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import ScrollReveal from '@/components/ScrollReveal';
import ParallaxImage from '@/components/ParallaxImage';
import MilestonesTimeline from '@/components/MilestonesTimeline';
import CTAFinal from '@/components/CTAFinal';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.pages.about' });
  return { title: t('title'), description: t('description') };
}

export default function NosotrosPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('about');
  const tc = useTranslations('home.cta');

  return (
    <>
      {/* La línea del tiempo abre la página en lugar de un hero de foto: la
          travesía de 1965 a Flamingo ES la portada de "Nosotros". */}
      <MilestonesTimeline
        asHero
        locale={locale}
        eyebrow={t('history.eyebrow')}
        title={t('history.title')}
        intro={t('history.intro')}
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
                src="/images/navan-shade.jpg"
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

      {/* Foto propia: con la de por defecto, esta página cerraba con el mismo
          banner que la home (misma imagen y mismo texto). */}
      <CTAFinal
        eyebrow={tc('eyebrow')}
        title={tc('title')}
        description={tc('description')}
        button={tc('button')}
        image="/images/navan-duo-1.jpg"
      />
    </>
  );
}
