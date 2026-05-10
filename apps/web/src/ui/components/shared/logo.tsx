interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <span
      className={`flex items-center gap-2 text-xl font-semibold uppercase tracking-widest text-foreground ${className}`}
    >
      <span className="inline-block h-2.5 w-2.5 bg-brand" aria-hidden />
      Sentinel
    </span>
  );
}
