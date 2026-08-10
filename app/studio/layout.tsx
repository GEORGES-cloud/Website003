import type { Metadata } from 'next';

/* El layout raíz es un passthrough (el <html> lo pone cada árbol), así que el
   Studio trae el suyo — igual que app/not-found.tsx. */
export const metadata: Metadata = {
  title: 'Studio · Flamingo Yacht Club',
  robots: { index: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
