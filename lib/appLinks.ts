/* Enlaces oficiales de la app del club (MOXSEA) en las stores.
   Se pueden sobreescribir por entorno sin tocar código.

   OJO: desde 2026-09-24 la web NO enlaza a las tiendas — la app es una ventaja
   de socio y el enlace de descarga se manda al darse de alta, así que nadie
   importa estas constantes. Se conservan porque son la referencia de las URLs
   buenas; si vuelven los botones, salen de aquí. */
export const appStoreUrl =
  process.env.NEXT_PUBLIC_APP_STORE_URL ?? 'https://apps.apple.com/app/moxsea/id6738347482';
export const playStoreUrl =
  process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? 'https://play.google.com/store/apps/details?id=com.moxsea';
