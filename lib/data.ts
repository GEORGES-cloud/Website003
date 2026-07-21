export interface Boat {
  slug: string;
  name: string;
  lengthM: string;
  capacity: number;
  year: number;
  tagline: string;
  taglineEn: string;
  description: string;
  descriptionEn: string;
  specs: {
    length: string;
    beam?: string;
    maxSpeed?: string;
    engines?: string;
  };
  image: string;
  /** Optional per-boat photography for the detail-page gallery. Falls back to [image]. */
  gallery?: string[];
}

export interface Testimonial {
  quote: string;
  quoteEn: string;
  author: string;
  role: string;
}

// The boats currently active in the club. Edit this list to show/hide boats
// (the rest stay hidden but in the data).
export const ACTIVE_BOAT_SLUGS = ['sea-ray-spx-210', 'navan-c30', 'level-43st'];

export const fleet: Boat[] = [
  {
    slug: 'sea-ray-spx-210',
    name: 'Sea Ray SPX 210',
    lengthM: '6.6 m',
    capacity: 10,
    year: 2025,
    tagline: 'Te presentamos a Blue: lista para cada aventura.',
    taglineEn: 'Meet Blue — ready for every adventure.',
    description:
      'Blue, nuestra Sea Ray SPX 210, es el barco perfecto para días inolvidables en el Mediterráneo. Con su motor Mercury FourStroke de 200 CV es divertida, cómoda y fácil de disfrutar: costa de Marbella, fondeos para un baño, almuerzos en el agua o un día entero con familia y amigos. Mantenida profesionalmente por Marina Marbella y preparada antes de cada salida, con un máximo de siete socios por barco para garantizar una disponibilidad excelente.',
    descriptionEn:
      'Blue, our Sea Ray SPX 210, is the perfect boat for unforgettable days on the Mediterranean. Powered by a Mercury 200HP FourStroke engine, she is fun, comfortable and easy to enjoy: cruising the Marbella coastline, dropping anchor for a swim, lunch on the water or a full day with family and friends. Professionally maintained by Marina Marbella and prepared before every trip — with just seven members per boat, ensuring excellent availability.',
    specs: {
      length: '6.60 m',
      beam: '2.59 m',
      maxSpeed: '35 kn',
      engines: 'Mercury FourStroke · 200 CV',
    },
    image: '/images/fleet-searay.jpg',
    gallery: [
      '/images/searay-1.jpg',
      '/images/searay-2.jpg',
      '/images/searay-3.jpg',
      '/images/searay-4.jpg',
      '/images/searay-5.jpg',
      '/images/searay-6.jpg',
      '/images/searay-7.jpg',
      '/images/searay-8.jpg',
    ],
  },
  {
    slug: 'navan-c30',
    name: 'NAVAN C30',
    lengthM: '9.4 m',
    capacity: 8,
    // TODO confirmar specs con el cliente (motorización/año/capacidad provisionales)
    year: 2024,
    tagline: 'Carácter nórdico para llegar más lejos.',
    taglineEn: 'Nordic character, built to go further.',
    description:
      'La NAVAN C30 es nuestra aventurera nórdica: un walkaround robusto y marinero con T-top, cabina para descansar o cambiarse y dos Mercury V8 que la convierten en la elección perfecta para jornadas largas. Costa de Marbella, calas de aguas transparentes, paddle surf y baños fuera de temporada: con la C30, el Mediterráneo se hace grande.',
    descriptionEn:
      'The NAVAN C30 is our Nordic adventurer: a rugged, seaworthy walkaround with a T-top, a cabin to rest or change in and twin Mercury V8s that make her the perfect choice for long days out. The Marbella coastline, crystal-clear coves, paddleboarding and off-season swims — aboard the C30, the Mediterranean gets bigger.',
    specs: {
      length: '9.35 m',
      beam: '2.95 m',
      maxSpeed: '42 kn',
      engines: '2 × Mercury V8 Verado 300 CV',
    },
    image: '/images/fleet-navan.jpg',
    gallery: [
      '/images/navan-1.jpg',
      '/images/navan-2.jpg',
      '/images/navan-3.jpg',
      '/images/navan-4.jpg',
      '/images/navan-5.jpg',
      '/images/navan-6.jpg',
      '/images/navan-7.jpg',
      '/images/navan-8.jpg',
    ],
  },
  {
    slug: 'level-43st',
    name: 'Level Yachts 43ST',
    lengthM: '13.2 m',
    capacity: 12,
    // TODO confirmar specs con el cliente (eslora/manga/motorización/año provisionales)
    year: 2024,
    tagline: 'La insignia del club: espacio y presencia.',
    taglineEn: 'The club flagship — space and presence.',
    description:
      'La Level Yachts 43ST es la insignia de la flota: un sport walkaround de 13 metros con solárium de proa y popa, sombra generosa y una cubierta pensada para compartir el día entero en el agua. Presencia, confort y espacio para todos — la elección natural para las grandes ocasiones.',
    descriptionEn:
      'The Level Yachts 43ST is the flagship of the fleet: a 13-metre sport walkaround with bow and stern sun loungers, generous shade and a deck designed for sharing a full day on the water. Presence, comfort and room for everyone — the natural choice for the big occasions.',
    specs: {
      length: '13.20 m',
      beam: '3.90 m',
      maxSpeed: '35 kn',
    },
    image: '/images/fleet-level.jpg',
    gallery: [
      '/images/level-1.jpg',
      '/images/level-2.jpg',
      '/images/level-3.jpg',
      '/images/level-4.jpg',
      '/images/level-5.jpg',
    ],
  },
  {
    slug: 'wajer-55',
    name: 'Wajer 55',
    lengthM: '16.8 m',
    capacity: 12,
    year: 2024,
    tagline: 'El day boat definitivo.',
    taglineEn: 'The ultimate day boat.',
    description:
      'La Wajer 55 es la referencia mundial en day boats de lujo. Construida a mano en Holanda, combina un casco rapidísimo con un confort y unos acabados sin rival para el mejor día en el mar.',
    descriptionEn:
      'The Wajer 55 is the global benchmark for luxury day boats. Hand-built in Holland, it pairs a blistering hull with unrivalled comfort and finish for the finest day at sea.',
    specs: {
      length: '16.76 m',
      beam: '4.60 m',
      maxSpeed: '40 kn',
      engines: '2 × Volvo IPS 1050',
    },
    image: '/images/fleet-wajer.jpg',
  },
  {
    slug: 'frauscher-1212-ghost',
    name: 'Frauscher 1212 Ghost',
    lengthM: '12.2 m',
    capacity: 10,
    year: 2023,
    tagline: 'Diseño austríaco, alma deportiva.',
    taglineEn: 'Austrian design, sporting soul.',
    description:
      'La 1212 Ghost es la obra maestra de Frauscher: líneas escultóricas, navegación precisa y un rendimiento que electriza. Pura emoción náutica con sello austríaco.',
    descriptionEn:
      'The 1212 Ghost is Frauscher’s masterpiece: sculptural lines, razor-sharp handling and electrifying performance. Pure nautical emotion, with an Austrian signature.',
    specs: {
      length: '12.20 m',
      beam: '3.50 m',
      maxSpeed: '45 kn',
      engines: '2 × Mercury V8 300',
    },
    image: '/images/fleet-frauscher.jpg',
  },
  {
    slug: 'sessa-c68',
    name: 'Sessa Marine C68',
    lengthM: '20.7 m',
    capacity: 12,
    year: 2022,
    tagline: 'Lujo italiano con flybridge.',
    taglineEn: 'Italian luxury with a flybridge.',
    description:
      'La C68 lleva el savoir-faire italiano al máximo: flybridge panorámico, salón inundado de luz y una popa pensada para vivir el mar. Elegancia para los días que cuentan.',
    descriptionEn:
      'The C68 takes Italian savoir-faire to its peak: a panoramic flybridge, a light-flooded saloon and an aft deck made for living the sea. Elegance for the days that matter.',
    specs: {
      length: '20.70 m',
      beam: '5.30 m',
      maxSpeed: '32 kn',
      engines: '2 × MAN V12 1400',
    },
    image: '/images/fleet-sessa.jpg',
  },
  {
    slug: 'navan-s30',
    name: 'Navan S30',
    lengthM: '9.3 m',
    capacity: 8,
    year: 2024,
    tagline: 'Diseño escandinavo, versatilidad total.',
    taglineEn: 'Scandinavian design, total versatility.',
    description:
      'La Navan S30 reinventa el day boat nórdico: ágil, luminosa y sorprendentemente espaciosa. La opción perfecta para escapadas espontáneas y baños en cala.',
    descriptionEn:
      'The Navan S30 reinvents the Nordic day boat: agile, bright and surprisingly spacious. The perfect choice for spontaneous escapes and swims in a quiet cove.',
    specs: {
      length: '9.27 m',
      beam: '2.99 m',
      maxSpeed: '42 kn',
      engines: '2 × Mercury V8 300',
    },
    image: '/images/fleet-navan.jpg',
  },
  {
    slug: 'solaris-power-48',
    name: 'Solaris Power 48 Open',
    lengthM: '14.7 m',
    capacity: 10,
    year: 2023,
    tagline: 'Walkaround de altura.',
    taglineEn: 'A walkaround like no other.',
    description:
      'La Solaris Power 48 Open combina la pasión velera de Solaris con un walkaround de líneas puras. Espacio, mar y horizonte en estado puro, sin renunciar a nada.',
    descriptionEn:
      'The Solaris Power 48 Open blends Solaris’s sailing pedigree with a pure-lined walkaround. Space, sea and horizon in their purest form, with no compromise.',
    specs: {
      length: '14.74 m',
      beam: '4.60 m',
      maxSpeed: '34 kn',
      engines: '2 × Volvo IPS 800',
    },
    image: '/images/fleet-solaris.jpg',
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      'Tener el Mediterráneo a tu disposición desde Puerto Banús sin los quebraderos de cabeza del mantenimiento — eso es exactamente lo que buscábamos.',
    quoteEn:
      'Having the Mediterranean at your fingertips from Puerto Banús without the maintenance headaches — that is exactly what we were looking for.',
    author: 'Carlos M.',
    role: 'Socio fundador',
  },
  {
    quote:
      'La flota es impresionante y el servicio, impecable. Reservar es tan fácil que ya no puedo imaginar el verano en Marbella sin esto.',
    quoteEn:
      "The fleet is impressive and the service impeccable. Booking is so easy I can't imagine a summer in Marbella without it.",
    author: 'Ana & Javier R.',
    role: 'Socios',
  },
  {
    quote:
      'Lo que más valoro es la flexibilidad. Elijo el barco, el día y el destino. Salir desde Puerto Banús cada vez que quiero es un privilegio.',
    quoteEn:
      'What I value most is the flexibility. I choose the boat, the day, and the destination. Setting off from Puerto Banús whenever I want is a privilege.',
    author: 'Martina L.',
    role: 'Socia',
  },
];
