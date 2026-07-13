export const locales = ['es', 'en', 'sv', 'ru', 'de', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  sv: 'Svenska',
  ru: 'Русский',
  de: 'Deutsch',
  fr: 'Français',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
