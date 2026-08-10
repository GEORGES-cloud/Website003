/* Migración one-shot del contenido local a Sanity. Idempotente: los
   documentos usan _id determinista (createOrReplace) y las imágenes se
   deduplican por nombre de archivo, así que puede ejecutarse varias veces.

   Requisitos (.env.local):
     NEXT_PUBLIC_SANITY_PROJECT_ID=xxxx
     NEXT_PUBLIC_SANITY_DATASET=production
     SANITY_API_WRITE_TOKEN=sk...   (token con permiso Editor)

   Ejecutar:  npx tsx scripts/migrate-to-sanity.ts

   El emparejamiento de traducciones replica la lógica actual de
   lib/localize.ts UNA última vez (por slug, id o índice); a partir de aquí
   cada traducción vive keyed por idioma dentro de su campo y el acople
   posicional desaparece. */

import { createClient } from '@sanity/client';
import { createReadStream, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { fleet, testimonials, ACTIVE_BOAT_SLUGS } from '../lib/data';
import { tiers, faqs, stats, milestones } from '../lib/content';
import { legal } from '../lib/legal';
import { REEL, REEL_ALTS } from '../lib/reel-data';
import svStrings from '../lib/strings/sv.json';
import ruStrings from '../lib/strings/ru.json';
import deStrings from '../lib/strings/de.json';
import frStrings from '../lib/strings/fr.json';

const ROOT = path.resolve(__dirname, '..');

// — Carga manual de .env.local (tsx no lo hace solo) —
const envFile = path.join(ROOT, '.env.local');
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    'Faltan variables: NEXT_PUBLIC_SANITY_PROJECT_ID y SANITY_API_WRITE_TOKEN en .env.local.\n' +
      'Crea el proyecto en sanity.io/manage y vuelve a ejecutar (ver PROXIMOS-PASOS.md).'
  );
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: '2024-10-01', token, useCdn: false });

// — Helpers de internacionalización (formato del plugin internationalized-array) —
type IntlValue = { _type: string; _key: string; value: string };
const LOCALES = ['es', 'en', 'sv', 'ru', 'de', 'fr'] as const;

function intl(kind: 'String' | 'Text', values: Partial<Record<string, string | undefined>>): IntlValue[] {
  return LOCALES.filter((l) => values[l]).map((l) => ({
    _type: `internationalizedArray${kind}Value`,
    _key: l,
    value: values[l] as string,
  }));
}

const extras: Record<string, typeof svStrings> = {
  sv: svStrings,
  ru: ruStrings,
  de: deStrings,
  fr: frStrings,
};
const EXTRA_LOCALES = ['sv', 'ru', 'de', 'fr'] as const;

// — Subida de imágenes con deduplicación por nombre de archivo —
const assetCache = new Map<string, string>();

async function uploadImage(publicPath: string): Promise<string> {
  const cached = assetCache.get(publicPath);
  if (cached) return cached;

  const filename = path.basename(publicPath);
  const existing = await client.fetch<string | null>(
    '*[_type == "sanity.imageAsset" && originalFilename == $fn][0]._id',
    { fn: filename }
  );
  if (existing) {
    assetCache.set(publicPath, existing);
    return existing;
  }

  const fullPath = path.join(ROOT, 'public', publicPath);
  if (!existsSync(fullPath)) throw new Error(`No existe la imagen: ${fullPath}`);
  const asset = await client.assets.upload('image', createReadStream(fullPath), { filename });
  assetCache.set(publicPath, asset._id);
  console.log(`  ↑ ${filename}`);
  return asset._id;
}

async function captionedImage(publicPath: string, alts?: Partial<Record<string, string>>, key?: string) {
  const assetId = await uploadImage(publicPath);
  return {
    _type: 'captionedImage',
    _key: key ?? path.basename(publicPath, path.extname(publicPath)),
    asset: { _type: 'reference', _ref: assetId },
    ...(alts && Object.values(alts).some(Boolean) ? { alt: intl('String', alts) } : {}),
  };
}

