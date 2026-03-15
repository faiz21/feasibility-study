import type { CSSProperties } from "react";
import {
  DEFAULT_PORTAL_PALETTE,
  DEFAULT_PORTAL_THEME_TOKENS,
  PORTAL_THEME_TOKEN_KEYS,
  resolvePortalPalette,
  resolvePortalThemeTokens,
  type PortalPalette,
  type PortalThemeTokenKey,
  type PortalThemeTokens,
} from "@/lib/portal-theme";

export type ReportPalette = PortalPalette;
export const REPORT_COLOR_TOKEN_KEYS = PORTAL_THEME_TOKEN_KEYS;
export type ReportColorTokenKey = PortalThemeTokenKey;
export type ReportColorTokens = PortalThemeTokens;

export type ReportTypography = {
  fontFamily?: string;
  titleSize?: string;
  bodySize?: string;
  labelSize?: string;
  valueSize?: string;
};

export const DEFAULT_REPORT_PALETTE: ReportPalette = DEFAULT_PORTAL_PALETTE;
export const DEFAULT_REPORT_COLOR_TOKENS: ReportColorTokens = DEFAULT_PORTAL_THEME_TOKENS;

type ColorLike = Partial<PortalPalette> | Partial<PortalThemeTokens>;

function hasTokenShape(input?: ColorLike) {
  if (!input) return false;
  return REPORT_COLOR_TOKEN_KEYS.some((key) => key in input);
}

export function resolveReportColorTokens(
  input?: Partial<ReportColorTokens>,
  legacyPalette?: Partial<ReportPalette>,
): ReportColorTokens {
  return resolvePortalThemeTokens(input, legacyPalette);
}

export function resolveReportPalette(input?: Partial<ReportPalette>): ReportPalette {
  return resolvePortalPalette(input);
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
