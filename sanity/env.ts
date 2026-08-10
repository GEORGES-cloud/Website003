/* El Project ID de Sanity no es un secreto (viaja en el bundle del cliente
 * en cualquier web con Sanity); va hardcodeado como valor por defecto para
 * que producción (Hostinger) active el CMS sin depender de variables de
 * entorno del panel. Para forzar el fallback local, define la variable
 * NEXT_PUBLIC_SANITY_PROJECT_ID vacía. */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'zx8vyxcc';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
export const apiVersion = '2024-10-01';

/** Sin projectId (variable definida pero vacía), la web sirve el contenido
 *  local (lib/content, lib/data, lib/legal) y el CMS queda en espera. */
export const sanityEnabled = Boolean(projectId);