async function run() {
  console.log(`Migrando a ${projectId}/${dataset}...\n`);

  // ——— Flota ———
  console.log('Flota:');
  for (const [i, b] of fleet.entries()) {
    const slugExtras = (loc: (typeof EXTRA_LOCALES)[number]) => extras[loc].fleet?.[b.slug as keyof typeof svStrings.fleet];
    const galleryImages = [];
    for (const [gi, src] of (b.gallery ?? []).entries()) {
      galleryImages.push(
        await captionedImage(src, { es: b.galleryAlts?.[gi], en: b.galleryAltsEn?.[gi] }, `g-${path.basename(src, '.jpg')}`)
      );
    }
    const slides = [];
    for (const src of b.slides ?? []) {
      slides.push(await captionedImage(src, undefined, `s-${path.basename(src, '.jpg')}`));
    }

    await client.createOrReplace({
      _id: `boat-${b.slug}`,
      _type: 'boat',
      name: b.name,
      shortName: b.shortName,
      slug: { _type: 'slug', current: b.slug },
      active: ACTIVE_BOAT_SLUGS.includes(b.slug),
      order: i * 10,
      lengthM: b.lengthM,
      capacity: b.capacity,
      year: b.year,
      tagline: intl('String', {
        es: b.tagline,
        en: b.taglineEn,
        ...Object.fromEntries(EXTRA_LOCALES.map((l) => [l, slugExtras(l)?.tagline])),
      }),
      description: intl('Text', {
        es: b.description,
        en: b.descriptionEn,
        ...Object.fromEntries(EXTRA_LOCALES.map((l) => [l, slugExtras(l)?.description])),
      }),
      specs: b.specs,
      image: await captionedImage(b.image, undefined, 'main'),
      ...(slides.length ? { slides } : {}),
      ...(b.heroImage ? { heroImage: await captionedImage(b.heroImage, undefined, 'hero') } : {}),
      ...(b.video ? { video: b.video } : {}),
      ...(b.videoPoster ? { videoPoster: await captionedImage(b.videoPoster, undefined, 'poster') } : {}),
      ...(galleryImages.length ? { gallery: galleryImages } : {}),
    });
    console.log(`  ✔ boat-${b.slug}${ACTIVE_BOAT_SLUGS.includes(b.slug) ? ' (activo)' : ''}`);
  }

  // ——— FAQs ———
  console.log('FAQs:');
  for (const [i, f] of faqs.entries()) {
    await client.createOrReplace({
      _id: `faq-${i + 1}`,
      _type: 'faq',
      order: i * 10,
      question: intl('String', {
        es: f.q,
        en: f.qEn,
        ...Object.fromEntries(EXTRA_LOCALES.map((l) => [l, extras[l].faqs?.[i]?.q])),
      }),
      answer: intl('Text', {
        es: f.a,
        en: f.aEn,
        ...Object.fromEntries(EXTRA_LOCALES.map((l) => [l, extras[l].faqs?.[i]?.a])),
      }),
    });
  }
  console.log(`  ✔ ${faqs.length} preguntas`);

  // ——— Testimonios ———
  console.log('Testimonios:');
  for (const [i, t] of testimonials.entries()) {
    await client.createOrReplace({
      _id: `testimonial-${i + 1}`,
      _type: 'testimonial',
      order: i * 10,
      author: t.author,
      role: intl('String', {
        es: t.role,
        ...Object.fromEntries(EXTRA_LOCALES.map((l) => [l, extras[l].testimonials?.[i]?.role])),
      }),
      quote: intl('Text', {
        es: t.quote,
        en: t.quoteEn,
        ...Object.fromEntries(EXTRA_LOCALES.map((l) => [l, extras[l].testimonials?.[i]?.quote])),
      }),
    });
  }
  console.log(`  ✔ ${testimonials.length} testimonios`);

  // ——— Cifras ———
  console.log('Cifras:');
  for (const [i, s] of stats.entries()) {
    await client.createOrReplace({
      _id: `stat-${i + 1}`,
      _type: 'stat',
      order: i * 10,
      value: s.value,
      ...(s.suffix ? { suffix: s.suffix } : {}),
      label: intl('String', {
        es: s.label,
        en: s.labelEn,
        ...Object.fromEntries(EXTRA_LOCALES.map((l) => [l, extras[l].stats?.[i]?.label])),
      }),
    });
  }
  console.log(`  ✔ ${stats.length} cifras`);

  // ——— Hitos ———
  console.log('Hitos:');
  for (const [i, m] of milestones.entries()) {
    await client.createOrReplace({
      _id: `milestone-${m.year}`,
      _type: 'milestone',
      order: i * 10,
      year: m.year,
      highlight: Boolean(m.highlight),
      title: intl('String', {
        es: m.title,
        en: m.titleEn,
        ...Object.fromEntries(EXTRA_LOCALES.map((l) => [l, extras[l].milestones?.[i]?.title])),
      }),
      desc: intl('Text', {
        es: m.desc,
        en: m.descEn,
        ...Object.fromEntries(EXTRA_LOCALES.map((l) => [l, extras[l].milestones?.[i]?.desc])),
      }),
    });
  }
  console.log(`  ✔ ${milestones.length} hitos`);

  // ——— Membresía ———
  console.log('Membresía:');
  for (const [i, t] of tiers.entries()) {
    const tierExtras = (loc: (typeof EXTRA_LOCALES)[number]) => extras[loc].tiers?.[t.id as keyof typeof svStrings.tiers];
    await client.createOrReplace({
      _id: `tier-${t.id}`,
      _type: 'tier',
      tierId: t.id,
      order: i * 10,
      name: intl('String', { es: t.name, en: t.name }),
      price: t.price,
      featured: Boolean(t.featured),
      period: intl('String', {
        es: t.period,
        en: t.periodEn,
        ...Object.fromEntries(EXTRA_LOCALES.map((l) => [l, tierExtras(l)?.period])),
      }),
      tagline: intl('String', {
        es: t.tagline,
        en: t.taglineEn,
        ...Object.fromEntries(EXTRA_LOCALES.map((l) => [l, tierExtras(l)?.tagline])),
      }),
      features: t.features.map((feat, fi) => ({
        _type: 'feature',
        _key: `f${fi}`,
        text: intl('String', {
          es: feat,
          en: t.featuresEn[fi],
          ...Object.fromEntries(EXTRA_LOCALES.map((l) => [l, tierExtras(l)?.features?.[fi]])),
        }),
      })),
    });
    console.log(`  ✔ tier-${t.id} (${t.features.length} ventajas × 6 idiomas)`);
  }

  // ——— Textos legales ———
  console.log('Textos legales:');
  const docKeys = ['privacy', 'terms', 'notice', 'cookies'] as const;
  for (const key of docKeys) {
    const es = legal[key].es;
    const en = legal[key].en;
    const ex = (loc: (typeof EXTRA_LOCALES)[number]) =>
      (extras[loc].legal as Record<string, typeof es | undefined>)?.[key];

    await client.createOrReplace({
      _id: `legal-${key}`,
      _type: 'legalDoc',
      docKey: key,
      title: intl('String', {
        es: es.title,
        en: en.title,
        ...Object.fromEntries(EXTRA_LOCALES.map((l) => [l, ex(l)?.title])),
      }),
      updated: intl('String', {
        es: es.updated,
        en: en.updated,
        ...Object.fromEntries(EXTRA_LOCALES.map((l) => [l, ex(l)?.updated])),
      }),
      intro: intl('Text', {
        es: es.intro,
        en: en.intro,
        ...Object.fromEntries(EXTRA_LOCALES.map((l) => [l, ex(l)?.intro])),
      }),
      // Las secciones se emparejan por posición (última vez): los párrafos de
      // cada idioma se unen con línea en blanco y LegalDocView los re-separa.
      sections: es.sections.map((sec, si) => ({
        _type: 'legalSection',
        _key: `s${si}`,
        heading: intl('String', {
          es: sec.heading,
          en: en.sections[si]?.heading,
          ...Object.fromEntries(EXTRA_LOCALES.map((l) => [l, ex(l)?.sections?.[si]?.heading])),
        }),
        body: intl('Text', {
          es: sec.body.join('\n\n'),
          en: en.sections[si]?.body.join('\n\n'),
          ...Object.fromEntries(EXTRA_LOCALES.map((l) => [l, ex(l)?.sections?.[si]?.body?.join('\n\n')])),
        }),
      })),
    });
    console.log(`  ✔ legal-${key}`);
  }

  // ——— Galería lifestyle ———
  console.log('Galería lifestyle:');
  const reelImages = [];
  for (const [i, src] of REEL.entries()) {
    reelImages.push(await captionedImage(src, { es: REEL_ALTS[i] }, `r-${path.basename(src, '.jpg')}`));
  }
  await client.createOrReplace({
    _id: 'lifestyleGallery',
    _type: 'lifestyleGallery',
    images: reelImages,
  });
  console.log(`  ✔ ${REEL.length} fotos`);

  // ——— Ajustes del sitio ———
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    telephone: '+34722454277',
    email: 'Hello@flamingoyachtclub.com',
    sameAs: [],
  });
  console.log('Ajustes del sitio: ✔');

  console.log(`\nListo. ${assetCache.size} imágenes en el CDN de Sanity.`);
  console.log('Abre /studio y comprueba: 8 barcos (3 activos), 7 FAQs, 3 testimonios, 4 cifras, 7 hitos, 1 membresía, 4 legales, galería de 51.');
}

run().catch((err) => {
  console.error('\nLa migración falló:', err.message ?? err);
  process.exit(1);
});
