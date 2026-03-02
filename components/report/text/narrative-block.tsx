import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import { paletteVars, resolveReportPalette, type ReportPalette } from "../report-theme";

export type NarrativeBlockSize = "sm" | "md" | "lg";

const SIZE_STYLES: Record<NarrativeBlockSize, { title: string; body: string; padding: string; minHeight: string }> = {
  sm: {
    title: "text-xl md:text-2xl",
    body: "text-sm md:text-base",
    padding: "p-4 md:p-5",
    minHeight: "min-h-[220px]",
  },
  md: {
    title: "text-2xl md:text-3xl",
    body: "text-base md:text-lg",
    padding: "p-5 md:p-6",
    minHeight: "min-h-[260px]",
  },
  lg: {
    title: "text-3xl md:text-4xl",
    body: "text-lg md:text-xl",
    padding: "p-6 md:p-8",
    minHeight: "min-h-[320px]",
  },
};

export type NarrativeBlockProps = {
  title?: string;
  content: string;
  size?: NarrativeBlockSize;
  palette?: Partial<ReportPalette>;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function NarrativeBlock({
  title = "Summary",
  content,
  size = "md",
  palette,
  gridSpan = { base: 12, md: 6, lg: 6 },
  className,
}: NarrativeBlockProps) {
  const colors = resolveReportPalette(palette);
  const style = paletteVars("narrative-block", colors);
  const sizing = SIZE_STYLES[size];

  return (
    <article
      className={cn(
        spanClassName(gridSpan),
        "overflow-hidden rounded-2xl border border-foreground/10 bg-[var(--narrative-block-background)] text-[var(--narrative-block-text)]",
        className,
      )}
      style={style}
    >
      <section className={cn("relative", sizing.padding, sizing.minHeight)}>
        <div
          className="absolute inset-0 opacity-70"
          aria-hidden="true"
          style={{
            backgroundColor: "var(--narrative-block-background)",
            backgroundImage:
              "linear-gradient(145deg, var(--narrative-block-background) 0%, var(--narrative-block-muted) 100%)",
          }}
        />
        <div className="relative z-10 rounded-xl border border-white/15 bg-[var(--narrative-block-primary)] p-5 text-white shadow-xl md:p-6">
          <h2 className={cn("font-black tracking-tight", sizing.title)}>{title}</h2>
          <p className={cn("mt-3 leading-relaxed text-white/95", sizing.body)}>{content}</p>
        </div>
      </section>
    </article>
  );
}
