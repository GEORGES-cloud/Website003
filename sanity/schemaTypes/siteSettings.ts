import { defineField, defineType } from 'sanity';

/* Documento único con los datos de contacto/redes que alimentan el pie y el
   JSON-LD (datos estructurados para Google). */
export default defineType({
  name: 'siteSettings',
  title: 'Ajustes del sitio',
  type: 'document',
  fields: [
    defineField({
      name: 'telephone',
      title: 'Teléfono (con prefijo, p. ej. +34722454277)',
      type: 'string',
    }),
    defineField({ name: 'email', title: 'Email de contacto', type: 'string' }),
    defineField({
      name: 'sameAs',
      title: 'Perfiles sociales (URLs completas)',
      description: 'Instagram, Facebook, LinkedIn... Se usan en los datos estructurados para Google.',
      type: 'array',
      of: [{ type: 'url' }],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Ajustes del sitio' }),
  },
});
