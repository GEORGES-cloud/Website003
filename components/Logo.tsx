interface LogoProps {
  layout?: 'row' | 'stack';
  withTagline?: boolean;
  className?: string; // controls color via currentColor
}

const display = { fontFamily: 'var(--font-display), "Arial Black", Impact, sans-serif' } as const;

/**
 * Brand symbol — the Flamingo Yacht Club yacht, recreated as a single-ink
 * line mark. Uses currentColor so it sits white over the hero and ink on light.
 * Swap the paths for the client's exact vectorised file when provided.
 */
export function YachtMark({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 0.573}
      viewBox="0 0 300 172"
      fill="none"
      stroke="currentColor"
      strokeWidth={7.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={`flex-none ${className}`}
    >
      <path d="M 92 50 L 99 30 C 100 26 103 25 107 26 L 129 32 C 133 33 134 37 131 40 L 123 55" />
      <path d="M 108 33 C 158 20 214 22 258 47" />
      <path d="M 74 62 C 104 57 150 54 258 47" />
      <path d="M 74 62 C 98 96 168 102 226 80 C 244 73 254 62 258 47" />
      <path strokeWidth={6.6} d="M 56 116 C 108 98 158 128 210 108 C 226 102 240 108 252 105" />
      <path strokeWidth={6} d="M 86 130 C 130 117 176 135 214 122" />
    </svg>
  );
}

export default function Logo({
  layout = 'row',
  withTagline = true,
  className = '',
}: LogoProps) {
  if (layout === 'stack') {
    return (
      <span className={`inline-flex flex-col items-center text-center ${className}`}>
        <span className="text-[1.15em] font-black uppercase leading-none" style={{ ...display, letterSpacing: '0.02em' }}>
          Flamingo
        </span>
        <span className="mt-2 text-[0.52em] uppercase leading-none opacity-90" style={{ ...display, fontWeight: 500, letterSpacing: '0.36em', paddingLeft: '0.36em' }}>
          Yacht Club
        </span>
        {withTagline && (
          <span className="font-sans text-[8px] font-semibold tracking-[0.3em] uppercase opacity-55 mt-2.5">
            powered by Marina Banus
          </span>
        )}
      </span>
    );
  }

  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span className="inline-flex flex-col leading-none">
        <span className="text-[0.95rem] font-black uppercase" style={{ ...display, letterSpacing: '0.02em' }}>
          Flamingo
        </span>
        <span className="text-[0.5rem] uppercase mt-1.5 opacity-90" style={{ ...display, fontWeight: 500, letterSpacing: '0.32em', paddingLeft: '0.32em' }}>
          Yacht Club
        </span>
        {withTagline && (
          <span className="font-sans text-[7px] font-semibold tracking-[0.26em] uppercase opacity-55 mt-1.5">
            powered by Marina Banus
          </span>
        )}
      </span>
    </span>
  );
}
