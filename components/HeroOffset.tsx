import Image from 'next/image';
import MediaSlideshow, { type Slide } from './MediaSlideshow';

interface HeroOffsetProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image: string;
  /** Pase de fotos opcional (crossfade tipo vídeo); si falta, foto única. */
  slides?: Slide[];
}

interface HeroOffsetAllProps extends HeroOffsetProps {
  /** object-position de la foto (encuadre editorial por asset). */
  imagePosition?: string;
}

/* Hero editorial con solape: retrato anclado a la derecha y el titular
   entrando por encima desde la izquierda. Mucho blanco. En móvil colapsa a
   texto → foto.
   En lg el ancho de la foto es un porcentaje fijo (38%) y NO se deriva de su
   alto: con aspect-[3/4] + w-auto, un titular largo alargaba la fila, la fila
   ensanchaba la foto y la foto se comía el texto (bucle de realimentación).
   El texto ocupa el 56% restante, así que nunca colisionan. */
export default function HeroOffset({ eyebrow, title, subtitle, image, imagePosition = 'center', slides }: HeroOffsetAllProps) {
  return (
    <section className="pt-[calc(var(--header-h)+3rem)] pb-16 md:pb-24 bg-bone overflow-hidden">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        <div className="relative lg:min-h-[72svh] flex flex-col justify-center">
          <div className="relative z-10 lg:max-w-[56%]">
            <p className="eyebrow mb-6 animate-hero">{eyebrow}</p>
            <h1
              className="display text-ink text-balance whitespace-pre-line animate-hero animate-hero-d1"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.75rem)' }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="font-sans text-lg text-muted max-w-lg leading-relaxed mt-7 animate-hero animate-hero-d2">
                {subtitle}
              </p>
            )}
          </div>
          <div className="relative mt-12 w-full sm:w-2/3 aspect-[3/4] lg:absolute lg:right-0 lg:inset-y-0 lg:mt-0 lg:w-[38%] lg:aspect-auto overflow-hidden bg-sand">
            {slides && slides.length > 1 ? (
              <MediaSlideshow
                slides={slides}
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="animate-hero-img"
              />
            ) : (
              <Image
                src={image}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="img-grade animate-hero-img object-cover"
                style={{ objectPosition: imagePosition }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
