# Onboarding — Flamingo Yacht Club

Puesta en marcha del proyecto en un ordenador nuevo. Para el desarrollador
que entra; el dueño de la web mantiene los accesos.

La web está EN PRODUCCIÓN en https://flamingoyachtclub.com. Lee
`CLAUDE.md` antes de tocar nada: contiene las reglas del proyecto y las
decisiones de diseño acordadas con el cliente.

## 1. Accesos

| Acceso | Para qué | Nivel |
|---|---|---|
| Repo de GitHub | El código | Colaborador **Admin** |
| Contenido de `.env.local` | Arrancar en local (ver paso 3) | — |
| Sanity | Contenido del CMS y esquemas | **Administrator** |
| Panel de Hostinger | Deploy, variables de producción, dominio | **Acceso compartido** |
| Buzón `Hello@` | Recibe los leads del formulario | Contraseña del buzón |

Con acceso al panel de Hostinger asumes el despliegue: las variables de
entorno de producción viven ahí y `SANITY_API_WRITE_TOKEN` no debe subirse
nunca. Cambia las contraseñas que recibas y activa 2FA en GitHub,
Hostinger y Sanity.

## 2. Arranque

Requiere Node 18 o superior (probado en 20 y 22).

```bash
git clone https://github.com/GEORGES-cloud/Website003
cd Website003
npm install
# crea .env.local — ver paso 3
npm run dev
```

El servidor de desarrollo queda en **http://localhost:3010**. El puerto
está fijado en el script `dev` y en `.claude/launch.json`; no lo cambies,
el resto de la documentación lo da por hecho.

## 3. Plantilla de `.env.local`

Crea el archivo en la raíz. Está gitignored: nunca se commitea. Pide los
valores al dueño por un gestor de contraseñas, nunca por email o chat.

```bash
# URL pública — la usan sitemap, robots, OpenGraph y JSON-LD
NEXT_PUBLIC_SITE_URL=https://flamingoyachtclub.com

# CMS (estos dos no son secretos: viajan en el bundle del navegador)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production

# Destino de los leads
CONTACT_EMAIL=Hello@flamingoyachtclub.com

# SECRETO — contraseña del buzón del club. Puede que no te la den.
SMTP_PASS=

# SECRETO — solo si vas a re-ejecutar scripts/migrate-to-sanity.ts
SANITY_API_WRITE_TOKEN=

# SECRETO — compartido con el webhook de Sanity → /api/revalidate
SANITY_REVALIDATE_SECRET=
```

Referencia completa de variables en `.env.example`.

**Sin `SMTP_PASS` los formularios devuelven 503.** Es intencionado: es
preferible un error visible a perder leads en silencio. No lo "arregles".

**Sin las variables de Sanity la web funciona igual**, sirviendo el
contenido local de `lib/content.ts`, `lib/data.ts`, `lib/legal.ts` y
`lib/strings/*.json`. La capa que decide entre CMS y local es
`lib/localize.ts`.

## 4. Flujo de trabajo

`main` despliega a producción automáticamente: push a `main` = web pública
actualizada en unos 3 minutos, vía el CDN de Hostinger. **No es Vercel.**

Por eso:

1. Trabaja siempre en una rama: `git checkout -b descripcion-del-cambio`
2. Abre un Pull Request y revisa el diff completo antes de aprobarlo.
3. El merge a `main` es el que publica. Trátalo como un despliegue.

La rama `main` tiene un ruleset que exige Pull Request. No lo desactives
aunque tengas permisos para hacerlo: es la única red de seguridad entre un
commit y la web pública.

Mensajes de commit en español y **sin tildes ni eñes** (ASCII), una línea
estilo `Zona: que cambia`. Mira `git log` para el patrón.

Antes de dar algo por bueno, para el servidor de dev. **Nunca ejecutes
`npm run build` con el dev server en marcha**: pisa `.next` y produce
errores 500 que parecen fallos de código.

## 5. Lo que NO está en el repo

Estos materiales viven fuera de git. Si los necesitas, pídeselos al dueño:

- **`Contenido recibido/`** — fotos originales que envía el club. Antes de
  usar una: comprimir con ffmpeg (`-q:v 4`, ~400-600 KB) hacia
  `public/images/` con nombre kebab-case.
- **Vídeos originales sin comprimir** — los del repo ya van comprimidos a
  ~2 MB. Cada uno necesita su póster en `public/images/<nombre>-poster.jpg`.
- **`Entrega cliente/`** — PDFs de entrega, se regeneran.
- **`Pinterest/`** — material de inspiración, prescindible.

Los vídeos no los gestiona el CMS: los gestiona el desarrollador.

## 6. Si trabajas en la nube (claude.ai/code)

Dos ajustes del entorno cloud que hacen falta para este proyecto:

**Red.** El nivel por defecto (`Trusted`) bloquea Sanity y Open-Meteo, así
que la web caería al contenido local sin avisar y el widget de estado del
mar fallaría. Cambia **Network access** a `Custom` y permite:

```
*.api.sanity.io
*.apicdn.sanity.io
cdn.sanity.io
*.sanity.io
api.open-meteo.com
marine-api.open-meteo.com
```

**ffmpeg.** No viene instalado. Si vas a tocar vídeos o fotos, añade un
setup script al entorno:

```bash
sudo apt-get update && sudo apt-get install -y ffmpeg
```

El ffmpeg que trae Playwright no sirve: está compilado con
`--disable-everything` y no tiene H.264 ni muxer MP4.

**No pongas secretos en las variables del entorno cloud.** No hay almacén
de secretos: cualquiera que use el entorno puede leer los valores.

## 7. Siguiente lectura

- `CLAUDE.md` — reglas del proyecto y dirección de diseño.
- `PROXIMOS-PASOS.md` — qué queda pendiente de la puesta en marcha.
- `GUIA-EDICION.md` — la guía del CMS que usa el cliente.
