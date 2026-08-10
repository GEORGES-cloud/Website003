import { Studio } from './Studio';

/* El Studio es una SPA de Sanity: se sirve estática y todo pasa en cliente. */
export const dynamic = 'force-static';

export default function StudioPage() {
  return <Studio />;
}
