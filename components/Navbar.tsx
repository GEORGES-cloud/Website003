'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import JoinCTA from './JoinCTA';

interface NavbarProps {
  locale: string;
}

const MENU_LABEL: Record<string, string> = {
  es: 'Menú',
  en: 'Menu',
  sv: 'Meny',
  ru: 'Меню',
  de: 'Menü',
  fr: 'Menu',
};

const display = { fontFamily: 'var(--font-display), "Arial Black", Impact, sans-serif' } as const;

function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-black uppercase" style={{ ...display, fontSize: 'clamp(1rem, 2.3vw, 1.5rem)', letterSpacing: '0.03em' }}>
        Flamingo
      </span>
      <span
        className="uppercase mt-1 opacity-90"
        style={{ ...display, fontWeight: 500, fontSize: 'clamp(0.46rem, 0.82vw, 0.58rem)', letterSpacing: '0.36em', paddingLeft: '0.36em' }}
      >
        Yacht Club
      </span>
    </span>
  );
}

export default function Navbar({ locale }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations('nav');
  const pathname = usePathname();
  const menuLabel = MENU_LABEL[locale] ?? 'Menu';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { href: `/${locale}/flota`, label: t('fleet') },
    { href: `/${locale}/membresia`, label: t('membership') },
    { href: `/${locale}/experiencias`, label: t('experiences') },
    { href: `/${locale}/nosotros`, label: t('about') },
  ];

  // On hero (not scrolled): white text over the video. After scroll: solid light bg, ink text.
  const onLight = scrolled;
  const textColor = onLight ? 'text-ink' : 'text-white';
  const barColor = onLight ? 'bg-ink' : 'bg-white';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? 'bg-bone/95 backdrop-blur-md border-b border-line shadow-[0_1px_20px_rgba(0,0,0,0.04)]' : 'bg-transparent'
        }`}
      >
        <div className="relative max-w-[1480px] mx-auto px-6 md:px-10 h-[88px] flex items-center justify-between">
          {/* LEFT — menu trigger */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label={menuLabel}
            className={`flex items-center gap-3 transition-colors hover:text-sea ${textColor}`}
          >
            <span className="flex flex-col gap-[5px]" aria-hidden>
              <span className={`block w-6 h-[1.5px] transition-colors ${barColor}`} />
              <span className={`block w-6 h-[1.5px] transition-colors ${barColor}`} />
              <span className={`block w-4 h-[1.5px] transition-colors ${barColor}`} />
            </span>
            <span className="hidden sm:inline font-sans text-[12px] font-semibold uppercase tracking-wide2">
              {menuLabel}
            </span>
          </button>

          {/* CENTER — brand lockup */}
          <Link
            href={`/${locale}`}
            aria-label="Flamingo Yacht Club"
            className={`absolute left-1/2 -translate-x-1/2 transition-colors hover:text-sea ${textColor}`}
          >
            <Wordmark />
          </Link>

          {/* RIGHT — language */}
          <div className="flex items-center">
            <LanguageSwitcher locale={locale} dark={!onLight} />
          </div>
        </div>
      </header>

      {/* Full-screen menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-bone flex flex-col"
          >
            <div className="relative flex justify-between items-center px-6 h-[88px] border-b border-line">
              <span className="w-8" aria-hidden />
              <Link href={`/${locale}`} aria-label="Flamingo Yacht Club" className="absolute left-1/2 -translate-x-1/2 text-ink">
                <Wordmark />
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 -mr-2 text-ink/50 hover:text-ink transition-colors"
                aria-label="Close menu"
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <line x1="1" y1="1" x2="21" y2="21" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="21" y1="1" x2="1" y2="21" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
              {navLinks.map(({ href, label }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 + 0.1, duration: 0.4 }}
                >
                  <Link
                    href={href}
                    className="font-sans text-4xl sm:text-5xl font-extralight text-ink hover:text-sea transition-colors block py-3 leading-tight tracking-tight"
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="px-8 pb-10 pt-6 border-t border-line space-y-5">
              <LanguageSwitcher locale={locale} variant="inline" className="-mx-2.5" />
              <JoinCTA className="btn-primary w-full">{t('join')}</JoinCTA>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
