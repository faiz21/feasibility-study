Below is a **granular component inventory** extracted from your MV Template Case Study Content List PDF (pages 1–13). 
For each component I give: **component name**, **type key**, and a **recommended JSON content format** (block-based, safe for Supabase `jsonb`).

---

## 0) Recommended JSON convention (used by all components)

```json
{
  "schemaVersion": 1,
  "type": "component.typeKey",
  "id": "uuid-or-stable-string",
  "data": { },
  "meta": {
    "locale": "en",
    "tags": [],
    "createdAt": "ISO-8601"
  }
}
```

Common sub-objects:

```json
{
  "text": { "plain": "string", "rich": { "blocks": [] } },
  "image": { "src": "url-or-storage-path", "alt": "string", "caption": "string" },
  "icon": { "name": "string", "src": "optional-url" },
  "link": { "label": "string", "href": "string" }
}
```

Rich text block format (minimal):

```json
{
  "blocks": [
    { "t": "h2", "text": "Heading" },
    { "t": "p", "text": "Paragraph..." },
    { "t": "ul", "items": ["Item 1", "Item 2"] }
  ]
}
```

---

## 1) Header / Footer / Branding Components (Page 1–2) 

### 1. HeaderBarBrand

**type:** `layout.headerBarBrand`
**Purpose:** top strip with title (“HEADER LIST”) + logo mark

```json
{
  "type": "layout.headerBarBrand",
  "data": {
    "headerLabel": "HEADER LIST",
    "brand": { "logo": { "src": "logo.png", "alt": "Brand" } }
  }
}
```

### 2. FooterContactStrip

**type:** `layout.footerContactStrip`
**Purpose:** phone / website / email footer (p1–p2)

```json
{
  "type": "layout.footerContactStrip",
  "data": {
    "contacts": [
      { "kind": "phone", "value": "+62-8111-092-533" },
      { "kind": "web", "value": "machinevision.global" },
      { "kind": "email", "value": "info@machinevision.global" }
    ],
    "pageNumber": 1
  }
}
```

### 3. WatermarkBackgroundPattern

**type:** `layout.watermarkBackgroundPattern`
**Purpose:** subtle geometric background texture (p2+)

```json
{
  "type": "layout.watermarkBackgroundPattern",
  "data": { "patternKey": "geo-lines", "opacity": 0.08 }
}
```

---

## 2) Cover / Title Page Components (Page 1) 

### 4. CoverHeroImage

**type:** `cover.heroImage`
**Purpose:** large photo background

```json
{
  "type": "cover.heroImage",
  "data": {
    "image": { "src": "cover.jpg", "alt": "Cover hero" },
    "overlay": { "style": "darkGradient", "opacity": 0.35 }
  }
}
```

### 5. CoverTitleStack

**type:** `cover.titleStack`
**Purpose:** “COMPANY CASE STUDY” + company name

```json
{
  "type": "cover.titleStack",
  "data": {
    "kicker": "COMPANY",
    "title": "CASE STUDY",
    "subtitle": "Arowwai Industries"
  }
}
```

### 6. CompanyProfileCard

**type:** `cover.companyProfileCard`
**Purpose:** company description box + “Background” label

```json
{
  "type": "cover.companyProfileCard",
  "data": {
    "label": "Background",
    "companyName": "Arowwai Industries",
    "description": {
      "blocks": [{ "t": "p", "text": "Established in 2010..." }]
    }
  }
}
```

### 7. CoverTagline

**type:** `cover.tagline`
**Purpose:** “Empowering Change, One Step at a Time”

```json
{
  "type": "cover.tagline",
  "data": { "text": "Empowering Change, One Step at a Time" }
}
```

### 8. CoverYearBadge

**type:** `cover.yearBadge`
**Purpose:** large “20 30” vertical year badge

```json
{
  "type": "cover.yearBadge",
  "data": { "year": "2030", "style": "stackedDigits" }
}
```

### 9. CoverReportMetaCard

