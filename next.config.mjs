import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Source images are <=1600px wide — cap generated widths to avoid
    // pointless upscaling (faster optimization, no quality loss).
    deviceSizes: [640, 750, 828, 1080, 1200, 1600],
    imageSizes: [256, 384],
    formats: ['image/webp'],
  },
  // The old /membresia and /experiencias pages were folded into /precios and
  // /puerto-base. Keep their inbound links + SEO alive across all 6 locales.
  async redirects() {
    return [
      {
        source: '/:locale(es|en|sv|ru|de|fr)/membresia',
        destination: '/:locale/precios',
        permanent: true,
      },
      {
        source: '/:locale(es|en|sv|ru|de|fr)/experiencias',
        destination: '/:locale/puerto-base',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
