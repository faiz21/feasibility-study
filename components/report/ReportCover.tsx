import { cn } from "@/lib/utils";
import React from "react";

export interface ReportCoverProps {
  /** Primary document title */
  title: string;
  /** Optional subtitle / descriptor beneath the title */
  subtitle?: string;
  /**
   * Short label shown above the title.
   * e.g. organisation name, project code, document type.
   */
  eyebrow?: string;
  /** Date or version string shown in the footer row */
  date?: string;
  /** Secondary footer label (e.g. "Version 1.0", "Prepared by…") */
  prepared?: string;
  /** One-line footer note (e.g. confidentiality / classification notice) */
  footerNote?: string;
  /**
   * Slot for a logo/wordmark rendered in the top-right.
   * Pass an <img> or SVG component.
   */
  logo?: React.ReactNode;
  /**
   * Slot for a background decoration (subtle image, pattern, or gradient).
   * Positioned absolute, fills the right half of the cover.
   */
  backgroundDecoration?: React.ReactNode;
  className?: string;
}

/**
 * ReportCover
 *
 * Full-bleed editorial cover for a report or document.
 *
 * Structure
 * ─────────
 * ┌──────────────────────────────────────────────┐
 * │ ▏ eyebrow                          [logo]   │  ← top bar
 * │ ▏                                            │
 * │ ▏ TITLE                                      │  ← centre
 * │ ▏ ──── (brand rule)                          │
 * │ ▏ Subtitle                                   │
 * │                                              │
 * │ date · prepared           [footerNote]       │  ← bottom bar
 * └──────────────────────────────────────────────┘
 *
 * Brand areas (Zone 2 — client-overrideable)
 * ──────────────────────────────────────────
 * · Left accent stripe  → bg-report-brand
 * · Eyebrow text        → text-report-brand
 * · Title rule line     → bg-report-brand
 */
export function ReportCover({
  title,
  subtitle,
  eyebrow,
  date,
  prepared,
  footerNote,
  logo,
  backgroundDecoration,
  className,
}: ReportCoverProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-[620px] flex-col justify-between overflow-hidden",
        "bg-report-ink-surface",
        "px-12 py-12 md:px-16",
        className,
      )}
    >
      {/* Background decoration slot (optional) */}
      {backgroundDecoration && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 select-none"
        >
          {backgroundDecoration}
        </div>
      )}

      {/* Left brand stripe — CLIENT BRAND */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-[3px] bg-report-brand"
      />

      {/* ── Top row ────────────────────────────────────────────────────── */}
      <div className="relative flex items-start justify-between gap-4">
        <div>
          {eyebrow && (
            <>
              {/* CLIENT BRAND: eyebrow colour */}
              <p className="font-body-serif text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-report-brand">
                {eyebrow}
              </p>
              {/* Thin horizontal rule beneath eyebrow */}
              <div className="mt-2 h-px w-8 bg-white/15" />
            </>
          )}
        </div>
        {/* Logo slot */}
        {logo && (
          <div className="ml-auto shrink-0 opacity-90">{logo}</div>
        )}
      </div>

      {/* ── Centre: title block ─────────────────────────────────────────── */}
      <div className="relative my-auto py-10">
        <h1
          className={cn(
            "font-display font-bold leading-[1.1] tracking-tight text-white",
            "text-[2.5rem] md:text-[3.5rem] lg:text-[4.25rem]",
            "max-w-[22ch]",
          )}
        >
          {title}
        </h1>

        {/* Brand accent rule — CLIENT BRAND */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-[2px] w-12 bg-report-brand" />
          <div className="h-px w-6 bg-white/20" />
        </div>

        {subtitle && (
          <p className="mt-6 max-w-[52ch] font-body-serif text-[1.0625rem] font-light leading-[1.75] text-white/65">
            {subtitle}
          </p>
        )}
      </div>

      {/* ── Bottom footer row ───────────────────────────────────────────── */}
      <div className="relative flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-t border-white/10 pt-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {date && (
            <p className="font-body-serif text-sm text-white/50">{date}</p>
          )}
          {date && prepared && (
            <span aria-hidden className="text-white/20 text-sm">·</span>
          )}
          {prepared && (
            <p className="font-body-serif text-sm text-white/50">{prepared}</p>
          )}
        </div>
        {footerNote && (
          <p className="font-body-serif text-[0.7rem] italic text-white/30">
            {footerNote}
          </p>
        )}
      </div>
    </section>
  );
}
