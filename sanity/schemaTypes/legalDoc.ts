import { defineField, defineType } from 'sanity';

/* Cuatro documentos fijos (privacidad, términos, aviso legal, cookies) con
   _id determinista legal-<clave>; se editan desde el grupo "Textos legales"
   del panel. Los párrafos de cada sección se separan con una línea en blanco. */
export default defineType({
  name: 'legalDoc',
  title: 'Texto legal',
  type: 'document',
  fields: [
    defineField({
      name: 'docKey',
      title: 'Clave',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({ name: 'title', title: 'Título', type: 'internationalizedArrayString' }),
    defineField({
      name: 'updated',
      title: 'Texto de "última actualización"',
      type: 'internationalizedArrayString',
    }),
    defineField({ name: 'intro', title: 'Introducción', type: 'internationalizedArrayText' }),
    defineField({
      name: 'sections',
      title: 'Secciones',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'legalSection',
          title: 'Sección',
          fields: [
            defineField({ name: 'heading', title: 'Encabezado', type: 'internationalizedArrayString' }),
            defineField({
              name: 'body',
              title: 'Texto (párrafos separados por línea en blanco)',
              type: 'internationalizedArrayText',
            }),
          ],
          preview: {
            select: { heading: 'heading' },
            prepare({ heading }: { heading?: { _key: string; value?: string }[] }) {
              const es = Array.isArray(heading) ? heading.find((v) => v._key === 'es') : null;
              return { title: es?.value ?? 'Sección' };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', docKey: 'docKey' },
    prepare({ title, docKey }) {
      const es = Array.isArray(title) ? title.find((v: { _key: string }) => v._key === 'es') : null;
      return { title: es?.value ?? docKey ?? 'Texto legal' };
    },
  },
});
