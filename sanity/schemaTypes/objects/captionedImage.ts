import { defineField, defineType } from 'sanity';

/* Foto con su texto alternativo en los 6 idiomas: el alt viaja con la imagen,
   así reordenar una galería nunca desalinea las descripciones (antes vivían
   en arrays paralelos acoplados por posición). */
export default defineType({
  name: 'captionedImage',
  title: 'Foto',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Descripción (accesibilidad y SEO)',
      type: 'internationalizedArrayString',
    }),
  ],
});
