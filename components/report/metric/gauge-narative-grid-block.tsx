import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import { paletteVars, resolveReportPalette, type ReportPalette } from "../report-theme";

export type GaugeNarativeItem = {
  label: string;
  percent: number;
};

export type GaugeNarativeGridBlockProps = {
  title?: string;
  items: GaugeNarativeItem[];
  narrative?: string;
  palette?: Partial<ReportPalette>;
  gridSpan?: GridSpanConfig;
  className?: string;
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

function Gauge({ percent, label, color }: { percent: number; label: string; color: string }) {
  const safe = clamp(percent);
  return (
    <article className="rounded-xl p-1">
      <div
        className="mx-auto aspect-[2/1] w-full max-w-[250px] overflow-hidden rounded-t-full"
        style={{ background: `conic-gradient(${color} 0 ${safe}%, var(--gauge-grid-secondary) ${safe}% 100%)` }}
      >
        <div className="mx-auto mt-[18%] aspect-[2/1] w-[72%] overflow-hidden rounded-t-full bg-[var(--gauge-grid-background)]" />
      </div>
      <p className="-mt-10 text-center text-5xl font-black leading-none">{safe}%</p>
      <p className="mt-1 text-center text-3xl">{label}</p>
    </article>
  );
}

export function GaugeNarativeGridBlock({
  title = "Peak Engagement Time",
  items,
  narrative,
  palette,
  gridSpan = { base: 12, lg: 6 },
  className,
}: GaugeNarativeGridBlockProps) {
  const colors = resolveReportPalette(palette);
  const style = paletteVars("gauge-grid", colors);

  return (
    <section className={cn(spanClassName(gridSpan), className)} style={style} aria-label={title}>
      <h3 className="text-3xl font-black tracking-tight md:text-5xl">{title} :</h3>
      <div className="mt-4 grid grid-cols-12 gap-3">
        {items.map((item, index) => (
          <div key={`${item.label}-${index}`} className="col-span-12 md:col-span-6">
            <Gauge percent={item.percent} label={item.label} color="var(--gauge-grid-primary)" />
          </div>
        ))}
      </div>
      {narrative ? <p className="mt-4 text-2xl leading-relaxed text-[var(--gauge-grid-text)] md:text-4xl">{narrative}</p> : null}
    </section>
  );
}
