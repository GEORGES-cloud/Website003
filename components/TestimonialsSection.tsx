import { getTestimonials } from '@/lib/localize';
import ScrollReveal from './ScrollReveal';

interface TestimonialsSectionProps {
  locale: string;
}

const EYEBROW: Record<string, string> = {
  es: 'Lo que dicen los socios',
  en: 'What members say',
  sv: 'Vad medlemmarna säger',
  ru: 'Отзывы наших членов',
  de: 'Was unsere Mitglieder sagen',
  fr: 'Ce que disent les membres',
};

/* Static editorial quote — one confident hero testimonial, the rest as a quiet
   two-column postscript. No carousel, no timers. */
export default function TestimonialsSection({ locale }: TestimonialsSectionProps) {
  const all = getTestimonials(locale);
  if (all.length === 0) return null;

  const featured = all.reduce((a, b) => (b.quote.length > a.quote.length ? b : a));
  const rest = all.filter((t) => t !== featured);

  return (
    <section className="py-24 md:py-36 bg-bone">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <p className="eyebrow mb-10">{EYEBROW[locale] ?? EYEBROW.en}</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <blockquote
              className="display text-ink leading-[1.15] mb-10"
              style={{ fontSize: 'clamp(1.9rem, 3.5vw, 3.25rem)' }}
            >
              &ldquo;{featured.quote}&rdquo;
            </blockquote>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="font-sans text-sm font-semibold text-ink tracking-wide">{featured.author}</p>
            <p className="font-sans text-xs text-sea mt-1 tracking-wide2 uppercase">{featured.role}</p>
          </ScrollReveal>
        </div>

        {rest.length > 0 && (
          <div className="grid md:grid-cols-2 gap-10 mt-20 text-left max-w-4xl mx-auto">
            {rest.map((t, i) => (
              <ScrollReveal key={t.author} delay={i * 0.1}>
                <figure className="border-t border-line pt-7">
                  <blockquote className="font-sans text-lg font-light text-ink/80 leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4">
                    <span className="font-sans text-sm font-semibold text-ink">{t.author}</span>
                    <span className="font-sans text-xs text-sea uppercase tracking-wide2 ml-3">{t.role}</span>
                  </figcaption>
                </figure>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
