# Flamingo Yacht Club — flamingoyachtclub.com

Web de club náutico de membresía en Puerto Banús (Marbella), operado por
Marina Marbella, S.A. Next.js 14 (App Router) + Tailwind + next-intl
(6 idiomas: es, en, sv, ru, de, fr). Sin CMS: el contenido vive en el repo.

## Despliegue — IMPORTANTE

- Producción se sirve vía **CDN de Hostinger** con **auto-deploy desde GitHub**
  (`GEORGES-cloud/Website003`, rama `main`). NO es Vercel.
- Publicar = commit + push a `main`. Tarda ~3 minutos en llegar a producción.
- Las variables de entorno de producción viven en el panel de Hostinger, que
  es del cliente. Los secretos (`SMTP_PASS`) NUNCA van al repo: solo a ese
  panel y a `.env.local`, que está gitignored.

## Reglas de desarrollo

- Servidor de dev: puerto **3010** (config en `.claude/launch.json`).
- **NUNCA ejecutes `npm run build` con el dev server en marcha**: pisa `.next`
  y produce errores 500 que parecen fallos de código. Para el dev server antes.
- Mensajes de commit: en español y **sin tildes ni eñes** (ASCII), una línea
  descriptiva estilo "Zona: que cambia" — mira `git log` para el patrón.

## Dirección de diseño (acordada con el cliente — no desviarse)

- Monocromo/minimal estilo De Antonio Yachts. El rosa `#E31C5F` es el ÚNICO
  color de acento en toda la web.
- Sin 3D, sin animaciones decorativas infinitas, sin efectos-truco.
- El quiz de descuento existe SOLO como banner; "Únete al club" abre JoinFunnel.
- Los heros de página usan vídeo a pantalla completa o la banda de `HeroLedger`.

## Logo

- Vive vectorizado en `public/brand/*.svg` y se sirve SIEMPRE con `<img>`,
  nunca con `next/image`.
- En la **barra** va el **wordmark sin flamenco** (`wordmark-bold.svg`:
  FLAMINGO / YACHT CLUB, engordado con stroke por línea) con "powered by Marina
  Marbella" como texto HTML debajo (decisión del cliente 2026-08-10: en el arte
  sale ilegible a tamaño de barra).
- En el **footer** va el lockup CON flamenco (2026-08-27, revierte para el
  footer la decisión de 2026-08-10: ahí hay sitio y el cliente lo quiere
  completo). Se usa la variante `nav` y NO `full`: `full` trae el "powered by"
  dibujado dentro, que sale como un hilo ilegible y duplicaría la línea HTML.
- El flamenco tambien vive en `logo-mark` (favicon, 404, sellos) y en el lockup
  grande sobre el vídeo de `HeroVideo` (variante `full`).
- El navbar se funde a negro (`bg-ink/95`) al hacer scroll, con lockup y
  texto en blanco (también petición del cliente, mismo día).

## Contenido: en el repo, sin CMS

- **No hay CMS.** Sanity se retiró en 2026-08: todo el contenido vive en el
  repo y cada cambio de texto o foto es un commit.
- `lib/localize.ts` es la ÚNICA capa de acceso al contenido. Sus funciones son
  async por contrato (17 archivos las esperan con `await`); mantenerlas así.
- Dónde vive cada cosa:
  - `lib/data.ts` — flota (8 barcos, 3 activos vía `ACTIVE_BOAT_SLUGS`).
  - `lib/content.ts` — membresía, FAQs, rutas, cifras, hitos.
  - `lib/legal.ts` — privacidad, términos, aviso legal, cookies.
  - `lib/reel-data.ts` — carrete lifestyle de la portada.
  - `lib/strings/{sv,ru,de,fr}.json` — traducciones; es/en van en los base.
- Al tocar un texto en español o inglés, revisar si los otros 4 idiomas
  necesitan la misma actualización en `lib/strings/`.
- Los VÍDEOS (`public/videos/`) los gestiona el desarrollador: comprimidos
  con ffmpeg a ~2 MB, con póster propio en
  `public/images/<nombre>-poster.jpg`.

## Leads

- `/api/contact` envía por SMTP de Hostinger (buzón Hello@flamingoyachtclub.com).
- Sin `SMTP_PASS` en producción los formularios devuelven 503 A PROPÓSITO
  (para no perder leads en silencio). No "arreglar" ese comportamiento.

## Material del cliente

- Las fotos originales que envía el club están en `Contenido recibido/`
  (fuera de `public/`). Antes de usar una: comprimir con ffmpeg (`-q:v 4`,
  ~400-600 KB) hacia `public/images/` con nombre kebab-case descriptivo.
