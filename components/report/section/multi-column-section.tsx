import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import { paletteVars, resolveReportPalette, type ReportPalette } from "../report-theme";

type GapSize = "compact" | "default" | "comfortable";

const GAP_CLASS: Record<GapSize, string> = {
  compact: "gap-4",
  default: "gap-6",
  comfortable: "gap-8",
};

export type MultiColumnSectionProps = {
  left: ReactNode;
  right: ReactNode;
  palette?: Partial<ReportPalette>;
  leftSpan?: GridSpanConfig;
  rightSpan?: GridSpanConfig;
  gap?: GapSize;
  className?: string;
};

export function MultiColumnSection({
  left,
  right,
  palette,
  leftSpan = { base: 12, lg: 7 },
  rightSpan = { base: 12, lg: 5 },
  gap = "default",
  className,
}: MultiColumnSectionProps) {
  const colors = resolveReportPalette(palette);
  const style = paletteVars("multi-column", colors);

  return (
    <section
      className={cn(
        "border border-foreground/10 bg-[var(--multi-column-background)] p-4 text-[var(--multi-column-text)] md:p-6",
        className,
      )}
      style={style}
    >
      <div className={cn("grid grid-cols-12", GAP_CLASS[gap])}>
        <div className={spanClassName(leftSpan)}>{left}</div>
        <div className={spanClassName(rightSpan)}>{right}</div>
      </div>
    </section>
  );
}
