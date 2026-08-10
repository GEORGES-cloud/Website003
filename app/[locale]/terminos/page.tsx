import type { Metadata } from 'next';
import LegalDocView from '@/components/LegalDocView';
import { getLegal } from '@/lib/localize';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return { title: (await getLegal(locale, 'terms')).title, robots: { index: false } };
}

export default async function TerminosPage({ params: { locale } }: { params: { locale: string } }) {
  return <LegalDocView doc={await getLegal(locale, 'terms')} />;
}
