Mode: Draft

# Step 1 - Document Outline and Component Mapping Plan

## Document Outline Table

| Order | Section ID | Heading | Subsections (ordered list) | Notes |
| ----: | ---------- | ------- | -------------------------- | ----- |
| 0 | cov | Cover | Metadata snapshot | Added as deterministic cover page from title, scope, and date |
| 1 | es | 1. Executive Summary | Plant context; maturity snapshot; risk themes; feasibility outlook; strategic roadmap direction; immediate priorities | Narrative-first summary with KPI snapshot |
| 2 | m | 2. Scope and Methodology | 2.1 purpose and boundaries; 2.2 information sources; 2.3 data quality controls; 2.4 outputs | Narrative plus in/out of scope structure |
| 3 | b | 3. Green Plant Baseline: Process and Automation Landscape | 3.1 automation inventory snapshot | Includes PLC brand counts and instrument register table |
| 4 | fw | 4. Assessment Framework and Scoring | 4.1 level definitions; 4.2 scoring scale; 4.3 confidence definition | Rule-set narrative plus score interpretation |
| 5 | r | 5. Assessment Results by Process Group | 5.1 summary scores; 5.1.1-5.1.8 process group rationales; 5.3 actions by group | Summary table + averaged bar chart + process narrative |
| 6 | fnd | 6. Findings (Plant-wide) | 6.1-6.11 plant-wide findings | Condensed findings in two-column narrative |
| 7 | feas | 7. Feasibility Implications for Digitalisation | 7.1 feasible early; 7.2 feasible after upgrades; 7.3 not feasible without major upgrades; 7.4 broader implications | Includes qualitative readiness gauge |
| 8 | rd | 8. Recommended Technical Roadmap | 8.1 principles; 8.2 phase overview; 8.3 phase details; 8.4 pilots; 8.5 dependencies | Workflow stepper + phase table |
| 9 | gaps | 9. Risks, Assumptions, and Data Gaps | 9.1 explicit gaps; 9.2 assumptions; 9.3 technical risks | Closing risk register narrative |

## Component Mapping Plan

| Order | PageTitle | Section ID | Block Summary | BlockType | Component Type | Needs Chart? (Y/N) | Chart Type | Data Source |
| ----: | --------- | ---------- | ------------- | --------- | -------------- | ------------------ | ---------- | ----------- |
| 1 | Cover | cov | Background watermark | Layout | report.layout.watermark | N | - | Input C metadata + style default |
| 2 | Cover | cov | Brand header with report label | Branding | report.layout.headerBar | N | - | Input C/AppCode |
| 3 | Cover | cov | Report title, scope, date, and objective summary | Narrative | report.text.narrativeBlock | N | - | Input A heading and preamble |
| 4 | Cover | cov | Key context metrics (levels in scope, process groups, report sections) | KPI | report.metric.resultMetricCard | N | - | Input A section list |
| 5 | Cover | cov | Contact/footer strip | Branding | report.layout.footerStrip | N | - | Input C defaults |
| 6 | Executive Summary | es | Executive narrative | Narrative | report.text.narrativeBlock | N | - | Section 1 |
| 7 | Executive Summary | es | Risk themes and priorities split | Two-perspective narrative | report.section.multiColumn | N | - | Section 1 |
| 8 | Executive Summary | es | Footer | Branding | report.layout.footerStrip | N | - | Input C defaults |
| 9 | Scope and Methodology | m | Scope, methodology, and controls narrative | Narrative | report.text.narrativeBlock | N | - | Section 2 |
| 10 | Scope and Methodology | m | In-scope vs out-of-scope split | Two-perspective narrative | report.section.multiColumn | N | - | Section 2.1 |
| 11 | Scope and Methodology | m | Footer | Branding | report.layout.footerStrip | N | - | Input C defaults |
| 12 | Baseline Landscape | b | Baseline narrative | Narrative | report.text.narrativeBlock | N | - | Section 3 |
| 13 | Baseline Landscape | b | PLC brand distribution | Chart | report.chart.charts | Y | bar | Section 3.1 PLC brands |
| 14 | Baseline Landscape | b | Instrument summary table | Table | report.table.table | N | - | Section 3.1 instrument summary |
| 15 | Baseline Landscape | b | Footer | Branding | report.layout.footerStrip | N | - | Input C defaults |
| 16 | Framework and Scoring | fw | Level definitions and scoring narrative | Narrative | report.text.narrativeBlock | N | - | Section 4 |
| 17 | Framework and Scoring | fw | Confidence tier list | Narrative | report.section.multiColumn | N | - | Section 4.3 |
| 18 | Framework and Scoring | fw | Footer | Branding | report.layout.footerStrip | N | - | Input C defaults |
| 19 | Results by Process Group | r | Process-group score table | Table | report.table.table | N | - | Section 5.1 |
| 20 | Results by Process Group | r | Average L1/L2/L3 score comparison | Chart | report.chart.charts | Y | bar | Section 5.1 computed averages |
| 21 | Results by Process Group | r | Action priorities narrative | Narrative | report.text.narrativeBlock | N | - | Section 5.3 |
| 22 | Results by Process Group | r | Footer | Branding | report.layout.footerStrip | N | - | Input C defaults |
| 23 | Plant-wide Findings | fnd | Findings 6.1-6.11 narrative | Narrative | report.text.narrativeBlock | N | - | Section 6 |
| 24 | Plant-wide Findings | fnd | Findings grouped by operating vs governance themes | Two-perspective narrative | report.section.multiColumn | N | - | Section 6 |
| 25 | Plant-wide Findings | fnd | Footer | Branding | report.layout.footerStrip | N | - | Input C defaults |
| 26 | Feasibility Implications | feas | Feasibility narrative by readiness tier | Narrative | report.text.narrativeBlock | N | - | Section 7 |
| 27 | Feasibility Implications | feas | Qualitative readiness distribution | Chart | report.metric.gaugeNarrativeGrid | Y | gauge | Section 7 classification synthesis |
| 28 | Feasibility Implications | feas | Footer | Branding | report.layout.footerStrip | N | - | Input C defaults |
| 29 | Technical Roadmap | rd | Roadmap principles and phase details narrative | Narrative | report.text.narrativeBlock | N | - | Section 8 |
| 30 | Technical Roadmap | rd | Phase sequence 0-3 | Process | report.list.squareNumberedList | N | - | Section 8.2-8.3 |
| 31 | Technical Roadmap | rd | Phase overview table | Table | report.table.table | N | - | Section 8.2 |
| 32 | Technical Roadmap | rd | Footer | Branding | report.layout.footerStrip | N | - | Input C defaults |
| 33 | Risks and Data Gaps | gaps | Risks, assumptions, and gaps narrative | Narrative | report.text.narrativeBlock | N | - | Section 9 |
| 34 | Risks and Data Gaps | gaps | Explicit gaps vs risks split | Two-perspective narrative | report.section.multiColumn | N | - | Section 9 |
| 35 | Risks and Data Gaps | gaps | Footer | Branding | report.layout.footerStrip | N | - | Input C defaults |

