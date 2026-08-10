export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
export const apiVersion = '2024-10-01';

/** Sin projectId configurado, la web sirve el contenido local (lib/content,
 *  lib/data, lib/legal) y el CMS queda en espera: así el sitio funciona
 *  entero antes de crear el proyecto en sanity.io. */
export const sanityEnabled = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
