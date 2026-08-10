import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/locales';

export default createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always',
});

export const config = {
  // "studio" excluido: si no, next-intl redirige /studio → /es/studio y el
  // panel de Sanity nunca carga.
  matcher: ['/((?!api|studio|_next|_vercel|.*\\..*).*)'],
};
