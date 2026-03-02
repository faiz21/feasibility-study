import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import { paletteVars, resolveReportPalette, type ReportPalette } from "../report-theme";

export type SummaryHighlightItem = {
  label: string;
  value: string;
  tone?: "neutral" | "primary" | "dark";
};

export type SummaryHighlightProps = {
  items: SummaryHighlightItem[];
  palette?: Partial<ReportPalette>;
  gridSpan?: GridSpanConfig;
  className?: string;
};

const TONE_CLASS: Record<NonNullable<SummaryHighlightItem["tone"]>, string> = {
  neutral: "bg-[var(--summary-highlight-secondary)] text-[var(--summary-highlight-secondary-foreground)]",
  primary: "bg-[var(--summary-highlight-primary)] text-[var(--summary-highlight-primary-foreground)]",
  dark: "bg-[var(--summary-highlight-card-foreground)] text-[var(--summary-highlight-primary-foreground)]",
};

export function SummaryHighlight({
  items,
  palette,
  gridSpan = { base: 12, lg: 12 },
  className,
}: SummaryHighlightProps) {
  const colors = resolveReportPalette(palette);
  const style = paletteVars("summary-highlight", colors);

  if (items.length === 0) return null;

  return (
    <section className={cn(spanClassName(gridSpan), className)} style={style} aria-label="Summary highlights">
      <div className="grid grid-cols-12 gap-4">
        {items.map((item, index) => (
          <article
            key={`${item.label}-${index}`}
            className={cn("col-span-12 rounded-3xl border border-[var(--summary-highlight-border)] px-5 py-6 text-center md:col-span-4", TONE_CLASS[item.tone ?? "neutral"])}
          >
            <p className="text-xl font-semibold md:text-2xl">{item.label}</p>
            <p className="mt-2 text-4xl font-black leading-none md:text-5xl">{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
