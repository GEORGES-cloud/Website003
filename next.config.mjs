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
};

export default withNextIntl(nextConfig);
