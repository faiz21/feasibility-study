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
    <div className={cn("space-y-1", className)} style={style}>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
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
    <div className={cn("rounded-xl border border-border/70 bg-card p-4 shadow-soft", className)}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
