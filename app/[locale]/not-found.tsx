import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { FlamingoMark } from '@/components/Logo';

/* 404 dentro del árbol de locale: hereda navbar, footer e idioma del
   visitante (el app/not-found.tsx global solo cubre rutas fuera de
   /[locale], y esas caen en español). Lo dispara el catch-all
   app/[locale]/[...rest]/page.tsx. */
export default function LocaleNotFound() {
  const t = useTranslations('notFound');
  const locale = useLocale();

  return (
    <section className="min-h-[70svh] flex items-center justify-center px-6 pt-[calc(var(--header-h)+2rem)] pb-24">
      <div className="text-center max-w-md">
        <FlamingoMark size={84} className="block mx-auto mb-9" />
        <p className="eyebrow mb-5">{t('eyebrow')}</p>
        <h1 className="display text-ink mb-5 display-3">{t('title')}</h1>
        <p className="font-sans text-muted leading-relaxed mb-10">{t('body')}</p>
        <Link href={`/${locale}`} className="btn-primary">
          {t('cta')}
        </Link>
      </div>
    </section>
  );
}
