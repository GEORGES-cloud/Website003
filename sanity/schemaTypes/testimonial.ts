import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'testimonial',
  title: 'Testimonio',
  type: 'document',
  fields: [
    defineField({ name: 'author', title: 'Autor', type: 'string' }),
    defineField({ name: 'role', title: 'Rol (p. ej. "Socio fundador")', type: 'internationalizedArrayString' }),
    defineField({ name: 'quote', title: 'Cita', type: 'internationalizedArrayText' }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
  ],
  orderings: [
    { title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'author' },
  },
});
