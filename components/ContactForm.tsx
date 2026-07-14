'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ContactForm() {
  const t = useTranslations('contact.form');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputClass =
    'w-full bg-transparent border-b border-line py-3 font-sans text-base text-ink focus:outline-none focus:border-sea transition-colors';
  const labelClass =
    'block font-sans text-[11px] font-semibold uppercase tracking-wide2 text-muted mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div>
        <label htmlFor="name" className={labelClass}>{t('name')}</label>
        <input id="name" name="name" type="text" required autoComplete="name" className={inputClass} />
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>{t('email')}</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
      </div>
      <div>
        <label htmlFor="phone" className={labelClass}>{t('phone')}</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
      </div>
      <div>
        <label htmlFor="message" className={labelClass}>{t('message')}</label>
        <textarea id="message" name="message" required rows={5} className={`${inputClass} resize-none`} />
      </div>

      <p aria-live="polite" className="min-h-[1.25rem]">
        {status === 'success' && <span className="font-sans text-sm text-sea">{t('success')}</span>}
        {status === 'error' && <span className="font-sans text-sm text-red-600">{t('error')}</span>}
      </p>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="font-sans text-[12px] font-semibold tracking-wide2 uppercase bg-ink text-white px-10 py-4 hover:bg-sea transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? t('sending') : t('submit')}
      </button>
    </form>
  );
}
