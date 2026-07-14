import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Logo from './Logo';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('nav');
  const tf = useTranslations('footer');

  const navLinks = [
    { href: `/${locale}/como-funciona`, label: t('howItWorks') },
    { href: `/${locale}/flota`, label: t('fleet') },
    { href: `/${locale}/precios`, label: t('prices') },
    { href: `/${locale}/puerto-base`, label: t('homePort') },
    { href: `/${locale}/nosotros`, label: t('about') },
    { href: `/${locale}/contacto`, label: t('contact') },
  ];

  const appStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL ?? '#';
  const playStoreUrl = process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? '#';

  return (
    <footer className="bg-ink text-white">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
          {/* Brand */}
          <div>
            <Link
              href={`/${locale}`}
              aria-label="Flamingo Yacht Club"
              className="inline-block text-white hover:text-sea-light transition-colors w-fit"
            >
              <Logo layout="row" />
            </Link>
            <p className="font-sans text-sm text-white/60 mt-6 leading-relaxed max-w-xs">
              {tf('tagline')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-sans text-[11px] font-semibold tracking-eyebrow uppercase text-sea-light mb-7">
              {tf('explore')}
            </p>
            <ul className="space-y-3.5">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="font-sans text-sm text-white/70 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* App */}
          <div>
            <p className="font-sans text-[11px] font-semibold tracking-eyebrow uppercase text-sea-light mb-7">
              {tf('app')}
            </p>
            <p className="font-sans text-sm text-white/60 mb-7 leading-relaxed">{tf('appText')}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={appStoreUrl}
                className="inline-flex items-center justify-center font-sans text-[11px] font-semibold tracking-wide2 uppercase text-white/60 border border-white/20 px-5 py-3 hover:border-sea-light hover:text-white transition-colors"
              >
                App Store
              </Link>
              <Link
                href={playStoreUrl}
                className="inline-flex items-center justify-center font-sans text-[11px] font-semibold tracking-wide2 uppercase text-white/60 border border-white/20 px-5 py-3 hover:border-sea-light hover:text-white transition-colors"
              >
                Google Play
              </Link>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/10 mt-16 mb-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-sans text-sm text-white/60">{tf('legal')}</p>
          <div className="flex gap-8">
            <Link href={`/${locale}/privacidad`} className="font-sans text-sm text-white/60 hover:text-white transition-colors">
              {tf('privacy')}
            </Link>
            <Link href={`/${locale}/terminos`} className="font-sans text-sm text-white/60 hover:text-white transition-colors">
              {tf('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
