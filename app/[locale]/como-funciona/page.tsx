import { redirect } from 'next/navigation';

/* "Cómo funciona" vive ahora dentro de Membresía (/precios), a petición del
   cliente. La ruta se mantiene para no romper enlaces antiguos. */
export default function ComoFuncionaPage({ params: { locale } }: { params: { locale: string } }) {
  redirect(`/${locale}/precios`);
}
