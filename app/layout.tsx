import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://marbellacharterboatclub.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Flamingo Yacht Club powered by Marina Banus | Club Náutico de Membresía',
    template: '%s · Flamingo Yacht Club',
  },
  description:
    'Club náutico de membresía en Puerto Banús, Marbella. Accede a una flota premium de yates sin compromisos.',
  applicationName: 'Flamingo Yacht Club',
  authors: [{ name: 'Flamingo Yacht Club' }],
  keywords: [
    'club náutico Marbella',
    'membresía de yates',
    'Puerto Banús',
    'alquiler de yates Marbella',
    'boat club Marbella',
    'Wajer',
    'Frauscher',
    'Marina Banus',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Flamingo Yacht Club',
    title: 'Flamingo Yacht Club · Club Náutico de Membresía en Puerto Banús',
    description:
      'Accede a una flota premium de yates con tu membresía. Puerto Banús, Marbella.',
    images: [{ url: '/opengraph-image.jpg', width: 1200, height: 630, alt: 'Flamingo Yacht Club — Club Náutico Puerto Banús' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flamingo Yacht Club · Club Náutico de Membresía en Puerto Banús',
    description: 'Accede a una flota premium de yates con tu membresía. Puerto Banús, Marbella.',
    images: ['/opengraph-image.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
