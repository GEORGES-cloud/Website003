import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'milestone',
  title: 'Hito de la historia',
  type: 'document',
  fields: [
    defineField({ name: 'year', title: 'Año (no se traduce)', type: 'string' }),
    defineField({ name: 'title', title: 'Título', type: 'internationalizedArrayString' }),
    defineField({ name: 'desc', title: 'Texto', type: 'internationalizedArrayText' }),
    defineField({
      name: 'highlight',
      title: 'Hito destacado (Flamingo, en rosa)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
  ],
  orderings: [
    { title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { year: 'year', title: 'title' },
    prepare({ year, title }) {
      const es = Array.isArray(title) ? title.find((v: { _key: string }) => v._key === 'es') : null;
      return { title: `${year ?? ''} — ${es?.value ?? ''}` };
    },
  },
});
