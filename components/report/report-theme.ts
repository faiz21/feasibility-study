import type { CSSProperties } from "react";

export type ReportPalette = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

export const REPORT_COLOR_TOKEN_KEYS = [
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "accent",
  "accent-foreground",
  "background",
  "foreground",
  "card",
  "card-foreground",
  "muted",
  "muted-foreground",
  "border",
  "input",
  "ring",
  "success",
  "success-foreground",
  "warning",
  "warning-foreground",
  "critical",
  "critical-foreground",
  "info",
  "info-foreground",
  "cover-background",
  "cover-overlay",
  "cover-title",
  "cover-subtitle",
  "section-title",
  "section-body",
  "kpi-value",
  "kpi-label",
  "chart-grid",
  "chart-axis",
  "chart-series-1",
  "chart-series-2",
  "chart-series-3",
  "table-header",
  "table-row",
  "table-border",
  "tag-background",
  "tag-foreground",
  "disabled-background",
  "disabled-foreground",
] as const;

export type ReportColorTokenKey = (typeof REPORT_COLOR_TOKEN_KEYS)[number];
export type ReportColorTokens = Record<ReportColorTokenKey, string>;

export type ReportTypography = {
  fontFamily?: string;
  titleSize?: string;
  bodySize?: string;
  labelSize?: string;
  valueSize?: string;
};

export const DEFAULT_REPORT_PALETTE: ReportPalette = {
  primary: "#1E40AF",
  secondary: "#334155",
  accent: "#0EA5E9",
  background: "#F8FAFC",
  text: "#0F172A",
};

export const DEFAULT_REPORT_COLOR_TOKENS: ReportColorTokens = {
  primary: "#1E40AF",
  "primary-foreground": "#FFFFFF",
  secondary: "#334155",
  "secondary-foreground": "#FFFFFF",
  accent: "#0EA5E9",
  "accent-foreground": "#FFFFFF",
  background: "#F8FAFC",
  foreground: "#0F172A",
  card: "#FFFFFF",
  "card-foreground": "#0F172A",
  muted: "#E2E8F0",
  "muted-foreground": "#475569",
  border: "#CBD5E1",
  input: "#FFFFFF",
  ring: "#1E40AF",
  success: "#16A34A",
  "success-foreground": "#FFFFFF",
  warning: "#F59E0B",
  "warning-foreground": "#111827",
  critical: "#DC2626",
  "critical-foreground": "#FFFFFF",
  info: "#0284C7",
  "info-foreground": "#FFFFFF",
  "cover-background": "#1E40AF",
  "cover-overlay": "rgba(15, 23, 42, 0.42)",
  "cover-title": "#FFFFFF",
  "cover-subtitle": "#E2E8F0",
  "section-title": "#0F172A",
  "section-body": "#334155",
  "kpi-value": "#1E40AF",
  "kpi-label": "#334155",
  "chart-grid": "#CBD5E1",
  "chart-axis": "#475569",
  "chart-series-1": "#1E40AF",
  "chart-series-2": "#0EA5E9",
  "chart-series-3": "#334155",
  "table-header": "#E2E8F0",
  "table-row": "#FFFFFF",
  "table-border": "#CBD5E1",
  "tag-background": "#0EA5E9",
  "tag-foreground": "#FFFFFF",
  "disabled-background": "#E2E8F0",
  "disabled-foreground": "#94A3B8",
};

type ColorLike = Partial<ReportPalette> | Partial<ReportColorTokens>;

const HEX_COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const RGB_COLOR_RE =
  /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/;
const HSL_COLOR_RE =
  /^hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/;

function isSafeCssColor(input: unknown): input is string {
  if (typeof input !== "string") return false;
  const value = input.trim();
  if (!value) return false;
  return (
    HEX_COLOR_RE.test(value) ||
    RGB_COLOR_RE.test(value) ||
    HSL_COLOR_RE.test(value) ||
    value === "transparent" ||
    /^var\(--[a-z0-9-]+\)$/i.test(value)
  );
}

function safeColor(input: unknown, fallback: string) {
  return isSafeCssColor(input) ? input.trim() : fallback;
}

function hasTokenShape(input?: ColorLike) {
  if (!input) return false;
  return REPORT_COLOR_TOKEN_KEYS.some((key) => key in input);
}

function fromLegacyPalette(palette?: Partial<ReportPalette>) {
  if (!palette) return {};
  return {
    primary: palette.primary,
    secondary: palette.secondary,
    accent: palette.accent,
    background: palette.background,
    foreground: palette.text,
    card: palette.background,
    "card-foreground": palette.text,
    "cover-background": palette.primary,
    "cover-title": "#FFFFFF",
    "section-title": palette.text,
    "section-body": palette.secondary,
    "kpi-value": palette.primary,
    "kpi-label": palette.secondary,
    "chart-series-1": palette.primary,
    "chart-series-2": palette.accent,
    "chart-series-3": palette.secondary,
    "table-row": palette.background,
    "tag-background": palette.accent,
    "tag-foreground": "#FFFFFF",
    ring: palette.primary,
  } as Partial<ReportColorTokens>;
}

