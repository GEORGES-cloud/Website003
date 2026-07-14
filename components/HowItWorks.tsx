import ScrollReveal from './ScrollReveal';

interface Step {
  number: string;
  title: string;
  desc: string;
}

interface HowItWorksProps {
  eyebrow: string;
  title: string;
  steps: Step[];
}

export default function HowItWorks({ eyebrow, title, steps }: HowItWorksProps) {
  return (
    <section className="py-24 md:py-36 bg-sand">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="mb-16 md:mb-20 max-w-2xl">
          <ScrollReveal>
            <p className="eyebrow mb-4">{eyebrow}</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="display text-ink" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 4rem)' }}>
              {title}
            </h2>
          </ScrollReveal>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 0.12}>
              <div className="relative border-t border-ink/10 pt-8 md:pr-10 pb-10 md:pb-0">
                <span className="display-num text-ink/10 block mb-5" style={{ fontSize: 'clamp(2.75rem, 4.5vw, 4rem)' }}>
                  {step.number}
                </span>
                <h3 className="display text-2xl md:text-3xl text-ink mb-4">
                  {step.title}
                </h3>
                <p className="font-sans text-base text-muted leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
