import ScrollReveal from './ScrollReveal';
import BoatGallery from './BoatGallery';

interface LifestyleGalleryProps {
  title: string;
}

/* Carrete horizontal de la home: se pasa con el dedo (snap táctil) y cada foto
   abre el visor a pantalla completa. Selección monocroma de todo el club —
   los tres barcos y la vida a bordo, sin fotos vetadas. */
const REEL = [
  '/images/blue-cala-anchor.jpg',
  '/images/about.jpg',
  '/images/navan-5.jpg',
  '/images/cta.jpg',
  '/images/exp-daytrip.jpg',
  '/images/blue-cave-paddle.jpg',
  '/images/navan-7.jpg',
  '/images/exp-private.jpg',
  '/images/blue-helm-teak.jpg',
  
  '/images/navan-cannes-2.jpg',
  '/images/exp-weekend.jpg',
  
  '/images/blue-platform-couple.jpg',
  '/images/navan-coast-run.jpg',
  '/images/life-1.jpg',
  '/images/blue-profile.jpg',
  
  '/images/navan-dji-1.jpg',
  '/images/life-3.jpg',
  '/images/life-4.jpg',
  '/images/blue-snorkel-split.jpg',
  '/images/navan-print-37.jpg',
  '/images/life-5.jpg',
  '/images/blue-townhouse.jpg',
  
  '/images/navan-rocks-cove.jpg',
  
  '/images/reel-beach-cove.jpg',
  '/images/blue-vertical.jpg',
  '/images/navan-sunset-run.jpg',
  '/images/reel-dolphin.jpg',
  '/images/reel-accent-sunset.jpg',
  '/images/reel-palms-beach.jpg',
  '/images/reel-navan-aerial.jpg',
  '/images/reel-teal-water.jpg',
  '/images/reel-wake-loop.jpg',
  '/images/reel-aerial-pair.jpg',
  '/images/reel-navan-anchored.jpg',
  '/images/reel-bow-sunset.jpg',
  '/images/reel-navan-cliff.jpg',
  '/images/reel-cockpit-bow.jpg',
  '/images/reel-navan-covrun.jpg',
  '/images/reel-cockpit-table.jpg',
  '/images/reel-navan-cruise.jpg',
  '/images/reel-cockpit-teak.jpg',
  '/images/reel-navan-friends.jpg',
  '/images/reel-engines-under.jpg',
  '/images/reel-navan-run.jpg',
  '/images/reel-feet-teak.jpg',
  '/images/reel-navan-stern.jpg',
  '/images/reel-kid-swim.jpg',
  '/images/reel-platform-sit.jpg',
  '/images/reel-platform-step.jpg',
  '/images/reel-profile-dusk.jpg',
  '/images/reel-sunpad-couple.jpg',
  '/images/reel-sunset-lone.jpg',
];

export default function LifestyleGallery({ title }: LifestyleGalleryProps) {
  return (
    <section className="py-24 md:py-36 bg-bone">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        <ScrollReveal>
          <h2 className="display text-ink mb-14 md:mb-16" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 4rem)' }}>
            {title}
          </h2>
        </ScrollReveal>

        <BoatGallery images={REEL} name={title} auto />
      </div>
    </section>
  );
}
