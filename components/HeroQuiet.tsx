import Image from 'next/image';
import MediaSlideshow, { type Slide } from './MediaSlideshow';

interface HeroQuietProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image: string;
  /** Pase de fotos opcional (crossfade tipo vídeo); si falta, foto única. */
  slides?: Slide[];
}

/* Hero silencioso: tipografía a la izquierda y una foto 4:5 pequeña a la
   derecha, como una invitación. Cierra con el mismo asiento inferior que el
   hero plano (pb-16 md:pb-20) para no descolocar la sección siguiente. */
export default function HeroQuiet({ eyebrow, title, subtitle, image, slides }: HeroQuietProps) {
  return (
    <section className="pt-[calc(var(--header-h)+3rem)] pb-16 md:pb-20 bg-bone">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-center">
          <div className="md:col-span-7">
            <p className="eyebrow mb-6 animate-hero">{eyebrow}</p>
            <h1
              className="display text-ink whitespace-pre-line animate-hero animate-hero-d1 display-1"
            >
              {title}
            </h1>
            {subtitle && (
              <p className="font-sans text-lg text-muted max-w-xl leading-relaxed mt-7 animate-hero animate-hero-d2">
                {subtitle}
              </p>
            )}
          </div>
          {/* La foto solo asienta (heroSettle) — el rise queda para el texto */}
          <div className="relative md:col-span-4 md:col-start-9 aspect-[4/5] overflow-hidden bg-sand">
            {slides && slides.length > 1 ? (
              <MediaSlideshow
                slides={slides}
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
                className="animate-hero-img"
              />
            ) : (
              <Image
                src={image}
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
                className="img-grade animate-hero-img object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
