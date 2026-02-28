import type { BlockRenderer, ComponentTypeKey } from "@/lib/case-study/types";
import { BarChartCard, DonutChartCard, GainsAreaChart, PeakTimeGauge, SalesByProductDonut } from "./chart/blocks";
import { CoverCompanyProfileCard, CoverHeroImage, CoverReportMetaCard, CoverTagline, CoverTitleStack, CoverYearBadge } from "./cover/blocks";
import { GoalsCardRow, HighlightsCard, IconBulletsAnalysisCard, LongFormOverview, PricingPackageCards, SectionSummaryTextBlock, SidePanelNarrativeCard, SupportingTextCard, TwoColumnTextBlock } from "./content/blocks";
import { DemographicSummaryCards } from "./demographics/blocks";
import { IconCategoryGrid } from "./icons/blocks";
import { KpiCard, KpiCardGrid2x2, KpiStrip3 } from "./kpi/blocks";
import { CardGrid, FooterContactStrip, Grid2Column, Grid3Column, HeaderBarBrand, WatermarkBackgroundPattern } from "./layout/blocks";
import { GoalsListWithIcons, NumberedBenefitsBlock, RankedPlatformList, WorkflowStepper } from "./list/blocks";
import { ThreePillarSummary } from "./pillars/blocks";
import { QuoteBackdropPanel, QuoteRibbonStack } from "./quote/blocks";
import { ResultMetricCard, ResultQuoteCallout } from "./result/blocks";
import { ImpactCategoryPanel, ImpactTopMetricRow } from "./impact/blocks";
import { ProfitVsExpenseSplit, YearPercentBadgeColumn } from "./stats/blocks";
import { DataTableSimple } from "./table/blocks";

export const CASE_STUDY_RENDERERS: Record<ComponentTypeKey, BlockRenderer> = {
  "layout.headerBarBrand": HeaderBarBrand,
  "layout.footerContactStrip": FooterContactStrip,
  "layout.watermarkBackgroundPattern": WatermarkBackgroundPattern,
  "cover.heroImage": CoverHeroImage,
  "cover.titleStack": CoverTitleStack,
  "cover.companyProfileCard": CoverCompanyProfileCard,
  "cover.tagline": CoverTagline,
  "cover.yearBadge": CoverYearBadge,
  "cover.reportMetaCard": CoverReportMetaCard,
  "content.sidePanelNarrativeCard": SidePanelNarrativeCard,
  "content.twoColumnTextBlock": TwoColumnTextBlock,
  "cards.goalsRow": GoalsCardRow,
  "table.simple": DataTableSimple,
  "chart.barCard": BarChartCard,
  "quote.backdropPanel": QuoteBackdropPanel,
  "quote.ribbonStack": QuoteRibbonStack,
  "content.longFormOverview": LongFormOverview,
  "list.goalsWithIcons": GoalsListWithIcons,
  "list.numberedBenefits": NumberedBenefitsBlock,
  "kpi.card": KpiCard,
  "kpi.grid2x2": KpiCardGrid2x2,
  "icons.categoryGrid": IconCategoryGrid,
  "result.metricCard": ResultMetricCard,
  "result.quoteCallout": ResultQuoteCallout,
  "impact.topMetricRow": ImpactTopMetricRow,
  "impact.categoryPanel": ImpactCategoryPanel,
  "pillars.challengeSolutionResult": ThreePillarSummary,
  "cards.pricingPackages": PricingPackageCards,
  "process.workflowStepper": WorkflowStepper,
  "content.highlightsCard": HighlightsCard,
  "kpi.strip3": KpiStrip3,
  "list.rankedWithDelta": RankedPlatformList,
  "chart.donutCard": DonutChartCard,
  "demographics.summaryCards": DemographicSummaryCards,
  "chart.gaugeSegments": PeakTimeGauge,
  "content.supportingTextCard": SupportingTextCard,
  "stats.yearPercentColumn": YearPercentBadgeColumn,
  "content.iconBulletsCard": IconBulletsAnalysisCard,
  "stats.profitExpenseSplit": ProfitVsExpenseSplit,
  "chart.donutSalesByProduct": SalesByProductDonut,
  "chart.areaGains": GainsAreaChart,
  "content.sectionSummaryText": SectionSummaryTextBlock,
  "layout.grid2Column": Grid2Column,
  "layout.grid3Column": Grid3Column,
  "layout.cardGrid": CardGrid,
};
