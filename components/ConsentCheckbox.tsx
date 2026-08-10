'use client';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

/* Casilla de consentimiento RGPD compartida por los tres formularios de
   captación: sin marcar no se envía nada a /api/contact. */
export default function ConsentCheckbox({
  checked,
  onChange,
  required = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  required?: boolean;
}) {
  const t = useTranslations('forms');
  const locale = useLocale();

  return (
    <label className="flex items-start gap-3 text-left cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        required={required}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-sea"
      />
      <span className="font-sans text-[13px] text-muted leading-snug">
        {t('consentPre')}{' '}
        <Link
          href={`/${locale}/privacidad`}
          target="_blank"
          className="underline underline-offset-2 hover:text-ink transition-colors"
        >
          {t('consentLink')}
        </Link>
        .
      </span>
    </label>
  );
}
