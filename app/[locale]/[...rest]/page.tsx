import { notFound } from 'next/navigation';

/* Cualquier ruta bajo /[locale] que no exista cae aquí y dispara el 404
   localizado (app/[locale]/not-found.tsx). Sin este catch-all, Next
   servía el not-found global, siempre en español. */
export default function CatchAllPage() {
  notFound();
}
