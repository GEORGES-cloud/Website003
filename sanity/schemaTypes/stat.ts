import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'stat',
  title: 'Cifra',
  type: 'document',
  fields: [
    defineField({ name: 'value', title: 'Valor numérico', type: 'number' }),
    defineField({ name: 'suffix', title: 'Sufijo (%, NM...)', type: 'string' }),
    defineField({ name: 'label', title: 'Etiqueta', type: 'internationalizedArrayString' }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
  ],
  orderings: [
    { title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { value: 'value', suffix: 'suffix', label: 'label' },
    prepare({ value, suffix, label }) {
      const es = Array.isArray(label) ? label.find((v: { _key: string }) => v._key === 'es') : null;
      return { title: `${value ?? ''}${suffix ?? ''}`, subtitle: es?.value };
    },
  },
});
