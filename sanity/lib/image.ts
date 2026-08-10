import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { client } from './client';

/* Builder de URLs del CDN de imágenes de Sanity (recortes, tamaños...). Las
   consultas actuales proyectan `asset->url` directamente y next/image hace el
   resize, así que esto queda para usos puntuales (p. ej. OG images futuras). */
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
