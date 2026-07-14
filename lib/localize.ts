import { fleet, testimonials, ACTIVE_BOAT_SLUGS } from './data';
import type { Boat } from './data';
import { tiers, faqs, routes, stats } from './content';
import { legal } from './legal';
import type { LegalDoc } from './legal';
import sv from './strings/sv.json';
import ru from './strings/ru.json';
import de from './strings/de.json';
import fr from './strings/fr.json';

type Doc = 'privacy' | 'terms' | 'notice';

interface Strings {
  fleet?: Record<string, { tagline?: string; description?: string }>;
  testimonials?: { quote?: string; role?: string }[];
  tiers?: Record<string, { tagline?: string; period?: string; features?: string[] }>;
  faqs?: { q?: string; a?: string }[];
  routes?: { name?: string; desc?: string }[];
  stats?: { label?: string }[];
  legal?: Partial<Record<Doc, LegalDoc>>;
}

const extra: Record<string, Strings> = {
  sv: sv as Strings,
  ru: ru as Strings,
  de: de as Strings,
  fr: fr as Strings,
};

// pick: Spanish/English come from the base data; other locales from the
// per-language strings file, falling back to English when a value is missing.
function pick(locale: string, es: string, en: string, ex?: string): string {
  if (locale === 'es') return es;
  if (locale === 'en') return en;
  return ex || en;
}

export interface LocalBoat {
  slug: string;
  name: string;
  lengthM: string;
  capacity: number;
  year: number;
  specs: Boat['specs'];
  image: string;
  gallery?: string[];
  tagline: string;
  description: string;
}

export function getFleet(locale: string): LocalBoat[] {
  return fleet.map((b) => ({
    slug: b.slug,
    name: b.name,
    lengthM: b.lengthM,
    capacity: b.capacity,
    year: b.year,
    specs: b.specs,
    image: b.image,
    gallery: b.gallery,
    tagline: pick(locale, b.tagline, b.taglineEn, extra[locale]?.fleet?.[b.slug]?.tagline),
    description: pick(locale, b.description, b.descriptionEn, extra[locale]?.fleet?.[b.slug]?.description),
  }));
}

export function getBoat(locale: string, slug: string): LocalBoat | undefined {
  return getFleet(locale).find((b) => b.slug === slug);
}

// Only the boats currently active in the club (one for now). Others stay in the data, hidden.
export function getActiveFleet(locale: string): LocalBoat[] {
  return getFleet(locale).filter((b) => ACTIVE_BOAT_SLUGS.includes(b.slug));
}

export function getTestimonials(locale: string) {
  return testimonials.map((t, i) => ({
    author: t.author,
    quote: pick(locale, t.quote, t.quoteEn, extra[locale]?.testimonials?.[i]?.quote),
    role: locale === 'es' ? t.role : extra[locale]?.testimonials?.[i]?.role || t.role,
  }));
}

export function getTiers(locale: string) {
  return tiers.map((t) => ({
    id: t.id,
    name: t.name,
    price: t.price,
    featured: t.featured,
    period: locale === 'es' ? t.period : extra[locale]?.tiers?.[t.id]?.period || t.periodEn,
    tagline: pick(locale, t.tagline, t.taglineEn, extra[locale]?.tiers?.[t.id]?.tagline),
    features:
      locale === 'es'
        ? t.features
        : locale === 'en'
          ? t.featuresEn
          : extra[locale]?.tiers?.[t.id]?.features || t.featuresEn,
  }));
}

export function getFaqs(locale: string) {
  return faqs.map((f, i) => ({
    q: pick(locale, f.q, f.qEn, extra[locale]?.faqs?.[i]?.q),
    a: pick(locale, f.a, f.aEn, extra[locale]?.faqs?.[i]?.a),
  }));
}

export function getRoutes(locale: string) {
  return routes.map((r, i) => ({
    name: extra[locale]?.routes?.[i]?.name || r.name,
    distance: r.distance,
    time: r.time,
    desc: pick(locale, r.desc, r.descEn, extra[locale]?.routes?.[i]?.desc),
  }));
}

export function getStats(locale: string) {
  return stats.map((s, i) => ({
    value: s.value,
    suffix: s.suffix,
    label: pick(locale, s.label, s.labelEn, extra[locale]?.stats?.[i]?.label),
  }));
}

export function getLegal(locale: string, doc: Doc): LegalDoc {
  return extra[locale]?.legal?.[doc] ?? legal[doc][locale as 'es'] ?? legal[doc].en ?? legal[doc].es;
}
