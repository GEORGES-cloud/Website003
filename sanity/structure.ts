import type { StructureResolver } from 'sanity/structure';
import {
  RocketIcon,
  HelpCircleIcon,
  CommentIcon,
  BarChartIcon,
  CalendarIcon,
  TagIcon,
  DocumentTextIcon,
  ImagesIcon,
  CogIcon,
} from '@sanity/icons';

/* Menú del panel en el orden que le importa al club, con los documentos
   únicos (legales, galería, ajustes) como entradas fijas. Los iconos hacen
   el menú escaneable también en la vista de móvil del Studio. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      S.documentTypeListItem('boat').title('Flota').icon(RocketIcon),
      S.documentTypeListItem('faq').title('Preguntas frecuentes').icon(HelpCircleIcon),
      S.documentTypeListItem('testimonial').title('Testimonios').icon(CommentIcon),
      S.documentTypeListItem('stat').title('Cifras de la portada').icon(BarChartIcon),
      S.documentTypeListItem('milestone').title('Historia (hitos)').icon(CalendarIcon),
      S.documentTypeListItem('tier').title('Membresía').icon(TagIcon),
      S.divider(),
      S.listItem()
        .title('Textos legales')
        .icon(DocumentTextIcon)
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
        .icon(ImagesIcon)
        .child(S.document().schemaType('lifestyleGallery').documentId('lifestyleGallery')),
      S.listItem()
        .title('Ajustes del sitio')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ]);
