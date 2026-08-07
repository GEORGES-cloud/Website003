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
      'Acumula hasta dos reservas seguidas: asegura tu sitio y el barco es tuyo todo el día',
      'Preparación profesional del barco antes de cada salida',
      'Onboarding y soporte a socios',
      'Toallas, refrescos, paddleboards y equipo de snorkel a bordo',
      'Sin mantenimiento, seguro, servicio ni invernaje que gestionar',
      '¿Sin licencia de navegación? Te la ponemos fácil: te ayudamos a conseguirla',
      'Invitados a bordo sin coste adicional',
    ],
    featuresEn: [
      'Unlimited annual usage, booked from the club app',
      'Stack up to two back-to-back bookings: secure your spot and make the boat yours all day',
      'Professional boat preparation before every trip',
      'Onboarding and member support',
      'Beach towels, complimentary soft drinks, paddleboards and snorkelling equipment on board',
      'No maintenance, insurance, servicing or winter storage to think about',
      'No boating licence yet? We make it easy — we help you get one',
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
    a: 'Sí. Y si aún no la tienes, te lo ponemos fácil: te acompañamos en todo el proceso para que la consigas rápido y sin complicaciones.',
    aEn: 'Yes — and if you don’t have one yet, we make it easy: we guide you through the whole process so you get it quickly, hassle-free.',
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
  { value: 365, label: 'Días navegables al año', labelEn: 'Sailing days a year' },
  { value: 40, suffix: ' NM', label: 'De costa a tu alcance', labelEn: 'Of coastline within reach' },
  { value: 1, label: 'Puerto: Banús, Marbella', labelEn: 'Home port: Banús, Marbella' },
];

export interface Milestone {
  /** Año del hito — no se traduce. */
  year: string;
  title: string;
  titleEn: string;
  desc: string;
  descEn: string;
  /** Marca el hito de Flamingo: se destaca como cierre de la línea. */
  highlight?: boolean;
}

/* La historia que avala al club: seis décadas de Marina Marbella (fuente:
   marinamarbella.net/nuestra-historia) desembocando en Flamingo Yacht Club.
   El orden del array es la clave de traducción en lib/strings/*.json. */
export const milestones: Milestone[] = [
  {
    year: '1965',
    title: 'Dos hermanos y un galeón',
    titleEn: 'Two brothers and a galleon',
    desc: 'Lars y Göran Sundberg llegan desde Suecia navegando en un galeón de 1920 y fundan Marina Auto junto a Puerto Banús. Empieza todo.',
    descEn: 'Lars and Göran Sundberg sail in from Sweden aboard a 1920 galleon and found Marina Auto beside Puerto Banús. Everything starts here.',
  },
  {
    year: '1967',
    title: 'La primera instalación náutica de Marbella',
    titleEn: 'Marbella’s first nautical facility',
    desc: 'Se construye el primer centro náutico de la ciudad. La Costa del Sol empieza a mirar al mar de otra manera.',
    descEn: 'The city’s first marine centre is built. The Costa del Sol starts to look at the sea differently.',
  },
  {
    year: '1982',
    title: 'Varadero, astillero y Puerto Banús',
    titleEn: 'Dry dock, shipyard and Puerto Banús',
    desc: 'Nace el varadero del puerto de Marbella, con capacidad para más de 600 embarcaciones de 6 a 30 metros, y la oficina de Puerto Banús: la casa que aún hoy mantiene nuestra flota.',
    descEn: 'The Marbella dry dock opens — room for over 600 boats from 6 to 30 metres — along with the Puerto Banús office: the home that still maintains our fleet today.',
  },
  {
    year: '1991',
    title: 'El mar no entiende de fronteras',
    titleEn: 'The sea knows no borders',
    desc: 'Inglaterra, Portugal, Marruecos y Baleares. La compañía cruza fronteras sin moverse de su puerto base.',
    descEn: 'England, Portugal, Morocco and the Balearics. The company crosses borders without ever leaving its home port.',
  },
  {
    year: '2005',
    title: 'Cuarenta años y un puerto nuevo',
    titleEn: 'Forty years and a new marina',
    desc: 'Marina Marbella celebra su 40 aniversario y levanta un nuevo puerto y centro de servicio en Setúbal, Portugal.',
    descEn: 'Marina Marbella celebrates its 40th anniversary and builds a new marina and service centre in Setúbal, Portugal.',
  },
  {
    year: '2017',
    title: 'Cinco países, dos continentes',
    titleEn: 'Five countries, two continents',
    desc: 'Veinte puntos de venta, catorce centros de servicio y tres puertos deportivos. Referente náutico europeo.',
    descEn: 'Twenty sales points, fourteen service centres and three marinas. A European benchmark in boating.',
  },
  {
    year: '2026',
    title: 'Nace Flamingo Yacht Club',
    titleEn: 'Flamingo Yacht Club is born',
    desc: 'Lotta Sundberg, hija de Göran, abre la segunda generación con una idea sencilla: disfrutar del mar sin comprar barco. Una membresía, la flota lista y sesenta años de oficio detrás.',
    descEn: 'Lotta Sundberg, Göran’s daughter, opens the second generation with a simple idea: enjoy the sea without buying a boat. One membership, the fleet ready, and sixty years of craft behind it.',
    highlight: true,
  },
];
