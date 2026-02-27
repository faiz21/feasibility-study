import { cn } from "@/lib/utils";
import React from "react";

export interface SectionBlockProps {
  /**
   * Section index label — displayed as a small superscript above the title.
   * e.g. "01", "A", "§ 3"
   */
  number?: string;
  /** Section title */
  title: string;
  /** Short lead / deck paragraph beneath the title */
  lead?: string;
  /** Main body content — text, charts, nested sub-sections, tables, etc. */
  children?: React.ReactNode;
  /**
   * Optional slot rendered flush-right beside the header.
   * e.g. a status badge, date tag, or action button.
   */
  headerAction?: React.ReactNode;
  /** Render a horizontal rule above the section header */
  divider?: boolean;
  /**
   * Featured section — renders a tinted brand background panel behind
   * the section number + title, drawing the eye to executive sections.
   *
   * CLIENT BRAND: uses report-brand-light tint.
   */
  featured?: boolean;
  className?: string;
}

/**
 * SectionBlock
 *
 * A titled report section with configurable number, lead, divider,
 * and full body content slot.
 *
 * Brand areas (Zone 2 — client-overrideable)
 * ──────────────────────────────────────────
 * · Section number text          → text-report-brand
 * · Section number underline     → bg-report-brand
 * · Featured header background   → bg-report-brand-light
 * · Featured border accent       → border-l-report-brand
 */
export function SectionBlock({
  number,
  title,
  lead,
  children,
  headerAction,
  divider = true,
  featured = false,
  className,
}: SectionBlockProps) {
  return (
    <section className={cn("w-full", className)}>
      {/* Top rule */}
      {divider && (
        <div className="mb-8 h-px w-full bg-report-rule" />
      )}

      {/* ── Section header ──────────────────────────────────────────────── */}
      <header
        className={cn(
          "flex items-start justify-between gap-6",
          featured && [
            "rounded-[2px] border-l-[3px] border-l-report-brand",
            "bg-report-brand-light px-6 py-5",
          ],
        )}
      >
        <div className="flex-1">
          {/* Section number — CLIENT BRAND */}
          {number && (
            <div className="mb-2 flex items-center gap-2">
              <span className="font-body-serif text-[0.65rem] font-bold uppercase tracking-[0.25em] text-report-brand">
                {number}
              </span>
              {/* Short brand underline rule */}
              <div className="h-px w-4 bg-report-brand/40" />
            </div>
          )}

          {/* Title */}
          <h2
            className={cn(
              "font-display font-bold leading-tight tracking-tight text-report-ink",
              "text-2xl md:text-[1.875rem]",
            )}
          >
            {title}
          </h2>

          {/* Lead paragraph */}
          {lead && (
            <p className="mt-3 max-w-[60ch] font-body-serif text-[0.9375rem] leading-[1.75] text-report-ink-subtle">
              {lead}
            </p>
          )}
        </div>

        {/* Header-right slot */}
        {headerAction && (
          <div className="shrink-0 pt-1">{headerAction}</div>
        )}
      </header>

      {/* ── Body content ────────────────────────────────────────────────── */}
      {children && (
        <div className={cn("mt-8", featured && "mt-6")}>
          {children}
        </div>
      )}
    </section>
  );
}

/* ── Sub-components ───────────────────────────────────────────────────────── */

export interface SectionBodyProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * SectionBody
 *
 * Prose content wrapper inside a SectionBlock.
 * Handles paragraphs, lists, and inline emphasis via Tailwind child selectors.
 */
export function SectionBody({ children, className }: SectionBodyProps) {
  return (
    <div
      className={cn(
        "font-body-serif text-[0.9375rem] leading-[1.8] text-report-ink",
        "[&_p]:mb-5 [&_p:last-child]:mb-0",
        "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul:last-child]:mb-0",
        "[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol:last-child]:mb-0",
        "[&_li]:mb-1.5",
        "[&_strong]:font-semibold [&_strong]:text-report-ink",
        "[&_em]:italic",
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface SectionColumnsProps {
  children: React.ReactNode;
  /** Number of equal columns: 2 or 3 */
  columns?: 2 | 3;
  /** Gap between columns */
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const gapStyles = {
  sm: "gap-4",
  md: "gap-8",
  lg: "gap-12",
};

/**
 * SectionColumns
 *
 * Responsive multi-column layout for use inside SectionBlock.
 * Collapses to single column on small screens.
 */
export function SectionColumns({
  children,
  columns = 2,
  gap = "md",
  className,
}: SectionColumnsProps) {
  return (
    <div
      className={cn(
        "grid",
        gapStyles[gap],
        columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