## Step 1 Reference Map

| Object Type | Code(s) Produced/Updated | Source | Used By | Notes |
| ----------- | ------------------------ | ------ | ------- | ----- |
| Plan Artifact | INA-PL-GRP-TPL-PLAN-001 | Input A/B/C | Step 2, Step 3 | Draft mode; source-derived uncertainty markers retained where applicable |

# Step 3.5 - Template Method (Deterministic Derivation)

## Source Document Summary

- Input source: `templates/report_template/template/Automation_Assessment_Report.md`
- Detected title: `Automation Assessment Report (L1-L3)`
- Detected top-level headings: `1` through `9` (Executive Summary to Risks, Assumptions, and Data Gaps)
- Detected major subsections:
  - `2.1` to `2.4` (scope/method controls)
  - `3.1` (automation inventory snapshot)
  - `4.1` to `4.3` (scoring model + confidence)
  - `5.1` and `5.1.1` to `5.1.8` (scores + process rationales)
  - `7.1` to `7.4` (feasibility tiers)
  - `8.1` to `8.5` (roadmap)
  - `9.1` to `9.3` (risks and gaps)

## Deterministic Mapping Decisions

| Source Block Pattern | Decision Rule | Component Type | JSON Path |
| --- | --- | --- | --- |
| Intro/section narrative paragraphs | Preserve paragraph order and flatten into deterministic text + bullets envelope | `report.text.narrativeBlock` | `pages[*].layout[*].data.content/bullets` |
| Two-perspective narrative (risk vs priority, in-scope vs out-of-scope) | Split into left/right columns with mirrored rich-text envelopes | `report.section.multiColumn` | `pages[*].layout[*].data.left/right` |
| Structured table content (scores, inventories, phase matrix) | Convert headers + rows into deterministic arrays | `report.table.table` | `pages[*].layout[*].data.headers/rows` |
| Category + count numeric series | Use categorical bar payload (`xAxis`, `series`) | `report.chart.charts` | `pages[*].layout[*].data` |
| Qualitative readiness distribution | Use segmented gauge payload | `report.metric.gaugeNarrativeGrid` | `pages[*].layout[*].data` |
| Coverage snapshot metrics | Present as KPI list with narrative context | `report.metric.resultMetricCard` | `pages[*].layout[*].data.metrics` |
| Roadmap phases | Ordered step list with title/description per item | `report.list.squareNumberedList` | `pages[*].layout[*].data.items` |
| Brand + page framing | Include watermark/header/footer wrappers per page | `report.layout.*` | `pages[*].layout[0..n]` |

