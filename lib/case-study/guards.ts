import type { CaseStudyBlock, CaseStudyPageDocument, ComponentTypeKey } from "./types";

const COMPONENT_TYPE_KEYS: ComponentTypeKey[] = [
  "layout.headerBarBrand",
  "layout.footerContactStrip",
  "layout.watermarkBackgroundPattern",
  "cover.heroImage",
  "cover.titleStack",
  "cover.companyProfileCard",
  "cover.tagline",
  "cover.yearBadge",
  "cover.reportMetaCard",
  "content.sidePanelNarrativeCard",
  "content.twoColumnTextBlock",
  "cards.goalsRow",
  "table.simple",
  "chart.barCard",
  "quote.backdropPanel",
  "quote.ribbonStack",
  "content.longFormOverview",
  "list.goalsWithIcons",
  "list.numberedBenefits",
  "kpi.card",
  "kpi.grid2x2",
  "icons.categoryGrid",
  "result.metricCard",
  "result.quoteCallout",
  "impact.topMetricRow",
  "impact.categoryPanel",
  "pillars.challengeSolutionResult",
  "cards.pricingPackages",
  "process.workflowStepper",
  "content.highlightsCard",
  "kpi.strip3",
  "list.rankedWithDelta",
  "chart.donutCard",
  "demographics.summaryCards",
  "chart.gaugeSegments",
  "content.supportingTextCard",
  "stats.yearPercentColumn",
  "content.iconBulletsCard",
  "stats.profitExpenseSplit",
  "chart.donutSalesByProduct",
  "chart.areaGains",
  "content.sectionSummaryText",
  "layout.grid2Column",
  "layout.grid3Column",
  "layout.cardGrid",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => typeof item === "number");
}

function isTypeKey(value: unknown): value is ComponentTypeKey {
  return typeof value === "string" && COMPONENT_TYPE_KEYS.includes(value as ComponentTypeKey);
}

function isBaseBlockShape(value: unknown): value is CaseStudyBlock {
  if (!isRecord(value)) return false;
  return (
    value.schemaVersion === 1 &&
    typeof value.id === "string" &&
    isTypeKey(value.type) &&
    isRecord(value.data)
  );
}

function hasTableShape(data: Record<string, unknown>): boolean {
  return (
    typeof data.title === "string" &&
    isStringArray(data.columns) &&
    Array.isArray(data.rows) &&
    data.rows.every((row) => Array.isArray(row) && row.every((cell) => typeof cell === "string"))
  );
}

function hasChartSeriesShape(data: Record<string, unknown>): boolean {
  return Array.isArray(data.series);
}

function hasMetricsShape(data: Record<string, unknown>): boolean {
  return Array.isArray(data.metrics) || Array.isArray(data.items);
}

function hasLayoutRefsShape(data: Record<string, unknown>): boolean {
  if (Array.isArray(data.items)) {
    return data.items.every((item) => isRecord(item) && typeof item.ref === "string");
  }
  if (isRecord(data.left) && isRecord(data.right)) return true;
  if (Array.isArray(data.columns)) return true;
  return false;
}

function passesHighRiskValidation(block: CaseStudyBlock): boolean {
  if (block.type === "table.simple") return hasTableShape(block.data);
  if (
    block.type === "chart.barCard" ||
    block.type === "chart.donutCard" ||
    block.type === "chart.gaugeSegments" ||
    block.type === "chart.donutSalesByProduct" ||
    block.type === "chart.areaGains"
  ) {
    return hasChartSeriesShape(block.data) || isNumberArray(block.data.x);
  }
  if (
    block.type === "kpi.card" ||
    block.type === "kpi.grid2x2" ||
    block.type === "impact.topMetricRow" ||
    block.type === "impact.categoryPanel" ||
    block.type === "result.metricCard"
  ) {
    return hasMetricsShape(block.data);
  }
  if (
    block.type === "layout.grid2Column" ||
    block.type === "layout.grid3Column" ||
    block.type === "layout.cardGrid"
  ) {
    return hasLayoutRefsShape(block.data);
  }
  return true;
}

export function isCaseStudyBlock(input: unknown): input is CaseStudyBlock {
  if (!isBaseBlockShape(input)) return false;
  return passesHighRiskValidation(input);
}

export function isCaseStudyPageDocument(input: unknown): input is CaseStudyPageDocument {
  if (!isRecord(input)) return false;
  if (input.schemaVersion !== 1 || typeof input.pageTitle !== "string") return false;
  if (!Array.isArray(input.layout)) return false;
  return input.layout.every((block) => isCaseStudyBlock(block));
}

