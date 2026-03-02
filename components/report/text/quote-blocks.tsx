import { cn } from "@/lib/utils";
import { paletteVars, type ReportPalette } from "../report-theme";

type QuoteSize = "sm" | "md" | "lg";

function resolveSize(input?: QuoteSize): QuoteSize {
  return input === "sm" || input === "lg" ? input : "md";
}

const SIZE_STYLES: Record<
  QuoteSize,
  {
    backdropText: string;
    backdropMark: string;
    ribbonRow: string;
    ribbonGap: string;
  }
> = {
  sm: {
    backdropText: "text-base italic leading-relaxed",
    backdropMark: "text-5xl",
    ribbonRow: "px-3 py-2 text-xs",
    ribbonGap: "space-y-1.5",
  },
  md: {
    backdropText: "text-lg italic leading-relaxed",
    backdropMark: "text-6xl",
    ribbonRow: "px-3 py-2 text-xs",
    ribbonGap: "space-y-2",
  },
  lg: {
    backdropText: "text-2xl italic leading-snug md:text-3xl",
    backdropMark: "text-7xl md:text-8xl",
    ribbonRow: "px-4 py-2.5 text-sm",
    ribbonGap: "space-y-2.5",
  },
};

export type ReportQuoteBackdropProps = {
  quote: string;
  size?: QuoteSize;
  palette?: Partial<ReportPalette>;
};

export function ReportQuoteBackdrop({
  quote,
  size,
  palette,
}: ReportQuoteBackdropProps) {
  const resolvedSize = resolveSize(size);
  const sizeStyles = SIZE_STYLES[resolvedSize];
  const themeStyle = paletteVars("report-quote", palette);

  return (
    <article
      className="relative overflow-hidden border border-foreground/10 bg-[var(--report-quote-background)] p-6 text-[var(--report-quote-text)] md:p-8"
      style={themeStyle}
    >
      <blockquote className={cn("relative pl-6", sizeStyles.backdropText)}>
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -left-1 -top-4 text-[var(--report-quote-secondary)]/30",
            sizeStyles.backdropMark,
          )}
        >
          &ldquo;
        </span>
        {quote}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -bottom-3 right-0 text-[var(--report-quote-secondary)]/30",
            sizeStyles.backdropMark,
          )}
        >
          &rdquo;
        </span>
      </blockquote>
    </article>
  );
}

export type ReportQuoteRibbonProps = {
  items: string[];
  repeat?: number;
  size?: QuoteSize;
  palette?: Partial<ReportPalette>;
};

export function ReportQuoteRibbon({
  items,
  repeat = 1,
  size,
  palette,
}: ReportQuoteRibbonProps) {
  const resolvedSize = resolveSize(size);
  const sizeStyles = SIZE_STYLES[resolvedSize];
  const themeStyle = paletteVars("report-quote", palette);
  const lineSource = items.length ? items : [""];
  const lines = Array.from({ length: Math.max(1, repeat) }).map((_, index) => lineSource[index % lineSource.length]);

  return (
    <article
      className="overflow-hidden border border-foreground/10 bg-[var(--report-quote-background)] p-4 text-[var(--report-quote-text)] md:p-6"
      style={themeStyle}
    >
      <div className={sizeStyles.ribbonGap}>
        {lines.map((line, index) => (
          <p
            key={`${line}-${index}`}
            className={cn(
              "rounded border border-[var(--report-quote-accent)]/20 bg-[var(--report-quote-primary)]/5 font-medium tracking-wide",
              sizeStyles.ribbonRow,
            )}
          >
            {line}
          </p>
        ))}
      </div>
    </article>
  );
}
