import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import { paletteVars, resolveReportPalette, type ReportPalette } from "../report-theme";

export type ChartsSize = "sm" | "md" | "lg";

const SIZE_STYLES: Record<ChartsSize, { title: string; chartHeight: string; axis: string; value: string }> = {
  sm: {
    title: "text-xl md:text-2xl",
    chartHeight: "h-44",
    axis: "text-xs",
    value: "text-xs",
  },
  md: {
    title: "text-2xl md:text-3xl",
    chartHeight: "h-56",
    axis: "text-sm",
    value: "text-sm",
  },
  lg: {
    title: "text-3xl md:text-4xl",
    chartHeight: "h-72",
    axis: "text-base",
    value: "text-base",
  },
};

export type ChartSeriesItem = {
  label: string;
  value: number;
  color?: string;
};

export type ChartsProps = {
  title?: string;
  series: ChartSeriesItem[];
  size?: ChartsSize;
  palette?: Partial<ReportPalette>;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function Charts({
  title = "Charts",
  series,
  size = "md",
  palette,
  gridSpan = { base: 12, lg: 6 },
  className,
}: ChartsProps) {
  const colors = resolveReportPalette(palette);
  const style = paletteVars("charts", colors);
  const sizing = SIZE_STYLES[size];

  if (series.length === 0) return null;

  const maxValue = Math.max(...series.map((item) => item.value), 1);

  return (
    <section
      className={cn(
        spanClassName(gridSpan),
        "rounded-2xl border border-foreground/10 bg-[var(--charts-background)] p-5 text-[var(--charts-text)] md:p-6",
        className,
      )}
      style={style}
      aria-label={title}
    >
      <h3 className={cn("font-black tracking-tight", sizing.title)}>{title}</h3>
      <div className="mt-4 flex flex-wrap gap-5">
        {series.map((item, index) => (
          <div key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
            <span
              className="h-3.5 w-3.5 rounded-full"
              style={{ backgroundColor: item.color ?? colors.primary }}
              aria-hidden="true"
            />
            <span className={cn("text-[var(--charts-text)]/90", sizing.axis)}>{item.label}</span>
          </div>
        ))}
      </div>

      <div className={cn("mt-4 grid grid-cols-3 items-end gap-3 md:gap-4", sizing.chartHeight)}>
        {series.map((item, index) => {
          const ratio = Math.max(0, item.value) / maxValue;
          const barHeight = `${Math.max(10, Math.round(ratio * 100))}%`;

          return (
            <div key={`${item.label}-bar-${index}`} className="flex h-full flex-col items-center justify-end gap-2">
              <span className={cn("font-medium", sizing.value)}>{item.value}</span>
              <div
                className="w-full rounded-t-lg"
                style={{ height: barHeight, backgroundColor: item.color ?? colors.primary }}
                role="img"
                aria-label={`${item.label}: ${item.value}`}
              />
              <span className={cn("text-center text-[var(--charts-text)]/90", sizing.axis)}>{item.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
