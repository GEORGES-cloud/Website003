import { createClient } from 'next-sanity';
import { projectId, dataset, apiVersion } from '../env';

/* Cliente de solo lectura para el frontend. El dataset es público, así que
   no necesita token; useCdn sirve el contenido cacheado del CDN de Sanity. */
export const client = createClient({
  projectId: projectId || 'pendiente0',
  dataset,
  apiVersion,
  useCdn: true,
});
