import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Manrope, Montserrat } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import CookieBanner from '@/components/CookieBanner';
import FloatingContact from '@/components/FloatingContact';
import SmoothScroll from '@/components/SmoothScroll';
import JoinFunnelProvider from '@/components/JoinFunnelProvider';
import JoinFunnel from '@/components/JoinFunnel';
import { locales, isLocale } from '@/lib/locales';

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['200', '300', '400', '500', '600'],
  variable: '--font-manrope',
  display: 'swap',
});

// Display face for the brand wordmark — heavy geometric grotesque matching the logo.
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500', '900'],
  variable: '--font-display',
  display: 'swap',
});

const ogLocale: Record<string, string> = {
  es: 'es_ES',
  en: 'en_US',
  sv: 'sv_SE',
  ru: 'ru_RU',
  de: 'de_DE',
  fr: 'fr_FR',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: { absolute: t('title'), template: '%s · Flamingo Yacht Club' },
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: { ...Object.fromEntries(locales.map((l) => [l, `/${l}`])), 'x-default': '/es' },
    },
    openGraph: { locale: ogLocale[locale] ?? 'es_ES' },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(locale)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${manrope.variable} ${montserrat.variable} bg-bone text-ink antialiased`} suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-ink focus:text-white focus:px-5 focus:py-3 focus:text-sm"
        >
          {({ es: 'Saltar al contenido', en: 'Skip to content', sv: 'Hoppa till innehåll', ru: 'Перейти к содержимому', de: 'Zum Inhalt springen', fr: 'Aller au contenu' } as Record<string, string>)[locale] ?? 'Skip to content'}
        </a>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <JoinFunnelProvider>
            <SmoothScroll />
            <Navbar locale={locale} />
            <main id="main">{children}</main>
            <Footer locale={locale} />
            <FloatingContact locale={locale} />
            <CookieBanner locale={locale} />
            <JoinFunnel locale={locale} />
          </JoinFunnelProvider>
        </NextIntlClientProvider>
        <JsonLd locale={locale} />
      </body>
    </html>
  );
}
