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
    tagline: 'Todo el mar de Marbella, una sola membresía.',
    taglineEn: 'All the sea of Marbella, one single membership.',
    features: [
      'Acceso a toda la flota',
      'Reserva desde la app 24/7',
      'Seguro, mantenimiento y amarre incluidos',
      'Patrón profesional disponible',
      'Invitados a bordo sin coste adicional',
      'Eventos exclusivos del club',
    ],
    featuresEn: [
      'Access to the entire fleet',
      '24/7 booking from the app',
      'Insurance, maintenance and mooring included',
      'Professional skipper available',
      'Guests on board at no extra cost',
      'Exclusive club events',
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
    a: 'No. Puedes navegar con tu propia titulación o reservar uno de nuestros patrones profesionales para que te lleve a donde quieras.',
    aEn: 'No. You can sail with your own licence or book one of our professional skippers to take you wherever you wish.',
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
    a: 'Acceso a la flota, seguro, mantenimiento, limpieza y amarre. Sin gastos ocultos: solo el combustible de cada salida corre de tu cuenta.',
    aEn: 'Access to the fleet, insurance, maintenance, cleaning and mooring. No hidden costs: you only cover the fuel for each outing.',
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
  { value: 9, label: 'Marcas premium en flota', labelEn: 'Premium brands in the fleet' },
  { value: 300, suffix: '+', label: 'Días navegables al año', labelEn: 'Sailing days a year' },
  { value: 40, suffix: ' NM', label: 'De costa a tu alcance', labelEn: 'Of coastline within reach' },
  { value: 1, label: 'Puerto: Banús, Marbella', labelEn: 'Home port: Banús, Marbella' },
];
