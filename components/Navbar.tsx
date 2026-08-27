'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { useJoinFunnel } from './JoinFunnelProvider';
import { getLenis } from '@/lib/lenis';

export interface MenuBoat {
  slug: string;
  name: string;
  shortName?: string;
}

interface NavbarProps {
  locale: string;
  /** Barcos activos para el menú "range", ya localizados (los pasa el layout). */
  menuBoats: MenuBoat[];
}

const MENU_LABEL: Record<string, string> = {
  es: 'Menú',
  en: 'Menu',
  sv: 'Meny',
  ru: 'Меню',
  de: 'Menü',
  fr: 'Menu',
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Logo de la barra: el wordmark del cliente — ondas, FLAMINGO, —YACHT CLUB—
 * y "powered by Marina Marbella", sin el flamenco (petición del cliente
 * 2026-08-10: solo texto). Aspecto ~5.8:1, así que va por altura contenida.
 *
 * Las dos tintas van superpuestas alternando opacidad: ambas quedan cargadas
 * de inicio, así el cambio blanco→tinta al hacer scroll es un fundido limpio,
 * sin parpadeo.
 */
function BrandLogo({ white, className = '' }: { white: boolean; className?: string }) {
  return (
    <span className={`flex flex-col items-center gap-[5px] ${className}`}>
      {/* 44px en escritorio (antes 32): al 100% de zoom en un monitor normal
          FLAMINGO tenia ~15px de letra y YACHT CLUB ~3.5px — una serifa fina no
          se rasteriza limpia con tan pocos pixeles y salia gris y borrosa
          (2026-08-14). Con zoom se arreglaba sola: faltaba tamano, no trazo. */}
      <span className="relative block h-[28px] md:h-[44px]">
        {/* eslint-disable @next/next/no-img-element */}
        {/* wordmark-bold.svg es un NOMBRE nuevo, no un ?v=: tras varias
            iteraciones de grosor (2026-08-14) el cliente seguia viendo la
            version fina y la query no burlaba todos los caches. Grosor por
            linea (10 FLAMINGO / 3 YACHT CLUB) y esquinas en inglete. */}
        <img
          src="/brand/wordmark-bold.svg"
          alt="Flamingo Yacht Club"
          className={`block h-full w-auto transition-opacity duration-500 ${white ? 'opacity-0' : 'opacity-100'}`}
        />
        <img
          src="/brand/wordmark-bold-white.svg"
          alt=""
          aria-hidden
          className={`absolute inset-0 h-full w-auto transition-opacity duration-500 ${white ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* eslint-enable @next/next/no-img-element */}
      </span>
      {/* El "powered by" del arte mide ~2px a este tamaño; va como texto HTML
          para que sea legible (all-caps + tracking, el puente tipográfico). */}
      <span
        className={`font-sans text-[7px] md:text-[9px] font-semibold uppercase tracking-wide2 whitespace-nowrap transition-colors duration-500 ${
          white ? 'text-white/80' : 'text-ink/70'
        }`}
      >
        powered by Marina Marbella
      </span>
    </span>
  );
}

export default function Navbar({ locale, menuBoats }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  // La barra se retira al bajar y reaparece al subir (patrón "mayordomo")
  const [hidden, setHidden] = useState(false);
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
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      if (Math.abs(y - lastY) > 8) {
        setHidden(y > lastY && y > 400);
        lastY = y;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    // El contenido de la página puede llegar en streaming después de que la
    // Navbar hidrate: re-comprobamos el marcador cuando el DOM cambia.
    const check = () => setOverDark(Boolean(document.querySelector('[data-navbar-on-dark]')));
    check();
    const mo = new MutationObserver(check);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (menuOpen) getLenis()?.stop();
    else getLenis()?.start();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    if (menuOpen) document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      getLenis()?.start();
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  // Menú tipo "range": la flota en grande a la izquierda, navegación a la derecha.
  // Los barcos llegan por props desde el layout (server) — salen del CMS.
  const models = menuBoats;

  // Orden pedido por el cliente: Membresía (con "cómo funciona" dentro), Flota,
  // Puerto base, Nosotros, Contacto. "Cómo funciona" ya no es item propio.
  const overlayLinks = [
    { href: `/${locale}/precios`, label: t('membership') },
    { href: `/${locale}/flota`, label: t('fleet') },
    { href: `/${locale}/puerto-base`, label: t('homePort') },
    { href: `/${locale}/nosotros`, label: t('about') },
    { href: `/${locale}/contacto`, label: t('contact') },
  ];

  // Al hacer scroll la barra se funde a negro (petición del cliente), con
  // texto y logo en blanco. Solo va en tinta sin scroll sobre un hero claro
  // (/flota, legales...).
  const onLight = !scrolled && !overDark;
  const textColor = onLight ? 'text-ink' : 'text-white';
  const barColor = onLight ? 'bg-ink' : 'bg-white';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-[transform,background-color,border-color] duration-500 ease-smooth ${
          hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'
        } ${scrolled ? 'bg-ink/95 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}
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
            className="absolute left-1/2 -translate-x-1/2"
          >
            <BrandLogo white={!onLight} />
          </Link>

          {/* RIGHT — language + Únete al club (abre el mismo funnel que "Hazte socio") */}
          <div className="flex items-center gap-4 md:gap-6">
            <LanguageSwitcher locale={locale} dark={!onLight} />
            <button
              type="button"
              onClick={openFunnel}
              className={`hidden sm:inline-flex items-center justify-center font-sans text-[11px] font-semibold uppercase tracking-wide2 px-5 py-2.5 transition-colors duration-300 ${
                onLight ? 'bg-ink text-white hover:bg-sea' : 'bg-white text-ink hover:bg-sea hover:text-white'
              }`}
            >
              {t('join')}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-3%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.3, ease: EASE } }}
            transition={{ duration: 0.55, ease: EASE }}
            className="fixed inset-0 z-50 bg-bone flex flex-col"
          >
            <div className="relative flex justify-between items-center px-6 md:px-10 h-[var(--header-h)] border-b border-line">
              <span className="w-8" aria-hidden />
              <Link href={`/${locale}`} aria-label="Flamingo Yacht Club" className="absolute left-1/2 -translate-x-1/2">
                <BrandLogo white={false} />
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
            <div data-lenis-prevent className="flex-1 overflow-y-auto">
              <div className="max-w-[1480px] mx-auto px-6 md:px-10 py-10 md:py-16 grid md:grid-cols-[1.5fr_1fr] gap-x-12 gap-y-12">
                {/* LA FLOTA */}
                <div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.08, duration: 0.4, ease: EASE }}
                    className="eyebrow mb-5 md:mb-7"
                  >
                    {t('fleet')}
                  </motion.p>
                  {models.map((b, i) => (
                    <div key={b.slug} className="overflow-hidden">
                      {/* Masked reveal: el nombre sube desde su línea base */}
                      <motion.div
                        initial={{ y: '110%' }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.15 + i * 0.06, duration: 0.7, ease: EASE }}
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
                    </div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.36, duration: 0.4, ease: EASE }}
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
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.16 + i * 0.05, duration: 0.4, ease: EASE }}
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
                    transition={{ delay: 0.42, duration: 0.4, ease: EASE }}
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
