import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import {
  paletteVars,
  resolveReportPalette,
  typographyVars,
  type ReportPalette,
  type ReportTypography,
} from "../report-theme";

export type AreaTrendPoint = { x: string; primary: number; secondary?: number };

export type AreaTrendChartProps = {
  title?: string;
  points: AreaTrendPoint[];
  palette?: Partial<ReportPalette>;
  colorPicker?: Partial<ReportPalette>;
  typography?: ReportTypography;
  gridSpan?: GridSpanConfig;
  className?: string;
};

function toAreaPath(values: number[], width: number, height: number, max: number) {
  if (values.length === 0) return "";
  const step = values.length > 1 ? width / (values.length - 1) : width;
  const coords = values.map((v, i) => {
    const x = i * step;
    const y = height - (v / max) * height;
    return `${x},${y}`;
  });
  return `M0,${height} L${coords.join(" L")} L${width},${height} Z`;
}

export function AreaTrendChart({
  title = "Trend",
  points,
  palette,
  colorPicker,
  typography,
  gridSpan = { base: 12, md: 6, lg: 6 },
  className,
}: AreaTrendChartProps) {
  const colors = resolveReportPalette(colorPicker ?? palette);
  const style = {
    ...paletteVars("area-trend", colors),
    ...typographyVars("area-trend", typography),
  };
  if (points.length === 0) return null;

  const width = 520;
  const height = 260;
  const primary = points.map((p) => p.primary);
  const secondary = points.map((p) => p.secondary ?? 0);
  const max = Math.max(1, ...primary, ...secondary);

  return (
    <section className={cn(spanClassName(gridSpan), className)} style={style}>
      <h4
        className="font-black text-[var(--area-trend-text)] md:text-6xl"
        style={{
          fontFamily: "var(--area-trend-font-family)",
          fontSize: "var(--area-trend-title-size, 3rem)",
        }}
      >
        {title}
      </h4>
      <div className="mt-2">
        <svg viewBox={`0 0 ${width} ${height + 48}`} className="h-auto w-full" role="img" aria-label={`${title} area chart`}>
          <g opacity="0.2" stroke="currentColor" className="text-[var(--area-trend-secondary)]">
            <line x1="0" y1="52" x2={width} y2="52" />
            <line x1="0" y1="104" x2={width} y2="104" />
            <line x1="0" y1="156" x2={width} y2="156" />
            <line x1="0" y1="208" x2={width} y2="208" />
          </g>
          <path d={toAreaPath(secondary, width, height, max)} fill="var(--area-trend-secondary)" fillOpacity="0.35" />
          <path d={toAreaPath(primary, width, height, max)} fill="var(--area-trend-primary)" fillOpacity="0.55" />
          {points.map((p, index) => {
            const step = points.length > 1 ? width / (points.length - 1) : width;
            return (
              <text
                key={`${p.x}-${index}`}
                x={index * step}
                y={height + 28}
                textAnchor="middle"
                className="fill-[var(--area-trend-secondary)] text-[18px]"
                style={{
                  fontFamily: "var(--area-trend-font-family)",
                  fontSize: "var(--area-trend-label-size, clamp(12px, 2.2vw, 18px))",
                }}
              >
                {p.x}
              </text>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
