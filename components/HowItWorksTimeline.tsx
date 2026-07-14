'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

interface Step {
  number: string;
  title: string;
  desc: string;
}

interface HowItWorksTimelineProps {
  steps: Step[];
  locale: string;
  /** Index of the step that carries the "required" pill (the boating-licence step). */
  licenseStepIndex?: number;
}

const REQUIRED_LABEL: Record<string, string> = {
  es: 'Obligatorio',
  en: 'Required',
  sv: 'Obligatoriskt',
  ru: 'Обязательно',
  de: 'Pflicht',
  fr: 'Obligatoire',
};

// The vertical rail sits at the horizontal centre of the node column.
// Node column = 44px (mobile) / 64px (desktop) → rail at 22px / 32px.
const RAIL_LEFT = 'left-[22px] md:left-[32px]';

function TimelineStep({
  step,
  isLicense,
  requiredLabel,
  reduce,
}: {
  step: Step;
  isLicense: boolean;
  requiredLabel: string;
  reduce: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-30% 0px -40% 0px' });
  const active = reduce || inView;

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-[44px_1fr] md:grid-cols-[64px_1fr] gap-5 md:gap-9 pb-16 md:pb-24 last:pb-0"
    >
      {/* Node on the rail */}
      <div className="relative flex justify-center pt-3 md:pt-4">
        <span
          className={`relative z-10 block rounded-full transition-all duration-500 ${
            active ? 'h-3.5 w-3.5 bg-sea ring-4 ring-sea/15' : 'h-3 w-3 bg-bone border border-sea/40'
          }`}
          aria-hidden
        />
      </div>

      {/* Content */}
      <ScrollReveal delay={0.05}>
        <div>
          <span
            className={`display-num block mb-3 transition-colors duration-500 ${active ? 'text-ink' : 'text-ink/20'}`}
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.25rem)' }}
          >
            {step.number}
          </span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
            <h3 className="display text-2xl md:text-4xl text-ink">{step.title}</h3>
            {isLicense && (
              <span className="font-sans text-[10px] font-semibold uppercase tracking-wide2 text-sea border border-sea/40 px-3 py-1">
                {requiredLabel}
              </span>
            )}
          </div>
          <p className="font-sans text-base md:text-lg text-muted leading-relaxed max-w-md">{step.desc}</p>
        </div>
      </ScrollReveal>
    </div>
  );
}

export default function HowItWorksTimeline({ steps, locale, licenseStepIndex = 1 }: HowItWorksTimelineProps) {
  const reduce = useReducedMotion() ?? false;
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start center', 'end center'],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const dotTop = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const requiredLabel = REQUIRED_LABEL[locale] ?? REQUIRED_LABEL.en;

  return (
    <section className="py-24 md:py-36 bg-bone overflow-hidden">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        <div ref={timelineRef} className="relative max-w-3xl">
          {/* Rail — static hairline */}
          <div className={`absolute ${RAIL_LEFT} top-2 bottom-2 w-px bg-line`} aria-hidden />
          {/* Rail — sea line that draws with scroll */}
          <motion.div
            className={`absolute ${RAIL_LEFT} top-2 bottom-2 w-px bg-sea origin-top`}
            style={{ scaleY: reduce ? 1 : scaleY }}
            aria-hidden
          />
          {/* Travelling lead dot (hidden under reduced motion) */}
          <motion.span
            className={`absolute ${RAIL_LEFT} h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-sea shadow-[0_0_0_4px_rgba(44,74,79,0.12)]`}
            style={{ top: dotTop, opacity: reduce ? 0 : 1 }}
            aria-hidden
          />

          {steps.map((step, i) => (
            <TimelineStep
              key={step.number}
              step={step}
              isLicense={i === licenseStepIndex}
              requiredLabel={requiredLabel}
              reduce={reduce}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
