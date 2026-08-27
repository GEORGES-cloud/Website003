import { fleet, testimonials, ACTIVE_BOAT_SLUGS } from './data';
import type { Boat } from './data';
import { tiers, faqs, routes, stats, milestones } from './content';
import { legal } from './legal';
import type { LegalDoc } from './legal';
import { REEL, REEL_ALTS } from './reel-data';
import sv from './strings/sv.json';
import ru from './strings/ru.json';
import de from './strings/de.json';
import fr from './strings/fr.json';

/* Capa de acceso al contenido. Sirve los datos de lib/content, lib/data,
   lib/legal, lib/reel-data y lib/strings/*.json.

   Español e inglés viven en los archivos base; el resto de idiomas en
   lib/strings/<locale>.json, con vuelta al inglés cuando falta un valor.

   Las funciones son async por contrato histórico (aquí hubo un CMS): los 17
   archivos que consumen esta capa las esperan con await. */

type Doc = 'privacy' | 'terms' | 'notice' | 'cookies';

interface Strings {
  fleet?: Record<string, { tagline?: string; description?: string }>;
  testimonials?: { quote?: string; role?: string }[];
  tiers?: Record<string, { tagline?: string; period?: string; features?: string[] }>;
  faqs?: { q?: string; a?: string }[];
  routes?: { name?: string; desc?: string }[];
  stats?: { label?: string }[];
  milestones?: { title?: string; desc?: string }[];
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
  shortName?: string;
  lengthM: string;
  capacity: number;
  year: number;
  active: boolean;
  specs: Boat['specs'];
  image: string;
  slides?: string[];
  heroImage?: string;
  video?: string;
  videoPoster?: string;
  gallery?: string[];
  galleryAlts?: string[];
  tagline: string;
  description: string;
}

/* ——— API pública (async, mismo contrato) ——— */

export async function getFleet(locale: string): Promise<LocalBoat[]> {
  return fleet.map((b) => ({
    slug: b.slug,
    name: b.name,
    shortName: b.shortName,
    lengthM: b.lengthM,
    capacity: b.capacity,
    year: b.year,
    active: ACTIVE_BOAT_SLUGS.includes(b.slug),
    specs: b.specs,
    image: b.image,
    slides: b.slides,
    heroImage: b.heroImage,
    video: b.video,
    videoPoster: b.videoPoster,
    gallery: b.gallery,
    galleryAlts: locale === 'es' ? b.galleryAlts : b.galleryAltsEn ?? b.galleryAlts,
    tagline: pick(locale, b.tagline, b.taglineEn, extra[locale]?.fleet?.[b.slug]?.tagline),
    description: pick(locale, b.description, b.descriptionEn, extra[locale]?.fleet?.[b.slug]?.description),
  }));
}

export async function getBoat(locale: string, slug: string): Promise<LocalBoat | undefined> {
  return (await getFleet(locale)).find((b) => b.slug === slug);
}

// Only the boats currently active in the club. Others stay in the data, hidden.
export async function getActiveFleet(locale: string): Promise<LocalBoat[]> {
  return (await getFleet(locale)).filter((b) => b.active);
}

export async function getActiveBoatSlugs(): Promise<string[]> {
  return (await getActiveFleet('es')).map((b) => b.slug);
}

/** Lo mínimo que necesita el menú de la barra: nombre y ruta de cada barco activo. */
export async function getMenuBoats(locale: string) {
  return (await getActiveFleet(locale)).map((b) => ({
    slug: b.slug,
    name: b.name,
    shortName: b.shortName,
  }));
}

export async function getTestimonials(locale: string) {
  return testimonials.map((t, i) => ({
    author: t.author,
    quote: pick(locale, t.quote, t.quoteEn, extra[locale]?.testimonials?.[i]?.quote),
    role: locale === 'es' ? t.role : extra[locale]?.testimonials?.[i]?.role || t.role,
  }));
}

export async function getTiers(locale: string) {
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

export async function getFaqs(locale: string) {
  return faqs.map((f, i) => ({
    q: pick(locale, f.q, f.qEn, extra[locale]?.faqs?.[i]?.q),
    a: pick(locale, f.a, f.aEn, extra[locale]?.faqs?.[i]?.a),
  }));
}

export async function getRoutes(locale: string) {
  return routes.map((r, i) => ({
    name: extra[locale]?.routes?.[i]?.name || r.name,
    distance: r.distance,
    time: r.time,
    desc: pick(locale, r.desc, r.descEn, extra[locale]?.routes?.[i]?.desc),
  }));
}

export async function getStats(locale: string) {
  return stats.map((s, i) => ({
    value: s.value,
    suffix: s.suffix,
    label: pick(locale, s.label, s.labelEn, extra[locale]?.stats?.[i]?.label),
  }));
}

export async function getMilestones(locale: string) {
  return milestones.map((m, i) => ({
    year: m.year,
    highlight: m.highlight,
    title: pick(locale, m.title, m.titleEn, extra[locale]?.milestones?.[i]?.title),
    desc: pick(locale, m.desc, m.descEn, extra[locale]?.milestones?.[i]?.desc),
  }));
}

export async function getLegal(locale: string, doc: Doc): Promise<LegalDoc> {
  return extra[locale]?.legal?.[doc] ?? legal[doc][locale as 'es'] ?? legal[doc].en ?? legal[doc].es;
}

export async function getLifestyleReel(locale: string): Promise<{ images: string[]; alts: string[] }> {
  return { images: REEL, alts: REEL_ALTS };
}

export interface SiteSettings {
  telephone: string;
  email: string;
  sameAs: string[];
}

/* Redes sociales: la web no publica ninguna todavía. Cuando el club las
   facilite, se añaden aquí y salen en el JSON-LD. */
export async function getSiteSettings(): Promise<SiteSettings> {
  return {
    telephone: `+${process.env.NEXT_PUBLIC_WHATSAPP ?? '34722454277'}`,
    email: process.env.CONTACT_EMAIL ?? 'Hello@flamingoyachtclub.com',
    sameAs: [],
  };
}
