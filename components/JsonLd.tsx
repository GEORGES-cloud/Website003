import { getSiteSettings } from '@/lib/localize';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://flamingoyachtclub.com';

export default async function JsonLd({ locale }: { locale: string }) {
  const settings = await getSiteSettings();
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#organization`,
    name: 'Flamingo Yacht Club',
    alternateName: 'Flamingo Yacht Club powered by Marina Marbella',
    description:
      locale === 'es'
        ? 'Club náutico de membresía en Puerto Banús, Marbella. Accede a una flota premium de yates sin compromisos.'
        : 'Yacht membership club in Puerto Banús, Marbella. Access a premium fleet of yachts with no compromises.',
    url: `${siteUrl}/${locale}`,
    image: `${siteUrl}/opengraph-image.jpg`,
    // El logo oficial que leen los buscadores. Apuntaba al wordmark viejo
    // (la vectorizacion a mano de Carlos) hasta 2026-09-28; ahora al arte del
    // diseñador, que es el que se ve en la web. Si algun dia Google pide un
    // logo mas "presentable" para el panel de conocimiento, lo ideal seria un
    // PNG cuadrado con fondo solido: este es apaisado y transparente.
    logo: `${siteUrl}/brand/wordmark-2026.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Puerto Banús',
      addressLocality: 'Marbella',
      addressRegion: 'Málaga',
      postalCode: '29660',
      addressCountry: 'ES',
    },
    // Mismo punto que el mapa de /puerto-base (antes divergían).
    geo: { '@type': 'GeoCoordinates', latitude: 36.48862, longitude: -4.94988 },
    areaServed: { '@type': 'Place', name: 'Costa del Sol, Marbella' },
    telephone: settings.telephone,
    email: settings.email,
    priceRange: '€€€',
    // Redes sociales: se añaden en getSiteSettings() cuando el club las facilite.
    sameAs: settings.sameAs,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
