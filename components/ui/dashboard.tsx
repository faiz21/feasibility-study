import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  className,
  style,
}: {
  title: string;
  description?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={cn("space-y-3", className)} style={style}>
      <div className="inline-flex items-center rounded-full border border-primary/15 bg-primary-soft/80 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-primary">
        Machine Vision Workspace
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{title}</h2>
        {description ? <p className="max-w-3xl text-base leading-7 text-muted-foreground">{description}</p> : null}
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass-panel rounded-[1.3rem] border border-border/80 bg-card/95 p-5 shadow-soft transition-transform duration-200 ease-out hover:-translate-y-0.5",
        className,
      )}
    >
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
    </div>
  );
}
