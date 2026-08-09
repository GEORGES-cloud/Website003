import Link from 'next/link';
import { useTranslations } from 'next-intl';
import ScrollReveal from './ScrollReveal';
import RevealText from './RevealText';

/* Editorial split: real Sea Ray SPX footage on one side, the club manifesto on
   the other. Replaces the second full-screen hero video — gives the home the
   brand narrative it was missing (less "just video", more voice). */
export default function ClubManifesto({
  locale,
  asHero = false,
}: {
  locale: string;
  /** Abre la página: deja pasar la barra fija por encima del fondo claro y su
   *  titular hace de h1. Sin esto el logo centrado caería sobre la costura
   *  entre el vídeo oscuro y el panel claro, ilegible a media barra. */
  asHero?: boolean;
}) {
  const t = useTranslations('home.manifesto');
  const Heading = asHero ? 'h1' : 'h2';

  return (
    <section className={`bg-bone overflow-hidden ${asHero ? 'pt-[var(--header-h)]' : ''}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Video — real footage, bleeds to the section edge */}
        <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[640px] bg-ink">
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
        </div>

        {/* Manifesto */}
        <div className={`px-6 md:px-10 lg:pl-20 lg:pr-16 flex flex-col justify-center ${asHero ? 'py-20 md:py-28' : 'py-24 md:py-36'}`}>
          <div className="max-w-xl">
            <ScrollReveal>
              <p className="eyebrow mb-6">{t('eyebrow')}</p>
            </ScrollReveal>
              <Heading className={`display text-ink mb-8 ${asHero ? 'display-1' : 'display-2'}`}>
                <RevealText delay={0.1}>{t('title')}</RevealText>
              </Heading>
            <ScrollReveal delay={0.2}>
              <p className="font-sans text-lg text-muted leading-relaxed">{t('p1')}</p>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <p className="font-sans text-lg text-muted leading-relaxed mt-5">{t('p2')}</p>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <Link href={`/${locale}/precios`} className="link-underline mt-10">
                {t('cta')}
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
