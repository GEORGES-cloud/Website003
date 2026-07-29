import Image from 'next/image';

interface HeroOffsetProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image: string;
}

interface HeroOffsetAllProps extends HeroOffsetProps {
  /** object-position de la foto (encuadre editorial por asset). */
  imagePosition?: string;
}

/* Hero editorial con solape: retrato 3/4 anclado a la derecha y el titular
   entrando por encima desde la izquierda. Mucho blanco. En móvil colapsa a
   texto → foto. En lg la foto toma su alto de la fila (inset-y-0 + aspect):
   nunca invade la navbar ni se recorta contra el pb. */
export default function HeroOffset({ eyebrow, title, subtitle, image, imagePosition = 'center' }: HeroOffsetAllProps) {
  return (
    <section className="pt-[calc(var(--header-h)+3rem)] pb-16 md:pb-24 bg-bone overflow-hidden">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        <div className="relative lg:min-h-[72svh] flex flex-col justify-center">
          <div className="relative z-10 lg:max-w-[72%]">
            <p className="eyebrow mb-6 animate-hero">{eyebrow}</p>
            <h1
              className="display text-ink whitespace-pre-line animate-hero animate-hero-d1"
              style={{ fontSize: 'clamp(2.75rem, 6vw, 5.5rem)' }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="font-sans text-lg text-muted max-w-lg leading-relaxed mt-7 animate-hero animate-hero-d2">
                {subtitle}
              </p>
            )}
          </div>
          <div className="relative mt-12 w-full sm:w-2/3 aspect-[3/4] lg:absolute lg:right-0 lg:inset-y-0 lg:mt-0 lg:w-auto overflow-hidden bg-sand">
            <Image
              src={image}
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="img-grade animate-hero-img object-cover"
              style={{ objectPosition: imagePosition }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
