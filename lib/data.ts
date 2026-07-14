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
}

export interface Testimonial {
  quote: string;
  quoteEn: string;
  author: string;
  role: string;
}

// TODO(content): placeholder — the real single boat is still to be decided.
// Change this one line to swap the displayed boat (the other boats stay hidden but in the data).
export const ACTIVE_BOAT_SLUGS = ['wajer-55'];

export const fleet: Boat[] = [
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
