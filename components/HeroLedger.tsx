import Image from 'next/image';
import ImageReveal from './ImageReveal';

interface Fact {
  value: string;
  label: string;
}

interface HeroLedgerProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image: string;
  facts: Fact[];
}

/* El hero más desnudo: tipografía grande + regla de datos valor-primero
   (mismo patrón que la ficha técnica de FleetShowcase) y una banda de foto
   panorámica a sangre debajo. El LCP es el titular — la banda entra con
   cortina y sin priority. */
export default function HeroLedger({ eyebrow, title, subtitle, image, facts }: HeroLedgerProps) {
  return (
    <section className="pt-[calc(var(--header-h)+3rem)] bg-bone">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        <p className="eyebrow mb-6 animate-hero">{eyebrow}</p>
        <h1
          className="display text-ink max-w-4xl whitespace-pre-line animate-hero animate-hero-d1"
          style={{ fontSize: 'clamp(3rem, 6.5vw, 6rem)' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="font-sans text-lg text-muted max-w-xl leading-relaxed mt-7 animate-hero animate-hero-d2">
            {subtitle}
          </p>
        )}

        <dl className="mt-12 md:mt-16 border-t border-line grid grid-cols-3 gap-x-4 md:flex md:divide-x md:divide-line animate-hero animate-hero-d2">
          {facts.map((f) => (
            <div key={f.label} className="flex flex-col-reverse gap-1 py-5 md:px-8 md:first:pl-0 md:flex-none">
              <dt className="eyebrow !text-[9px] !text-ink/65 break-words">{f.label}</dt>
              <dd className="display text-2xl md:text-[2rem] text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Banda panorámica a sangre */}
      <div className="mt-12 md:mt-16">
        <ImageReveal>
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
            <Image
              src={image}
              alt=""
              fill
              sizes="100vw"
              className="img-grade object-cover"
            />
          </div>
        </ImageReveal>
      </div>
    </section>
  );
}
