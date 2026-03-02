import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import { paletteVars, resolveReportPalette, type ReportPalette } from "../report-theme";

type ParagraphSize = "sm" | "md" | "lg";

const SIZE_STYLES: Record<
  ParagraphSize,
  { sectionPadding: string; titleSize: string; bodySize: string }
> = {
  sm: {
    sectionPadding: "p-5 md:p-6",
    titleSize: "text-2xl md:text-3xl",
    bodySize: "text-base md:text-lg",
  },
  md: {
    sectionPadding: "p-6 md:p-8",
    titleSize: "text-3xl md:text-4xl",
    bodySize: "text-lg md:text-[1.65rem]",
  },
  lg: {
    sectionPadding: "p-7 md:p-10",
    titleSize: "text-4xl md:text-5xl",
    bodySize: "text-xl md:text-[1.9rem]",
  },
};

export type NarrativeCardProps = {
  title?: string;
  content: string;
  palette?: Partial<ReportPalette>;
  size?: ParagraphSize;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function NarrativeCard({
  title = "Overview",
  content,
  palette,
  size = "md",
  gridSpan = { base: 12, lg: 6 },
  className,
}: NarrativeCardProps) {
  const colors = resolveReportPalette(palette);
  const style = paletteVars("paragraph", colors);
  const selected = SIZE_STYLES[size];

  return (
    <article
      className={cn(
        spanClassName(gridSpan),
        "overflow-hidden border border-foreground/10 bg-[var(--paragraph-background)] text-[var(--paragraph-text)]",
        className,
      )}
      style={style}
    >
      <section className={cn("relative min-h-[300px] md:min-h-[420px]", selected.sectionPadding)}>
        <div
          className="absolute inset-0 opacity-70"
          aria-hidden="true"
          style={{
            backgroundColor: "var(--paragraph-background)",
            backgroundImage:
              "linear-gradient(145deg, var(--paragraph-background) 0%, var(--paragraph-muted) 100%)",
          }}
        />
        <div className="relative z-10 w-full border border-white/15 bg-[var(--paragraph-primary)] text-white shadow-xl lg:max-w-[680px]">
          <section className="space-y-4 px-6 pb-7 pt-8 md:px-8 md:pb-9 md:pt-10">
            <h2 className={cn("font-black uppercase tracking-tight", selected.titleSize)}>{title}</h2>
            <p className={cn("leading-relaxed text-white/95 [text-wrap:pretty]", selected.bodySize)}>{content}</p>
          </section>
        </div>
      </section>
    </article>
  );
}

export type ParagraphProps = NarrativeCardProps;
export const Paragraph = NarrativeCard;
