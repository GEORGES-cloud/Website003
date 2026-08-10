import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'faq',
  title: 'Pregunta frecuente',
  type: 'document',
  fields: [
    defineField({ name: 'question', title: 'Pregunta', type: 'internationalizedArrayString' }),
    defineField({ name: 'answer', title: 'Respuesta', type: 'internationalizedArrayText' }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
  ],
  orderings: [
    { title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { q: 'question' },
    prepare({ q }) {
      const first = Array.isArray(q) ? q.find((v: { _key: string }) => v._key === 'es') ?? q[0] : null;
      return { title: first?.value ?? 'Pregunta sin texto' };
    },
  },
});
