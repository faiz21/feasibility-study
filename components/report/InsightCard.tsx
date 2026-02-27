import { cn } from "@/lib/utils";
import React from "react";

/**
 * Variant guide
 * ─────────────
 * "default"  — white surface, subtle border. General use.
 * "highlight"— tinted brand background, brand border. Key callouts.  ← CLIENT BRAND
 * "border"   — white surface + bold left brand rule. Findings lists. ← CLIENT BRAND
 * "muted"    — warm paper background, quiet border. Context / notes.
 * "ink"      — dark surface (cover palette). Dark panel callouts.
 */
export type InsightCardVariant =
  | "default"
  | "highlight"
  | "border"
  | "muted"
  | "ink";

export interface InsightCardProps {
  /** Bold heading — the core finding or insight */
  heading: string;
  /** Supporting body text */
  body?: string;
  /**
   * Tag / label pill above the heading.
   * e.g. "Priority", "Risk", "Opportunity", "Finding"
   */
  tag?: string;
  /** Controls the card's visual weight and colour treatment */
  variant?: InsightCardVariant;
  /**
   * Icon or decorative element displayed beside the heading.
   * Pass a Lucide icon component.
   */
  icon?: React.ReactNode;
  /** Children slot — any supplementary content (list, chart, table) */
  children?: React.ReactNode;
  /** Right-side aside slot — e.g. a score badge, status indicator */
  aside?: React.ReactNode;
  className?: string;
}

/* ── Variant style maps ─────────────────────────────────────────────────── */

const wrapperStyles: Record<InsightCardVariant, string> = {
  default:
    "bg-report-surface border border-report-rule",
  /* CLIENT BRAND ↓ */
  highlight:
    "bg-report-brand-light border border-report-brand/40",
  /* CLIENT BRAND ↓ — left border applied via border-l override */
  border:
    "bg-report-surface border border-report-rule border-l-[3px] border-l-report-brand",
  muted:
    "bg-report-bg border border-report-rule",
  ink:
    "bg-report-ink-surface border border-white/10",
};

const tagStyles: Record<InsightCardVariant, string> = {
  default:
    "bg-report-bg text-report-ink-subtle border border-report-rule",
  /* CLIENT BRAND ↓ */
  highlight:
    "bg-report-brand text-report-brand-on border-transparent",
  border:
    "bg-report-brand-light text-report-brand-dark border border-report-brand/30",
  muted:
    "bg-report-rule/70 text-report-ink-subtle border-transparent",
  ink:
    "bg-white/10 text-white/70 border-transparent",
};

const headingStyles: Record<InsightCardVariant, string> = {
  default:   "text-report-ink",
  highlight: "text-report-ink",
  border:    "text-report-ink",
  muted:     "text-report-ink",
  ink:       "text-white",
};

const bodyStyles: Record<InsightCardVariant, string> = {
  default:   "text-report-ink-subtle",
  highlight: "text-report-ink-subtle",
  border:    "text-report-ink-subtle",
  muted:     "text-report-ink-subtle",
  ink:       "text-white/65",
};

/**
 * InsightCard
 *
 * A general-purpose highlight / callout card. Suitable for findings,
 * risks, opportunities, recommendations, and any keyed insight.
 *
 * Brand areas (Zone 2 — client-overrideable)
 * ──────────────────────────────────────────
 * · "highlight" variant background & border  → report-brand / report-brand-light
 * · "border" variant left rule               → report-brand
 * · Tag pill in "highlight" variant          → report-brand (bg) / report-brand-on (text)
 * · Tag pill in "border" variant             → report-brand-light / report-brand-dark
 */
export function InsightCard({
  heading,
  body,
  tag,
  variant = "default",
  icon,
  children,
  aside,
  className,
}: InsightCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[2px] p-6",
        wrapperStyles[variant],
        className,
      )}
    >
      {/* Top row: tag + aside */}
      {(tag || aside) && (
        <div className="flex items-center justify-between gap-2">
          {tag && (
            <span
              className={cn(
                "inline-block rounded-[2px] border px-2.5 py-0.5",
                "font-body-serif text-[0.625rem] font-semibold uppercase tracking-[0.18em]",
                tagStyles[variant],
              )}
            >
              {tag}
            </span>
          )}
          {aside && <div className="ml-auto shrink-0">{aside}</div>}
        </div>
      )}

      {/* Icon + Heading */}
      <div className="flex items-start gap-3">
        {icon && (
          <div
            className={cn(
              "mt-0.5 shrink-0",
              variant === "ink" ? "text-white/60" : "text-report-ink-subtle/60",
            )}
          >
            {icon}
          </div>
        )}
        <h3
          className={cn(
            "font-display font-bold leading-snug",
            "text-[1.125rem] md:text-[1.25rem]",
            headingStyles[variant],
          )}
        >
          {heading}
        </h3>
      </div>

      {/* Body */}
      {body && (
        <p
          className={cn(
            "font-body-serif text-[0.875rem] leading-[1.7]",
            bodyStyles[variant],
          )}
        >
          {body}
        </p>
      )}

      {/* Children slot */}
      {children && (
        <div
          className={cn(
            "mt-1 pt-3 border-t",
            variant === "ink"
              ? "border-white/10"
              : "border-report-rule/70",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
