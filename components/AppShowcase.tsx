import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import ScrollReveal from './ScrollReveal';
import { appStoreUrl, playStoreUrl } from '@/lib/appLinks';

/* Cinematic editorial split: full-bleed photography instead of device mockups.
   The app story is told in copy; the imagery stays on-brand (sea, not screens). */
export default function AppShowcase() {
  const t = useTranslations('home.app');

  const features = ['f1', 'f2', 'f3'] as const;

  return (
    <section className="bg-sand overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Mockup oficial de la app (MOXSEA) — contenida, sin recorte ni gradación:
            es interfaz, no fotografía. El fondo replica el gris del propio mockup. */}
        <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[680px] bg-[#e4e6e9]">
          <Image
            src="/images/app-mockup-moxsea.jpg"
            alt="La app del club: reservas, check-in y check-out desde el móvil"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain"
          />
        </div>

        {/* Text */}
        <div className="py-24 md:py-36 px-6 md:px-10 lg:pl-20 lg:pr-16 flex flex-col justify-center">
          <div className="max-w-xl">
            <ScrollReveal>
              <p className="eyebrow mb-6">{t('eyebrow')}</p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2 className="display text-ink mb-7 display-2">
                {t('titleLead')} {t('titleAccent')}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="font-sans text-lg text-muted leading-relaxed mb-12 max-w-md">{t('description')}</p>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <ul className="border-t border-ink/10 mb-12">
                {features.map((f) => (
                  <li key={f} className="border-b border-ink/10 py-5 font-sans text-base text-ink">
                    {t(f)}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <div className="flex gap-8">
                <Link href={appStoreUrl} className="link-underline">App Store</Link>
                <Link href={playStoreUrl} className="link-underline">Google Play</Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
