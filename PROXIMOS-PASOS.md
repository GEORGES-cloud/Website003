# Próximos pasos — puesta en marcha del CMS y lanzamiento

La web funciona completa SIN hacer nada de esto (sirve el contenido local).
Estos pasos activan el panel de edición para el cliente y el despliegue.

## 1. Crear el proyecto en Sanity (5 min)

1. Entra en [sanity.io](https://www.sanity.io/) y crea una cuenta (vale con Google).
2. En [sanity.io/manage](https://www.sanity.io/manage) → **Create project**. Nombre: "Flamingo Yacht Club". Plan **Free**.
3. Crea el dataset **production** y márcalo como **público** (public).
4. Copia el **Project ID** (algo como `ab12cd34`).

## 2. Configurar el entorno local

En `.env.local` (créalo copiando `.env.example` si no existe), añade:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=el-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=el-token
```

El token se crea en sanity.io/manage → tu proyecto → **API → Tokens → Add API token**, permiso **Editor**. Es SOLO para la migración local: no lo subas a Vercel ni al repo.

## 3. Autorizar la web en Sanity (CORS)

En sanity.io/manage → **API → CORS origins** → Add:
- `http://localhost:3010` (con "Allow credentials")
- Cuando tengas dominio: `https://flamingoyachtclub.com` (con "Allow credentials")

## 4. Migrar el contenido (una vez)

```bash
npx tsx scripts/migrate-to-sanity.ts
```

Sube todo el contenido actual (8 barcos, FAQs, testimonios, cifras, hitos, membresía, 4 textos legales, galería de la portada y ajustes) con sus 6 idiomas, y ~120 fotos al CDN de Sanity. Tarda unos minutos. Se puede re-ejecutar sin duplicar nada.

## 5. Comprobar el panel

Abre `http://localhost:3010/studio`, inicia sesión y verifica: 8 barcos (3 activos), 7 FAQs, 3 testimonios, 4 cifras, 7 hitos, membresía con 8 ventajas, 4 textos legales y la galería de 51 fotos.

**Importante**: en "Textos legales", rellena la razón social y el CIF donde pone `[RAZÓN SOCIAL]` y `[CIF/NIF]` (el aviso ámbar de la web desaparece solo). En "Ajustes del sitio", añade las redes sociales del club.

## 6. Invitar al cliente

sanity.io/manage → **Members → Invite member** → email del cliente, rol **Editor**. Entrará en `flamingoyachtclub.com/studio` con su cuenta y podrá editar textos y fotos sin tocar código.

## 7. Desplegar en Vercel

1. [vercel.com](https://vercel.com) → **Add New → Project** → importa el repo `GEORGES-cloud/Website003`.
2. En **Environment Variables** (Production + Preview) añade:
   - `NEXT_PUBLIC_SITE_URL` = `https://flamingoyachtclub.com`
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_REVALIDATE_SECRET` = una cadena aleatoria larga (invéntala y guárdala)
   - `CONTACT_EMAIL` = `Hello@flamingoyachtclub.com`
   - `SMTP_PASS` = la contraseña del buzón de Hostinger (⚠️ sin esto los formularios devuelven error en producción — a propósito, para no perder leads en silencio)
   - `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_APP_STORE_URL`, `NEXT_PUBLIC_PLAY_STORE_URL`
   - **NO** subas `SANITY_API_WRITE_TOKEN`.
3. Deploy. En **Settings → Analytics**, activa Web Analytics.
4. Dominio: en Vercel → Domains añade `flamingoyachtclub.com` y apunta el DNS desde Hostinger (Vercel te da los registros).

## 8. Webhook de publicación (para que editar refresque la web al instante)

sanity.io/manage → tu proyecto → **API → Webhooks → Create webhook**:
- **URL**: `https://flamingoyachtclub.com/api/revalidate`
- **Trigger on**: Create, Update, Delete
- **Filter**: `_type in ["boat","faq","testimonial","stat","milestone","tier","legalDoc","lifestyleGallery","siteSettings"]`
- **Projection**: `{ "tags": [_type] }`
- **Secret**: el mismo valor que pusiste en `SANITY_REVALIDATE_SECRET`

Con esto, publicar en /studio actualiza la web en segundos, sin redeploy.

## 9. Prueba final de punta a punta

- Enviar el formulario de contacto → llega el email al buzón del club.
- Editar un texto en /studio → publicar → refrescar la web y verlo.
- Probar el funnel "Únete al club" y el banner de descuento.

## Pendientes conocidos (no bloquean)

- **Specs provisionales**: NAVAN T30 y Level 43ST tienen motorización/año por confirmar con el club (ahora se editan en /studio).
- **Textos legales**: además de rellenar razón social/CIF, conviene una revisión de abogado antes del lanzamiento.
- **Cifras e hitos**: marcados como indicativos en su día — confirmarlos con el cliente (se editan en /studio).
- `npm audit` reporta vulnerabilidades en dependencias de desarrollo (la mayoría del tooling de Sanity); revisar con `npm audit` tras cada actualización de Next.
- Los vídeos (`public/videos/`) se quedan en el repo: el CMS no los gestiona (los gestiona el desarrollador).
- Tras verificar la migración en producción, se pueden borrar del repo las fotos de galerías que ya vivan en Sanity (~35 MB menos).
