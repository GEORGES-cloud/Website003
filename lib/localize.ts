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
import { sanityEnabled } from '@/sanity/env';
import { sanityFetch } from '@/sanity/lib/fetch';
import {
  FLEET_QUERY,
  FAQS_QUERY,
  TESTIMONIALS_QUERY,
  STATS_QUERY,
  MILESTONES_QUERY,
  TIERS_QUERY,
  LEGAL_QUERY,
  REEL_QUERY,
  SETTINGS_QUERY,
} from '@/sanity/lib/queries';

/* Capa de acceso al contenido. Mismo contrato de siempre (ahora async):
   - Con NEXT_PUBLIC_SANITY_PROJECT_ID configurado, lee del CMS (GROQ con
     fallback inglés→español) y cachea por etiquetas (_type) que el webhook
     de /api/revalidate refresca al publicar.
   - Sin proyecto (o con un dataset aún vacío), sirve los datos locales de
     lib/content, lib/data y lib/legal: la web funciona igual antes y después
     de crear el CMS. */

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

/* ——— Fallback local (la lógica de siempre) ——— */

function localFleet(locale: string): LocalBoat[] {
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

/* ——— Filas tal y como llegan de Sanity ——— */

interface SanityBoatRow {
  slug: string;
  name: string;
  shortName?: string;
  lengthM?: string;
  capacity?: number;
  year?: number;
  active?: boolean;
  specs?: Boat['specs'];
  video?: string;
  tagline?: string;
  description?: string;
  image?: string;
  slides?: (string | null)[];
  heroImage?: string;
  videoPoster?: string;
  gallery?: { url?: string; alt?: string }[];
}

function mapBoat(row: SanityBoatRow): LocalBoat {
  const gallery = (row.gallery ?? []).filter((g) => g.url);
  return {
    slug: row.slug,
    name: row.name,
    shortName: row.shortName,
    lengthM: row.lengthM ?? '',
    capacity: row.capacity ?? 0,
    year: row.year ?? 0,
    active: Boolean(row.active),
    specs: row.specs ?? { length: row.lengthM ?? '' },
    image: row.image ?? '',
    slides: row.slides?.filter((s): s is string => Boolean(s)),
    heroImage: row.heroImage ?? undefined,
    video: row.video ?? undefined,
    videoPoster: row.videoPoster ?? undefined,
    gallery: gallery.length ? gallery.map((g) => g.url as string) : undefined,
    galleryAlts: gallery.length ? gallery.map((g) => g.alt ?? '') : undefined,
    tagline: row.tagline ?? '',
    description: row.description ?? '',
  };
}

/* ——— API pública (async, mismo contrato) ——— */

export async function getFleet(locale: string): Promise<LocalBoat[]> {
  if (sanityEnabled) {
    const rows = await sanityFetch<SanityBoatRow[]>(FLEET_QUERY, { locale }, ['boat']);
    if (rows?.length) return rows.map(mapBoat);
  }
  return localFleet(locale);
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
  if (sanityEnabled) {
    const rows = await sanityFetch<{ author: string; quote?: string; role?: string }[]>(
      TESTIMONIALS_QUERY,
      { locale },
      ['testimonial']
    );
    if (rows?.length) {
      return rows.map((r) => ({ author: r.author, quote: r.quote ?? '', role: r.role ?? '' }));
    }
  }
  return testimonials.map((t, i) => ({
    author: t.author,
    quote: pick(locale, t.quote, t.quoteEn, extra[locale]?.testimonials?.[i]?.quote),
    role: locale === 'es' ? t.role : extra[locale]?.testimonials?.[i]?.role || t.role,
  }));
}

export async function getTiers(locale: string) {
  if (sanityEnabled) {
    const rows = await sanityFetch<
      { id: string; name?: string; price?: string; featured?: boolean; period?: string; tagline?: string; features?: { text?: string }[] }[]
    >(TIERS_QUERY, { locale }, ['tier']);
    if (rows?.length) {
      return rows.map((r) => ({
        id: r.id,
        name: r.name ?? '',
        price: r.price ?? '',
        featured: Boolean(r.featured),
        period: r.period ?? '',
        tagline: r.tagline ?? '',
        features: (r.features ?? []).map((f) => f.text ?? '').filter(Boolean),
      }));
    }
  }
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
  if (sanityEnabled) {
    const rows = await sanityFetch<{ q?: string; a?: string }[]>(FAQS_QUERY, { locale }, ['faq']);
    if (rows?.length) return rows.map((r) => ({ q: r.q ?? '', a: r.a ?? '' }));
  }
  return faqs.map((f, i) => ({
    q: pick(locale, f.q, f.qEn, extra[locale]?.faqs?.[i]?.q),
    a: pick(locale, f.a, f.aEn, extra[locale]?.faqs?.[i]?.a),
  }));
}

/* Las rutas/destinos se quedan en código (lib/content.ts): fuera del alcance
   del CMS acordado. Async por uniformidad con el resto de la capa. */
export async function getRoutes(locale: string) {
  return routes.map((r, i) => ({
    name: extra[locale]?.routes?.[i]?.name || r.name,
    distance: r.distance,
    time: r.time,
    desc: pick(locale, r.desc, r.descEn, extra[locale]?.routes?.[i]?.desc),
  }));
}

export async function getStats(locale: string) {
  if (sanityEnabled) {
    const rows = await sanityFetch<{ value: number; suffix?: string; label?: string }[]>(
      STATS_QUERY,
      { locale },
      ['stat']
    );
    if (rows?.length) {
      return rows.map((r) => ({ value: r.value, suffix: r.suffix ?? undefined, label: r.label ?? '' }));
    }
  }
  return stats.map((s, i) => ({
    value: s.value,
    suffix: s.suffix,
    label: pick(locale, s.label, s.labelEn, extra[locale]?.stats?.[i]?.label),
  }));
}

export async function getMilestones(locale: string) {
  if (sanityEnabled) {
    const rows = await sanityFetch<{ year: string; highlight?: boolean; title?: string; desc?: string }[]>(
      MILESTONES_QUERY,
      { locale },
      ['milestone']
    );
    if (rows?.length) {
      return rows.map((r) => ({
        year: r.year,
        highlight: Boolean(r.highlight),
        title: r.title ?? '',
        desc: r.desc ?? '',
      }));
    }
  }
  return milestones.map((m, i) => ({
    year: m.year,
    highlight: m.highlight,
    title: pick(locale, m.title, m.titleEn, extra[locale]?.milestones?.[i]?.title),
    desc: pick(locale, m.desc, m.descEn, extra[locale]?.milestones?.[i]?.desc),
  }));
}

export async function getLegal(locale: string, doc: Doc): Promise<LegalDoc> {
  if (sanityEnabled) {
    const row = await sanityFetch<{
      title?: string;
      updated?: string;
      intro?: string;
      sections?: { heading?: string; body?: string }[];
    } | null>(LEGAL_QUERY, { locale, id: `legal-${doc}` }, ['legalDoc']);
    if (row?.title) {
      return {
        title: row.title,
        updated: row.updated ?? '',
        intro: row.intro ?? '',
        // En el CMS cada sección es un solo texto; los párrafos se separan
        // por línea en blanco (LegalDocView los pinta como <p> sueltos).
        sections: (row.sections ?? []).map((s) => ({
          heading: s.heading ?? '',
          body: (s.body ?? '').split(/\n\s*\n/).filter(Boolean),
        })),
      };
    }
  }
  return extra[locale]?.legal?.[doc] ?? legal[doc][locale as 'es'] ?? legal[doc].en ?? legal[doc].es;
}

export async function getLifestyleReel(locale: string): Promise<{ images: string[]; alts: string[] }> {
  if (sanityEnabled) {
    const rows = await sanityFetch<{ url?: string; alt?: string }[] | null>(
      REEL_QUERY,
      { locale },
      ['lifestyleGallery']
    );
    const withUrl = (rows ?? []).filter((r) => r.url);
    if (withUrl.length) {
      return { images: withUrl.map((r) => r.url as string), alts: withUrl.map((r) => r.alt ?? '') };
    }
  }
  return { images: REEL, alts: REEL_ALTS };
}

export interface SiteSettings {
  telephone: string;
  email: string;
  sameAs: string[];
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const fallback: SiteSettings = {
    telephone: `+${process.env.NEXT_PUBLIC_WHATSAPP ?? '34722454277'}`,
    email: process.env.CONTACT_EMAIL ?? 'Hello@flamingoyachtclub.com',
    sameAs: [],
  };
  if (sanityEnabled) {
    const row = await sanityFetch<Partial<SiteSettings> | null>(SETTINGS_QUERY, {}, ['siteSettings']);
    if (row) {
      return {
        telephone: row.telephone || fallback.telephone,
        email: row.email || fallback.email,
        sameAs: row.sameAs ?? [],
      };
    }
  }
  return fallback;
}
