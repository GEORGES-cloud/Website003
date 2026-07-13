import { getRoutes } from '@/lib/localize';
import ScrollReveal from './ScrollReveal';

const COPY: Record<string, { eyebrow: string; title: string; subtitle: string; distance: string; time: string }> = {
  es: { eyebrow: 'Desde Puerto Banús', title: 'El Mediterráneo, a tu alcance', subtitle: 'Calas escondidas, puertos con encanto y travesías de día. Todo empieza en el corazón de Marbella.', distance: 'Distancia', time: 'Tiempo' },
  en: { eyebrow: 'From Puerto Banús', title: 'The Mediterranean, within reach', subtitle: 'Hidden coves, charming harbours and day voyages. It all starts in the heart of Marbella.', distance: 'Distance', time: 'Time' },
  sv: { eyebrow: 'Från Puerto Banús', title: 'Medelhavet, inom räckhåll', subtitle: 'Dolda vikar, charmiga hamnar och dagsutflykter. Allt börjar i hjärtat av Marbella.', distance: 'Avstånd', time: 'Tid' },
  ru: { eyebrow: 'Из Пуэрто-Банус', title: 'Средиземное море — рядом', subtitle: 'Укромные бухты, очаровательные порты и однодневные переходы. Всё начинается в сердце Марбельи.', distance: 'Расстояние', time: 'Время' },
  de: { eyebrow: 'Ab Puerto Banús', title: 'Das Mittelmeer in Reichweite', subtitle: 'Versteckte Buchten, charmante Häfen und Tagestörns. Alles beginnt im Herzen von Marbella.', distance: 'Entfernung', time: 'Zeit' },
  fr: { eyebrow: 'Depuis Puerto Banús', title: 'La Méditerranée, à votre portée', subtitle: 'Criques cachées, ports de charme et navigations à la journée. Tout commence au cœur de Marbella.', distance: 'Distance', time: 'Temps' },
};

export default function Destinations({ locale }: { locale: string }) {
  const copy = COPY[locale] ?? COPY.en;
  const routes = getRoutes(locale);

  return (
    <section className="py-20 md:py-28 bg-bone">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        <div className="max-w-2xl mb-14 md:mb-16">
          <ScrollReveal>
            <p className="eyebrow mb-5">{copy.eyebrow}</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="display text-ink mb-6" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.75rem)' }}>
              {copy.title}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="font-sans text-lg text-muted leading-relaxed">{copy.subtitle}</p>
          </ScrollReveal>
        </div>

        <div className="border-t border-line">
          {routes.map((r, i) => (
            <ScrollReveal key={r.name} delay={(i % 4) * 0.06}>
              <div className="group grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-baseline py-7 md:py-8 border-b border-line">
                <div className="md:col-span-1 font-sans text-sm text-sea font-semibold">0{i + 1}</div>
                <h3 className="md:col-span-4 font-sans text-2xl md:text-3xl font-light text-ink tracking-tight group-hover:text-sea transition-colors">
                  {r.name}
                </h3>
                <p className="md:col-span-4 font-sans text-base text-muted leading-relaxed">{r.desc}</p>
                <div className="md:col-span-3 flex gap-8 md:justify-end">
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-wide2 text-muted/70 mb-1">
                      {copy.distance}
                    </p>
                    <p className="font-sans text-sm text-ink">{r.distance}</p>
                  </div>
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-wide2 text-muted/70 mb-1">
                      {copy.time}
                    </p>
                    <p className="font-sans text-sm text-ink">{r.time}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
