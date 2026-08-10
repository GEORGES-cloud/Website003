import type { MetadataRoute } from 'next';
import { getActiveBoatSlugs } from '@/lib/localize';
import { locales } from '@/lib/locales';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://flamingoyachtclub.com';
const routes = ['', '/flota', '/precios', '/puerto-base', '/nosotros', '/contacto'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const boatSlugs = await getActiveBoatSlugs();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${siteUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${route}`])),
        },
      });
    }
    for (const slug of boatSlugs) {
      entries.push({
        url: `${siteUrl}/${locale}/flota/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
