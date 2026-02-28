export type RichTextBlock =
  | { t: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"; text: string }
  | { t: "p"; text: string }
  | { t: "ul" | "ol"; items: string[] };

export type RichText = {
  blocks: RichTextBlock[];
};

export type ImageValue = {
  src: string;
  alt?: string;
  caption?: string;
};

export type IconValue = {
  name: string;
  src?: string;
};

export type LinkValue = {
  label: string;
  href: string;
};

export type CaseStudyMeta = {
  locale?: string;
  tags?: string[];
  createdAt?: string;
};

export type ComponentTypeKey =
  | "layout.headerBarBrand"
  | "layout.footerContactStrip"
  | "layout.watermarkBackgroundPattern"
  | "cover.heroImage"
  | "cover.titleStack"
  | "cover.companyProfileCard"
  | "cover.tagline"
  | "cover.yearBadge"
  | "cover.reportMetaCard"
  | "content.sidePanelNarrativeCard"
  | "content.twoColumnTextBlock"
  | "cards.goalsRow"
  | "table.simple"
  | "chart.barCard"
  | "quote.backdropPanel"
  | "quote.ribbonStack"
  | "content.longFormOverview"
  | "list.goalsWithIcons"
  | "list.numberedBenefits"
  | "kpi.card"
  | "kpi.grid2x2"
  | "icons.categoryGrid"
  | "result.metricCard"
  | "result.quoteCallout"
  | "impact.topMetricRow"
  | "impact.categoryPanel"
  | "pillars.challengeSolutionResult"
  | "cards.pricingPackages"
  | "process.workflowStepper"
  | "content.highlightsCard"
  | "kpi.strip3"
  | "list.rankedWithDelta"
  | "chart.donutCard"
  | "demographics.summaryCards"
  | "chart.gaugeSegments"
  | "content.supportingTextCard"
  | "stats.yearPercentColumn"
  | "content.iconBulletsCard"
  | "stats.profitExpenseSplit"
  | "chart.donutSalesByProduct"
  | "chart.areaGains"
  | "content.sectionSummaryText"
  | "layout.grid2Column"
  | "layout.grid3Column"
  | "layout.cardGrid";

export type BaseBlock<
  TType extends ComponentTypeKey = ComponentTypeKey,
  TData = Record<string, unknown>,
> = {
  schemaVersion: 1;
  type: TType;
  id: string;
  data: TData;
  meta?: CaseStudyMeta;
};

export type GenericBlock = BaseBlock<ComponentTypeKey, Record<string, unknown>>;
export type CaseStudyBlock = GenericBlock;

export type CaseStudyPageDocument = {
  schemaVersion: 1;
  pageTitle: string;
  layout: CaseStudyBlock[];
};

export type CaseStudyRenderContext = {
  blockMap: Map<string, CaseStudyBlock>;
  renderRef: (id: string, path: string[]) => ReactNode;
};

export type CaseStudyBlockComponentProps = {
  block: CaseStudyBlock;
  context: CaseStudyRenderContext;
  path: string[];
};

export type BlockRenderer = (props: CaseStudyBlockComponentProps) => ReactNode;

export type CaseStudyMetric = {
  label: string;
  value: string;
  description?: string;
};

export type CaseStudyGoal = {
  title: string;
  description: string;
};

export type CaseStudyBenefit = {
  title: string;
  description: string;
};

export type CaseStudyFinding = {
  text: string;
};

export type CaseStudyFaqItem = {
  question: string;
  answer: string;
};

export type CaseStudySegment = {
  name: string;
  characteristics: string;
  marketingStrategy: string;
};

export type CaseStudyContact = {
  website?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
};

export type CaseStudyCompany = {
  name: string;
  description: string;
  backgroundLabel?: string;
};

export type CaseStudy = {
  title: string;
  subtitle?: string;
  yearLabel?: string;
  reportLabel?: string;
  preparedByLabel?: string;
  preparedBy?: string;
  company: CaseStudyCompany;
  overview: string;
  goals?: CaseStudyGoal[];
  benefits?: CaseStudyBenefit[];
  keyFindings?: CaseStudyFinding[];
  keyMetrics?: CaseStudyMetric[];
  segments?: CaseStudySegment[];
  faq?: CaseStudyFaqItem[];
  aboutUs?: {
    heading?: string;
    description: string;
    stats?: CaseStudyMetric[];
  };
  contact?: CaseStudyContact;
};
import type { ReactNode } from "react";
