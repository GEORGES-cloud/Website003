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

- Monocromo/minimal estilo De Antonio Yachts. El rosa `#f97ccf` es el ÚNICO
  color de acento en toda la web (lo trajo el arte nuevo del diseñador el
  2026-09-24 y sustituyó al `#E31C5F` anterior en TODAS partes: tema, SVG de
  marca e icono de pestaña).
- Sin 3D, sin animaciones decorativas infinitas, sin efectos-truco.
- El quiz de descuento existe SOLO como banner; "Únete al club" abre JoinFunnel.
- Los heros de página usan vídeo a pantalla completa o la banda de `HeroLedger`.

## Logo

- Vive vectorizado en `public/brand/*.svg` y se sirve SIEMPRE con `<img>`,
  nunca con `next/image`.
- En la **barra** va el wordmark en TODAS las páginas, portada incluida
  (2026-11-09). Hasta esa fecha la portada era la excepción (`!isHome` en
  `Navbar`, 2026-09-28) porque el lockup con flamenco vivía en grande sobre el
  vídeo; al quitarle el pájaro, el hero se quedaba repitiendo el mismo
  wordmark que ya estaba arriba, dos veces en la misma pantalla. El cliente
  pidió dejarlo solo en la barra y el vídeo limpio. La barra nunca pudo crecer
  lo suficiente para el logo CON flamenco sin quedar enorme al hacer scroll —
  por eso aquí va el wordmark y no el lockup. `BrandLogo` es el único enlace a
  inicio de la cabecera, y el mismo componente sirve dentro del menú
  desplegable: por eso la portada sale del mismo tamaño que el resto sin tocar
  nada.
- El wordmark de `BrandLogo` es `wordmark-min.png` (+ `-white`), arte del
  diseñador (2026-09-30). Solo **FLAMINGO / YACHT CLUB**: sin los filetes a
  los lados de YACHT CLUB y **sin ninguna línea de "powered by"** — el cliente
  lo veía recargado y pidió "menos es más". Antes de este hubo
  `wordmark-2026` (con filetes, dos días) y antes la vectorización a mano de
  Carlos, `wordmark-bold`, con su stroke postizo. Ambos siguen en
  `public/brand/` pero ya no se usan.
- **La atribución a Marina Marbella ya no sale en barra ni en footer.** Queda
  en el `<title>` de portada y Nosotros, en los datos estructurados, y como
  frase de verdad en el texto de Nosotros ("Proudly powered by Marina
  Marbella…"). Avisado al cliente el 2026-09-30.
- El **hero del vídeo de la portada va SIN logo** (2026-11-09). El nombre vive
  solo en la barra. El bloque sigue entero en `HeroVideo` detrás de la prop
  `showLogo`, que ya no le pasa nadie: para recuperarlo basta con volver a
  ponerla en `app/[locale]/page.tsx`. Ojo, ese bloque se lleva consigo el
  oscurecido radial al 28%, que existía para el logo — la legibilidad de la
  barra no depende de él, sino del degradado `from-black/45` de arriba.
  Lo que pintaba era `logo-hero-word.png` (variante `hero`): SOLO FLAMINGO /
  YACHT CLUB en BLANCO, **sin el flamenco encima**, que es el `logo-hero.png`
  del diseñador recortado a las filas 408-610 y **a ancho completo (1200 px)**
  — ese ancho de más era deliberado, porque pintado a 560 px las letras salían
  exactamente del tamaño que tenían con el pájaro. Ambos archivos siguen en
  `public/brand/`. Historia de tres días, por si vuelve: el cliente quitó el
  flamenco ("más limpio"), luego pidió bajar el nombre a donde estaba antes
  (`top` 27% / 36%, que es justo donde caía cuando el pájaro lo empujaba), y
  al final prefirió el vídeo limpio y el nombre arriba.
- La tinta del wordmark la decide sola `white` (el flag `data-navbar-on-dark`
  que ponen `PageHero` con foto y `HeroVideo`): blanco sobre Puerto base,
  Nosotros y Contacto; tinta sobre Membresía y Flota, cuyos heros son claros.
- En el **footer** va SOLO el flamenco (`logo-bird.png`, variante `bird`,
  2026-09-23). Antes estuvo el wordmark (2026-08-10) y luego el lockup `nav`
  con flamenco (2026-08-27); el cliente acabó pidiendo la marca sola. El
  "powered by Marina Marbella" sigue como texto HTML debajo, y el pájaro lleva
  `mx-auto` porque es más estrecho que esa línea.
- **`logo-bird.png` es la ÚNICA excepción a la regla del SVG.** Es el arte
  oficial del diseñador del cliente (2026-09-24), distinto al flamenco de
  `logo-mark`. Llegó como WebP de 2000x1200 con mucho margen vacío; va
  recortado a la caja del dibujo y reescalado a 249x440 (unas 3,5 veces el
  tamaño al que se ve, de sobra para pantallas retina). Sigue siendo mapa de
  bits: **si el diseñador manda el SVG, sustituirlo, quitar la excepción de
  `Logo.tsx` y actualizar `RATIO.bird`.**
- **El rosa `#f97ccf` es claro y eso importa sobre fondo claro.** En el footer
  oscuro y en el icono de pestaña luce; sobre el crema tiene poco contraste
  (~2,3:1 contra ~4,3:1 del rosa viejo). Se avisó al cliente el 2026-09-24 por
  el titular `2026` de los hitos de Nosotros: si alguna vez molesta, la salida
  es un rosa más oscuro SOLO para fondos claros, no cambiar este.
- **Icono de pestana** (`app/icon.png` 512px y `app/favicon.ico` con 16/32/48):
  flamenco NUEVO en rosa sobre cuadrado tinta `#1A1916`, con 12% de margen
  (2026-09-24). Fondo oscuro a proposito: el rosa nuevo es claro y sobre el
  crema anterior se perdia en las pestanas de tema claro. El .ico lleva PNG
  dentro de cada entrada; si hay que rehacerlo, el script vive en el historial
  de esta sesion (cabecera 6 bytes + 16 por tamano + los PNG al final).
- `logo-bird` es tambien el sello suelto de `FlamingoMark`: funnel de "Unete
  al club", 404 e hitos de Nosotros (2026-09-29). **OJO con `FlamingoMark`:
  su prop `size` es el ALTO**, no el ancho — el pajaro nuevo es vertical
  (0,57:1) donde el viejo era apaisado (1,26:1), asi que medirlo por el ancho
  descuadraba los tres sitios de golpe.
- `logo-mark` y `logo-full`/`logo-nav` (el flamenco viejo, de linea fina) ya
  NO se usan en ninguna parte. Se conservan en `public/brand/` por si hay que
  volver al arte original.
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

- **Archivo vintage de Puerto Banus** (`public/images/vintage-*.jpg`): 10 fotos
  de los 70-80 que, junto a la foto actual de la playa, forman el pase de
  Puerto base. En cuatro salen personajes reconocibles (los Reyes, Julio
  Iglesias, Sean Connery, Jose Banus) y el material parece de agencia. Se le
  explico la exposicion al cliente el 2026-10-21 (derechos de imagen, LO
  1/1982, y licencia de la agencia) y dio el visto bueno a las once.
  **Decision tomada: no reabrirla.**
- Ese pase usa `MediaSlideshow` dentro de un `div` 4:3 pelado. El marco NO
  puede ser vertical ni llevar `ParallaxImage`: el archivo es todo apaisado, y
  la capa del parallax (`-inset-y-[22%]`, un 44% mas alta que el marco) recorta
  por los lados justo lo que hay que ensenar.
