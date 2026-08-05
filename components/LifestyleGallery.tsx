import ScrollReveal from './ScrollReveal';
import BoatGallery from './BoatGallery';

interface LifestyleGalleryProps {
  title: string;
}

/* Carrete horizontal de la home: se pasa con el dedo (snap táctil) y cada foto
   abre el visor a pantalla completa. Selección monocroma de todo el club —
   los tres barcos y la vida a bordo, sin fotos vetadas. */
const REEL = [
  '/images/life-1.jpg',
  '/images/navan-1.jpg',
  '/images/blue-cockpit-friends.jpg',
  '/images/exp-sunset.jpg',
  '/images/level-aerial-anchor.jpg',
  '/images/navan-cala.jpg',
  '/images/blue-cove.jpg',
  '/images/life-5.jpg',
  '/images/navan-rocks-cove.jpg',
  '/images/blue-snorkel-split.jpg',
  '/images/level-terrace.jpg',
  '/images/marina-dawn.jpg',
  '/images/navan-3.jpg',
  '/images/blue-townhouse.jpg',
  '/images/exp-private.jpg',
  '/images/navan-ttop-helm.jpg',
  '/images/life-6.jpg',
  '/images/blue-helm-teak.jpg',
  '/images/level-running.jpg',
  '/images/navan-sunset-run.jpg',
  '/images/aerial-reef-1.jpg',
  '/images/blue-cave-paddle.jpg',
  '/images/navan-duo-1.jpg',
  '/images/life-2.jpg',
  '/images/blue-platform-couple.jpg',
  '/images/level-sunpad.jpg',
  '/images/navan-coast-run.jpg',
  '/images/exp-daytrip.jpg',
  '/images/blue-cala-anchor.jpg',
  '/images/navan-night-glow.jpg',
  '/images/life-3.jpg',
  '/images/blue-overhead-anchor.jpg',
  '/images/level-cockpit.jpg',
  '/images/navan-dji-1.jpg',
  '/images/sunset-palms.jpg',
  '/images/blue-bow-sunpad.jpg',
  '/images/navan-beach.jpg',
  '/images/exp-weekend.jpg',
  '/images/blue-profile.jpg',
  '/images/navan-splitwater.jpg',
  '/images/level-deck-table.jpg',
  '/images/bow-dusk.jpg',
  '/images/navan-cannes-2.jpg',
  '/images/aerial-reef-2.jpg',
  '/images/blue-marina-golden.jpg',
  '/images/navan-glide.jpg',
  '/images/membership.jpg',
  '/images/stern-couple.jpg',
  '/images/navan-print-37.jpg',
  '/images/hero-final.jpg',
  '/images/blue-vertical.jpg',
  '/images/navan-dive.jpg',
  '/images/platform-dawn.jpg',
  '/images/wake-circle.jpg',
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
