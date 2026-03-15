import {
  DEFAULT_PORTAL_THEME_TOKENS,
  resolvePortalPalette,
  resolvePortalThemeTokens,
  type PortalPalette,
  type PortalThemeTokens,
} from "@/lib/portal-theme";

type LegacyPalette = {
  primary?: unknown;
  secondary?: unknown;
  accent?: unknown;
  background?: unknown;
  text?: unknown;
};

type DesignTokenEntry = {
  $type?: unknown;
  $value?: unknown;
};

type ThemeTokenDocument = {
  tokens?: {
    color?: Record<string, DesignTokenEntry>;
  };
};

const DEFAULT_THEME_COLORS = {
  primary: "#1E40AF",
  "primary-foreground": "#FFFFFF",
  secondary: "#64748B",
  "secondary-foreground": "#FFFFFF",
  accent: "#0EA5E9",
  "accent-foreground": "#FFFFFF",
  background: "#F8FAFC",
  foreground: "#0F172A",
  card: "#FFFFFF",
  "card-foreground": "#0F172A",
  muted: "#F1F5F9",
  "muted-foreground": "#475569",
  border: "#E2E8F0",
  input: "#FFFFFF",
  ring: "#1E40AF",
  success: "#16A34A",
  "success-foreground": "#FFFFFF",
  warning: "#F59E0B",
  "warning-foreground": "#111827",
  critical: "#DC2626",
  "critical-foreground": "#FFFFFF",
  info: "#2563EB",
  "info-foreground": "#FFFFFF",
  "cover-background": "#1E40AF",
  "cover-overlay": "rgba(0,0,0,0.4)",
  "cover-title": "#FFFFFF",
  "cover-subtitle": "#E2E8F0",
  "section-title": "#0F172A",
  "section-body": "#475569",
  "kpi-value": "#1E40AF",
  "kpi-label": "#475569",
  "chart-grid": "#E5E7EB",
  "chart-axis": "#6B7280",
  "chart-series-1": "#1E40AF",
  "chart-series-2": "#10B981",
  "chart-series-3": "#F59E0B",
  "table-header": "#F1F5F9",
  "table-row": "#FFFFFF",
  "table-border": "#E2E8F0",
  "tag-background": "#0EA5E9",
  "tag-foreground": "#FFFFFF",
  "disabled-background": "#E5E7EB",
  "disabled-foreground": "#9CA3AF",
} as const;

type ThemeColorKey = keyof typeof DEFAULT_THEME_COLORS;

export type ClientThemeColors = Record<ThemeColorKey, string>;

export type ClientThemePalette = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

export type ClientTheme = {
  colors: ClientThemeColors;
  palette: ClientThemePalette;
};

function isSafeCssColor(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const token = value.trim();
  if (!token) return false;
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(token)) return true;
  if (/^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/.test(token)) return true;
  if (/^hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/.test(token)) return true;
  return token === "transparent";
}

function parseLegacyPalette(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const palette = input as LegacyPalette;
  return {
    primary: isSafeCssColor(palette.primary) ? palette.primary : undefined,
    secondary: isSafeCssColor(palette.secondary) ? palette.secondary : undefined,
    accent: isSafeCssColor(palette.accent) ? palette.accent : undefined,
    background: isSafeCssColor(palette.background) ? palette.background : undefined,
    text: isSafeCssColor(palette.text) ? palette.text : undefined,
  };
}

function parseTokenMap(input: unknown): Record<string, string> {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const doc = input as ThemeTokenDocument;
  if (!doc.tokens || !doc.tokens.color || typeof doc.tokens.color !== "object") return {};
  const entries = doc.tokens.color as Record<string, DesignTokenEntry>;
  return Object.fromEntries(
    Object.entries(entries)
      .filter(([, entry]) => entry && typeof entry === "object" && typeof entry.$value === "string")
      .map(([key, entry]) => [key, String(entry.$value).trim()]),
  );
}

function resolveTokenValue(
  key: string,
  tokenMap: Record<string, string>,
  stack: Set<string>,
): string | undefined {
  if (stack.has(key)) return undefined;
  const raw = tokenMap[key];
  if (!raw) return undefined;
  const refMatch = raw.match(/^\{color\.([a-z0-9-]+)\}$/i);
  if (!refMatch) return isSafeCssColor(raw) ? raw : undefined;
  const referenced = refMatch[1];
  stack.add(key);
  const resolved = resolveTokenValue(referenced, tokenMap, stack);
  stack.delete(key);
  return resolved;
}

export function resolveClientTheme(themeTokens: unknown, legacyPalette?: unknown): ClientTheme {
  const legacy = parseLegacyPalette(legacyPalette) as Partial<PortalPalette>;
  const tokenMap = parseTokenMap(themeTokens);
  const resolvedKeys = Object.fromEntries(
    (Object.keys(DEFAULT_THEME_COLORS) as ThemeColorKey[]).map((key) => [
      key,
      resolveTokenValue(key, tokenMap, new Set<string>()),
    ]),
  ) as Partial<Record<ThemeColorKey, string>>;
  const merged = resolvePortalThemeTokens(resolvedKeys as Partial<PortalThemeTokens>, legacy);

  (Object.keys(DEFAULT_THEME_COLORS) as ThemeColorKey[]).forEach((key) => {
    merged[key] = merged[key] ?? DEFAULT_PORTAL_THEME_TOKENS[key];
  });

  const colors = Object.fromEntries((Object.keys(DEFAULT_THEME_COLORS) as ThemeColorKey[]).map((key) => [key, merged[key]])) as ClientThemeColors;
  const palette = resolvePortalPalette(legacy);

  return {
    colors,
    palette: {
      primary: palette.primary,
      secondary: palette.secondary,
      accent: palette.accent,
      background: palette.background,
      text: palette.text,
    },
  };
}
