import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import { paletteVars, resolveReportPalette, type ReportPalette } from "../report-theme";

export type PerformanceRow = {
  platform: string;
  value: number;
  deltaPercent: number;
};

export type PerformanceTableBlockProps = {
  title?: string;
  rows: PerformanceRow[];
  palette?: Partial<ReportPalette>;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function PerformanceTableBlock({
  title = "Performance by Social Media Platforms",
  rows,
  palette,
  gridSpan = { base: 12, lg: 6 },
  className,
}: PerformanceTableBlockProps) {
  const colors = resolveReportPalette(palette);
  const style = {
    ...paletteVars("performance-table", colors),
    "--performance-table-positive": "var(--performance-table-success)",
    "--performance-table-negative": "var(--performance-table-critical)",
  } as CSSProperties;

  return (
    <section className={cn(spanClassName(gridSpan), className)} style={style} aria-label={title}>
      <h3 className="text-3xl font-black tracking-tight text-[var(--performance-table-text)] md:text-5xl">{title}</h3>
      <ul className="mt-4">
        {rows.map((row, index) => {
          const positive = row.deltaPercent >= 0;
          return (
            <li key={`${row.platform}-${index}`} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-[var(--performance-table-table-border)] py-4 md:py-5">
              <div className="inline-flex items-center gap-3">
                <span className="h-4 w-4 rounded-full bg-[var(--performance-table-primary)]" aria-hidden="true" />
                <span className="text-2xl font-black md:text-4xl">{row.platform}</span>
              </div>
              <span className="text-2xl md:text-4xl">{row.value}</span>
              <span className="inline-flex items-center gap-2 text-2xl md:text-4xl">
                {positive ? (
                  <ArrowDropUpIcon sx={{ fontSize: 32, color: "var(--performance-table-positive)" }} aria-hidden="true" />
                ) : (
                  <ArrowDropDownIcon sx={{ fontSize: 32, color: "var(--performance-table-negative)" }} aria-hidden="true" />
                )}
                {Math.abs(row.deltaPercent)}%
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
