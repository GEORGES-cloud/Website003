import type { Metadata } from 'next';
import LegalDocView from '@/components/LegalDocView';
import { getLegal } from '@/lib/localize';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return { title: (await getLegal(locale, 'cookies')).title, robots: { index: false } };
}

export default async function CookiesPage({ params: { locale } }: { params: { locale: string } }) {
  return <LegalDocView doc={await getLegal(locale, 'cookies')} />;
}
