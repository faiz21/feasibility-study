import { cn } from "@/lib/utils";
import React from "react";

export type StatCardTrend = "up" | "down" | "neutral";

export interface StatCardProps {
  /** Short label above the value (e.g. "Total Investment", "Market Size") */
  label: string;
  /** Primary display value — number, currency, or any string */
  value: string | number;
  /** Optional unit shown next to the value (e.g. "M", "%", "pts") */
  unit?: string;
  /** Optional supporting note below the value */
  description?: string;
  /** Optional change indicator: value + direction */
  change?: {
    value: string;
    trend: StatCardTrend;
    label?: string;
  };
  /** Visual size of the card */
  size?: "sm" | "md" | "lg";
  /** Highlight the card with gold accent styling */
  highlighted?: boolean;
  className?: string;
}

const trendStyles: Record<StatCardTrend, string> = {
  up: "text-emerald-600",
  down: "text-red-500",
  neutral: "text-report-ink-subtle",
};

const trendArrows: Record<StatCardTrend, string> = {
  up: "↑",
  down: "↓",
  neutral: "→",
};

const sizeStyles = {
  sm: { card: "p-5", value: "text-3xl", label: "text-xs" },
  md: { card: "p-6", value: "text-4xl", label: "text-sm" },
  lg: { card: "p-8", value: "text-5xl", label: "text-sm" },
};

/**
 * StatCard
 *
 * Displays a single key metric or statistic in an editorial card layout.
 * Fully configurable — label, value, unit, trend indicator, and sizing.
 */
export function StatCard({
  label,
  value,
  unit,
  description,
  change,
  size = "md",
  highlighted = false,
  className,
}: StatCardProps) {
  const sizes = sizeStyles[size];

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-sm border",
        "bg-report-surface",
        highlighted
          ? "border-report-gold shadow-sm"
          : "border-report-rule shadow-none",
        sizes.card,
        className,
      )}
    >
      {/* Gold top accent for highlighted cards */}
      {highlighted && (
        <span
          aria-hidden
          className="absolute left-0 top-0 h-0.5 w-full bg-report-gold"
        />
      )}

      {/* Label */}
      <p
        className={cn(
          "font-body-serif uppercase tracking-widest text-report-ink-subtle",
          sizes.label,
        )}
      >
        {label}
      </p>

      {/* Value */}
      <div className="mt-3 flex items-end gap-1">
        <span
          className={cn(
            "font-display font-bold leading-none text-report-ink",
            sizes.value,
          )}
        >
          {value}
        </span>
        {unit && (
          <span className="mb-1 font-body-serif text-sm text-report-ink-subtle">
            {unit}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="mt-2 font-body-serif text-xs leading-snug text-report-ink-subtle">
          {description}
        </p>
      )}

      {/* Change indicator */}
      {change && (
        <div
          className={cn(
            "mt-4 flex items-center gap-1 font-body-serif text-xs",
            trendStyles[change.trend],
          )}
        >
          <span aria-hidden>{trendArrows[change.trend]}</span>
          <span className="font-semibold">{change.value}</span>
          {change.label && (
            <span className="text-report-ink-subtle">{change.label}</span>
          )}
        </div>
      )}
    </div>
  );
}
