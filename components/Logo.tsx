interface LogoProps {
  layout?: 'row' | 'stack';
  withTagline?: boolean;
  className?: string; // controls color via currentColor
  markSize?: number;
}

/**
 * Brand logo — vector recreation of the sail/prow mark + serif wordmark.
 * Uses currentColor so it can sit white over the hero and ink when scrolled.
 * Swap the <Mark> SVG for the client's exact file when provided.
 */
// Vectorised from the brand logo bitmap (potrace) — the ship's-prow mark.
export const MARK_PATH =
  'M 26.434 7.250 C 26.723 9.038, 27.445 18.150, 28.039 27.500 C 28.633 36.850, 29.350 45.295, 29.632 46.267 C 29.915 47.238, 32.025 48.980, 34.323 50.136 C 36.620 51.293, 44.575 55.634, 52 59.783 C 101.513 87.448, 129.191 106.350, 191.348 154.946 C 207.215 167.351, 221.390 178.375, 222.848 179.445 C 224.307 180.514, 227.634 183.141, 230.242 185.281 C 232.850 187.421, 235.550 188.972, 236.242 188.727 C 237.765 188.187, 201.500 151.912, 180.500 132.970 C 139.978 96.418, 95.051 58.107, 57.028 27.680 C 50.718 22.631, 41.493 15.245, 36.528 11.267 C 31.562 7.289, 27.142 4.026, 26.705 4.017 C 26.267 4.008, 26.145 5.462, 26.434 7.250 M 5.262 51.250 C 6.448 54.365, 17.456 88.355, 22.993 106 C 31.941 134.516, 42.289 166.986, 48.967 187.500 C 52.190 197.400, 59.182 219, 64.505 235.500 C 69.828 252, 74.827 266.512, 75.614 267.750 C 77.265 270.344, 80 270.753, 80 268.406 C 80 266.196, 71.798 226.169, 67.007 205 C 64.829 195.375, 60.803 176.925, 58.059 164 C 55.316 151.075, 51.745 134.650, 50.124 127.500 C 45.237 105.950, 40.828 83.839, 41.319 83.348 C 42.569 82.098, 103.636 116.322, 134 135.290 C 181.914 165.220, 222.541 194.903, 300.883 257.217 C 312.942 266.808, 317.350 269.168, 311.427 262.863 C 305.988 257.073, 274.500 228.589, 258.448 214.938 C 241.495 200.522, 217.897 181.824, 199 167.836 C 156.644 136.483, 105.573 103.712, 59.334 78.214 C 36.878 65.832, 6.699 50, 5.550 50 C 5.130 50, 5 50.563, 5.262 51.250';

function Mark({ size = 38 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.858}
      viewBox="0 0 318 273"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="flex-none"
    >
      <path d={MARK_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

export default function Logo({
  layout = 'row',
  withTagline = true,
  className = '',
  markSize = 34,
}: LogoProps) {
  const serif = { fontFamily: 'Georgia, "Times New Roman", serif' };

  if (layout === 'stack') {
    return (
      <span className={`inline-flex flex-col items-center text-center ${className}`}>
        <Mark size={markSize} />
        <span className="mt-3.5 text-[1.25em] tracking-[0.22em] uppercase leading-none" style={serif}>
          Flamingo
        </span>
        <span className="mt-2 text-[0.62em] tracking-[0.42em] uppercase leading-none opacity-90" style={serif}>
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
    <span className={`inline-flex items-center gap-3.5 ${className}`}>
      <Mark size={markSize} />
      <span className="inline-flex flex-col leading-none">
        <span className="text-[0.95rem] tracking-[0.2em] uppercase" style={serif}>
          Flamingo
        </span>
        <span className="text-[0.56rem] tracking-[0.34em] uppercase mt-1.5 opacity-90" style={serif}>
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
