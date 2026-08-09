import {
  BIRD_VIEWBOX,
  FULL_VIEWBOX,
  FLAMINGO_PATHS,
  DETAIL_PATHS,
  WAVE_PATHS,
  WAVE_STROKE,
} from './logo-paths';

export type LogoVariant =
  | 'full' // marca + agua + FLAMINGO + —YACHT CLUB— (+ tagline)
  | 'compact' // marca + tipografía, sin agua ni tagline → navbar
  | 'mark' // solo el flamenco → 404, favicon, cierre del funnel
  | 'wordmark'; // solo tipografía → UI pequeña, mockups de app

export type LogoTone =
  | 'brand' // flamenco rosa, tipografía y agua en currentColor
  | 'mono' // todo en currentColor (una sola tinta)
  | 'inverse'; // todo en blanco, ignora currentColor

/**
 * El rosa entra por variable CSS y no por un fill fijo: así el `hover:text-*`
 * del contenedor tiñe la tipografía mientras el flamenco se mantiene de marca,
 * y `tone="mono"` colapsa las dos tintas en una sin props nuevas.
 */
const TONE_VARS: Record<LogoTone, { mark: string; className: string }> = {
  brand: { mark: '#E81E5C', className: '' },
  mono: { mark: 'currentColor', className: '' },
  inverse: { mark: '#FFFFFF', className: 'text-white' },
};

interface MarkProps {
  size?: number;
  tone?: LogoTone;
  withWaves?: boolean;
  /** Nombre accesible. Si se omite, la marca es decorativa (aria-hidden). */
  title?: string;
  className?: string;
}

export function FlamingoMark({
  size = 40,
  tone = 'brand',
  withWaves = false,
  title,
  className = '',
}: MarkProps) {
  const viewBox = withWaves ? FULL_VIEWBOX : BIRD_VIEWBOX;
  const [, , vbW, vbH] = viewBox.split(' ').map(Number);
  const width = Math.round((size * vbW) / vbH);
  const mark = TONE_VARS[tone].mark;

  // El enlace que envuelve el logo en Navbar/Footer ya lleva aria-label; una
  // <title> aquí haría que el lector de pantalla anunciara la marca dos veces.
  const a11y = title
    ? ({ role: 'img' as const, 'aria-label': title })
    : ({ 'aria-hidden': true as const, focusable: 'false' as const });

  return (
    <svg
      viewBox={viewBox}
      width={width}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-none ${className}`}
      {...a11y}
    >
      {withWaves && (
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth={WAVE_STROKE}
          strokeLinecap="round"
        >
          {WAVE_PATHS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      )}

      {FLAMINGO_PATHS.map((d) => (
        <path key={d} d={d} fill={mark} />
      ))}

      {/* pico y ojo */}
      {DETAIL_PATHS.map((d) => (
        <path key={d} d={d} fill="currentColor" />
      ))}
    </svg>
  );
}

export interface LogoProps {
  variant?: LogoVariant;
  orientation?: 'stack' | 'row';
  tone?: LogoTone;
  /** "POWERED BY MARINA MARBELLA". Por defecto solo en variant="full". */
  withTagline?: boolean;
  /** Línea de agua. Por defecto solo en variant="full" y a partir de 40px. */
  withWaves?: boolean;
  /** Altura de la marca en px; la tipografía escala desde aquí. */
  size?: number;
  title?: string;
  className?: string;
}

const serif = {
  fontFamily: 'var(--font-display), Didot, "Bodoni MT", Georgia, serif',
} as const;

export default function Logo({
  variant = 'full',
  orientation = 'stack',
  tone = 'brand',
  withTagline,
  withWaves,
  size = 40,
  title,
  className = '',
}: LogoProps) {
  const showTagline = withTagline ?? variant === 'full';
  // Cuatro hairlines dentro de ~10px de alto se convierten en una mancha gris:
  // por debajo de 40px el agua se cae aunque se pida.
  const showWaves = (withWaves ?? variant === 'full') && size >= 40;
  const showMark = variant !== 'wordmark';
  const showType = variant !== 'mark';
  const toneClass = TONE_VARS[tone].className;

  // La Didone pierde trazo por debajo de 9px: ese es el suelo de la línea
  // "YACHT CLUB", con tracking recortado a 0.30em para que no se deshilache.
  const flamingoSize = Math.max(size * 0.42, 12);
  const yachtSize = Math.max(size * 0.17, 9);
  const taglineSize = Math.max(size * 0.13, 7);

  const type = showType ? (
    <span
      className={`inline-flex flex-col leading-none ${
        orientation === 'row' ? 'items-start' : 'items-center text-center'
      }`}
    >
      <span
        className="uppercase leading-none"
        style={{
          ...serif,
          fontWeight: 500,
          fontSize: `${flamingoSize}px`,
          letterSpacing: '0.22em',
          paddingLeft: '0.22em',
        }}
      >
        Flamingo
      </span>

      <span
        className="inline-flex items-center gap-[0.5em] leading-none"
        style={{ marginTop: `${Math.max(size * 0.1, 5)}px` }}
      >
        <span className="h-px w-[2.2em] bg-current opacity-70" aria-hidden />
        <span
          className="uppercase leading-none"
          style={{
            ...serif,
            fontWeight: 500,
            fontSize: `${yachtSize}px`,
            letterSpacing: '0.3em',
            paddingLeft: '0.3em',
          }}
        >
          Yacht Club
        </span>
        <span className="h-px w-[2.2em] bg-current opacity-70" aria-hidden />
      </span>

      {showTagline && (
        <span
          className="uppercase leading-none opacity-60"
          style={{
            ...serif,
            fontWeight: 500,
            fontSize: `${taglineSize}px`,
            letterSpacing: '0.32em',
            paddingLeft: '0.32em',
            marginTop: `${Math.max(size * 0.16, 8)}px`,
          }}
        >
          powered by Marina Marbella
        </span>
      )}
    </span>
  ) : null;

  const mark = showMark ? (
    <FlamingoMark
      size={size}
      tone={tone}
      withWaves={showWaves}
      title={showType ? undefined : title}
    />
  ) : null;

  const a11yWrapper =
    title && showType
      ? ({ role: 'img' as const, 'aria-label': title })
      : {};

  return (
    <span
      className={`inline-flex ${
        orientation === 'row'
          ? 'flex-row items-center gap-3'
          : 'flex-col items-center'
      } ${toneClass} ${className}`}
      {...a11yWrapper}
    >
      {mark}
      {showMark && showType && orientation === 'stack' && (
        <span style={{ height: `${Math.max(size * 0.22, 10)}px` }} aria-hidden />
      )}
      {type}
    </span>
  );
}
