# Estado de la puesta en marcha — actualizado 2026-08-27

La web está EN PRODUCCIÓN en https://flamingoyachtclub.com, servida por el
CDN de Hostinger con auto-deploy desde GitHub (`main` → producción en ~3 min).

## Hecho ✅

1. ~~Dominio y SMTP~~ — dominio conectado; buzón de Hostinger configurado.
2. ~~Textos legales~~ — razón social y NIF reales (Marina Marbella, S.A.,
   A29071693) en `lib/legal.ts`.
3. ~~Retirar el CMS~~ — Sanity eliminado (2026-08-27). Todo el contenido vive
   en el repo; cada cambio de texto o foto es un commit. Ver `CLAUDE.md`,
   sección "Contenido".

## Pendiente — panel de Hostinger (lo gestiona el cliente)

Variables de entorno de build/runtime que deben estar configuradas:

- `NEXT_PUBLIC_SITE_URL` = `https://flamingoyachtclub.com`
- `CONTACT_EMAIL` = `Hello@flamingoyachtclub.com`
- `SMTP_PASS` = contraseña del buzón

Sin `SMTP_PASS`, los formularios devuelven **503 a propósito**: es
preferible un error visible a perder leads en silencio. No cambiar ese
comportamiento (ver `app/api/contact/route.ts`).

## Pendiente — contenido, a confirmar con el club

- **Redes sociales**: añadirlas en `getSiteSettings()` (`lib/localize.ts`).
  Hoy `sameAs` va vacío y el JSON-LD sale sin perfiles sociales.
- **Specs provisionales** de NAVAN T30 y Level 43ST en `lib/data.ts`.
- **Cifras e hitos** marcados como indicativos, en `lib/content.ts`.

## Pendiente — resto

- **Prueba de punta a punta del formulario** de contacto (envío real → buzón).
- **Revisión de abogado** de los textos legales.
- `npm audit` tras cada actualización de Next.
- Peso del repo: `public/images` ocupa ~51 MB y `public/videos` ~32 MB. Si en
  algún momento estorba al deploy, moverlos a un CDN externo.
