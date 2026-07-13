import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/locales';

export default createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always',
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
