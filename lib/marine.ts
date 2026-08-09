/* Condiciones de mar en el puerto base (Puerto Banús).

   Fuente: Open-Meteo — sin clave de API y con licencia libre para uso no
   comercial; si el club factura sobre esto habría que pasar a su plan de pago.
   Se cachea 30 min: el dato es de interés, no de seguridad, y así no se
   castiga al origen ni al tiempo de respuesta.

   Si la API falla o tarda, se devuelve null y el widget no se pinta: nunca
   debe romper la página ni enseñar datos náuticos inventados. */

const LAT = 36.4848;
const LON = -4.9534;
const REVALIDATE = 1800; // 30 min

export interface SeaConditions {
  /** Viento medio en nudos */
  windKn: number;
  /** Racha máxima en nudos */
  gustKn: number | null;
  /** Dirección de procedencia del viento, en grados */
  windDeg: number;
  /** Temperatura del aire en °C */
  airC: number;
  /** Altura de ola significativa en metros */
  waveM: number | null;
  /** Temperatura del agua en °C */
  seaC: number | null;
}

async function grab(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const num = (v: unknown): number | null =>
  typeof v === 'number' && Number.isFinite(v) ? v : null;

export async function getSeaConditions(): Promise<SeaConditions | null> {
  const [air, sea] = await Promise.all([
    grab(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
        `&current=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m` +
        `&wind_speed_unit=kn&timezone=Europe%2FMadrid`
    ),
    grab(
      `https://marine-api.open-meteo.com/v1/marine?latitude=${LAT}&longitude=${LON}` +
        `&current=wave_height,sea_surface_temperature&timezone=Europe%2FMadrid`
    ),
  ]);

  const c = air?.current;
  const windKn = num(c?.wind_speed_10m);
  const windDeg = num(c?.wind_direction_10m);
  const airC = num(c?.temperature_2m);
  // Sin viento, dirección o temperatura del aire no hay nada que contar.
  if (windKn === null || windDeg === null || airC === null) return null;

  return {
    windKn: Math.round(windKn),
    gustKn: num(c?.wind_gusts_10m) !== null ? Math.round(num(c!.wind_gusts_10m)!) : null,
    windDeg: Math.round(windDeg),
    airC: Math.round(airC),
    waveM: num(sea?.current?.wave_height),
    seaC: num(sea?.current?.sea_surface_temperature) !== null
      ? Math.round(num(sea!.current.sea_surface_temperature)!)
      : null,
  };
}

/** Rosa de los vientos abreviada, en la convención española (O = oeste). */
export function compassPoint(deg: number, locale: string): string {
  const es = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
  const en = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const table = locale === 'es' ? es : en;
  return table[Math.round(deg / 22.5) % 16];
}

/** Escala Beaufort resumida — el titular honesto de "cómo está el mar hoy". */
export function beaufort(windKn: number): number {
  const limits = [1, 3, 6, 10, 16, 21, 27, 33, 40, 47, 55, 63];
  return limits.findIndex((l) => windKn <= l) === -1 ? 12 : limits.findIndex((l) => windKn <= l);
}