**type:** `cover.reportMetaCard`
**Purpose:** “Impact Report” + “Prepared by” block

```json
{
  "type": "cover.reportMetaCard",
  "data": {
    "reportTitle": "Impact Report",
    "preparedBy": "Bartholomew Henderson"
  }
}
```

---

## 3) Overview Page Components (Page 2) 

### 10. SidePanelNarrativeCard

**type:** `content.sidePanelNarrativeCard`
**Purpose:** left tall card with TITLE + OVERVIEW paragraph

```json
{
  "type": "content.sidePanelNarrativeCard",
  "data": {
    "titleLabel": "TITLE",
    "title": "A Journey of Innovation and Success",
    "sectionLabel": "OVERVIEW",
    "body": { "blocks": [{ "t": "p", "text": "Borcelle embarked..." }] }
  }
}
```

---

## 4) Mixed Content Grid Components (Page 3) 

### 11. TwoColumnTextBlock

**type:** `content.twoColumnTextBlock`
**Purpose:** Overview + Key Findings & Recommendations

```json
{
  "type": "content.twoColumnTextBlock",
  "data": {
    "left": { "title": "Overview", "body": { "blocks": [{ "t": "p", "text": "..." }] } },
    "right": { "title": "Key Findings and Recommendations", "body": { "blocks": [{ "t": "ul", "items": ["...", "..."] }] } }
  }
}
```

### 12. GoalsCardRow

**type:** `cards.goalsRow`
**Purpose:** 3 goal cards (Brand Awareness / Boost Sales / Market Expansion)

```json
{
  "type": "cards.goalsRow",
  "data": {
    "title": "Goals and Objectives",
    "items": [
      { "icon": { "name": "awareness" }, "title": "Brand Awareness", "text": "Increase Brand Awareness by 40%..." },
      { "icon": { "name": "sales" }, "title": "Boost Sales", "text": "Boost Sales by 25%..." },
      { "icon": { "name": "expansion" }, "title": "Market Expansion", "text": "Expand Market Reach..." }
    ]
  }
}
```

### 13. DataTableSimple

**type:** `table.simple`
**Purpose:** “Target Audience and Segmentation” table

```json
{
  "type": "table.simple",
  "data": {
    "title": "Target Audience and Segmentation",
    "columns": ["Segment", "Characteristics", "Marketing Strategy"],
    "rows": [
      ["Segment 1", "Young Professionals (Ages 25–35)", "Mobile-friendly platforms..."],
      ["Segment 2", "Families (Ages 30–50)", "Family packages..."],
      ["Segment 3", "Digital Natives (Early 20)", "Social media campaigns..."]
    ]
  }
}
```

### 14. BarChartCard

**type:** `chart.barCard`
**Purpose:** “Advertising and Promotion” bar chart

```json
{
  "type": "chart.barCard",
  "data": {
    "title": "Advertising and Promotion",
    "legend": ["Digital Marketing", "Social Media", "Offline Marketing"],
    "xAxis": ["Channel"],
    "series": [
      { "name": "Digital Marketing", "data": [10] },
      { "name": "Social Media", "data": [15] },
      { "name": "Offline Marketing", "data": [8] }
    ]
  }
}
```

---

## 5) Quote / Statement Components (Pages 4 & 9) 

### 15. QuoteBackdropPanel

**type:** `quote.backdropPanel`
**Purpose:** big quote typography with faded repeats (p4)

```json
{
  "type": "quote.backdropPanel",
  "data": {
    "quote": "By prioritizing customer experience and community, Borcelle proved that bookstores can thrive in the digital age.",
    "style": { "repeatFaded": true, "quoteMarks": "large" }
  }
}
```

### 16. QuoteRibbonStack

**type:** `quote.ribbonStack`
**Purpose:** repeated horizontal quote ribbons (p9)

