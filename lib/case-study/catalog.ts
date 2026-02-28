import type { CaseStudyBlock, CaseStudyPageDocument, ComponentTypeKey } from "./types";

function block<TType extends ComponentTypeKey>(
  id: string,
  type: TType,
  data: Record<string, unknown>,
): CaseStudyBlock {
  return {
    schemaVersion: 1,
    id,
    type,
    data,
    meta: {
      locale: "en",
      tags: [],
      createdAt: new Date().toISOString(),
    },
  };
}

export const CASE_STUDY_BLOCKS: CaseStudyBlock[] = [
  block("hdr", "layout.headerBarBrand", {
    headerLabel: "HEADER LIST",
    brand: { logo: { src: "/opengraph-image.png", alt: "Machine Vision" } },
  }),
  block("ftr", "layout.footerContactStrip", {
    contacts: [
      { kind: "phone", value: "+62-8111-092-533" },
      { kind: "web", value: "machinevision.global" },
      { kind: "email", value: "info@machinevision.global" },
    ],
    pageNumber: 1,
  }),
  block("wmk", "layout.watermarkBackgroundPattern", {
    patternKey: "geo-lines",
    opacity: 0.08,
  }),
  block("cover-hero", "cover.heroImage", {
    image: { src: "/twitter-image.png", alt: "Cover hero" },
    overlay: { style: "darkGradient", opacity: 0.35 },
  }),
  block("cover-title", "cover.titleStack", {
    kicker: "COMPANY",
    title: "CASE STUDY",
    subtitle: "Arowwai Industries",
  }),
  block("cover-company", "cover.companyProfileCard", {
    label: "Background",
    companyName: "Arowwai Industries",
    description: {
      blocks: [{ t: "p", text: "Established in 2010, committed to sustainability and innovation." }],
    },
  }),
  block("cover-tagline", "cover.tagline", {
    text: "Empowering Change, One Step at a Time",
  }),
  block("cover-year", "cover.yearBadge", { year: "2030", style: "stackedDigits" }),
  block("cover-meta", "cover.reportMetaCard", {
    reportTitle: "Impact Report",
    preparedBy: "Bartholomew Henderson",
  }),
  block("side-narrative", "content.sidePanelNarrativeCard", {
    titleLabel: "TITLE",
    title: "A Journey of Innovation and Success",
    sectionLabel: "OVERVIEW",
    body: { blocks: [{ t: "p", text: "Borcelle embarked on a transformative journey." }] },
  }),
  block("two-col", "content.twoColumnTextBlock", {
    left: { title: "Overview", body: { blocks: [{ t: "p", text: "Long-form market context and positioning." }] } },
    right: {
      title: "Key Findings and Recommendations",
      body: { blocks: [{ t: "ul", items: ["Demand is increasing", "Customers seek personalization"] }] },
    },
  }),
  block("goals-row", "cards.goalsRow", {
    title: "Goals and Objectives",
    items: [
      { icon: { name: "awareness" }, title: "Brand Awareness", text: "Increase by 40% in 12 months." },
      { icon: { name: "sales" }, title: "Boost Sales", text: "Increase by 25% in first year." },
      { icon: { name: "expansion" }, title: "Market Expansion", text: "Expand market reach." },
    ],
  }),
  block("segment-table", "table.simple", {
    title: "Target Audience and Segmentation",
    columns: ["Segment", "Characteristics", "Marketing Strategy"],
    rows: [
      ["Segment 1", "Young Professionals", "Mobile-friendly campaigns"],
      ["Segment 2", "Families", "Family packages and testimonials"],
      ["Segment 3", "Digital Natives", "Viral social campaigns"],
    ],
  }),
  block("bar-card", "chart.barCard", {
    title: "Advertising and Promotion",
    legend: ["Digital Marketing", "Social Media", "Offline Marketing"],
    xAxis: ["Channel"],
    series: [
      { name: "Digital Marketing", data: [10] },
      { name: "Social Media", data: [15] },
      { name: "Offline Marketing", data: [8] },
    ],
  }),
  block("quote-backdrop", "quote.backdropPanel", {
    quote: "By prioritizing customer experience and community, bookstores can thrive in the digital age.",
    style: { repeatFaded: true, quoteMarks: "large" },
  }),
  block("quote-ribbon", "quote.ribbonStack", {
    items: [
      { text: "YOUR HEALTH DESERVES TRUSTED CARE - TODAY AND EVERY DAY.", variant: "navy" },
      { text: "YOUR HEALTH DESERVES TRUSTED CARE - TODAY AND EVERY DAY.", variant: "gray" },
    ],
    repeat: 4,
  }),
  block("long-overview", "content.longFormOverview", {
    title: "Overview",
    body: { blocks: [{ t: "p", text: "This business plan outlines strategic initiatives and measurable outcomes." }] },
  }),
  block("goals-list", "list.goalsWithIcons", {
    title: "Goals and Objectives",
    items: [
      { icon: { name: "brand" }, title: "Brand Awareness", text: "Grow awareness through campaigns." },
      { icon: { name: "sales" }, title: "Boost Sales", text: "Increase conversion and revenue." },
      { icon: { name: "market" }, title: "Market Expansion", text: "Expand to new regions." },
      { icon: { name: "retention" }, title: "Customer Retention", text: "Increase loyalty through personalization." },
      { icon: { name: "partners" }, title: "Develop Partnerships", text: "Partner with local influencers." },
    ],
  }),
  block("benefits-numbered", "list.numberedBenefits", {
    title: "BENEFITS",
    items: [
      { n: 1, title: "Benefits One", text: "Give colleagues context using clear section headers." },
      { n: 2, title: "Benefits Two", text: "Highlight pertinent information with visual clarity." },
      { n: 3, title: "Benefits Three", text: "Improve readability with structured blocks." },
    ],
  }),
  block("kpi-card", "kpi.card", {
    title: "Key metrics",
    body: { blocks: [{ t: "p", text: "Key outcomes and directional momentum indicators." }] },
    metrics: [
      { icon: { name: "heart" }, value: "750M", label: "The entries recorded" },
      { icon: { name: "clock" }, value: "200M", label: "Scheduled hours" },
    ],
    variant: "navy",
  }),
  block("kpi-grid", "kpi.grid2x2", {
    items: [{ ref: "kpi-card" }, { ref: "kpi-card" }, { ref: "kpi-card" }, { ref: "kpi-card" }],
  }),
  block("icon-grid", "icons.categoryGrid", {
    items: [
      { icon: { name: "briefcase" }, label: "Professional Service" },
      { icon: { name: "chip" }, label: "Information Technology" },
      { icon: { name: "calculator" }, label: "Accounting" },
      { icon: { name: "chart" }, label: "Management" },
    ],
    repeat: 2,
  }),
  block("result-metric", "result.metricCard", {
    label: "Result",
    metrics: [
      { value: "30%", text: "Growth in foot traffic through promotions and outreach." },
      { value: "50%", text: "Increase in engagement via events and social media." },
    ],
    variant: "dark",
  }),
  block("result-quote", "result.quoteCallout", {
    text: "By prioritizing customer experience and community, Borcelle proved that bookstores can thrive.",
    style: { quoteMarks: true, divider: true },
  }),
  block("impact-top-row", "impact.topMetricRow", {
    items: [
      { icon: { name: "donation" }, value: "$1.8M", label: "in total donations received" },
      { icon: { name: "programs" }, value: "30+", label: "community programs implemented successfully" },
      { icon: { name: "people" }, value: "12,500", label: "individuals successfully reached across 5 regions" },
    ],
  }),
  block("impact-category", "impact.categoryPanel", {
    category: "Community Engagement",
    metrics: [
      { value: "1,200", label: "volunteers contributed" },
      { value: "85%", label: "donor retention rate", viz: { type: "bar", value: 0.85 } },
      { value: "34%", label: "growth in social media following" },
    ],
  }),
  block("pillars", "pillars.challengeSolutionResult", {
    items: [
      { title: "Challenges", body: { blocks: [{ t: "p", text: "The organization faces distributed operations complexity." }] } },
      { title: "Solutions", body: { blocks: [{ t: "p", text: "Implemented unified platform and operating model." }] } },
      {
        title: "Results",
        metrics: [
          { value: "40%", label: "faster project turnaround" },
          { value: "25%", label: "resource utilization improvement" },
          { value: "30%", label: "increase in client feedback" },
        ],
      },
    ],
  }),
  block("pricing", "cards.pricingPackages", {
    title: "Our Packages",
    items: [
      { title: "Brand Clarity Session", description: "A one-hour strategic consultation.", priceFrom: 48, currency: "USD" },
      { title: "Visual Strategy & Content Map", description: "Includes social media guidance.", priceFrom: 52, currency: "USD" },
      { title: "Full Campaign Planning", description: "End-to-end content strategy.", priceFrom: 55, currency: "USD" },
    ],
  }),
  block("workflow", "process.workflowStepper", {
    title: "Workflow Process",
    steps: [
      "Intro call & client brief",
      "Strategic alignment",
      "Creative development",
      "Final presentation & handover",
      "Follow-up review session",
    ],
  }),
  block("highlights", "content.highlightsCard", {
    title: "Highlights",
    items: [
      "Worked with over 25 businesses",
      "Average 3x engagement boost post-launch",
      "Service availability: Weekdays 10AM-6PM",
    ],
  }),
  block("kpi-strip", "kpi.strip3", {
    items: [
      { label: "Total Impression", value: "1,345,000" },
      { label: "Total Engagement", value: "175,000" },
      { label: "Total New Followers", value: "6,500" },
    ],
  }),
  block("ranked-list", "list.rankedWithDelta", {
    title: "Performance by Social Media Platforms",
    items: [
      { label: "Platform 1", value: 1332, deltaPct: -3 },
      { label: "Platform 2", value: 1536, deltaPct: 16 },
      { label: "Platform 3", value: 1522, deltaPct: 11 },
      { label: "Platform 4", value: 1439, deltaPct: 9 },
    ],
  }),
  block("donut-card", "chart.donutCard", {
    title: "Performance by type",
    series: [
      { name: "Video", value: 64.9 },
      { name: "Picture", value: 21.2 },
      { name: "Text", value: 7.9 },
      { name: "Link", value: 6.0 },
    ],
    unit: "%",
  }),
  block("demographics", "demographics.summaryCards", {
    totalAudience: "123K",
    gender: [
      { label: "Male", value: 55 },
      { label: "Female", value: 45 },
    ],
    ageBands: [
      { label: "Age 18-24", value: 41 },
      { label: "Age 25-34", value: 45 },
      { label: "Age 35-44", value: 14 },
    ],
    unit: "%",
  }),
  block("gauge", "chart.gaugeSegments", {
    title: "Peak Engagement Time",
    segments: [
      { label: "Morning", value: 8 },
      { label: "Afternoon", value: 26 },
      { label: "Evening", value: 34 },
      { label: "Midnight", value: 32 },
    ],
    unit: "%",
  }),
  block("supporting-text", "content.supportingTextCard", {
    body: { blocks: [{ t: "p", text: "Supporting narrative that contextualizes chart movements and outliers." }] },
  }),
  block("year-pct", "stats.yearPercentColumn", {
    items: [
      { year: 2022, value: 4.3 },
      { year: 2023, value: 11.6 },
      { year: 2024, value: 23.2 },
      { year: 2025, value: 26.1 },
      { year: 2026, value: 11.6 },
      { year: 2027, value: 23.2 },
    ],
    unit: "%",
  }),
  block("icon-bullets", "content.iconBulletsCard", {
    icon: { name: "sales" },
    title: "Analisis de ventas",
    bullets: ["Trend acceleration in Q2", "Stabilization in Q3", "Campaign lift in Q4"],
  }),
  block("profit-expense", "stats.profitExpenseSplit", {
    profitPct: 80,
    expensePct: 20,
    labels: { profit: "Rentabilidad", expense: "Gastos" },
  }),
  block("sales-donut", "chart.donutSalesByProduct", {
    title: "Ventas por producto",
    series: [
      { name: "2022", value: 4.3 },
      { name: "2023", value: 11.6 },
      { name: "2024", value: 23.2 },
      { name: "2025", value: 26.1 },
      { name: "2026", value: 11.6 },
      { name: "2027", value: 23.2 },
    ],
    unit: "%",
  }),
  block("gains-area", "chart.areaGains", {
    title: "Ganancias",
    x: [2022, 2023, 2024, 2025, 2026, 2027],
    series: [{ name: "Gains", data: [5, 10, 18, 30, 22, 28] }],
  }),
  block("summary-text", "content.sectionSummaryText", {
    title: "Resumen de resultados",
    body: { blocks: [{ t: "p", text: "Resumen ejecutivo de resultados principales y acciones recomendadas." }] },
  }),
  block("layout-2col", "layout.grid2Column", {
    left: [{ ref: "two-col" }, { ref: "segment-table" }],
    right: [{ ref: "bar-card" }, { ref: "result-metric" }],
    ratio: "60/40",
  }),
  block("layout-3col", "layout.grid3Column", {
    columns: [[{ ref: "goals-row" }], [{ ref: "benefits-numbered" }], [{ ref: "highlights" }]],
  }),
  block("layout-card-grid", "layout.cardGrid", {
    minCardWidth: 260,
    items: [{ ref: "donut-card" }, { ref: "gauge" }, { ref: "demographics" }],
  }),
];

export const CASE_STUDY_DOCUMENT: CaseStudyPageDocument = {
  schemaVersion: 1,
  pageTitle: "MV Case Study V2",
  layout: CASE_STUDY_BLOCKS,
};

