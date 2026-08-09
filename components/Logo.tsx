type LogoVariant = 'full' | 'nav' | 'mark';
type LogoTone = 'ink' | 'white';

/**
 * Logotipo oficial del cliente, vectorizado desde el original de
 * "Contenido recibido/Logo" y servido como SVG desde public/brand/:
 *   logo-full   lockup completo con "powered by Marina Marbella"
 *   logo-nav    flamenco + FLAMINGO YACHT CLUB, sin tagline (barra)
 *   logo-mark   solo el flamenco sobre el agua (favicon, 404, sellos)
 * Cada uno en dos tintas (-white para fondos oscuros); el flamenco rosa es
 * idéntico en ambas. Al ser vectorial se ve nítido a cualquier tamaño y en
 * pantallas retina — por eso va en <img> y no en next/image: el optimizador
 * rasterizaría el SVG y volveríamos al problema que resolvimos.
 */
const RATIO: Record<LogoVariant, number> = {
  full: 2823 / 1825,
  nav: 2823 / 1481,
  mark: 1163 / 925,
};

interface LogoProps {
  variant?: LogoVariant;
  tone?: LogoTone;
  width?: number;
  className?: string;
  alt?: string;
}

export default function Logo({
  variant = 'full',
  tone = 'ink',
  width = 220,
  className = '',
  alt = 'Flamingo Yacht Club',
}: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/brand/logo-${variant}${tone === 'white' ? '-white' : ''}.svg`}
      alt={alt}
      width={width}
      height={Math.round(width / RATIO[variant])}
      className={className}
    />
  );
}

export function FlamingoMark({
  size = 76,
  tone = 'ink',
  className = '',
}: {
  size?: number;
  tone?: LogoTone;
  className?: string;
}) {
  return <Logo variant="mark" tone={tone} width={size} className={className} alt="" />;
}
