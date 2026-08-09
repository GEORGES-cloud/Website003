import Image from 'next/image';
import RevealText from './RevealText';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image?: string;
  /** Pie de hero opcional (variante plana): índice + hairline + etiqueta. */
  meta?: { index: string; label: string };
}

export default function PageHero({ eyebrow, title, subtitle, image, meta }: PageHeroProps) {
  // Image variant — full-bleed photo with overlay (used on most inner pages).
  // data-navbar-on-dark: señal para que la Navbar arranque en blanco sobre este hero.
  if (image) {
    return (
      <section data-navbar-on-dark className="relative pt-[var(--header-h)] h-[70svh] min-h-[480px] overflow-hidden">
        <Image src={image} alt="" fill priority sizes="100vw" className="img-grade animate-hero-img object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-ink/30" />
        <div className="relative h-full max-w-[1480px] mx-auto px-6 md:px-10 flex flex-col justify-end pb-16 md:pb-20">
          <p className="eyebrow-invert mb-5 animate-hero">{eyebrow}</p>
          <h1
            className="display text-white max-w-3xl display-1"
          >
          <RevealText>{title}</RevealText>
        </h1>
          {subtitle && (
            <p className="font-sans text-lg text-white/75 max-w-xl leading-relaxed mt-6 animate-hero animate-hero-d2">
              {subtitle}
            </p>
          )}
          {meta && (
            <div className="mt-10 md:mt-12 flex items-center gap-5 animate-hero animate-hero-d2">
              <span className="display-num text-sm text-white">{meta.index}</span>
              <span aria-hidden className="h-px flex-1 bg-white/25" />
              <span className="eyebrow-invert">{meta.label}</span>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Plain variant — light background, portada de colección
  return (
    <section className="pt-[calc(var(--header-h)+3rem)] pb-16 md:pb-20 bg-bone">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        <p className="eyebrow mb-6 animate-hero">{eyebrow}</p>
        <h1
          className="display text-ink max-w-3xl display-xl"
        >
          <RevealText>{title}</RevealText>
        </h1>
        {subtitle && (
          <p className="font-sans text-lg text-muted max-w-xl leading-relaxed mt-7 animate-hero animate-hero-d2">
            {subtitle}
          </p>
        )}
        {meta && (
          <div className="mt-12 md:mt-16 flex items-center gap-5 animate-hero animate-hero-d2">
            <span className="display-num text-sm text-ink">{meta.index}</span>
            <span aria-hidden className="h-px flex-1 bg-line" />
            <span className="eyebrow-muted">{meta.label}</span>
          </div>
        )}
      </div>
    </section>
  );
}
