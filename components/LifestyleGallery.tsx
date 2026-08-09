import ScrollReveal from './ScrollReveal';
import BoatGallery from './BoatGallery';
import RevealText from './RevealText';

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

/* Descripción de cada foto, en el mismo orden que REEL — el patrón numerado
   ("Una vida en el mar 23") no dice nada a quien usa lector de pantalla. */
const REEL_ALTS = [
  'La Sea Ray SPX 210 fondeada en una cala',
  'La SPX 210 amarrada en Puerto Banús al atardecer',
  'La NAVAN T30 navegando por la costa',
  'Navegando al atardecer frente a la Costa del Sol',
  'Un día completo en el mar con amigos',
  'Paddle surf junto a una cueva marina',
  'La NAVAN T30 fondeada en aguas transparentes',
  'Salida privada al caer la tarde',
  'El puesto de mando de la SPX 210 sobre cubierta de teca',
  'La NAVAN T30 en la bahía',
  'Escapada de fin de semana a bordo',
  'Una pareja sentada en la plataforma de baño',
  'La NAVAN T30 navegando pegada a la costa',
  'Vida a bordo en una jornada de sol',
  'Perfil de la SPX 210 navegando',
  'Vista aérea de la NAVAN T30 desde el dron',
  'Momento de descanso a bordo',
  'Foto partida: snorkel bajo el agua junto al barco',
  'La NAVAN T30 al sol del mediodía',
  'Baño desde el barco en aguas abiertas',
  'La SPX 210 frente a la fachada del puerto',
  'La NAVAN T30 entre rocas en una cala',
  'Cala de arena vista desde el agua',
  'La SPX 210 vista desde arriba',
  'La NAVAN T30 navegando al atardecer',
  'Delfines nadando junto al barco',
  'Luz de atardecer sobre el mar',
  'La playa de Puerto Banús entre palmeras',
  'Vista aérea de la NAVAN T30',
  'Agua turquesa vista desde cubierta',
  'Estela circular del barco vista desde el aire',
  'Dos barcos del club fondeados, vistos desde el aire',
  'La NAVAN T30 fondeada en calma',
  'La proa recortada contra el atardecer',
  'La NAVAN T30 bajo un acantilado',
  'La bañera y la proa vistas desde popa',
  'La NAVAN T30 saliendo de una cala',
  'La mesa de la bañera preparada',
  'La NAVAN T30 en travesía',
  'Detalle de la bañera con cubierta de teca',
  'Amigos a bordo de la NAVAN T30',
  'Los motores fueraborda vistos desde el agua',
  'La NAVAN T30 a plena velocidad',
  'Pies descalzos sobre la cubierta de teca',
  'La popa de la NAVAN T30',
  'Un niño bañándose junto al barco',
  'Sentados en la plataforma de baño',
  'Bajando al agua por la plataforma de baño',
  'Perfil del barco al anochecer',
  'Una pareja en el solárium de proa',
  'Un barco solo en el mar al atardecer',
];

export default function LifestyleGallery({ title }: LifestyleGalleryProps) {
  return (
    <section className="py-24 md:py-36 bg-bone">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
          <h2 className="display text-ink section-head display-2">
            <RevealText>{title}</RevealText>
          </h2>

        <BoatGallery images={REEL} alts={REEL_ALTS} name={title} auto />
      </div>
    </section>
  );
}