```json
{
  "type": "quote.ribbonStack",
  "data": {
    "items": [
      { "text": "YOUR HEALTH DESERVES TRUSTED CARE — TODAY AND EVERY DAY.", "variant": "navy" },
      { "text": "YOUR HEALTH DESERVES TRUSTED CARE — TODAY AND EVERY DAY.", "variant": "gray" }
    ],
    "repeat": 6
  }
}
```

---

## 6) Goals + Benefits Layout Components (Page 5) 

### 17. LongFormOverview

**type:** `content.longFormOverview`
**Purpose:** full-width overview paragraph

```json
{
  "type": "content.longFormOverview",
  "data": {
    "title": "Overview",
    "body": { "blocks": [{ "t": "p", "text": "This business plan outlines..." }] }
  }
}
```

### 18. GoalsListWithIcons

**type:** `list.goalsWithIcons`
**Purpose:** 5 goals list (Brand Awareness, Boost Sales, etc.)

```json
{
  "type": "list.goalsWithIcons",
  "data": {
    "title": "Goals and Objectives",
    "items": [
      { "icon": { "name": "brand" }, "title": "Brand Awareness", "text": "..." },
      { "icon": { "name": "sales" }, "title": "Boost Sales", "text": "..." },
      { "icon": { "name": "market" }, "title": "Market Expansion", "text": "..." },
      { "icon": { "name": "retention" }, "title": "Customer Retention", "text": "..." },
      { "icon": { "name": "partners" }, "title": "Develop Partnerships", "text": "..." }
    ]
  }
}
```

### 19. NumberedBenefitsBlock

**type:** `list.numberedBenefits`
**Purpose:** numbered 1–3 benefits column

```json
{
  "type": "list.numberedBenefits",
  "data": {
    "title": "BENEFITS",
    "items": [
      { "n": 1, "title": "Benefits One", "text": "Give your colleagues..." },
      { "n": 2, "title": "Benefits Two", "text": "Create stunning reports..." },
      { "n": 3, "title": "Benefits Three", "text": "Give your colleagues..." }
    ]
  }
}
```

---

## 7) KPI / Metrics Components (Pages 6–7–8–12) 

### 20. KpiCard

**type:** `kpi.card`
**Purpose:** “Key metrics” card with icon + big numbers (750M / 200M)

```json
{
  "type": "kpi.card",
  "data": {
    "title": "Key metrics",
    "body": { "blocks": [{ "t": "p", "text": "Some readers might prefer..." }] },
    "metrics": [
      { "icon": { "name": "heart" }, "value": "750M", "label": "The entries recorded" },
      { "icon": { "name": "clock" }, "value": "200M", "label": "Scheduled hours" }
    ],
    "variant": "navy"
  }
}
```

### 21. KpiCardGrid2x2

**type:** `kpi.grid2x2`
**Purpose:** 4 KPI cards layout (p6)

```json
{
  "type": "kpi.grid2x2",
  "data": { "items": [{ "ref": "kpi-card-1" }, { "ref": "kpi-card-2" }, { "ref": "kpi-card-3" }, { "ref": "kpi-card-4" }] }
}
```

### 22. IconCategoryGrid

**type:** `icons.categoryGrid`
**Purpose:** circular icon categories (Professional Service / IT / Accounting / Management) (p7)

```json
{
  "type": "icons.categoryGrid",
  "data": {
    "items": [
      { "icon": { "name": "briefcase" }, "label": "Professional Service" },
      { "icon": { "name": "chip" }, "label": "Information Technology" },
      { "icon": { "name": "calculator" }, "label": "Accounting" },
      { "icon": { "name": "chart" }, "label": "Management" }
    ],
    "repeat": 3
  }
}
```

### 23. ResultMetricCard

**type:** `result.metricCard`
**Purpose:** 2 big % metrics + short explanations (p8)

```json
{
  "type": "result.metricCard",
  "data": {
    "label": "Result",
    "metrics": [
      { "value": "30%", "text": "Growth in foot traffic through promotions & outreach." },
      { "value": "50%", "text": "Increase in engagement via events & social media." }
    ],
    "variant": "dark"
  }
}
```

