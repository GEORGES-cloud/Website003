import Link from 'next/link';
import ScrollReveal from './ScrollReveal';
import ParallaxImage from './ParallaxImage';

interface CTAFinalProps {
  eyebrow: string;
  title: string;
  description: string;
  button: string;
  locale: string;
}

export default function CTAFinal({ eyebrow, title, description, button, locale }: CTAFinalProps) {
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL ?? `/${locale}/contacto`;

  return (
    <section className="relative py-32 md:py-44 overflow-hidden md:rounded-[2.5rem] md:mx-6 lg:mx-10">
      <ParallaxImage src="/images/cta.jpg" alt="" sizes="100vw" strength={70} kenBurns className="absolute inset-0" />
      <div className="absolute inset-0 bg-ink/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />

      <div className="relative max-w-[1480px] mx-auto px-6 md:px-10 text-center">
        <ScrollReveal>
          <p className="font-sans text-[11px] font-semibold tracking-eyebrow uppercase text-white/80 mb-7">
            {eyebrow}
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="display text-white mb-9" style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}>
            {title}
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p className="font-sans text-lg text-white/70 mb-12 max-w-lg mx-auto leading-relaxed">{description}</p>
        </ScrollReveal>
        <ScrollReveal delay={0.3}>
          <Link
            href={bookingUrl}
            className="inline-flex items-center justify-center font-sans text-[12px] font-semibold uppercase tracking-wide2 bg-white text-ink px-12 py-5 hover:bg-sea hover:text-white transition-colors duration-300"
          >
            {button}
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
