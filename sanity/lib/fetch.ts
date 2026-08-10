import { client } from './client';

/* fetch etiquetado: cada consulta se cachea bajo el _type que consulta y el
   webhook de Sanity (/api/revalidate) refresca esa etiqueta al publicar.
   Resultado: editar en /studio actualiza la web en segundos, sin redeploy. */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown>,
  tags: string[]
): Promise<T> {
  return client.fetch<T>(query, params, { next: { tags } });
}
