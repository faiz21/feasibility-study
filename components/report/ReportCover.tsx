import { cn } from "@/lib/utils";
import React from "react";

export interface ReportCoverProps {
  /** Primary document title */
  title: string;
  /** Optional subtitle / descriptor beneath the title */
  subtitle?: string;
  /** Short label shown above the title (e.g. organisation name, project code) */
  eyebrow?: string;
  /** Date or version string displayed at the bottom */
  date?: string;
  /** One-line footer note (e.g. confidentiality notice) */
  footerNote?: string;
  /** Additional className for the outer wrapper */
  className?: string;
  /** Slot for a logo or icon placed in the top-right */
  logo?: React.ReactNode;
}

/**
 * ReportCover
 *
 * Full-bleed editorial cover/hero for a report or document.
 * Dark ink surface with gold accent line, display serif title,
 * and configurable meta areas (eyebrow, subtitle, date, footer).
 */
export function ReportCover({
  title,
  subtitle,
  eyebrow,
  date,
  footerNote,
  className,
  logo,
}: ReportCoverProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-[560px] flex-col justify-between overflow-hidden",
        "bg-report-ink-surface px-10 py-12",
        className,
      )}
    >
      {/* Decorative vertical gold stripe */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-1 bg-report-gold"
      />

      {/* Top row: eyebrow + optional logo */}
      <div className="flex items-start justify-between">
        {eyebrow && (
          <p className="font-body-serif text-xs font-semibold uppercase tracking-[0.2em] text-report-gold">
            {eyebrow}
          </p>
        )}
        {logo && <div className="ml-auto">{logo}</div>}
      </div>

      {/* Centre: title block */}
      <div className="my-auto py-10">
        <h1
          className={cn(
            "font-display text-4xl font-bold leading-tight text-white",
            "md:text-5xl lg:text-6xl",
          )}
        >
          {title}
        </h1>

        {/* Gold rule beneath title */}
        <div className="mt-5 h-px w-16 bg-report-gold" />

        {subtitle && (
          <p className="mt-6 max-w-xl font-body-serif text-base font-light leading-relaxed text-white/70">
            {subtitle}
          </p>
        )}
      </div>

      {/* Bottom row: date + footer note */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-6">
        {date && (
          <p className="font-body-serif text-sm text-white/50">{date}</p>
        )}
        {footerNote && (
          <p className="font-body-serif text-xs italic text-white/40">
            {footerNote}
          </p>
        )}
      </div>
    </section>
  );
}
