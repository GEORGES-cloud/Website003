import Link from 'next/link';
import { useTranslations } from 'next-intl';
import ScrollReveal from './ScrollReveal';
import RevealText from './RevealText';

/* Split editorial: el barco navegando a un lado, el manifiesto del club al
   otro. El metraje del SPX subió al hero a pantalla completa, así que aquí
   queda el plano en movimiento, que funciona mejor recortado en vertical. */
export default function ClubManifesto({ locale }: { locale: string }) {
  const t = useTranslations('home.manifesto');

  return (
    <section className="bg-bone overflow-hidden">
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
            poster="/images/hero-poster.jpg"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Manifesto */}
        <div className="py-24 md:py-36 px-6 md:px-10 lg:pl-20 lg:pr-16 flex flex-col justify-center">
          <div className="max-w-xl">
            <ScrollReveal>
              <p className="eyebrow mb-6">{t('eyebrow')}</p>
            </ScrollReveal>
            <h2 className="display text-ink mb-8 display-2">
              <RevealText delay={0.1}>{t('title')}</RevealText>
            </h2>
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
