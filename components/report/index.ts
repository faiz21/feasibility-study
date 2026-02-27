/* ── Report component system ──────────────────────────────────────────────── */

export { ReportCover } from "./ReportCover";
export type { ReportCoverProps } from "./ReportCover";

export { StatCard } from "./StatCard";
export type { StatCardProps, StatCardTrend } from "./StatCard";

export { SectionBlock, SectionBody, SectionColumns } from "./SectionBlock";
export type {
  SectionBlockProps,
  SectionBodyProps,
  SectionColumnsProps,
} from "./SectionBlock";

export { InsightCard } from "./InsightCard";
export type { InsightCardProps, InsightCardVariant } from "./InsightCard";

export { PullQuote } from "./PullQuote";
export type { PullQuoteProps } from "./PullQuote";

/* ── Theming ──────────────────────────────────────────────────────────────── */

export {
  ReportThemeProvider,
  REPORT_THEME_PRESETS,
} from "./ReportThemeProvider";
export type {
  ReportThemeProviderProps,
  ReportBrand,
  ReportCharts,
} from "./ReportThemeProvider";