### 24. ResultQuoteCallout

**type:** `result.quoteCallout`
**Purpose:** right-side narrative with large quote mark background (p8)

```json
{
  "type": "result.quoteCallout",
  "data": {
    "text": "By prioritizing customer experience and community, Borcelle proved that bookstores can thrive in the digital age.",
    "style": { "quoteMarks": true, "divider": true }
  }
}
```

### 25. ImpactTopMetricRow

**type:** `impact.topMetricRow`
**Purpose:** top-row big metrics ($1.8M / 30+ / 12,500) (p12)

```json
{
  "type": "impact.topMetricRow",
  "data": {
    "items": [
      { "icon": { "name": "donation" }, "value": "$1.8M", "label": "in total donations received" },
      { "icon": { "name": "programs" }, "value": "30+", "label": "community programs implemented successfully" },
      { "icon": { "name": "people" }, "value": "12,500", "label": "individuals successfully reached across 5 regions" }
    ]
  }
}
```

### 26. ImpactCategoryPanel

**type:** `impact.categoryPanel`
**Purpose:** category blocks (Education Support / Skills Training / Health & Wellness / Community Engagement) (p12)

```json
{
  "type": "impact.categoryPanel",
  "data": {
    "category": "Community Engagement",
    "metrics": [
      { "value": "1,200", "label": "volunteers contributed" },
      { "value": "85%", "label": "donor retention rate", "viz": { "type": "bar", "value": 0.85 } },
      { "value": "34%", "label": "growth in social media following" }
    ]
  }
}
```

---

## 8) Challenge / Solution / Results + Packages (Page 10) 

### 27. ThreePillarSummary

**type:** `pillars.challengeSolutionResult`
**Purpose:** three cards: Challenges / Solutions / Results

```json
{
  "type": "pillars.challengeSolutionResult",
  "data": {
    "items": [
      { "title": "Challenges", "body": { "blocks": [{ "t": "p", "text": "The organization faces..." }] } },
      { "title": "Solutions", "body": { "blocks": [{ "t": "p", "text": "Implementing a client portal..." }] } },
      { "title": "Results", "metrics": [
        { "value": "40%", "label": "faster project turnaround time" },
        { "value": "25%", "label": "improvement in resource utilization" },
        { "value": "30%", "label": "increase in positive client feedback" },
        { "value": "50%", "label": "boosting team efficiency" }
      ]}
    ]
  }
}
```

### 28. PricingPackageCards

**type:** `cards.pricingPackages`
**Purpose:** “Our Packages” 3 pricing cards with “Starting from $..”

```json
{
  "type": "cards.pricingPackages",
  "data": {
    "title": "Our Packages",
    "items": [
      { "title": "Brand Clarity Session", "description": "A 1-hour consultation...", "priceFrom": 48.0, "currency": "USD" },
      { "title": "Visual Strategy & Content Map", "description": "Includes social media guidelines...", "priceFrom": 52.0, "currency": "USD" },
      { "title": "Full Campaign Planning", "description": "End-to-end content strategy...", "priceFrom": 55.0, "currency": "USD" }
    ]
  }
}
```

### 29. WorkflowStepper

**type:** `process.workflowStepper`
**Purpose:** “Workflow Process” numbered steps 1–5

```json
{
  "type": "process.workflowStepper",
  "data": {
    "title": "Workflow Process",
    "steps": [
      "Intro call & client brief",
      "Strategic alignment",
      "Creative development",
      "Final presentation & handover",
      "Follow-up review session"
    ]
  }
}
```

### 30. HighlightsCard

**type:** `content.highlightsCard`
**Purpose:** bullet highlights (Worked with over 25 businesses, etc.)

```json
{
  "type": "content.highlightsCard",
  "data": {
    "title": "Highlights",
    "items": [
      "Worked with over 25 businesses",
      "Average 3x engagement boost post-launch",
      "Service availability: Weekdays 10AM–6PM"
    ]
  }
}
```

