export type ReportsUiTheme = {
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  textPrimary: string;
  textSecondary: string;
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

const REPORTS_UI_THEME: ReportsUiTheme = {
  surface: "#F6F9FF",
  surfaceElevated: "#FFFFFF",
  surfaceMuted: "#EDF3FF",
  textPrimary: "#10213E",
  textSecondary: "#4C628A",
  border: "#D9E5FA",
  borderStrong: "#B7C9EE",
  accent: "#1E40AF",
  accentHover: "#1B3A9C",
  accentSoft: "#DCE8FF",
  accentContrast: "#FFFFFF",
  focusRing: "#5B83F7",
  info: "#0EA5E9",
  success: "#16A34A",
  warning: "#D97706",
  critical: "#DC2626",
};

export function resolveReportsUiTheme(): ReportsUiTheme {
  return REPORTS_UI_THEME;
}
