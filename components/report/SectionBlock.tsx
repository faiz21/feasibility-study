import { cn } from "@/lib/utils";
import React from "react";

export interface SectionBlockProps {
  /** Section number or identifier (e.g. "01", "A") */
  number?: string;
  /** Section title */
  title: string;
  /** Optional short deck / lead paragraph */
  lead?: string;
  /** Main body content — text, lists, charts, sub-sections, etc. */
  children?: React.ReactNode;
  /** Optional slot rendered flush-right beside the title (e.g. a badge or date) */
  headerAction?: React.ReactNode;
  /** Whether to render a top rule above the section header */
  divider?: boolean;
  className?: string;
}

/**
 * SectionBlock
 *
 * A titled report section with an optional number, lead paragraph,
 * and a generic content slot for any mix of body content.
 * Mirrors editorial chapter/section styling with a warm rule and
 * display serif heading.
 */
export function SectionBlock({
  number,
  title,
  lead,
  children,
  headerAction,
  divider = true,
  className,
}: SectionBlockProps) {
  return (
    <section className={cn("w-full", className)}>
      {/* Top rule */}
      {divider && <div className="mb-8 h-px w-full bg-report-rule" />}

      {/* Section header */}
      <header className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Number + title row */}
          <div className="flex items-baseline gap-3">
            {number && (
              <span className="font-body-serif text-sm font-semibold uppercase tracking-[0.2em] text-report-gold">
                {number}
              </span>
            )}
            <h2
              className={cn(
                "font-display font-bold leading-tight text-report-ink",
                "text-2xl md:text-3xl",
              )}
            >
              {title}
            </h2>
          </div>

          {/* Lead paragraph */}
          {lead && (
            <p className="mt-3 max-w-2xl font-body-serif text-base leading-relaxed text-report-ink-subtle">
              {lead}
            </p>
          )}
        </div>

        {/* Optional header-right slot */}
        {headerAction && (
          <div className="shrink-0">{headerAction}</div>
        )}
      </header>

      {/* Body content */}
      {children && (
        <div className="mt-8 font-body-serif text-base leading-loose text-report-ink">
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
 * Prose content wrapper inside a SectionBlock — applies consistent
 * line-height and body serif styling.
 */
export function SectionBody({ children, className }: SectionBodyProps) {
  return (
    <div
      className={cn(
        "font-body-serif text-base leading-[1.8] text-report-ink",
        "[&_p]:mb-4 [&_p:last-child]:mb-0",
        "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5",
        "[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5",
        "[&_li]:mb-1",
        "[&_strong]:font-semibold [&_strong]:text-report-ink",
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface SectionColumnsProps {
  children: React.ReactNode;
  /** Number of columns — 2 or 3 */
  columns?: 2 | 3;
  className?: string;
}

/**
 * SectionColumns
 *
 * Multi-column layout grid for use inside SectionBlock.
 */
export function SectionColumns({
  children,
  columns = 2,
  className,
}: SectionColumnsProps) {
  return (
    <div
      className={cn(
        "grid gap-8",
        columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
