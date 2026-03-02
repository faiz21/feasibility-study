import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import { paletteVars, resolveReportPalette, type ReportPalette } from "../report-theme";

type CardSize = "sm" | "md" | "lg";
type CardVariant = "dark" | "brand" | "muted";

const CARD_VARIANT_BG: Record<CardVariant, (palette: ReturnType<typeof resolveReportPalette>) => string> = {
  dark: () => "var(--result-card-card-foreground)",
  brand: (palette) => palette.primary,
  muted: () => "var(--result-card-secondary)",
};

const SIZE_STYLES: Record<CardSize, { cardPadding: string; cardTitle: string; metricValue: string; metricLabel: string; gap: string }> = {
  sm: {
    cardPadding: "p-5",
    cardTitle: "text-3xl",
    metricValue: "text-5xl",
    metricLabel: "text-xl",
    gap: "gap-4 md:gap-5",
  },
  md: {
    cardPadding: "p-6 md:p-7",
    cardTitle: "text-4xl md:text-5xl",
    metricValue: "text-6xl md:text-7xl",
    metricLabel: "text-2xl md:text-3xl",
    gap: "gap-5 md:gap-6",
  },
  lg: {
    cardPadding: "p-8 md:p-9",
    cardTitle: "text-5xl md:text-6xl",
    metricValue: "text-7xl md:text-8xl",
    metricLabel: "text-3xl md:text-4xl",
    gap: "gap-6 md:gap-7",
  },
};

export type ResultMetric = {
  value: string;
  label: string;
};

export type ResultMetricCardProps = {
  title?: string;
  metrics: ResultMetric[];
  size?: CardSize;
  variant?: CardVariant;
  palette?: Partial<ReportPalette>;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function ResultMetricCard({
  title = "Result",
  metrics,
  size = "md",
  variant = "dark",
  palette,
  gridSpan = { base: 12, lg: 5 },
  className,
}: ResultMetricCardProps) {
  const colors = resolveReportPalette(palette);
  const style = {
    ...paletteVars("result-card", colors),
    "--result-card-bg": CARD_VARIANT_BG[variant](colors),
    "--result-card-fg": "var(--result-card-primary-foreground)",
  } as CSSProperties;
  const selected = SIZE_STYLES[size];

  return (
    <article
      className={cn(
        spanClassName(gridSpan),
        "rounded-[2.5rem] text-[var(--result-card-background)] shadow-xl",
        selected.cardPadding,
        className,
      )}
      style={{
        ...style,
        backgroundColor: "var(--result-card-bg)",
        color: "var(--result-card-fg)",
      }}
    >
      <h3 className={cn("text-center font-black tracking-tight", selected.cardTitle)}>{title}</h3>
      <div className="my-4 h-px bg-white/70" />
      <div className={cn("grid grid-cols-2", selected.gap)}>
        {metrics.slice(0, 2).map((metric, index) => (
          <div key={`${metric.value}-${index}`} className="text-center">
            <p className={cn("font-black leading-none", selected.metricValue)}>{metric.value}</p>
            <p className={cn("mt-3 font-medium leading-snug", selected.metricLabel)}>{metric.label}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
