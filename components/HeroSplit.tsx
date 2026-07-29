import Image from 'next/image';

interface HeroSplitProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image: string;
}

/* Hero 50/50 asimétrico: tipografía sobre bone a la izquierda (alineada al
   raíl estándar del site), foto vertical a sangre a la derecha, sin overlay.
   La foto es la mitad derecha de la sección en porcentaje (no vw: la scrollbar
   de Windows descuadraría el raíl) y empieza BAJO la navbar para que la barra
   en tinta nunca caiga sobre la imagen. */
export default function HeroSplit({ eyebrow, title, subtitle, image }: HeroSplitProps) {
  return (
    <section className="relative pt-[var(--header-h)] bg-bone">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        <div className="md:w-1/2 md:pr-12 lg:pr-16 py-14 md:py-20 md:min-h-[80svh] flex flex-col justify-center">
          <p className="eyebrow mb-6 animate-hero">{eyebrow}</p>
          <h1
            className="display text-ink whitespace-pre-line animate-hero animate-hero-d1"
            style={{ fontSize: 'clamp(2.5rem, 4.6vw, 4.5rem)' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="font-sans text-lg text-muted max-w-lg leading-relaxed mt-7 animate-hero animate-hero-d2">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {/* Foto: mitad derecha de la sección, de debajo del header al borde inferior */}
      <div className="relative h-[52svh] min-h-[380px] md:absolute md:top-[var(--header-h)] md:bottom-0 md:right-0 md:w-1/2 md:h-auto md:min-h-0 overflow-hidden">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="img-grade animate-hero-img object-cover"
        />
      </div>
    </section>
  );
}
