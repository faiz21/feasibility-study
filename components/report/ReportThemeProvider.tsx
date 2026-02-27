"use client";

import React from "react";

/* ── Type definitions ─────────────────────────────────────────────────────── */

/**
 * Client brand colours — overrides Zone 2 tokens.
 *
 * All values are HSL strings WITHOUT the `hsl()` wrapper,
 * matching the CSS custom property format used throughout the system.
 *
 * @example
 * { primary: "222 76% 46%" }          // corporate blue
 * { primary: "340 65% 45%", on: "0 0% 100%" }
 */
export interface ReportBrand {
  /**
   * Primary brand colour.
   * Used for: cover stripe, section numbers, pull-quote rules,
   * highlighted card borders, tag badges.
   *
   * Maps to: --report-brand
   */
  primary: string;
  /**
   * Pale tint of the primary colour for card backgrounds and tag fills.
   * If omitted, defaults to a very light version of the primary (CSS fallback).
   *
   * Maps to: --report-brand-light
   */
  light?: string;
  /**
   * Colour of text/icons rendered ON TOP of the primary brand colour.
   * Usually white or a very dark shade.
   *
   * Maps to: --report-brand-on
   */
  on?: string;
  /**
   * Darker variant of the primary brand colour — used for text on light tints.
   *
   * Maps to: --report-brand-dark
   */
  dark?: string;
}

/**
 * Chart palette overrides — overrides Zone 1 tokens.
 *
 * All values are HSL strings WITHOUT the `hsl()` wrapper.
 * Provide only the series you want to override.
 *
 * @example
 * { 1: "222 76% 46%", 2: "171 70% 30%" }
 */
export interface ReportCharts {
  /** Series 1 — primary data series */
  1?: string;
  /** Series 2 — secondary data series */
  2?: string;
  /** Series 3 — tertiary / accent */
  3?: string;
  /** Series 4 */
  4?: string;
  /** Series 5 */
  5?: string;
  /** Series 6 */
  6?: string;
  /** Colour for positive / growth values */
  positive?: string;
  /** Colour for negative / decline values */
  negative?: string;
  /** Colour for neutral / flat values */
  neutral?: string;
}

export interface ReportThemeProviderProps {
  /**
   * Client brand overrides (Zone 2).
   * At minimum, supply `primary` to apply client brand identity.
   */
  brand?: ReportBrand;
  /**
   * Chart palette overrides (Zone 1).
   * Override individual series or semantic roles as needed.
   */
  charts?: ReportCharts;
  children: React.ReactNode;
  className?: string;
}

/**
 * ReportThemeProvider
 *
 * Wraps report content and injects client brand + chart colour overrides
 * as CSS custom properties. Any nested report component will automatically
 * pick up the overrides without any prop drilling.
 *
 * Usage
 * ─────
 * ```tsx
 * <ReportThemeProvider
 *   brand={{ primary: "222 76% 46%", light: "222 76% 94%", on: "0 0% 100%" }}
 *   charts={{ 1: "222 76% 46%", 2: "171 70% 30%" }}
 * >
 *   <ReportCover title="Market Entry Analysis" />
 *   <SectionBlock title="Executive Summary" />
 * </ReportThemeProvider>
 * ```
 *
 * Token zones
 * ───────────
 * Zone 1 — Chart palette     → charts.1 … charts.6, positive, negative, neutral
 * Zone 2 — Client brand      → brand.primary, brand.light, brand.on, brand.dark
 * Zone 3 — Editorial base    → NOT overrideable (structural chrome)
 */
export function ReportThemeProvider({
  brand,
  charts,
  children,
  className,
}: ReportThemeProviderProps) {
  const style: Record<string, string> = {};

  /* ── Zone 2: Brand overrides ──────────────────────────────────────────── */
  if (brand?.primary)  style["--report-brand"]       = brand.primary;
  if (brand?.light)    style["--report-brand-light"]  = brand.light;
  if (brand?.on)       style["--report-brand-on"]     = brand.on;
  if (brand?.dark)     style["--report-brand-dark"]   = brand.dark;

  /* ── Zone 1: Chart palette overrides ──────────────────────────────────── */
  if (charts?.[1]) { style["--chart-1"] = charts[1]!; }
  if (charts?.[2]) { style["--chart-2"] = charts[2]!; }
  if (charts?.[3]) { style["--chart-3"] = charts[3]!; }
  if (charts?.[4]) { style["--chart-4"] = charts[4]!; }
  if (charts?.[5]) { style["--chart-5"] = charts[5]!; }
  if (charts?.[6]) { style["--chart-6"] = charts[6]!; }

  if (charts?.positive) style["--report-chart-positive"] = charts.positive;
  if (charts?.negative) style["--report-chart-negative"] = charts.negative;
  if (charts?.neutral)  style["--report-chart-neutral"]  = charts.neutral;

  return (
    <div style={style as React.CSSProperties} className={className}>
      {children}
    </div>
  );
}

/* ── Preset themes ────────────────────────────────────────────────────────── */

/**
 * Pre-built brand presets for common colour identities.
 * Pass any preset's `brand` and `charts` directly to ReportThemeProvider.
 *
 * @example
 * <ReportThemeProvider {...REPORT_THEME_PRESETS.navy} />
 */
export const REPORT_THEME_PRESETS = {
  /** Default editorial gold — same as globals.css defaults */
  gold: {
    brand: { primary: "39 58% 53%", light: "39 58% 94%", on: "0 0% 100%", dark: "39 55% 36%" },
  },
  /** Corporate navy blue */
  navy: {
    brand: { primary: "222 76% 38%", light: "222 76% 95%", on: "0 0% 100%", dark: "222 76% 24%" },
    charts: { 1: "222 76% 46%", 2: "171 70% 30%", 3: "35 90% 40%", 4: "258 65% 55%", 5: "340 65% 45%", 6: "148 60% 30%" },
  },
  /** Deep forest green */
  forest: {
    brand: { primary: "158 55% 35%", light: "158 55% 93%", on: "0 0% 100%", dark: "158 55% 22%" },
    charts: { 1: "158 55% 35%", 2: "214 80% 46%", 3: "35 90% 40%", 4: "258 65% 55%", 5: "340 65% 45%", 6: "35 55% 30%" },
  },
  /** Warm claret / wine */
  claret: {
    brand: { primary: "345 65% 42%", light: "345 65% 95%", on: "0 0% 100%", dark: "345 65% 28%" },
    charts: { 1: "345 65% 42%", 2: "214 80% 46%", 3: "35 90% 40%", 4: "258 65% 55%", 5: "171 70% 30%", 6: "148 60% 30%" },
  },
} satisfies Record<string, { brand?: ReportBrand; charts?: ReportCharts }>;
