import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Manrope, Bodoni_Moda } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import CookieBanner from '@/components/CookieBanner';
import DiscountQuiz from '@/components/DiscountQuiz';
import FloatingContact from '@/components/FloatingContact';
import SmoothScroll from '@/components/SmoothScroll';
import JoinFunnelProvider from '@/components/JoinFunnelProvider';
import MotionProvider from '@/components/MotionProvider';
import JoinFunnel from '@/components/JoinFunnel';
import { locales, isLocale } from '@/lib/locales';

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['200', '300', '400', '500', '600'],
  variable: '--font-manrope',
  display: 'swap',
});

// Didone de marca — la serif del logotipo oficial. El eje óptico es la razón de
// elegir Bodoni Moda y no otra: el lockup pide el corte display (serifas de
// pelo) por encima de 40px, mientras "YACHT CLUB" a 9px y las cifras necesitan
// el corte de texto con los finos engrosados. Una sola familia cubre los dos
// extremos sin que se rompa el trazo.
// Sin cirílico a propósito: la Didone no debe entrar en los titulares del
// locale `ru` — de eso se sigue encargando Manrope.
const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  axes: ['opsz'],
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
      <body className={`${manrope.variable} ${bodoni.variable} bg-bone text-ink antialiased`} suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-ink focus:text-white focus:px-5 focus:py-3 focus:text-sm"
        >
          {({ es: 'Saltar al contenido', en: 'Skip to content', sv: 'Hoppa till innehåll', ru: 'Перейти к содержимому', de: 'Zum Inhalt springen', fr: 'Aller au contenu' } as Record<string, string>)[locale] ?? 'Skip to content'}
        </a>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <MotionProvider>
          <JoinFunnelProvider>
            <SmoothScroll />
            <Navbar locale={locale} />
            <main id="main">{children}</main>
            <Footer locale={locale} />
            <FloatingContact locale={locale} />
            <CookieBanner locale={locale} />
            <DiscountQuiz locale={locale} />
            <JoinFunnel locale={locale} />
          </JoinFunnelProvider>
          </MotionProvider>
        </NextIntlClientProvider>
        <JsonLd locale={locale} />
      </body>
    </html>
  );
}
