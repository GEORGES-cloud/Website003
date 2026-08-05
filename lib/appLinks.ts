/* Enlaces oficiales de la app del club (MOXSEA) en las stores.
   Se pueden sobreescribir por entorno sin tocar código. */
export const appStoreUrl =
  process.env.NEXT_PUBLIC_APP_STORE_URL ?? 'https://apps.apple.com/app/moxsea/id6738347482';
export const playStoreUrl =
  process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? 'https://play.google.com/store/apps/details?id=com.moxsea';
