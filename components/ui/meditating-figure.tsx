import { cn } from "@/lib/utils";

interface MeditatingFigureProps {
  className?: string;
}

/**
 * Decorative line art of a seated meditator before the rising sun.
 * Drawn locally so the banner loads instantly and stays crisp at any size.
 */
export function MeditatingFigure({ className }: MeditatingFigureProps) {
  return (
    <svg
      viewBox="0 0 360 300"
      className={cn("h-auto w-full", className)}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E8C766" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#E8C766" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="figure-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8C766" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      <circle cx="212" cy="126" r="118" fill="url(#sun-glow)" />
      <circle
        cx="212"
        cy="126"
        r="82"
        stroke="#D4AF37"
        strokeOpacity="0.45"
        strokeWidth="1"
      />
      <circle
        cx="212"
        cy="126"
        r="104"
        stroke="#D4AF37"
        strokeOpacity="0.18"
        strokeWidth="1"
        strokeDasharray="1 7"
      />

      {/* Sun rays */}
      <g stroke="#D4AF37" strokeOpacity="0.32" strokeWidth="1">
        <path d="M212 18v22" />
        <path d="M212 212v18" />
        <path d="M116 126h-18" />
        <path d="M326 126h-18" />
        <path d="M144 58l-14-14" />
        <path d="M280 194l14 14" />
        <path d="M280 58l14-14" />
        <path d="M144 194l-14 14" />
      </g>

      {/* Seated figure */}
      <g>
        <ellipse
          cx="212"
          cy="208"
          rx="82"
          ry="12"
          fill="#D4AF37"
          fillOpacity="0.1"
        />
        <circle cx="212" cy="112" r="22" fill="url(#figure-fill)" />
        <path
          d="M212 137c-19 0-32 15-32 36v31c-13 3-27 12-38 24-11 12-5 27 12 27h116c17 0 23-15 12-27-11-12-25-21-38-24v-31c0-21-13-36-32-36Z"
          fill="url(#figure-fill)"
          fillOpacity="0.72"
        />
        <path
          d="M192 170c-16 10-27 24-32 40 18-6 34-17 45-31"
          stroke="#F3E7C6"
          strokeOpacity="0.5"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M232 170c16 10 27 24 32 40-18-6-34-17-45-31"
          stroke="#F3E7C6"
          strokeOpacity="0.5"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M165 228c24-12 70-12 94 0"
          stroke="#4A1C1C"
          strokeOpacity="0.28"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      <g fill="#D4AF37" fillOpacity="0.45">
        <circle cx="94" cy="94" r="1.6" />
        <circle cx="316" cy="84" r="1.3" />
        <circle cx="320" cy="168" r="1.8" />
        <circle cx="84" cy="178" r="1.2" />
        <circle cx="266" cy="38" r="1.2" />
      </g>
    </svg>
  );
}
