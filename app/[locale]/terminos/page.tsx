import type { Metadata } from 'next';
import LegalDocView from '@/components/LegalDocView';
import { getLegal } from '@/lib/localize';

export function generateMetadata({ params: { locale } }: { params: { locale: string } }): Metadata {
  return { title: getLegal(locale, 'terms').title, robots: { index: false } };
}

export default function TerminosPage({ params: { locale } }: { params: { locale: string } }) {
  return <LegalDocView doc={getLegal(locale, 'terms')} />;
}
