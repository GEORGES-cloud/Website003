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

      {/* El helicóptero sobre el mar en calma cierra la página como fondo del
          CTA: era una banda suelta a mitad de página y aquí remata mejor.
          (De paso deja de repetirse el banner de la home.) */}
      <CTAFinal
        eyebrow={tc('eyebrow')}
        title={tc('title')}
        description={tc('description')}
        button={tc('button')}
        image="/images/heli-flyover-poster.jpg"
        video="/videos/heli-flyover.mp4"
      />
    </>
  );
}
