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
        <div className="max-w-2xl section-head">
          <ScrollReveal>
            <p className="eyebrow mb-5">{t('eyebrow')}</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="display text-ink display-2">
              {t('title')}
            </h2>
          </ScrollReveal>
        </div>

        {/* Tarjeta "imponente": declaración en serif a la izquierda, prestaciones
            numeradas con filos finos a la derecha — el mismo lenguaje ledger del
            hero y la ficha técnica de la flota. */}
        <ScrollReveal zoom>
          <div className="bg-ink text-white">
            <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr]">
              {/* Statement */}
              <div className="p-8 sm:p-12 lg:p-14 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col">
                <p className="eyebrow-accent mb-8">
                  Flamingo Yacht Club
                </p>
                <p className="display leading-snug text-white/95" style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2.25rem)' }}>
                  {membership.tagline}
                </p>
                <div className="hidden lg:block mt-auto pt-12">
                  <JoinCTA className="btn-light w-full px-8">
                    {t('cta')}
                  </JoinCTA>
                </div>
              </div>

              {/* Features — ledger numerado */}
              <div className="p-8 sm:p-12 lg:p-14">
                <ul>
                  {membership.features.map((f, i) => (
                    <li
                      key={f}
                      className="flex items-baseline gap-5 py-[15px] first:pt-0 border-b border-white/10 last:border-b-0"
                    >
                      <span className="font-sans text-[11px] tracking-wide2 text-sea-light flex-none tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-sans text-[15px] sm:text-base leading-snug text-white/85">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="lg:hidden mt-10">
                  <JoinCTA className="btn-light w-full px-8">
                    {t('cta')}
                  </JoinCTA>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <p className="font-sans text-sm text-muted mt-10 max-w-2xl">{t('note')}</p>
      </div>
    </section>
  );
}
