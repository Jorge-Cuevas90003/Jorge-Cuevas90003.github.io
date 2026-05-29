/**
 * Icon — minimal stroked SVG set used across the HUD and panels.
 * All icons inherit `currentColor`, so they morph with the accent automatically.
 */
const PATHS = {
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  github: (
    <path d="M9 19c-4 1.4-4-2.2-6-2.7m12 5.2v-3.4c0-1 .3-1.6.8-2.1-2.7-.3-5.5-1.3-5.5-6a4.7 4.7 0 0 1 1.3-3.2 4.3 4.3 0 0 1 .1-3.2s1-.3 3.4 1.2a11.6 11.6 0 0 1 6 0C19 .9 20 1.2 20 1.2a4.3 4.3 0 0 1 .1 3.2A4.7 4.7 0 0 1 21.5 7.6c0 4.7-2.8 5.7-5.5 6 .5.4 1 1.3 1 2.6v3.9" />
  ),
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" /></>,
  shield: <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />,
  spark: <path d="M12 2v6m0 8v6m10-10h-6M8 12H2m15.5-7.5-4.2 4.2M10.7 14.8l-4.2 4.2m0-14.5 4.2 4.2m2.6 2.6 4.2 4.2" />,
  code: <path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 4l-4 16" />,
  external: <><path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></>,
  sun: <><circle cx="12" cy="12" r="4.2" /><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8" /></>,
  moon: <path d="M20 14.5A8.2 8.2 0 0 1 9.5 4 8.3 8.3 0 1 0 20 14.5Z" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.5 2.6 15.5 0 18M12 3c-2.6 2.5-2.6 15.5 0 18" /></>,
  pin: <><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" /><circle cx="12" cy="10" r="2.4" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" /></>,
  arrow: <path d="M12 5v14m0 0 6-6m-6 6-6-6" />,
  arrowUpRight: <path d="M7 17 17 7M8 7h9v9" />,
};

export default function Icon({ name, size = 18, className = '', strokeWidth = 1.7 }) {
  const path = PATHS[name];
  if (!path) return null;
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
