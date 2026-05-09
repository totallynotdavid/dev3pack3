import { type ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  trailing?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, trailing }: PageHeaderProps) {
  return (
    <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <div className="mb-6 flex items-center gap-3">
            <span className="h-2.5 w-2.5 bg-brand" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {eyebrow}
            </span>
          </div>
        ) : null}
        <h1 className="font-display text-4xl leading-[1.05] tracking-tighter text-foreground sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {trailing ? <div className="flex items-center gap-3">{trailing}</div> : null}
    </div>
  );
}