## Section to Page/Layout Conversion

| Section Key | Source Heading | Page ID | Ordered Layout Types |
| --- | --- | --- | --- |
| `cov` | Cover (deterministic from metadata + title) | `cov-p01` | `report.layout.watermark`, `report.layout.headerBar`, `report.text.narrativeBlock`, `report.metric.resultMetricCard`, `report.layout.footerStrip` |
| `es` | `1. Executive Summary` | `es-p02` | `report.layout.watermark`, `report.layout.headerBar`, `report.text.narrativeBlock`, `report.section.multiColumn`, `report.layout.footerStrip` |
| `m` | `2. Scope and Methodology` | `m-p03` | `report.layout.watermark`, `report.layout.headerBar`, `report.text.narrativeBlock`, `report.section.multiColumn`, `report.layout.footerStrip` |
| `b` | `3. Green Plant Baseline` | `b-p04` | `report.layout.watermark`, `report.layout.headerBar`, `report.text.narrativeBlock`, `report.chart.charts`, `report.table.table`, `report.layout.footerStrip` |
| `fw` | `4. Assessment Framework and Scoring` | `fw-p05` | `report.layout.watermark`, `report.layout.headerBar`, `report.text.narrativeBlock`, `report.section.multiColumn`, `report.layout.footerStrip` |
| `r` | `5. Assessment Results by Process Group` | `r-p06` | `report.layout.watermark`, `report.layout.headerBar`, `report.table.table`, `report.chart.charts`, `report.text.narrativeBlock`, `report.layout.footerStrip` |
| `fnd` | `6. Findings (Plant-wide)` | `fnd-p07` | `report.layout.watermark`, `report.layout.headerBar`, `report.text.narrativeBlock`, `report.section.multiColumn`, `report.layout.footerStrip` |
| `feas` | `7. Feasibility Implications` | `feas-p08` | `report.layout.watermark`, `report.layout.headerBar`, `report.text.narrativeBlock`, `report.metric.gaugeNarrativeGrid`, `report.layout.footerStrip` |
| `rd` | `8. Recommended Technical Roadmap` | `rd-p09` | `report.layout.watermark`, `report.layout.headerBar`, `report.text.narrativeBlock`, `report.list.squareNumberedList`, `report.table.table`, `report.layout.footerStrip` |
| `gaps` | `9. Risks, Assumptions, and Data Gaps` | `gaps-p10` | `report.layout.watermark`, `report.layout.headerBar`, `report.text.narrativeBlock`, `report.section.multiColumn`, `report.layout.footerStrip` |

## ID Generation Log

- Page ID format: `{sectionKey}-p##`
- Component ID format: `{sectionKey}-{abbr}-{###}`
- Abbreviation set used: `wmk`, `hdr`, `lfo`, `kpi`, `ftr`, `2ct`, `bar`, `tbl`, `gau`, `wfs`
- Gapless sequence check:
  - `cov`: `001-005`
  - `es`: `001-005`
  - `m`: `001-005`
  - `b`: `001-006`
  - `fw`: `001-005`
  - `r`: `001-006`
  - `fnd`: `001-005`
  - `feas`: `001-005`
  - `rd`: `001-006`
  - `gaps`: `001-005`
- Validation run result: IDs are unique, lowercase, and gapless by page/section.

## Draft Placeholder and Missing Data Notes

- Placeholder retained from source inventory: PLC brand category `To validate` in baseline bar chart.
- Confidence tier includes `Very Low (TBD)` from source scoring definition.
- No additional placeholders introduced beyond source-provided uncertainty markers.

## Re-run Instructions (Deterministic)

1. Keep source input at `templates/report_template/template/Automation_Assessment_Report.md`.
2. Preserve section key mapping: `cov, es, m, b, fw, r, fnd, feas, rd, gaps`.
3. Rebuild `automation-audit_template.json` with the same component type inventory and ID rules.
4. Rebuild `automation-audit_template.html` ensuring registry covers all JSON `type` values and keeps `R.__unknown` fallback.
5. Copy JSON to `sample.json` for Storybook parity.
6. Re-run stories under `components/case-study/renderer/report_template/` consuming `sample.json` to verify page-level and component-type coverage.

## Compatibility Contract

- Expected root envelope:
  - `schemaVersion: number`
  - `document: object`
  - `pages: array`
- Expected page envelope:
  - `schemaVersion: number`
  - `pageId: string`
  - `pageTitle: string`
  - `layout: array`
- Required component fields for every layout node:
  - `type`
  - `id`
  - `data`
  - `meta`
- Supported rich-text tokens in renderer:
  - `h2`
  - `p`
  - `ul`
- File compatibility mapping:
  - `content.json` concept -> `automation-audit_template.json`
  - `template.html` concept -> `automation-audit_template.html`
  - `structure/schema contract` -> `automation-audit_template.md`
