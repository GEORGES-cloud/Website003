# Estado de la puesta en marcha — actualizado 2026-08-10

La web está EN PRODUCCIÓN en https://flamingoyachtclub.com, servida por el
CDN de Hostinger con auto-deploy desde GitHub (`main` → producción en ~3 min).

## Hecho ✅

1. ~~Crear el proyecto en Sanity~~ — proyecto **"Flamingo Yacht Club"**,
   ID `zx8vyxcc`, organización propia, dataset `production` público, plan Free.
2. ~~Configurar el entorno local~~ — `.env.local` con Project ID, dataset,
   `SANITY_REVALIDATE_SECRET` y el token de migración (gitignored).
3. ~~CORS~~ — `http://localhost:3010` y `https://flamingoyachtclub.com`,
   ambos con credentials.
4. ~~Migrar el contenido~~ — `scripts/migrate-to-sanity.ts` (idempotente,
   re-ejecutable sin duplicar).
5. ~~Textos legales~~ — razón social y NIF reales (Marina Marbella, S.A.,
   A29071693) tanto en `lib/legal.ts` como migrados a Sanity.
6. ~~Dominio y SMTP~~ — dominio conectado; buzón de Hostinger configurado.

## Pendiente — requiere el panel de Hostinger (manual)

En el panel donde se configura el deploy de GitHub, añadir las variables de
entorno de build/runtime:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` = `zx8vyxcc`
- `NEXT_PUBLIC_SANITY_DATASET` = `production`
- `SANITY_REVALIDATE_SECRET` = (el valor está en `.env.local` local — copiarlo)
- `NEXT_PUBLIC_SITE_URL` = `https://flamingoyachtclub.com`
- Verificar que `SMTP_PASS` y `CONTACT_EMAIL` ya están (los formularios
  funcionan solo si están).
- **NO** subir `SANITY_API_WRITE_TOKEN`.

Sin estas variables, producción sigue sirviendo el contenido local (fallback)
y las ediciones de /studio no se ven en la web pública.

## Pendiente — resto

- **Webhook de publicación** (para que editar refresque la web al instante):
  sanity.io/manage → proyecto → API → Webhooks → Create:
  - URL `https://flamingoyachtclub.com/api/revalidate`
  - Trigger: Create, Update, Delete
  - Filter: `_type in ["boat","faq","testimonial","stat","milestone","tier","legalDoc","lifestyleGallery","siteSettings"]`
  - Projection: `{ "tags": [_type] }`
  - Secret: el mismo valor que `SANITY_REVALIDATE_SECRET`
- **Invitar al cliente**: sanity.io/manage → Members → Invite → email del
  club, rol **Editor**. Entrará en flamingoyachtclub.com/studio.
- **Prueba de punta a punta del formulario** de contacto (envío real → buzón).
- **Revisión de abogado** de los textos legales.
- En "Ajustes del sitio" de /studio: añadir las redes sociales del club.
- Specs provisionales de NAVAN T30 y Level 43ST — confirmar con el club
  (se editan en /studio).
- Cifras e hitos marcados como indicativos — confirmar con el cliente.
- `npm audit` tras cada actualización de Next (vulnerabilidades en tooling
  de desarrollo de Sanity, no afectan a producción).
- Tras verificar Sanity en producción, se pueden borrar del repo las fotos de
  galerías que ya vivan en el CDN de Sanity (~35 MB menos).
