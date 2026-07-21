/* Structured editorial content (bilingual). Prices/figures are indicative
   placeholders for the client to confirm. */

export interface Tier {
  id: string;
  name: string;
  price: string;
  period: string;
  periodEn: string;
  tagline: string;
  taglineEn: string;
  features: string[];
  featuresEn: string[];
  featured?: boolean;
}

/* Single membership for now — prices intentionally not shown. The Tier[]
   structure is kept so tiered plans with prices can return with a minimal diff. */
export const tiers: Tier[] = [
  {
    id: 'club',
    name: 'Membresía',
    price: '',
    period: '',
    periodEn: '',
    tagline: 'Simple. Transparente. Todo lo que necesitas para disfrutar del mar.',
    taglineEn: 'Simple. Transparent. Everything you need to enjoy life on the water.',
    features: [
      'Uso anual ilimitado, con reservas desde la app del club',
      'Preparación profesional del barco antes de cada salida',
      'Onboarding y soporte a socios',
      'Toallas, refrescos, paddleboards y equipo de snorkel a bordo',
      'Sin mantenimiento, seguro, servicio ni invernaje que gestionar',
      'Licencia de navegación obligatoria (si no la tienes, te ayudamos a conseguirla)',
      'Invitados a bordo sin coste adicional',
    ],
    featuresEn: [
      'Unlimited annual usage, booked from the club app',
      'Professional boat preparation before every trip',
      'Onboarding and member support',
      'Beach towels, complimentary soft drinks, paddleboards and snorkelling equipment on board',
      'No maintenance, insurance, servicing or winter storage to think about',
      'Boating licence required (we help you get one if you don’t have it)',
      'Guests on board at no extra cost',
    ],
    featured: true,
  },
];

export interface Faq {
  q: string;
  qEn: string;
  a: string;
  aEn: string;
}

export const faqs: Faq[] = [
  {
    q: '¿Necesito licencia de navegación?',
    qEn: 'Do I need a boating licence?',
    a: 'Sí, es imprescindible. Para navegar con el club necesitas licencia. Si aún no la tienes, te ayudamos a conseguirla.',
    aEn: 'Yes, it is required. To sail with the club you need a licence. If you don’t have one yet, we help you get it.',
  },
  {
    q: '¿Puedo llevar invitados a bordo?',
    qEn: 'Can I bring guests on board?',
    a: 'Por supuesto. Puedes invitar a familia y amigos sin coste adicional, respetando la capacidad de cada barco.',
    aEn: 'Of course. You can invite family and friends at no extra cost, within each boat’s capacity.',
  },
  {
    q: '¿Cómo se reserva un barco?',
    qEn: 'How do I book a boat?',
    a: 'Desde nuestra app, en segundos. Eliges barco, fecha y destino, y recibes la confirmación al instante. Llegas al amarre y zarpas.',
    aEn: 'From our app, in seconds. Pick a boat, date and destination, and get instant confirmation. Arrive at the berth and set off.',
  },
  {
    q: '¿Qué incluye la cuota?',
    qEn: 'What does the membership fee include?',
    a: 'Uso anual ilimitado, la app de reservas, la preparación profesional del barco antes de cada salida, onboarding y soporte a socios — además de toallas, refrescos, paddleboards y equipo de snorkel a bordo. Sin mantenimiento, seguro ni invernaje que gestionar.',
    aEn: 'Unlimited annual usage, the booking app, professional boat preparation before every trip, onboarding and member support — plus beach towels, complimentary soft drinks, paddleboards and snorkelling equipment on board. No maintenance, insurance or winter storage to think about.',
  },
  {
    q: '¿Desde dónde salen los barcos?',
    qEn: 'Where do the boats depart from?',
    a: 'Desde el corazón de Puerto Banús, Marbella. Uno de los puertos más exclusivos del Mediterráneo, a un paso de las mejores calas de la Costa del Sol.',
    aEn: 'From the heart of Puerto Banús, Marbella — one of the most exclusive ports in the Mediterranean, moments from the finest coves of the Costa del Sol.',
  },
  {
    q: '¿Hay permanencia mínima?',
    qEn: 'Is there a minimum commitment?',
    a: 'La membresía es anual. Escríbenos y te explicamos sin compromiso las condiciones.',
    aEn: 'Membership is annual. Get in touch and we will walk you through the terms with no obligation.',
  },
  {
    q: '¿Cuántos socios comparten cada barco?',
    qEn: 'How many members share each boat?',
    a: 'Un máximo de siete socios por barco. Así garantizamos una disponibilidad excelente y más tiempo en el agua para cada socio.',
    aEn: 'Just seven members per boat. That ensures excellent availability and more time on the water for every member.',
  },
];

export interface Route {
  name: string;
  distance: string;
  time: string;
  desc: string;
  descEn: string;
}

export const routes: Route[] = [
  {
    name: 'Calas de Marbella',
    distance: '5 – 15 NM',
    time: '20 – 45 min',
    desc: 'Aguas turquesa y calas escondidas a un paso del puerto. El plan perfecto para un baño al mediodía.',
    descEn: 'Turquoise water and hidden coves moments from the port. The perfect plan for a midday swim.',
  },
  {
    name: 'Puerto de Estepona',
    distance: '14 NM',
    time: '40 min',
    desc: 'Un paseo costero hasta el encanto marinero de Estepona, ideal para comer frente al mar.',
    descEn: 'A coastal cruise to the seaside charm of Estepona, ideal for lunch by the water.',
  },
  {
    name: 'Sotogrande',
    distance: '22 NM',
    time: '1 h',
    desc: 'El destino más exclusivo de la zona. Amarra, almuerza y vuelve con el atardecer.',
    descEn: 'The most exclusive destination in the area. Moor, dine and return with the sunset.',
  },
  {
    name: 'Gibraltar y el Estrecho',
    distance: '40 NM',
    time: '1 h 30',
    desc: 'Donde el Mediterráneo se abre al Atlántico. Una travesía de día con delfines de fondo.',
    descEn: 'Where the Mediterranean opens to the Atlantic. A day voyage with dolphins along the way.',
  },
];

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
  labelEn: string;
}

export const stats: Stat[] = [
  { value: 100, suffix: '%', label: 'Todo incluido, sin sorpresas', labelEn: 'All included, no surprises' },
  { value: 300, suffix: '+', label: 'Días navegables al año', labelEn: 'Sailing days a year' },
  { value: 40, suffix: ' NM', label: 'De costa a tu alcance', labelEn: 'Of coastline within reach' },
  { value: 1, label: 'Puerto: Banús, Marbella', labelEn: 'Home port: Banús, Marbella' },
];
