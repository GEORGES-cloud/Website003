import { WA_PHONE } from '@/lib/whatsapp';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://flamingoyachtclub.com';

export default function JsonLd({ locale }: { locale: string }) {
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
    logo: `${siteUrl}/brand/logo-full.svg`,
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
    telephone: `+${WA_PHONE}`,
    email: process.env.CONTACT_EMAIL ?? 'Hello@flamingoyachtclub.com',
    priceRange: '€€€',
    sameAs: [] as string[],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
