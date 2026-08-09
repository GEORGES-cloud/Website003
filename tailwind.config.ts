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
        sea: '#2C4A4F', // fondo profundo — ya no es color de interacción
        'sea-light': '#5E7E80',
        line: '#E6E2DA', // hairline borders
        // Rosa de marca. Una sola tinta a cuatro luminancias (H≈341), no cuatro
        // rosas distintos. `flamingo` es el del logo y es SOLO decorativo: sobre
        // bone da 4.18:1, así que no vale para texto pequeño ni para un botón
        // relleno con texto blanco (4.40:1, no pasa AA). Para eso está -deep.
        flamingo: '#E81E5C', // marca: logo, puntos, filetes
        'flamingo-deep': '#B01046', // 6.63:1 sobre bone — enlaces, eyebrows, foco
        'flamingo-soft': '#F27A97', // 6.70:1 sobre ink — el acento en oscuro
        'flamingo-tint': '#FBEAEF', // lavado: relleno de chips y hovers
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        // Fallback serif: con 'sans-serif' se veía un grotesco durante el swap.
        display: ['var(--font-display)', 'Didot', 'Bodoni MT', 'Georgia', 'serif'],
      },
      letterSpacing: {
        eyebrow: '0.3em',
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
