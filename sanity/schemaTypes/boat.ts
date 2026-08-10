import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'boat',
  title: 'Barco',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nombre', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'shortName',
      title: 'Nombre corto (menú)',
      description: 'Código de modelo para el menú, p. ej. "SPX 210".',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'URL (slug)',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'active',
      title: 'Visible en la web',
      description: 'Solo los barcos activos aparecen en la flota y el menú.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
    defineField({ name: 'lengthM', title: 'Eslora (texto, p. ej. "6.6 m")', type: 'string' }),
    defineField({ name: 'capacity', title: 'Capacidad (personas)', type: 'number' }),
    defineField({ name: 'year', title: 'Año', type: 'number' }),
    defineField({ name: 'tagline', title: 'Frase corta', type: 'internationalizedArrayString' }),
    defineField({ name: 'description', title: 'Descripción', type: 'internationalizedArrayText' }),
    defineField({
      name: 'specs',
      title: 'Ficha técnica',
      type: 'object',
      fields: [
        defineField({ name: 'length', title: 'Eslora', type: 'string' }),
        defineField({ name: 'beam', title: 'Manga', type: 'string' }),
        defineField({ name: 'maxSpeed', title: 'Velocidad máxima', type: 'string' }),
        defineField({ name: 'engines', title: 'Motorización', type: 'string' }),
      ],
    }),
    defineField({ name: 'image', title: 'Foto principal (tarjeta de flota)', type: 'captionedImage' }),
    defineField({
      name: 'slides',
      title: 'Pase de fotos de la tarjeta',
      type: 'array',
      of: [{ type: 'captionedImage' }],
    }),
    defineField({ name: 'heroImage', title: 'Foto de cabecera de la ficha', type: 'captionedImage' }),
    defineField({
      name: 'video',
      title: 'Vídeo (ruta local, p. ej. /videos/blue-spx210.mp4)',
      description: 'Los vídeos viven en la carpeta /public/videos del proyecto, no en el CMS.',
      type: 'string',
    }),
    defineField({ name: 'videoPoster', title: 'Fotograma de carga del vídeo', type: 'captionedImage' }),
    defineField({
      name: 'gallery',
      title: 'Galería de la ficha',
      type: 'array',
      of: [{ type: 'captionedImage' }],
    }),
  ],
  orderings: [
    {
      title: 'Orden del club',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'lengthM', media: 'image', active: 'active' },
    prepare({ title, subtitle, media, active }) {
      return { title: `${active ? '' : '(oculto) '}${title}`, subtitle, media };
    },
  },
});
