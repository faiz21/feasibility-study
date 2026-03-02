import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import { paletteVars, resolveReportPalette, type ReportPalette } from "../report-theme";

export type AgeDistributionItem = {
  label: string;
  percent: number;
};

export type AgeDistributionBarsProps = {
  items: AgeDistributionItem[];
  palette?: Partial<ReportPalette>;
  gridSpan?: GridSpanConfig;
  className?: string;
};

function clamp(percent: number) {
  return Math.max(0, Math.min(100, percent));
}

export function AgeDistributionBars({
  items,
  palette,
  gridSpan = { base: 12, lg: 12 },
  className,
}: AgeDistributionBarsProps) {
  const colors = resolveReportPalette(palette);
  const style = paletteVars("age-bars", colors);

  if (items.length === 0) return null;

  return (
    <section className={cn(spanClassName(gridSpan), className)} style={style}>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.label} className="grid grid-cols-[1fr_auto] items-center gap-4">
            <div className="relative h-14 overflow-hidden rounded-full bg-[var(--age-bars-secondary)]">
              <div className="h-full rounded-full bg-[var(--age-bars-primary)]" style={{ width: `${clamp(item.percent)}%` }} />
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black text-[var(--age-bars-primary-foreground)] md:text-4xl">{item.label} :</span>
            </div>
            <span className="text-4xl font-black md:text-6xl">{clamp(item.percent)}%</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
