import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import {
  paletteVars,
  resolveReportPalette,
  typographyVars,
  type ReportPalette,
  type ReportTypography,
} from "../report-theme";

export type DonutBreakdownDatum = {
  label: string;
  value: number;
  color: string;
};

export type DonutBreakdownChartProps = {
  title?: string;
  series: DonutBreakdownDatum[];
  description?: string;
  palette?: Partial<ReportPalette>;
  colorPicker?: Partial<ReportPalette>;
  typography?: ReportTypography;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function DonutBreakdownChart({
  title = "Breakdown",
  series,
  description,
  palette,
  colorPicker,
  typography,
  gridSpan = { base: 12, md: 6, lg: 6 },
  className,
}: DonutBreakdownChartProps) {
  const colors = resolveReportPalette(colorPicker ?? palette);
  const style = {
    ...paletteVars("donut-breakdown", colors),
    ...typographyVars("donut-breakdown", typography),
  };
  const total = series.reduce((sum, s) => sum + Math.max(0, s.value), 0);
  const segments =
    total > 0
      ? series.map((item) => `${item.color} ${(item.value / total) * 100}%`).join(", ")
      : "var(--donut-breakdown-background) 100%";

  return (
    <article className={cn(spanClassName(gridSpan), className)} style={style}>
      <h4
        className="font-black text-[var(--donut-breakdown-text)] md:text-6xl"
        style={{
          fontFamily: "var(--donut-breakdown-font-family)",
          fontSize: "var(--donut-breakdown-title-size, 3rem)",
        }}
      >
        {title}
      </h4>
      <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <ul className="space-y-1">
          {series.map((item, index) => (
            <li
              key={`${item.label}-${index}`}
              className="leading-tight text-[var(--donut-breakdown-secondary)] md:text-[2rem]"
              style={{
                fontFamily: "var(--donut-breakdown-font-family)",
                fontSize: "var(--donut-breakdown-label-size, 1.8rem)",
              }}
            >
              {item.label} {item.value.toFixed(1)}%
            </li>
          ))}
        </ul>
        <div className="relative mx-auto h-56 w-56 md:h-72 md:w-72" aria-label="Donut chart">
          <div className="h-full w-full rounded-full" style={{ background: `conic-gradient(${segments})` }} />
          <div className="absolute inset-[25%] rounded-full bg-[var(--donut-breakdown-background)]" />
        </div>
      </div>
      {description ? (
        <p
          className="mt-4 leading-tight text-[var(--donut-breakdown-text)] md:text-[2rem]"
          style={{
            fontFamily: "var(--donut-breakdown-font-family)",
            fontSize: "var(--donut-breakdown-body-size, 1.8rem)",
          }}
        >
          {description}
        </p>
      ) : null}
    </article>
  );
}
