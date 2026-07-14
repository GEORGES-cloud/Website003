'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import ParallaxImage from './ParallaxImage';

interface MembershipPitchProps {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  locale: string;
}

export default function MembershipPitch({ eyebrow, title, description, cta, locale }: MembershipPitchProps) {
  return (
    <section className="py-24 md:py-36 bg-sand">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: '-80px' }}
            className="order-1 lg:order-none"
          >
            <ParallaxImage
              src="/images/membership.jpg"
              alt="Estilo de vida del club náutico"
              sizes="(max-width: 1024px) 100vw, 50vw"
              strength={40}
              kenBurns
              className="aspect-[4/5] lg:aspect-[5/6]"
            />
          </motion.div>

          {/* Text */}
          <div className="lg:pr-10">
            <ScrollReveal>
              <p className="eyebrow mb-6">{eyebrow}</p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2 className="display text-ink mb-8" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 4.25rem)' }}>
                {title}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="font-sans text-lg text-muted leading-relaxed mb-10 max-w-md">{description}</p>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <Link href={`/${locale}/como-funciona`} className="link-underline">
                {cta}
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