---

## 9) Social/Analytics Dashboard Components (Page 11) 

### 31. KpiStrip3

**type:** `kpi.strip3`
**Purpose:** Total Impression / Total Engagement / Total New Followers

```json
{
  "type": "kpi.strip3",
  "data": {
    "items": [
      { "label": "Total Impression", "value": "1,345,000" },
      { "label": "Total Engagement", "value": "175,000" },
      { "label": "Total New Followers", "value": "6,500" }
    ]
  }
}
```

### 32. RankedPlatformList

**type:** `list.rankedWithDelta`
**Purpose:** platform performance list with up/down % deltas

```json
{
  "type": "list.rankedWithDelta",
  "data": {
    "title": "Performance by Social Media Platforms",
    "items": [
      { "label": "Platform 1", "value": 1332, "deltaPct": -3 },
      { "label": "Platform 2", "value": 1536, "deltaPct": 16 },
      { "label": "Platform 3", "value": 1522, "deltaPct": 11 },
      { "label": "Platform 4", "value": 1439, "deltaPct": 9 }
    ]
  }
}
```

### 33. DonutChartCard

**type:** `chart.donutCard`
**Purpose:** “Performance by type” donut (Video/Picture/Text/Link)

```json
{
  "type": "chart.donutCard",
  "data": {
    "title": "Performance by type",
    "series": [
      { "name": "Video", "value": 64.9 },
      { "name": "Picture", "value": 21.2 },
      { "name": "Text", "value": 7.9 },
      { "name": "Link", "value": 6.0 }
    ],
    "unit": "%"
  }
}
```

### 34. DemographicSummaryCards

**type:** `demographics.summaryCards`
**Purpose:** Total Audience + gender split + age bands

```json
{
  "type": "demographics.summaryCards",
  "data": {
    "totalAudience": "123K",
    "gender": [{ "label": "Male", "value": 55 }, { "label": "Female", "value": 45 }],
    "ageBands": [
      { "label": "Age 18–24", "value": 41 },
      { "label": "Age 25–34", "value": 45 },
      { "label": "Age 35–44", "value": 14 }
    ],
    "unit": "%"
  }
}
```

### 35. PeakTimeGauge

**type:** `chart.gaugeSegments`
**Purpose:** “Peak Engagement Time” segmented gauge (Morning/Afternoon/Evening/Midnight)

```json
{
  "type": "chart.gaugeSegments",
  "data": {
    "title": "Peak Engagement Time",
    "segments": [
      { "label": "Morning", "value": 8 },
      { "label": "Afternoon", "value": 26 },
      { "label": "Evening", "value": 34 },
      { "label": "Midnight", "value": 32 }
    ],
    "unit": "%"
  }
}
```

### 36. SupportingTextCard

**type:** `content.supportingTextCard`
**Purpose:** small paragraph block beside charts (p11)

```json
{
  "type": "content.supportingTextCard",
  "data": {
    "body": { "blocks": [{ "t": "p", "text": "Lorem ipsum..." }] }
  }
}
```

---

## 10) Multi-Panel Sales/Business Analytics Infographic (Page 13) 

### 37. YearPercentBadgeColumn

**type:** `stats.yearPercentColumn`
**Purpose:** year labels with % values (2022–2027)

```json
{
  "type": "stats.yearPercentColumn",
  "data": {
    "items": [
      { "year": 2022, "value": 4.3 },
      { "year": 2023, "value": 11.6 },
      { "year": 2024, "value": 23.2 },
      { "year": 2025, "value": 26.1 },
      { "year": 2026, "value": 11.6 },
      { "year": 2027, "value": 23.2 }
    ],
    "unit": "%"
  }
}
```

### 38. IconBulletsAnalysisCard

**type:** `content.iconBulletsCard`
**Purpose:** icon + bullet list explanatory block (e.g., “Análisis de ventas”)

