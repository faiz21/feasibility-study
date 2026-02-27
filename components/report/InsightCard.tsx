import { cn } from "@/lib/utils";
import React from "react";

export type InsightCardVariant = "default" | "highlight" | "muted" | "ink";

export interface InsightCardProps {
  /** Short bold heading */
  heading: string;
  /** Supporting body text */
  body?: string;
  /** Optional tag/label (e.g. "Priority", "Risk", "Opportunity") */
  tag?: string;
  /** Controls the card's visual weight */
  variant?: InsightCardVariant;
  /** Optional icon or decorative element */
  icon?: React.ReactNode;
  /** Optional slot for supplementary content (chart, list, etc.) */
  children?: React.ReactNode;
  /** Optional right-side slot (e.g. a score badge) */
  aside?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<InsightCardVariant, string> = {
  default:
    "bg-report-surface border border-report-rule text-report-ink",
  highlight:
    "bg-report-gold-light border border-report-gold text-report-ink",
  muted:
    "bg-report-bg border border-report-rule text-report-ink",
  ink: "bg-report-ink-surface border border-transparent text-white",
};

const tagStyles: Record<InsightCardVariant, string> = {
  default: "bg-report-bg text-report-ink-subtle border border-report-rule",
  highlight: "bg-report-gold text-white border border-transparent",
  muted: "bg-report-rule/60 text-report-ink-subtle border border-transparent",
  ink: "bg-white/10 text-white/70 border border-transparent",
};

/**
 * InsightCard
 *
 * A general-purpose highlight / callout card for findings, observations,
 * recommendations, risks, or any key insight. Variants control visual weight;
 * all content (heading, tag, body) is configurable.
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
        "flex flex-col gap-3 rounded-sm p-6",
        variantStyles[variant],
        className,
      )}
    >
      {/* Top row: tag + aside */}
      {(tag || aside) && (
        <div className="flex items-center justify-between gap-2">
          {tag && (
            <span
              className={cn(
                "inline-block rounded-sm px-2 py-0.5",
                "font-body-serif text-[0.65rem] font-semibold uppercase tracking-widest",
                tagStyles[variant],
              )}
            >
              {tag}
            </span>
          )}
          {aside && <div className="ml-auto">{aside}</div>}
        </div>
      )}

      {/* Icon + Heading */}
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-0.5 shrink-0 opacity-80">{icon}</div>
        )}
        <h3
          className={cn(
            "font-display font-bold leading-snug",
            "text-lg md:text-xl",
            variant === "ink" ? "text-white" : "text-report-ink",
          )}
        >
          {heading}
        </h3>
      </div>

      {/* Body */}
      {body && (
        <p
          className={cn(
            "font-body-serif text-sm leading-relaxed",
            variant === "ink" ? "text-white/70" : "text-report-ink-subtle",
          )}
        >
          {body}
        </p>
      )}

      {/* Children slot */}
      {children && <div className="mt-1">{children}</div>}
    </div>
  );
}
