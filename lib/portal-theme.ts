export const PORTAL_THEME_TOKEN_KEYS = [
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

export type PortalThemeTokenKey = (typeof PORTAL_THEME_TOKEN_KEYS)[number];
export type PortalThemeTokens = Record<PortalThemeTokenKey, string>;

export type PortalPalette = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

export type PortalSurfaceTheme = {
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  surfaceSidebar: string;
  surfaceOverlay: string;
  textPrimary: string;
  textSecondary: string;
  textInverted: string;
  border: string;
  borderStrong: string;
  accent: string;
  accentHover: string;
  accentSoft: string;
  accentContrast: string;
  focusRing: string;
  info: string;
  success: string;
  warning: string;
  critical: string;
};

export const DEFAULT_PORTAL_PALETTE: PortalPalette = {
  primary: "#1D4ED8",
  secondary: "#314968",
  accent: "#0EA5E9",
  background: "#F4F7FC",
  text: "#0B1530",
};

export const DEFAULT_PORTAL_THEME_TOKENS: PortalThemeTokens = {
  primary: "#1D4ED8",
  "primary-foreground": "#F8FBFF",
  secondary: "#314968",
  "secondary-foreground": "#F8FBFF",
  accent: "#0EA5E9",
  "accent-foreground": "#082F49",
  background: "#F4F7FC",
  foreground: "#0B1530",
  card: "#FFFFFF",
  "card-foreground": "#0B1530",
  muted: "#E7EEF8",
  "muted-foreground": "#52627D",
  border: "#CFD9EB",
  input: "#F8FBFF",
  ring: "#5B86FF",
  success: "#169C68",
  "success-foreground": "#F5FFF9",
  warning: "#D97706",
  "warning-foreground": "#FFF7ED",
  critical: "#D14343",
  "critical-foreground": "#FFF5F5",
  info: "#0EA5E9",
  "info-foreground": "#F0F9FF",
  "cover-background": "#102C6B",
  "cover-overlay": "rgba(8, 20, 44, 0.52)",
  "cover-title": "#FFFFFF",
  "cover-subtitle": "#D8E5FF",
  "section-title": "#11213C",
  "section-body": "#52627D",
  "kpi-value": "#1D4ED8",
  "kpi-label": "#52627D",
  "chart-grid": "#D6E0F1",
  "chart-axis": "#5C6F8F",
  "chart-series-1": "#1D4ED8",
  "chart-series-2": "#0EA5E9",
  "chart-series-3": "#314968",
  "table-header": "#E9F0FA",
  "table-row": "#FFFFFF",
  "table-border": "#D3DFF1",
  "tag-background": "#D9E8FF",
  "tag-foreground": "#123C8B",
  "disabled-background": "#E4EAF4",
  "disabled-foreground": "#8B99B2",
};

type ColorLike = Partial<PortalPalette> | Partial<PortalThemeTokens>;

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
  return PORTAL_THEME_TOKEN_KEYS.some((key) => key in input);
}

function fromLegacyPalette(palette?: Partial<PortalPalette>) {
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
  } as Partial<PortalThemeTokens>;
}

export function resolvePortalThemeTokens(
  input?: Partial<PortalThemeTokens>,
  legacyPalette?: Partial<PortalPalette>,
): PortalThemeTokens {
  const legacy = fromLegacyPalette(legacyPalette);
  const merged = {
    ...DEFAULT_PORTAL_THEME_TOKENS,
    ...legacy,
  } as Record<PortalThemeTokenKey, string>;

  PORTAL_THEME_TOKEN_KEYS.forEach((key) => {
    merged[key] = safeColor(merged[key], DEFAULT_PORTAL_THEME_TOKENS[key]);
  });

  if (input) {
    PORTAL_THEME_TOKEN_KEYS.forEach((key) => {
      merged[key] = safeColor(input[key], merged[key]);
    });
  }

  return merged as PortalThemeTokens;
}

export function resolvePortalPalette(input?: Partial<PortalPalette>): PortalPalette {
  const tokens = resolvePortalThemeTokens(undefined, input);
  return {
    primary: tokens.primary,
    secondary: tokens.secondary,
    accent: tokens.accent,
    background: tokens.background,
    text: tokens.foreground,
  };
}

export function resolvePortalSurfaceTheme(
  input?: Partial<PortalThemeTokens>,
  legacyPalette?: Partial<PortalPalette>,
): PortalSurfaceTheme {
  const tokens = resolvePortalThemeTokens(input, legacyPalette);

  return {
    surface: tokens.background,
    surfaceElevated: tokens.card,
    surfaceMuted: tokens.muted,
    surfaceSidebar: "#0F1B34",
    surfaceOverlay: "rgba(11, 21, 48, 0.72)",
    textPrimary: tokens.foreground,
    textSecondary: tokens["muted-foreground"],
    textInverted: tokens["primary-foreground"],
    border: tokens.border,
    borderStrong: "#AFC0DE",
    accent: tokens.primary,
    accentHover: "#173FAF",
    accentSoft: "#DCE8FF",
    accentContrast: tokens["primary-foreground"],
    focusRing: tokens.ring,
    info: tokens.info,
    success: tokens.success,
    warning: tokens.warning,
    critical: tokens.critical,
  };
}

export function withAlpha(hex: string, alphaHex: string): string {
  const clean = hex.trim().replace("#", "");
  if (clean.length !== 6) return hex;
  return `#${clean}${alphaHex}`;
}

export function toneValue(input?: ColorLike): PortalThemeTokens {
  if (!input) return resolvePortalThemeTokens();

  return hasTokenShape(input)
    ? resolvePortalThemeTokens(input as Partial<PortalThemeTokens>)
    : resolvePortalThemeTokens(undefined, input as Partial<PortalPalette>);
}
