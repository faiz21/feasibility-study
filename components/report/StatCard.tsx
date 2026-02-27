import { cn } from "@/lib/utils";
import React from "react";

export type StatCardTrend = "up" | "down" | "neutral";

export interface StatCardProps {
  /** Short label above the value (e.g. "Total Investment", "Market Size") */
  label: string;
  /** Primary display value — number, currency string, or any text */
  value: string | number;
  /** Optional unit appended to the value (e.g. "M", "%", "pts") */
  unit?: string;
  /** Supporting note below the value */
  description?: string;
  /**
   * Optional change / trend indicator.
   * Uses semantic chart colours (positive / negative / neutral).
   */
  change?: {
    value: string;
    trend: StatCardTrend;
    /** Contextual label after the change value (e.g. "YoY", "vs target") */
    label?: string;
  };
  /** Visual size preset */
  size?: "sm" | "md" | "lg";
  /**
   * Decorative icon shown in the top-right corner of the card.
   * Pass a Lucide icon or any React node.
   */
  icon?: React.ReactNode;
  /**
   * Highlighted styling — applies brand accent border and top rule.
   *
   * CLIENT BRAND: highlighted border and rule use --report-brand.
   */
  highlighted?: boolean;
  /**
   * Optional bottom content slot — useful for a sparkline, mini chart,
   * progress bar, or any supplementary visual.
   */
  children?: React.ReactNode;
  className?: string;
}

const sizeStyles = {
  sm: { wrap: "p-5 gap-2",   value: "text-3xl", label: "text-[0.65rem]" },
  md: { wrap: "p-6 gap-2.5", value: "text-4xl", label: "text-xs"         },
  lg: { wrap: "p-8 gap-3",   value: "text-5xl", label: "text-sm"         },
};

/**
 * StatCard
 *
 * Displays a single key metric or statistic in an editorial card layout.
 *
 * Brand areas (Zone 2 — client-overrideable)
 * ──────────────────────────────────────────
 * · Highlighted top rule & border → report-brand
 *
 * Chart areas (Zone 1 — client-overrideable)
 * ──────────────────────────────────────────
 * · Trend "up"     → report-chart-positive
 * · Trend "down"   → report-chart-negative
 * · Trend "neutral"→ report-chart-neutral
 */
export function StatCard({
  label,
  value,
  unit,
  description,
  change,
  size = "md",
  icon,
  highlighted = false,
  children,
  className,
}: StatCardProps) {
  const sizes = sizeStyles[size];

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[2px] border bg-report-surface",
        highlighted
          ? "border-report-brand shadow-[0_1px_12px_0_rgba(0,0,0,0.07)]"
          : "border-report-rule shadow-none",
        sizes.wrap,
        className,
      )}
    >
      {/* Brand top accent strip (highlighted only) — CLIENT BRAND */}
      {highlighted && (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[2px] bg-report-brand"
        />
      )}

      {/* Label row + icon */}
      <div className="flex items-start justify-between gap-2">
        <p
          className={cn(
            "font-body-serif font-semibold uppercase tracking-[0.18em] text-report-ink-subtle",
            sizes.label,
          )}
        >
          {label}
        </p>
        {icon && (
          <span className="mt-0.5 shrink-0 text-report-ink-subtle/50">
            {icon}
          </span>
        )}
      </div>

      {/* Value */}
      <div className="flex items-end gap-1.5">
        <span
          className={cn(
            "font-display font-bold leading-none tracking-tight text-report-ink",
            sizes.value,
          )}
        >
          {value}
        </span>
        {unit && (
          <span className="mb-1 font-body-serif text-sm font-light text-report-ink-subtle">
            {unit}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="font-body-serif text-xs leading-snug text-report-ink-subtle">
          {description}
        </p>
      )}

      {/* Trend indicator — CHART SEMANTIC COLOURS */}
      {change && (
        <div className="flex items-center gap-1.5">
          {/* Trend pip */}
          <span
            className={cn(
              "inline-flex h-4 w-4 items-center justify-center rounded-full text-[0.6rem] font-bold text-white",
              change.trend === "up"
                ? "bg-report-chart-positive"
                : change.trend === "down"
                  ? "bg-report-chart-negative"
                  : "bg-report-chart-neutral",
            )}
            aria-hidden
          >
            {change.trend === "up" ? "↑" : change.trend === "down" ? "↓" : "→"}
          </span>
          <span
            className={cn(
              "font-body-serif text-xs font-semibold",
              change.trend === "up"
                ? "text-report-chart-positive"
                : change.trend === "down"
                  ? "text-report-chart-negative"
                  : "text-report-chart-neutral",
            )}
          >
            {change.value}
          </span>
          {change.label && (
            <span className="font-body-serif text-xs text-report-ink-subtle">
              {change.label}
            </span>
          )}
        </div>
      )}

      {/* Optional bottom slot (sparkline, progress bar, etc.) */}
      {children && (
        <div className="mt-1 pt-1 border-t border-report-rule/60">
          {children}
        </div>
      )}
    </div>
  );
}
