'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { useJoinFunnel } from './JoinFunnelProvider';
import { fleet, ACTIVE_BOAT_SLUGS } from '@/lib/data';

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
  // Solo las páginas cuyo hero es oscuro (marcado con data-navbar-on-dark)
  // arrancan con la navbar en blanco; el resto usa tinta desde el inicio.
  const [overDark, setOverDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations('nav');
  const pathname = usePathname();
  const menuLabel = MENU_LABEL[locale] ?? 'Menu';
  const { openFunnel } = useJoinFunnel();

  // "Let's Meet" — the 6th menu item. Closes the overlay first so its scroll-lock
  // is released cleanly, then opens the funnel (z-90, above everything).
  const openLetsMeet = () => {
    setMenuOpen(false);
    openFunnel();
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setOverDark(Boolean(document.querySelector('[data-navbar-on-dark]')));
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    if (menuOpen) document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  // Menú tipo "range": la flota en grande a la izquierda, navegación a la derecha
  const models = ACTIVE_BOAT_SLUGS
    .map((slug) => fleet.find((b) => b.slug === slug))
    .filter((b): b is (typeof fleet)[number] => Boolean(b));

  const overlayLinks = [
    { href: `/${locale}/como-funciona`, label: t('howItWorks') },
    { href: `/${locale}/precios`, label: t('prices') },
    { href: `/${locale}/puerto-base`, label: t('homePort') },
    { href: `/${locale}/nosotros`, label: t('about') },
    { href: `/${locale}/contacto`, label: t('contact') },
  ];

  // Sobre un hero oscuro (sin scroll): texto blanco. Tras el scroll, o en
  // páginas de hero claro (/flota, /contacto, legales): fondo claro, tinta.
  const onLight = scrolled || !overDark;
  const textColor = onLight ? 'text-ink' : 'text-white';
  const barColor = onLight ? 'bg-ink' : 'bg-white';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? 'bg-bone/95 backdrop-blur-md border-b border-line' : 'bg-transparent'
        }`}
      >
        <div className="relative max-w-[1480px] mx-auto px-6 md:px-10 h-[var(--header-h)] flex items-center justify-between">
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

          {/* RIGHT — language + Join the Club (enlaza a la página de consulta) */}
          <div className="flex items-center gap-4 md:gap-6">
            <LanguageSwitcher locale={locale} dark={!onLight} />
            <Link
              href={`/${locale}/contacto`}
              className={`hidden sm:inline-flex items-center justify-center font-sans text-[11px] font-semibold uppercase tracking-[0.18em] px-5 py-2.5 transition-colors duration-300 ${
                onLight ? 'bg-ink text-white hover:bg-sea' : 'bg-white text-ink hover:bg-sea hover:text-white'
              }`}
            >
              {t('join')}
            </Link>
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
            <div className="relative flex justify-between items-center px-6 h-[var(--header-h)] border-b border-line">
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

            {/* Cuerpo — dos columnas estilo "range": flota en display a la izquierda,
                navegación secundaria a la derecha */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-[1480px] mx-auto px-8 md:px-14 py-10 md:py-16 grid md:grid-cols-[1.5fr_1fr] gap-x-12 gap-y-12">
                {/* LA FLOTA */}
                <div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.08, duration: 0.4 }}
                    className="eyebrow mb-5 md:mb-7"
                  >
                    {t('fleet')}
                  </motion.p>
                  {models.map((b, i) => (
                    <motion.div
                      key={b.slug}
                      initial={{ opacity: 0, x: -28 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.12 + i * 0.07, duration: 0.45 }}
                    >
                      <Link
                        href={`/${locale}/flota/${b.slug}`}
                        className="group flex items-baseline gap-4 py-1 md:py-1.5"
                      >
                        <span
                          className="font-display font-black uppercase leading-none text-ink group-hover:text-sea transition-colors duration-300"
                          style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)', letterSpacing: '-0.015em' }}
                        >
                          {b.shortName ?? b.name}
                        </span>
                        <span className="hidden sm:inline font-sans text-[11px] font-semibold uppercase tracking-wide2 text-muted group-hover:text-sea transition-colors duration-300">
                          {b.name}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.36, duration: 0.4 }}
                  >
                    <Link href={`/${locale}/flota`} className="link-underline mt-7 md:mt-9 inline-flex">
                      {t('allFleet')}
                    </Link>
                  </motion.div>
                </div>

                {/* NAVEGACIÓN SECUNDARIA */}
                <div className="flex flex-col md:pt-12">
                  <nav className="flex flex-col">
                    {overlayLinks.map(({ href, label }, i) => (
                      <motion.div
                        key={href}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.16 + i * 0.05, duration: 0.4 }}
                      >
                        <Link
                          href={href}
                          className="font-sans font-extralight uppercase text-ink/40 hover:text-ink transition-colors block py-1.5 md:py-2 tracking-[0.05em]"
                          style={{ fontSize: 'clamp(1.35rem, 2.3vw, 1.85rem)' }}
                        >
                          {label}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.42, duration: 0.4 }}
                    className="mt-9 md:mt-11 flex flex-col items-start gap-7"
                  >
                    <button type="button" onClick={openLetsMeet} className="btn-primary">
                      {t('letsMeet')}
                    </button>
                    <LanguageSwitcher locale={locale} variant="inline" className="-mx-2.5" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
