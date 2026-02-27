import { cn } from "@/lib/utils";

export interface PullQuoteProps {
  /** The quoted text */
  quote: string;
  /** Attribution name (person, organisation, document) */
  attribution?: string;
  /** Role or title of the attributed source */
  attributionRole?: string;
  /** Layout variant */
  variant?: "centered" | "left-rule" | "full-bleed";
  className?: string;
}

/**
 * PullQuote
 *
 * An editorial pull-quote component — italic serif quote text with
 * optional attribution and decorative gold rule. Three layout variants:
 *  - "centered"   – centred block with gold quotation mark
 *  - "left-rule"  – left-bordered rule with left-aligned text
 *  - "full-bleed" – full-width warm background panel
 */
export function PullQuote({
  quote,
  attribution,
  attributionRole,
  variant = "centered",
  className,
}: PullQuoteProps) {
  if (variant === "left-rule") {
    return (
      <figure
        className={cn(
          "border-l-2 border-report-gold pl-6",
          className,
        )}
      >
        <blockquote className="report-pull-quote font-display text-xl italic leading-relaxed text-report-ink">
          &ldquo;{quote}&rdquo;
        </blockquote>
        {attribution && (
          <figcaption className="mt-4 font-body-serif text-sm not-italic text-report-ink-subtle">
            — {attribution}
            {attributionRole && (
              <span className="ml-1 italic">{attributionRole}</span>
            )}
          </figcaption>
        )}
      </figure>
    );
  }

  if (variant === "full-bleed") {
    return (
      <figure
        className={cn(
          "w-full bg-report-bg px-8 py-10 md:px-16",
          className,
        )}
      >
        <blockquote className="mx-auto max-w-2xl font-display text-2xl font-medium italic leading-relaxed text-report-ink">
          &ldquo;{quote}&rdquo;
        </blockquote>
        {attribution && (
          <figcaption className="mt-6 flex items-center gap-3">
            <div className="h-px w-8 bg-report-gold" />
            <span className="font-body-serif text-sm not-italic text-report-ink-subtle">
              {attribution}
              {attributionRole && (
                <span className="ml-1 italic">{attributionRole}</span>
              )}
            </span>
          </figcaption>
        )}
      </figure>
    );
  }

  // Default: centered
  return (
    <figure
      className={cn("py-6 text-center", className)}
    >
      {/* Decorative opening mark */}
      <span
        aria-hidden
        className="block font-display text-6xl leading-none text-report-gold opacity-40 select-none"
      >
        &ldquo;
      </span>

      <blockquote className="mx-auto mt-2 max-w-2xl font-display text-2xl font-medium italic leading-relaxed text-report-ink">
        {quote}
      </blockquote>

      {attribution && (
        <figcaption className="mt-6 flex flex-col items-center gap-1">
          <div className="h-px w-10 bg-report-gold" />
          <span className="mt-3 font-body-serif text-sm not-italic text-report-ink-subtle">
            {attribution}
          </span>
          {attributionRole && (
            <span className="font-body-serif text-xs italic text-report-ink-subtle/70">
              {attributionRole}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
