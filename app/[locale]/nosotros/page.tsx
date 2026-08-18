import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ScrollReveal from '@/components/ScrollReveal';
import ParallaxImage from '@/components/ParallaxImage';
import PageHero from '@/components/PageHero';
import MilestonesTimeline from '@/components/MilestonesTimeline';
import CTAFinal from '@/components/CTAFinal';
import { getMilestones } from '@/lib/localize';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.pages.about' });
  return { title: t('title'), description: t('description') };
}

export default async function NosotrosPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'about' });
  const tc = await getTranslations({ locale, namespace: 'home.cta' });
  const milestones = await getMilestones(locale);

  return (
    <>
      {/* Foto de la NAVAN en una cala turquesa. Aquí hubo un vídeo cenital
          (about-hero.mp4) que el cliente descartó por calidad incluso
          regradado (2026-08-18); el único metraje bueno que hay es el de la
          SPX y ya abre la home. Foto del carrete que no se usaba en ninguna
          otra página, clara y tropical como pidió el cliente para esta
          sección. */}
      <PageHero
        image="/images/reel-navan-covrun.jpg"
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
      />

      <MilestonesTimeline
        items={milestones}
        eyebrow={t('history.eyebrow')}
        title={t('history.title')}
        intro={t('history.intro')}
      />

      {/* Story */}
      <section className="py-24 md:py-36 bg-bone">
        <div className="max-w-[1480px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <ScrollReveal direction="right">
              {/* Foto elegida por el cliente (2026-08-18) en sustitución de la
                  SPX en el amarre, que se veía pixelada. La lancha va en el
                  tercio izquierdo del original: el recorte 4:5 se ancla ahí. */}
              <ParallaxImage
                src="/images/sun-sport-250-lifestyle.jpg"
                alt="Una lancha navegando al atardecer con la costa al fondo"
                sizes="(max-width: 1024px) 100vw, 50vw"
                strength={44}
                className="aspect-[4/5]"
                position="28% 50%"
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
