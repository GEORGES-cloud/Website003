import type { StructureResolver } from 'sanity/structure';

/* Menú del panel en el orden que le importa al club, con los documentos
   únicos (legales, galería, ajustes) como entradas fijas. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      S.documentTypeListItem('boat').title('Flota'),
      S.documentTypeListItem('faq').title('Preguntas frecuentes'),
      S.documentTypeListItem('testimonial').title('Testimonios'),
      S.documentTypeListItem('stat').title('Cifras de la portada'),
      S.documentTypeListItem('milestone').title('Historia (hitos)'),
      S.documentTypeListItem('tier').title('Membresía'),
      S.divider(),
      S.listItem()
        .title('Textos legales')
        .child(
          S.list()
            .title('Textos legales')
            .items([
              S.listItem()
                .title('Política de privacidad')
                .child(S.document().schemaType('legalDoc').documentId('legal-privacy')),
              S.listItem()
                .title('Términos y condiciones')
                .child(S.document().schemaType('legalDoc').documentId('legal-terms')),
              S.listItem()
                .title('Aviso legal')
                .child(S.document().schemaType('legalDoc').documentId('legal-notice')),
              S.listItem()
                .title('Política de cookies')
                .child(S.document().schemaType('legalDoc').documentId('legal-cookies')),
            ])
        ),
      S.listItem()
        .title('Galería lifestyle (portada)')
        .child(S.document().schemaType('lifestyleGallery').documentId('lifestyleGallery')),
      S.listItem()
        .title('Ajustes del sitio')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ]);
