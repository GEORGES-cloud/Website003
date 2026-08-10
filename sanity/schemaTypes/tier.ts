import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'tier',
  title: 'Membresía',
  type: 'document',
  fields: [
    defineField({
      name: 'tierId',
      title: 'Identificador interno',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({ name: 'name', title: 'Nombre', type: 'internationalizedArrayString' }),
    defineField({
      name: 'price',
      title: 'Precio (vacío = precio en persona)',
      description: 'Se deja vacío a propósito: el CTA lleva al funnel para dar el precio en persona.',
      type: 'string',
    }),
    defineField({ name: 'period', title: 'Periodo (p. ej. "al año")', type: 'internationalizedArrayString' }),
    defineField({ name: 'tagline', title: 'Frase corta', type: 'internationalizedArrayString' }),
    defineField({
      name: 'features',
      title: 'Qué incluye',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'feature',
          title: 'Ventaja',
          fields: [defineField({ name: 'text', title: 'Texto', type: 'internationalizedArrayString' })],
          preview: {
            select: { text: 'text' },
            prepare({ text }: { text?: { _key: string; value?: string }[] }) {
              const es = Array.isArray(text) ? text.find((v) => v._key === 'es') : null;
              return { title: es?.value ?? 'Ventaja' };
            },
          },
        },
      ],
    }),
    defineField({ name: 'featured', title: 'Destacada', type: 'boolean', initialValue: true }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
  ],
  preview: {
    select: { name: 'name' },
    prepare({ name }) {
      const es = Array.isArray(name) ? name.find((v: { _key: string }) => v._key === 'es') : null;
      return { title: es?.value ?? 'Membresía' };
    },
  },
});
