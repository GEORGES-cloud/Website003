import Image from 'next/image';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image?: string;
}

export default function PageHero({ eyebrow, title, subtitle, image }: PageHeroProps) {
  // Image variant — full-bleed photo with overlay (used on most inner pages)
  if (image) {
    return (
      <section className="relative pt-[var(--header-h)] h-[70svh] min-h-[480px] overflow-hidden">
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover animate-kenburns" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-ink/30" />
        <div className="relative h-full max-w-[1480px] mx-auto px-6 md:px-10 flex flex-col justify-end pb-16">
          <p className="eyebrow-invert mb-5">{eyebrow}</p>
          <h1 className="display text-white max-w-3xl whitespace-pre-line" style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="font-sans text-lg text-white/75 max-w-xl leading-relaxed mt-6">{subtitle}</p>
          )}
        </div>
      </section>
    );
  }

  // Plain variant — light background
  return (
    <section className="pt-[calc(var(--header-h)+3rem)] pb-16 md:pb-20 bg-bone">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        <p className="eyebrow mb-6">{eyebrow}</p>
        <h1 className="display text-ink max-w-3xl whitespace-pre-line" style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="font-sans text-lg text-muted max-w-xl leading-relaxed mt-7">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
