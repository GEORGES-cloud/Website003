import { useTranslations } from 'next-intl';
import PageHero from '@/components/PageHero';
import ContactForm from '@/components/ContactForm';
import ScrollReveal from '@/components/ScrollReveal';

export default function ContactoPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('contact');

  return (
    <>
      <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} subtitle={t('hero.subtitle')} />

      <section className="pb-24 md:pb-32 bg-bone">
        <div className="max-w-[1480px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
            <ScrollReveal>
              <ContactForm />
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="lg:pt-2">
                <p className="eyebrow mb-8">{t('info.title')}</p>
                <div className="space-y-8">
                  <div>
                    <p className="font-sans text-xs tracking-wide2 uppercase text-muted mb-2">Email</p>
                    <a
                      href={`mailto:${t('info.email')}`}
                      className="font-sans text-2xl font-light text-ink hover:text-sea transition-colors tracking-tight"
                    >
                      {t('info.email')}
                    </a>
                  </div>
                  <div className="border-t border-line pt-8">
                    <p className="font-sans text-xs tracking-wide2 uppercase text-muted mb-2">
                      {({ es: 'Horario', en: 'Hours', sv: 'Öppettider', ru: 'Часы работы', de: 'Öffnungszeiten', fr: 'Horaires' } as Record<string, string>)[locale] ?? 'Hours'}
                    </p>
                    <p className="font-sans text-lg text-ink">{t('info.hours')}</p>
                  </div>
                  <div className="border-t border-line pt-8">
                    <p className="font-sans text-xs tracking-wide2 uppercase text-muted mb-2">
                      {({ es: 'Ubicación', en: 'Location', sv: 'Plats', ru: 'Расположение', de: 'Standort', fr: 'Emplacement' } as Record<string, string>)[locale] ?? 'Location'}
                    </p>
                    <p className="font-sans text-lg text-ink">Puerto Banús · Marbella</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
