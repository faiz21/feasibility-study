import type { CaseStudyBlockComponentProps } from "@/lib/case-study/types";
import { cn } from "@/lib/utils";
import { BlockShell } from "../primitives";
import { asArray, asRecord, asString } from "../helpers";

type QuoteSize = "sm" | "md" | "lg";

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
    ribbonRow: "px-3 py-2 text-[11px]",
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

function getQuoteSize(value: unknown): QuoteSize {
  return value === "sm" || value === "lg" ? value : "md";
}

export function QuoteBackdropPanel({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const style = asRecord(data.style);
  const size = getQuoteSize(style.size);
  const sizeStyles = SIZE_STYLES[size];

  return (
    <BlockShell>
      <blockquote className={cn("relative pl-6", sizeStyles.backdropText)}>
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -left-1 -top-4 text-muted-foreground/40",
            sizeStyles.backdropMark,
          )}
        >
          &ldquo;
        </span>
        {asString(data.quote)}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -bottom-3 right-0 text-muted-foreground/40",
            sizeStyles.backdropMark,
          )}
        >
          &rdquo;
        </span>
      </blockquote>
      <p className="mt-2 text-xs text-muted-foreground">Backdrop style ({size})</p>
    </BlockShell>
  );
}

export function QuoteRibbonStack({
  block,
}: CaseStudyBlockComponentProps) {
  const data = asRecord(block.data);
  const style = asRecord(data.style);
  const size = getQuoteSize(style.size);
  const sizeStyles = SIZE_STYLES[size];
  const items = asArray<Record<string, unknown>>(data.items);
  const repeat = Number(data.repeat ?? 1);
  const lines = Array.from({ length: repeat }).map((_, index) => items[index % Math.max(items.length, 1)]);
  return (
    <BlockShell>
      <div className={sizeStyles.ribbonGap}>
        {lines.map((item, index) => (
          <div key={index} className={cn("rounded bg-muted font-medium tracking-wide", sizeStyles.ribbonRow)}>
            {asString(item?.text)}
          </div>
        ))}
      </div>
    </BlockShell>
  );
}
