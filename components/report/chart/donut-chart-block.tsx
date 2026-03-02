import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import { paletteVars, resolveReportPalette, type ReportPalette } from "../report-theme";

export type DonutSlice = {
  label: string;
  value: number;
  color: string;
};

export type DonutChartBlockProps = {
  title?: string;
  slices: DonutSlice[];
  palette?: Partial<ReportPalette>;
  colorPicker?: Partial<ReportPalette>;
  gridSpan?: GridSpanConfig;
  className?: string;
};

function toConic(slices: DonutSlice[]) {
  const total = slices.reduce((sum, item) => sum + Math.max(0, item.value), 0) || 1;
  let current = 0;
  return slices
    .map((item) => {
      const start = (current / total) * 100;
      current += Math.max(0, item.value);
      const end = (current / total) * 100;
      return `${item.color} ${start}% ${end}%`;
    })
    .join(", ");
}

export function DonutChartBlock({
  title = "Performance by type",
  slices,
  palette,
  colorPicker,
  gridSpan = { base: 12, lg: 6 },
  className,
}: DonutChartBlockProps) {
  if (slices.length === 0) return null;

  const colors = resolveReportPalette(colorPicker ?? palette);
  const style = paletteVars("donut-chart-block", colors);
  const total = slices.reduce((sum, item) => sum + Math.max(0, item.value), 0) || 1;

  return (
    <section className={cn(spanClassName(gridSpan), className)} style={style} aria-label={title}>
      <h3 className="text-3xl font-black tracking-tight md:text-5xl">{title} :</h3>
      <div className="mt-4 grid grid-cols-12 gap-4">
        <div className="col-span-12 mx-auto aspect-square w-full max-w-[420px] rounded-full" style={{ background: `conic-gradient(${toConic(slices)})` }}>
          <div className="mx-auto mt-[25%] h-1/2 w-1/2 rounded-full bg-[var(--donut-chart-block-background)]" />
        </div>
        <ul className="col-span-12 grid grid-cols-2 gap-3 text-xl md:text-2xl">
          {slices.map((slice) => {
            const percent = ((slice.value / total) * 100).toFixed(1);
            return (
              <li key={slice.label} className="inline-flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: slice.color }} aria-hidden="true" />
                <span className="font-semibold">{slice.label}</span>
                <span>{percent}%</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
