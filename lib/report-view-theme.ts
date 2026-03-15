import {
  resolvePortalSurfaceTheme,
  type PortalSurfaceTheme,
} from "@/lib/portal-theme";

export type ReportsUiTheme = PortalSurfaceTheme;

export function resolveReportsUiTheme(): ReportsUiTheme {
  return resolvePortalSurfaceTheme();
}
