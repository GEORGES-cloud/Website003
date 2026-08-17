type LogoVariant = 'full' | 'nav' | 'mark' | 'word';
type LogoTone = 'ink' | 'white';

/**
 * Logotipo oficial del cliente, vectorizado desde el original de
 * "Contenido recibido/Logo" y servido como SVG desde public/brand/:
 *   wordmark-bold  FLAMINGO + YACHT CLUB, SIN el flamenco (decisión del
 *               cliente 2026-08-10: solo texto; es la variante de barra y
 *               footer — variant="word")
 *   logo-full   lockup completo con el flamenco (ya no se usa en la web)
 *   logo-nav    flamenco + FLAMINGO YACHT CLUB, sin tagline (ya no se usa)
 *   logo-mark   solo el flamenco sobre el agua (favicon, 404, sellos)
 * El wordmark lleva un stroke del mismo color sobre el trazado (petición del
 * cliente 2026-08-14): la vectorización salía demasiado fina y en la barra
 * sobre el vídeo el nombre se deshacía. El grosor va en el propio SVG para que
 * barra, footer y sellos engorden a la vez — distinto por línea (10 en
 * FLAMINGO, 3 en YACHT CLUB: las letras pequeñas son 4,5 veces menores y con
 * el mismo trazo salían como una negrita) y con esquinas en inglete
 * (miterlimit 2): con `round` los remates de la serifa se ablandaban y a
 * tamaño de barra parecía desenfocado.
 * Cada uno en dos tintas (-white para fondos oscuros). Al ser vectorial se ve
 * nítido a cualquier tamaño y en pantallas retina — por eso va en <img> y no
 * en next/image: el optimizador rasterizaría el SVG y volveríamos al problema
 * que resolvimos.
 */
const RATIO: Record<LogoVariant, number> = {
  full: 2823 / 1825,
  nav: 2823 / 1481,
  mark: 1163 / 925,
  word: 2823 / 487,
};

/* Nombre de archivo por variante. El wordmark vive en un nombre NUEVO
   (wordmark-bold) en lugar de logo-word: tras varias iteraciones de grosor el
   cliente seguía viendo la versión fina y un ?v= en la query no basta para
   burlar todos los cachés intermedios; una ruta nueva sí. */
const FILE: Record<LogoVariant, string> = {
  full: 'logo-full',
  nav: 'logo-nav',
  mark: 'logo-mark',
  word: 'wordmark-bold',
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
      src={`/brand/${FILE[variant]}${tone === 'white' ? '-white' : ''}.svg`}
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
