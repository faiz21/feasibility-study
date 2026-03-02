import { cn } from "@/lib/utils";
import { spanClassName, type GridSpanConfig } from "../report-grid";
import { paletteVars, resolveReportPalette, type ReportPalette } from "../report-theme";

type StatementSize = "sm" | "md" | "lg";

const SIZE_STYLES: Record<StatementSize, { quoteText: string; quoteMark: string }> = {
  sm: {
    quoteText: "text-3xl leading-tight",
    quoteMark: "text-[12rem]",
  },
  md: {
    quoteText: "text-4xl md:text-6xl leading-tight",
    quoteMark: "text-[14rem] md:text-[18rem]",
  },
  lg: {
    quoteText: "text-5xl md:text-7xl leading-tight",
    quoteMark: "text-[17rem] md:text-[22rem]",
  },
};

export type QuoteStatementProps = {
  statement: string;
  size?: StatementSize;
  palette?: Partial<ReportPalette>;
  gridSpan?: GridSpanConfig;
  className?: string;
};

export function QuoteStatement({
  statement,
  size = "md",
  palette,
  gridSpan = { base: 12, lg: 7 },
  className,
}: QuoteStatementProps) {
  const colors = resolveReportPalette(palette);
  const style = paletteVars("quote-statement", colors);
  const selected = SIZE_STYLES[size];

  return (
    <blockquote
      className={cn(
        spanClassName(gridSpan),
        "relative border-l border-[var(--quote-statement-secondary)]/40 pl-6 text-[var(--quote-statement-secondary)] md:pl-8",
        className,
      )}
      style={style}
    >
      <p className={cn("relative z-10 max-w-[18ch] font-medium", selected.quoteText)}>{statement}</p>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none font-black text-[var(--quote-statement-secondary)]/20",
          selected.quoteMark,
        )}
      >
        &rdquo;
      </span>
    </blockquote>
  );
}
