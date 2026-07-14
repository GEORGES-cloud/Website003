import Image from 'next/image';
import { useTranslations } from 'next-intl';
import PageHero from '@/components/PageHero';
import ScrollReveal from '@/components/ScrollReveal';
import CTAFinal from '@/components/CTAFinal';

const EXPERIENCES = [
  { key: 'dayTrip', image: '/images/exp-daytrip.jpg' },
  { key: 'sunset', image: '/images/exp-sunset.jpg' },
  { key: 'weekend', image: '/images/exp-weekend.jpg' },
  { key: 'private', image: '/images/exp-private.jpg' },
] as const;

export default function ExperienciasPage() {
  const t = useTranslations('experiences');
  const tc = useTranslations('home.cta');

  return (
    <>
      <PageHero
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        image="/images/exp-weekend.jpg"
      />

      <section className="py-24 md:py-36 bg-bone">
        <div className="max-w-[1480px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-20">
            {EXPERIENCES.map(({ key, image }, i) => (
              <ScrollReveal key={key} delay={(i % 2) * 0.1}>
                <article className="group">
                  <div className="relative aspect-[3/2] overflow-hidden mb-7">
                    <Image
                      src={image}
                      alt={t(`${key}.title`)}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="display-num text-3xl md:text-4xl text-ink/15 mb-4">0{i + 1}</p>
                  <h2 className="display text-3xl md:text-4xl text-ink mb-4">
                    {t(`${key}.title`)}
                  </h2>
                  <p className="font-sans text-base text-muted leading-relaxed max-w-md">
                    {t(`${key}.desc`)}
                  </p>
                </article>
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
        image="/images/exp-sunset.jpg"
      />
    </>
  );
}
