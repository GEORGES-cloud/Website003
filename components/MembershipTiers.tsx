import { useTranslations } from 'next-intl';
import { getTiers } from '@/lib/localize';
import ScrollReveal from './ScrollReveal';
import JoinCTA from './JoinCTA';

/* Single membership, no pricing shown for now. The card reads name-less on
   purpose — the section heading introduces it ("La membresía"). */
export default function MembershipTiers({ locale }: { locale: string }) {
  const t = useTranslations('membership.tiers');
  const membership = getTiers(locale)[0];

  return (
    <section className="py-24 md:py-36 bg-sand">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        <div className="max-w-2xl mb-14 md:mb-16">
          <ScrollReveal>
            <p className="eyebrow mb-5">{t('eyebrow')}</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="display text-ink" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.75rem)' }}>
              {t('title')}
            </h2>
          </ScrollReveal>
        </div>

        <ScrollReveal zoom>
          <div className="max-w-2xl flex flex-col p-8 sm:p-10 lg:p-12 bg-ink text-white">
            <p className="font-sans text-lg sm:text-xl text-white/75 leading-relaxed mb-9">
              {membership.tagline}
            </p>

            <ul className="space-y-4 mb-11">
              {membership.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full flex-none bg-sea-light" />
                  <span className="font-sans text-[15px] sm:text-base leading-snug text-white/85">{f}</span>
                </li>
              ))}
            </ul>

            <JoinCTA className="font-sans text-[12px] font-semibold uppercase tracking-wide2 text-center px-8 py-4 transition-colors duration-300 bg-white text-ink hover:bg-sea-light">
              {t('cta')}
            </JoinCTA>
          </div>
        </ScrollReveal>

        <p className="font-sans text-sm text-muted mt-10 max-w-2xl">{t('note')}</p>
      </div>
    </section>
  );
}
