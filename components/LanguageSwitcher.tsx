'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { locales, localeNames } from '@/lib/locales';

interface LanguageSwitcherProps {
  locale: string;
  dark?: boolean; // true when sitting on a dark background (hero)
  className?: string;
}

export default function LanguageSwitcher({ locale, dark = false, className = '' }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const change = (next: string) => {
    setOpen(false);
    if (next === locale) return;
    router.push(pathname.replace(`/${locale}`, `/${next}`));
  };

  const base = dark ? 'text-white/70 hover:text-white' : 'text-ink/55 hover:text-sea';

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-1.5 font-sans text-[11px] font-semibold tracking-wide2 uppercase transition-colors ${base}`}
      >
        {locale}
        <svg width="9" height="6" viewBox="0 0 9 6" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M1 1L4.5 4.5L8 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            role="listbox"
            className="absolute right-0 mt-3 min-w-[150px] bg-bone border border-line shadow-xl py-2 z-50"
          >
            {locales.map((l) => (
              <li key={l}>
                <button
                  onClick={() => change(l)}
                  aria-selected={l === locale}
                  className={`w-full text-left px-5 py-2.5 font-sans text-sm transition-colors ${
                    l === locale ? 'text-sea font-medium' : 'text-ink/70 hover:text-ink hover:bg-sand'
                  }`}
                >
                  {localeNames[l]}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
