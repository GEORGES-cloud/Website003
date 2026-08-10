import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Logo from './Logo';
import { appStoreUrl, playStoreUrl } from '@/lib/appLinks';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('nav');
  const tf = useTranslations('footer');

  const navLinks = [
    { href: `/${locale}/precios`, label: t('membership') },
    { href: `/${locale}/flota`, label: t('fleet') },
    { href: `/${locale}/puerto-base`, label: t('homePort') },
    { href: `/${locale}/nosotros`, label: t('about') },
    { href: `/${locale}/contacto`, label: t('contact') },
  ];

  return (
    <footer className="bg-ink text-white">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
          {/* Brand */}
          <div>
            <Link
              href={`/${locale}`}
              aria-label="Flamingo Yacht Club"
              className="inline-block w-fit transition-opacity hover:opacity-80"
            >
              {/* Lockup completo del cliente, tinta blanca sobre el footer oscuro */}
              <Logo variant="full" tone="white" width={190} />
            </Link>
            <p className="font-sans text-sm text-white/60 mt-6 leading-relaxed max-w-xs">
              {tf('tagline')}
            </p>
            {/* Ubicación del club (base Marina Marbella en Puerto Banús) → Google Maps */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Marina+Marbella%2C+Edificio+Levante%2C+Puerto+Ban%C3%BAs%2C+Marbella"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm text-white/60 hover:text-white transition-colors mt-4 block max-w-xs leading-relaxed"
            >
              Edificio Levante, local 9-10
              <br />
              Puerto Banús · 29660 Marbella
            </a>
          </div>

          {/* Navigation */}
          <div>
            <p className="eyebrow-accent mb-7">
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
            <p className="eyebrow-accent mb-7">
              {tf('app')}
            </p>
            <p className="font-sans text-sm text-white/60 mb-7 leading-relaxed">{tf('appText')}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center font-sans text-[11px] font-semibold tracking-wide2 uppercase text-white/60 border border-white/20 px-5 py-3 hover:border-sea-light hover:text-white transition-colors"
              >
                App Store
              </Link>
              <Link
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center font-sans text-[11px] font-semibold tracking-wide2 uppercase text-white/60 border border-white/20 px-5 py-3 hover:border-sea-light hover:text-white transition-colors"
              >
                Google Play
              </Link>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/10 mt-16 mb-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* El año sale del reloj, no del JSON: el literal se quedó en 2024. */}
          <p className="font-sans text-sm text-white/60">
            {tf('legal').replace(/\b(19|20)\d{2}\b/, String(new Date().getFullYear()))}
          </p>
          <div className="flex gap-8">
            <Link href={`/${locale}/privacidad`} className="font-sans text-sm text-white/60 hover:text-white transition-colors">
              {tf('privacy')}
            </Link>
            <Link href={`/${locale}/terminos`} className="font-sans text-sm text-white/60 hover:text-white transition-colors">
              {tf('terms')}
            </Link>
            {/* La página de aviso legal existía pero no se enlazaba desde ningún sitio */}
            <Link href={`/${locale}/aviso-legal`} className="font-sans text-sm text-white/60 hover:text-white transition-colors">
              {tf('legalNotice')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
