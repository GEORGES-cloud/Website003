# Flamingo Yacht Club — flamingoyachtclub.com

Web de club náutico de membresía en Puerto Banús (Marbella), operado por
Marina Marbella, S.A. Next.js 14 (App Router) + Tailwind + next-intl
(6 idiomas: es, en, sv, ru, de, fr) + Sanity embebido en `/studio`.

## Despliegue — IMPORTANTE

- Producción se sirve vía **CDN de Hostinger** con **auto-deploy desde GitHub**
  (`GEORGES-cloud/Website003`, rama `main`). NO es Vercel.
- Publicar = commit + push a `main`. Tarda ~3 minutos en llegar a producción.
- Las variables de entorno de producción viven en el panel de Hostinger.
  `SANITY_API_WRITE_TOKEN` NUNCA va a producción ni al repo (solo `.env.local`,
  que está gitignored).

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
- Decisión del cliente (2026-08-10): en barra y footer va el **wordmark sin
  flamenco** (`logo-word.svg`: FLAMINGO —YACHT CLUB—) con "powered by Marina
  Marbella" como texto HTML debajo (en el arte sale ilegible a tamaño de
  barra). El flamenco solo sobrevive en `logo-mark` (favicon, 404, sellos).
- El navbar se funde a negro (`bg-ink/95`) al hacer scroll, con lockup y
  texto en blanco (también petición del cliente, mismo día).

## Contenido: Sanity con fallback local

- Proyecto Sanity `zx8vyxcc`, dataset `production` (público), Studio en `/studio`.
- `lib/localize.ts` es la capa de acceso: con `NEXT_PUBLIC_SANITY_PROJECT_ID`
  lee del CMS (ISR por tags, refrescado por webhook → `/api/revalidate`);
  sin proyecto o con dataset vacío sirve los datos locales de
  `lib/content.ts`, `lib/data.ts`, `lib/legal.ts` y `lib/strings/*.json`.
- Una vez activo el CMS, los cambios de contenido del cliente van por
  `/studio`; los archivos locales quedan como fallback (mantenerlos
  sincronizados solo si se re-ejecuta `scripts/migrate-to-sanity.ts`, que es
  idempotente).
- Los VÍDEOS (`public/videos/`) no los gestiona el CMS: los gestiona el
  desarrollador — comprimidos con ffmpeg a ~2 MB, con póster propio en
  `public/images/<nombre>-poster.jpg`.

## Leads

- `/api/contact` envía por SMTP de Hostinger (buzón Hello@flamingoyachtclub.com).
- Sin `SMTP_PASS` en producción los formularios devuelven 503 A PROPÓSITO
  (para no perder leads en silencio). No "arreglar" ese comportamiento.

## Material del cliente

- Las fotos originales que envía el club están en `Contenido recibido/`
  (fuera de `public/`). Antes de usar una: comprimir con ffmpeg (`-q:v 4`,
  ~400-600 KB) hacia `public/images/` con nombre kebab-case descriptivo.
