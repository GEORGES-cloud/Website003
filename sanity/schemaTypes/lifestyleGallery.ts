import { defineField, defineType } from 'sanity';

/* Documento único: el carrete de fotos "lifestyle" de la portada. El cliente
   añade, quita y reordena arrastrando. */
export default defineType({
  name: 'lifestyleGallery',
  title: 'Galería lifestyle (portada)',
  type: 'document',
  fields: [
    defineField({
      name: 'images',
      title: 'Fotos del carrete',
      type: 'array',
      of: [{ type: 'captionedImage' }],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Galería lifestyle (portada)' }),
  },
});
