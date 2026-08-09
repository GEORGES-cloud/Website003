import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Elite, warm-minimal palette — Marbella members club
        white: '#FFFFFF',
        bone: '#FAF9F6', // primary background — warm off-white
        sand: '#F1EEE8', // alternating sections
        'sand-2': '#E7E3DA',
        ink: '#1A1916', // warm near-black — primary text
        muted: '#6E6A62', // warm grey — secondary text
        sea: '#2C4A4F', // restrained deep marine — used sparingly
        'sea-light': '#5E7E80',
        line: '#E6E2DA', // hairline borders
        // Único color de marca (el flamenco del logo). Reservado para acentos
        // puntuales — nunca como color de sección ni de texto corrido.
        flamingo: '#E31C5F',
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
      },
      letterSpacing: {
        // Única fuente de verdad del tracking de eyebrow (antes el token decía
        // 0.3em y la clase .eyebrow 0.34em, así que no casaban).
        eyebrow: '0.34em',
        wide2: '0.18em',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
};

export default config;