export function resolveReportColorTokens(
  input?: Partial<ReportColorTokens>,
  legacyPalette?: Partial<ReportPalette>,
): ReportColorTokens {
  const legacy = fromLegacyPalette(legacyPalette);
  const merged = {
    ...DEFAULT_REPORT_COLOR_TOKENS,
    ...legacy,
  } as Record<ReportColorTokenKey, string>;

  REPORT_COLOR_TOKEN_KEYS.forEach((key) => {
    merged[key] = safeColor(merged[key], DEFAULT_REPORT_COLOR_TOKENS[key]);
  });

  if (input) {
    REPORT_COLOR_TOKEN_KEYS.forEach((key) => {
      merged[key] = safeColor(input[key], merged[key]);
    });
  }

  return merged as ReportColorTokens;
}

export function resolveReportPalette(input?: Partial<ReportPalette>): ReportPalette {
  const tokens = resolveReportColorTokens(undefined, input);
  return {
    primary: tokens.primary,
    secondary: tokens.secondary,
    accent: tokens.accent,
    background: tokens.background,
    text: tokens.foreground,
  };
}

export function paletteVars(prefix: string, input?: ColorLike) {
  const tokens = hasTokenShape(input)
    ? resolveReportColorTokens(input as Partial<ReportColorTokens>)
    : resolveReportColorTokens(undefined, input as Partial<ReportPalette> | undefined);

  const vars: Record<string, string> = {
    "--primary": tokens.primary,
    "--primary-foreground": tokens["primary-foreground"],
    "--secondary": tokens.secondary,
    "--secondary-foreground": tokens["secondary-foreground"],
    "--accent": tokens.accent,
    "--accent-foreground": tokens["accent-foreground"],
    "--background": tokens.background,
    "--foreground": tokens.foreground,
    "--card": tokens.card,
    "--card-foreground": tokens["card-foreground"],
    "--muted": tokens.muted,
    "--muted-foreground": tokens["muted-foreground"],
    "--border": tokens.border,
    "--input": tokens.input,
    "--ring": tokens.ring,
    "--success": tokens.success,
    "--success-foreground": tokens["success-foreground"],
    "--warning": tokens.warning,
    "--warning-foreground": tokens["warning-foreground"],
    "--critical": tokens.critical,
    "--critical-foreground": tokens["critical-foreground"],
    "--info": tokens.info,
    "--info-foreground": tokens["info-foreground"],
    "--cover-background": tokens["cover-background"],
    "--cover-overlay": tokens["cover-overlay"],
    "--cover-title": tokens["cover-title"],
    "--cover-subtitle": tokens["cover-subtitle"],
    "--section-title": tokens["section-title"],
    "--section-body": tokens["section-body"],
    "--kpi-value": tokens["kpi-value"],
    "--kpi-label": tokens["kpi-label"],
    "--chart-grid": tokens["chart-grid"],
    "--chart-axis": tokens["chart-axis"],
    "--chart-series-1": tokens["chart-series-1"],
    "--chart-series-2": tokens["chart-series-2"],
    "--chart-series-3": tokens["chart-series-3"],
    "--table-header": tokens["table-header"],
    "--table-row": tokens["table-row"],
    "--table-border": tokens["table-border"],
    "--tag-background": tokens["tag-background"],
    "--tag-foreground": tokens["tag-foreground"],
    "--disabled-background": tokens["disabled-background"],
    "--disabled-foreground": tokens["disabled-foreground"],
    [`--${prefix}-primary`]: tokens.primary,
    [`--${prefix}-secondary`]: tokens.secondary,
    [`--${prefix}-accent`]: tokens.accent,
    [`--${prefix}-background`]: tokens.background,
    [`--${prefix}-text`]: tokens.foreground,
    [`--${prefix}-foreground`]: tokens.foreground,
    [`--${prefix}-border`]: tokens.border,
    [`--${prefix}-muted`]: tokens.muted,
    [`--${prefix}-muted-foreground`]: tokens["muted-foreground"],
    [`--${prefix}-card`]: tokens.card,
    [`--${prefix}-card-foreground`]: tokens["card-foreground"],
  };

  REPORT_COLOR_TOKEN_KEYS.forEach((key) => {
    vars[`--${prefix}-${key}`] = tokens[key];
  });

  return vars as CSSProperties;
}

export function semanticVars(prefix: string, tokens?: Partial<ReportColorTokens>) {
  const resolved = resolveReportColorTokens(tokens);
  return {
    ...paletteVars(prefix, resolved),
  } as CSSProperties;
}

export function typographyVars(
  prefix: string,
  typography?: ReportTypography,
) {
  return {
    [`--${prefix}-font-family`]: typography?.fontFamily ?? "inherit",
    [`--${prefix}-title-size`]: typography?.titleSize ?? "inherit",
    [`--${prefix}-body-size`]: typography?.bodySize ?? "inherit",
    [`--${prefix}-label-size`]: typography?.labelSize ?? "inherit",
    [`--${prefix}-value-size`]: typography?.valueSize ?? "inherit",
  } as CSSProperties;
}