```json
{
  "type": "content.iconBulletsCard",
  "data": {
    "icon": { "name": "sales" },
    "title": "Análisis de ventas",
    "bullets": ["Lorem ipsum...", "Lorem ipsum...", "Lorem ipsum..."]
  }
}
```

### 39. ProfitVsExpenseSplit

**type:** `stats.profitExpenseSplit`
**Purpose:** “Rentabilidad 80% / Gastos 20%”

```json
{
  "type": "stats.profitExpenseSplit",
  "data": {
    "profitPct": 80,
    "expensePct": 20,
    "labels": { "profit": "Rentabilidad", "expense": "Gastos" }
  }
}
```

### 40. SalesByProductDonut

**type:** `chart.donutSalesByProduct`
**Purpose:** donut with yearly slices + label “Ventas por producto”

```json
{
  "type": "chart.donutSalesByProduct",
  "data": {
    "title": "Ventas por producto",
    "series": [
      { "name": "2022", "value": 4.3 },
      { "name": "2023", "value": 11.6 },
      { "name": "2024", "value": 23.2 },
      { "name": "2025", "value": 26.1 },
      { "name": "2026", "value": 11.6 },
      { "name": "2027", "value": 23.2 }
    ],
    "unit": "%"
  }
}
```

### 41. GainsAreaChart

**type:** `chart.areaGains`
**Purpose:** “Ganancias” area chart (2022–2027)

```json
{
  "type": "chart.areaGains",
  "data": {
    "title": "Ganancias",
    "x": [2022, 2023, 2024, 2025, 2026, 2027],
    "series": [{ "name": "Gains", "data": [5, 10, 18, 30, 22, 28] }]
  }
}
```

### 42. SectionSummaryTextBlock

**type:** `content.sectionSummaryText`
**Purpose:** small narrative blocks used multiple times on p13

```json
{
  "type": "content.sectionSummaryText",
  "data": {
    "title": "Resumen de resultados",
    "body": { "blocks": [{ "t": "p", "text": "Lorem ipsum..." }] }
  }
}
```

---

## 11) Layout Containers (used across many pages) 

These are important because they encode the “template” structure:

### 43. Grid2Column

**type:** `layout.grid2Column`

```json
{
  "type": "layout.grid2Column",
  "data": { "left": [{ "ref": "component-id" }], "right": [{ "ref": "component-id" }], "ratio": "60/40" }
}
```

### 44. Grid3Column

**type:** `layout.grid3Column`

```json
{
  "type": "layout.grid3Column",
  "data": { "columns": [[{ "ref": "a" }], [{ "ref": "b" }], [{ "ref": "c" }]] }
}
```

### 45. CardGrid

**type:** `layout.cardGrid`

```json
{
  "type": "layout.cardGrid",
  "data": { "minCardWidth": 260, "items": [{ "ref": "x" }, { "ref": "y" }, { "ref": "z" }] }
}
```

---

# Deliverable you can store in Supabase

A **page** can simply be:

```json
{
  "schemaVersion": 1,
  "pageTitle": "Content List Page 10",
  "layout": [
    { "type": "layout.headerBarBrand", "id": "hdr" , "data": { "headerLabel": "CONTENT LIST", "brand": { "logo": { "src": "logo.png", "alt": "Machine Vision" } } } },
    { "type": "pillars.challengeSolutionResult", "id": "csr", "data": { "...": "..." } },
    { "type": "cards.pricingPackages", "id": "pkg", "data": { "...": "..." } },
    { "type": "process.workflowStepper", "id": "wf", "data": { "...": "..." } },
    { "type": "content.highlightsCard", "id": "hi", "data": { "...": "..." } },
    { "type": "layout.footerContactStrip", "id": "ftr", "data": { "contacts": [] } }
  ]
}
```

---

If you want, next I can output this as a **single JSON catalog file** (one array of 45 components with schemas + example payloads), ready to paste into your internal docs / Codex prompt.
