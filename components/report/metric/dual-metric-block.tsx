import type { ReactNode } from "react";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import {
  paletteVars,
  resolveReportPalette,
  typographyVars,
  type ReportPalette,
  type ReportTypography,
} from "../report-theme";

export type DualMetricBlockProps = {
  heading?: string;
  icon?: ReactNode;
  metricA: { label: string; value: string };
  metricB: { label: string; value: string };
  palette?: Partial<ReportPalette>;
  colorPicker?: Partial<ReportPalette>;
  typography?: ReportTypography;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function DualMetricBlock({
  heading = "Performance Summary",
  icon,
  metricA,
  metricB,
  palette,
  colorPicker,
  typography,
  gridSpan = { base: 12, md: 6, lg: 6 },
  className,
}: DualMetricBlockProps) {
  const colors = resolveReportPalette(colorPicker ?? palette);
  const style = {
    ...paletteVars("dual-metric", colors),
    ...typographyVars("dual-metric", typography),
  };

  return (
    <article className={cn(spanClassName(gridSpan), "grid grid-cols-[auto_1fr] gap-4", className)} style={style}>
      <div className="flex flex-col items-center text-[var(--dual-metric-primary)]">
        <span className="inline-flex h-24 w-24 items-center justify-center">
          {icon ?? <QueryStatsOutlinedIcon sx={{ fontSize: 72 }} aria-hidden="true" />}
        </span>
        <h4
          className="mt-2 text-center font-black leading-tight text-[var(--dual-metric-text)] md:text-6xl"
          style={{
            fontFamily: "var(--dual-metric-font-family)",
            fontSize: "var(--dual-metric-title-size, 3rem)",
          }}
        >
          {heading}
        </h4>
      </div>
      <div className="space-y-5">
        <div>
          <p
            className="font-bold leading-none text-[var(--dual-metric-text)] md:text-6xl"
            style={{
              fontFamily: "var(--dual-metric-font-family)",
              fontSize: "var(--dual-metric-label-size, 3rem)",
            }}
          >
            {metricA.label}
          </p>
          <p
            className="font-black leading-none text-[var(--dual-metric-text)] md:text-9xl"
            style={{
              fontFamily: "var(--dual-metric-font-family)",
              fontSize: "var(--dual-metric-value-size, 6rem)",
            }}
          >
            {metricA.value}
          </p>
        </div>
        <div>
          <p
            className="font-bold leading-none text-[var(--dual-metric-text)] md:text-6xl"
            style={{
              fontFamily: "var(--dual-metric-font-family)",
              fontSize: "var(--dual-metric-label-size, 3rem)",
            }}
          >
            {metricB.label}
          </p>
          <p
            className="font-black leading-none text-[var(--dual-metric-text)] md:text-9xl"
            style={{
              fontFamily: "var(--dual-metric-font-family)",
              fontSize: "var(--dual-metric-value-size, 6rem)",
            }}
          >
            {metricB.value}
          </p>
        </div>
      </div>
    </article>
  );
}
