import { getSeaConditions } from '@/lib/marine';
import SeaConditionsWidget from './SeaConditionsWidget';

/* Envoltorio de servidor: trae el dato (cacheado 30 min) y solo entonces monta
   el widget. Si la API no responde no se pinta nada — mejor sin gadget que con
   condiciones de mar equivocadas en una web de un club náutico. */
export default async function SeaConditions({ locale }: { locale: string }) {
  const data = await getSeaConditions();
  if (!data) return null;
  return <SeaConditionsWidget data={data} locale={locale} />;
}
