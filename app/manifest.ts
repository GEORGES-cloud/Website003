import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Flamingo Yacht Club · Membresía',
    short_name: 'Flamingo YC',
    description: 'Club náutico de membresía en Puerto Banús, Marbella.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF9F6',
    theme_color: '#1A1916',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
