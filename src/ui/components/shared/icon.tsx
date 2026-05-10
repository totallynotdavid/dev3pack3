import { type SVGProps } from "react";

/**
 * Inline Solar Linear icon set. Server-renderable, no runtime fetch.
 * Each path is taken from the Solar icon family to match DESIGN.md.
 */
type IconName =
  | "solar:arrow-right-linear"
  | "solar:arrow-left-linear"
  | "solar:arrow-up-linear"
  | "solar:shield-check-linear"
  | "solar:document-linear"
  | "solar:wallet-money-linear"
  | "solar:graph-up-linear"
  | "solar:bolt-linear";

const PATHS: Record<IconName, React.ReactNode> = {
  "solar:arrow-right-linear": (
    <>
      <path d="M5 12h14" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "solar:arrow-left-linear": (
    <>
      <path d="M19 12H5" strokeLinecap="round" />
      <path d="m11 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "solar:arrow-up-linear": (
    <>
      <path d="M12 19V5" strokeLinecap="round" />
      <path d="m6 11 6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "solar:shield-check-linear": (
    <>
      <path
        d="M3 7.5c0-.69 0-1.034.06-1.323a3 3 0 0 1 1.617-2.06c.27-.13.605-.21 1.275-.37l4.123-.989a8 8 0 0 1 3.85 0l4.123.99c.67.16 1.005.24 1.275.37a3 3 0 0 1 1.617 2.06C21 6.466 21 6.81 21 7.5v5.443c0 4.207-3.124 6.265-5.13 7.158-.546.243-.819.365-1.591.439-.772.073-1.013.073-1.493.073h-1.572c-.48 0-.72 0-1.493-.073-.772-.074-1.045-.196-1.59-.44C6.124 19.21 3 17.151 3 12.944Z"
        strokeLinecap="round"
      />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "solar:document-linear": (
    <>
      <path
        d="M9 18h6M9 14h6M9 22h6c2.828 0 4.243 0 5.121-.879C21 20.243 21 18.828 21 16V9.857c0-1.136 0-1.704-.21-2.216c-.21-.512-.612-.914-1.416-1.718l-3.297-3.297c-.804-.804-1.206-1.206-1.718-1.416C13.847 1 13.279 1 12.143 1H9c-2.828 0-4.243 0-5.121.879C3 2.757 3 4.172 3 7v9c0 2.828 0 4.243.879 5.121C4.757 22 6.172 22 9 22Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 1v3c0 1.886 0 2.828.586 3.414C15.172 8 16.114 8 18 8h3" />
    </>
  ),
  "solar:wallet-money-linear": (
    <>
      <path
        d="M22 12c0 4.243 0 6.364-1.318 7.682C19.364 21 17.243 21 13 21h-2c-4.243 0-6.364 0-7.682-1.318C2 18.364 2 16.243 2 12s0-6.364 1.318-7.682C4.636 3 6.757 3 11 3h2c4.243 0 6.364 0 7.682 1.318C22 5.5 22 7.5 22 11"
        strokeLinecap="round"
      />
      <path d="M22 13h-3a2 2 0 0 0 0 4h3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 7h7" strokeLinecap="round" />
    </>
  ),
  "solar:graph-up-linear": (
    <>
      <path d="M3 3v15a3 3 0 0 0 3 3h15" strokeLinecap="round" />
      <path d="m7 14 3.5-3.5 2.5 2.5L20 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 6h5v5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "solar:bolt-linear": (
    <>
      <path
        d="M14.856 2.871c.4-.93-.604-1.747-1.42-1.155a37 37 0 0 0-9.014 9.642C3.756 12.67 4.604 14 6 14h4.5l-1.356 7.129c-.4.93.605 1.747 1.42 1.155a37 37 0 0 0 9.014-9.642C20.244 11.33 19.396 10 18 10h-4.5l1.356-7.129Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  icon: IconName;
}

export function Icon({ icon, className = "", strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      width="1em"
      height="1em"
      aria-hidden
      className={className}
      {...rest}
    >
      {PATHS[icon]}
    </svg>
  );
}
