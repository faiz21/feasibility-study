import { cn } from "@/lib/utils";

export interface PullQuoteProps {
  /** The quoted text */
  quote: string;
  /** Attribution — person name, organisation, or source document */
  attribution?: string;
  /** Role or title of the attributed source */
  attributionRole?: string;
  /**
   * Layout variant
   *  "centered"   — centred block with large decorative quotation mark
   *  "left-rule"  — left-bordered brand rule, left-aligned
   *  "full-bleed" — full-width warm panel with centred text
   */
  variant?: "centered" | "left-rule" | "full-bleed";
  className?: string;
}

/**
 * PullQuote
 *
 * An editorial pull-quote in three layout variants.
 *
 * Brand areas (Zone 2 — client-overrideable)
 * ──────────────────────────────────────────
 * · "centered"   — quotation mark colour  → text-report-brand
 * · "centered"   — attribution rule line  → bg-report-brand
 * · "left-rule"  — left border            → border-l-report-brand
 * · "full-bleed" — attribution rule line  → bg-report-brand
 */
export function PullQuote({
  quote,
  attribution,
  attributionRole,
  variant = "centered",
  className,
}: PullQuoteProps) {
  /* ── Left-rule variant ────────────────────────────────────────────────── */
  if (variant === "left-rule") {
    return (
      <figure
        className={cn(
          /* CLIENT BRAND ↓ */
          "border-l-[3px] border-l-report-brand pl-7",
          className,
        )}
      >
        <blockquote className="font-display text-[1.1875rem] font-medium italic leading-[1.7] text-report-ink">
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

  /* ── Full-bleed variant ───────────────────────────────────────────────── */
  if (variant === "full-bleed") {
    return (
      <figure
        className={cn(
          "w-full bg-report-bg px-8 py-12 md:px-16 lg:px-24",
          className,
        )}
      >
        <blockquote className="mx-auto max-w-[54ch] font-display text-[1.375rem] font-medium italic leading-[1.75] text-report-ink md:text-[1.625rem]">
          &ldquo;{quote}&rdquo;
        </blockquote>
        {attribution && (
          <figcaption className="mt-8 flex items-center gap-4">
            {/* CLIENT BRAND ↓ */}
            <div className="h-[2px] w-8 shrink-0 bg-report-brand" />
            <div className="font-body-serif text-sm not-italic text-report-ink-subtle">
              <span className="font-semibold text-report-ink">
                {attribution}
              </span>
              {attributionRole && (
                <span className="ml-1 italic">{attributionRole}</span>
              )}
            </div>
          </figcaption>
        )}
      </figure>
    );
  }

  /* ── Centered variant (default) ──────────────────────────────────────── */
  return (
    <figure className={cn("py-8 text-center", className)}>
      {/* Decorative quotation mark — CLIENT BRAND */}
      <span
        aria-hidden
        className="block select-none font-display text-[5rem] leading-none text-report-brand opacity-35"
      >
        &ldquo;
      </span>

      <blockquote className="mx-auto -mt-2 max-w-[50ch] font-display text-[1.375rem] font-medium italic leading-[1.75] text-report-ink md:text-[1.625rem]">
        {quote}
      </blockquote>

      {attribution && (
        <figcaption className="mt-8 flex flex-col items-center gap-3">
          {/* CLIENT BRAND ↓ */}
          <div className="h-[2px] w-10 bg-report-brand" />
          <div className="font-body-serif text-sm not-italic">
            <span className="font-semibold text-report-ink">{attribution}</span>
            {attributionRole && (
              <span className="ml-1 italic text-report-ink-subtle">
                {attributionRole}
              </span>
            )}
          </div>
        </figcaption>
      )}
    </figure>
  );
}
