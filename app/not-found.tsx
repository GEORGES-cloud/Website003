import Link from 'next/link';
import { Manrope } from 'next/font/google';
import { MARK_PATH } from '@/components/Logo';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['200', '400', '600'],
  variable: '--font-manrope',
  display: 'swap',
});

export default function NotFound() {
  return (
    <html lang="es">
      <body
        className={`${manrope.variable} bg-bone text-ink antialiased min-h-screen flex items-center justify-center px-6`}
      >
        <div className="text-center max-w-md">
          <svg
            viewBox="0 0 318 273"
            fill="currentColor"
            aria-hidden
            className="w-16 h-auto mx-auto mb-9 text-ink"
          >
            <path fillRule="evenodd" d={MARK_PATH} />
          </svg>
          <p className="eyebrow mb-5">Error 404</p>
          <h1 className="display text-ink mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
            Mar adentro, sin rumbo.
          </h1>
          <p className="font-sans text-muted leading-relaxed mb-10">
            La página que buscas se ha perdido en el horizonte. / The page you are looking for has drifted away.
          </p>
          <Link href="/es" className="btn-primary">
            Volver al inicio
          </Link>
        </div>
      </body>
    </html>
  );
}
