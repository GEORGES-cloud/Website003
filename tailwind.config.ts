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
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
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
