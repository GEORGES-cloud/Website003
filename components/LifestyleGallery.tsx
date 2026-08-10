import BoatGallery from './BoatGallery';
import RevealText from './RevealText';
import { getLifestyleReel } from '@/lib/localize';

interface LifestyleGalleryProps {
  title: string;
  locale: string;
}

/* Carrete horizontal de la home: se pasa con el dedo (snap táctil) y cada foto
   abre el visor a pantalla completa. Las fotos las gestiona el cliente desde
   /studio (documento "Galería lifestyle"); sin CMS configurado salen de
   lib/reel-data. */
export default async function LifestyleGallery({ title, locale }: LifestyleGalleryProps) {
  const reel = await getLifestyleReel(locale);

  return (
    <section className="py-24 md:py-36 bg-bone">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        <h2 className="display text-ink section-head display-2">
          <RevealText>{title}</RevealText>
        </h2>

        <BoatGallery images={reel.images} alts={reel.alts} name={title} auto />
      </div>
    </section>
  );
}
