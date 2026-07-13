'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';

interface NavbarProps {
  locale: string;
}

export default function Navbar({ locale }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations('nav');
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinks = [
    { href: `/${locale}/flota`, label: t('fleet') },
    { href: `/${locale}/membresia`, label: t('membership') },
    { href: `/${locale}/experiencias`, label: t('experiences') },
    { href: `/${locale}/nosotros`, label: t('about') },
  ];

  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL ?? `/${locale}/contacto`;

  // On hero (not scrolled): white text. After scroll: solid white bg, ink text.
  const onLight = scrolled;
  const textColor = onLight ? 'text-ink' : 'text-white';
  const mutedColor = onLight ? 'text-ink/60' : 'text-white/75';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? 'bg-bone/95 backdrop-blur-md border-b border-line shadow-[0_1px_20px_rgba(0,0,0,0.04)]' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1480px] mx-auto px-6 md:px-10 h-[88px] flex items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            aria-label="Flamingo Yacht Club"
            className={`transition-colors ${textColor} hover:text-sea`}
          >
            <Logo layout="row" markSize={44} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-9">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`font-sans text-[12px] font-medium uppercase tracking-wide2 transition-colors hover:text-sea ${mutedColor}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="hidden lg:flex items-center gap-7">
            <LanguageSwitcher locale={locale} dark={!onLight} />
            <Link
              href={bookingUrl}
              className={`font-sans text-[12px] font-semibold uppercase tracking-wide2 px-7 py-3 transition-colors duration-300 ${
                onLight
                  ? 'bg-ink text-white hover:bg-sea'
                  : 'bg-bone text-ink hover:bg-sea hover:text-white'
              }`}
            >
              {t('join')}
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex flex-col gap-[5px] p-2 -mr-2"
            aria-label="Open menu"
          >
            <span className={`block w-6 h-[1.5px] transition-colors ${onLight ? 'bg-ink' : 'bg-bone'}`} />
            <span className={`block w-6 h-[1.5px] transition-colors ${onLight ? 'bg-ink' : 'bg-bone'}`} />
            <span className={`block w-4 h-[1.5px] transition-colors ${onLight ? 'bg-ink' : 'bg-bone'}`} />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-bone flex flex-col lg:hidden"
          >
            <div className="flex justify-between items-center px-6 h-[88px] border-b border-line">
              <Link href={`/${locale}`} aria-label="Flamingo Yacht Club" className="text-ink">
                <Logo layout="row" markSize={40} />
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
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

            <div className="px-8 pb-10 pt-6 border-t border-line flex items-center justify-between">
              <LanguageSwitcher locale={locale} />
              <Link href={bookingUrl} className="btn-primary">{t('join')}</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
