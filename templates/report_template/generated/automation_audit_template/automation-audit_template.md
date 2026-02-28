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
| 1 | Cover | cov | Background watermark | Layout | layout.watermarkBackgroundPattern | N | - | Input C metadata + style default |
| 2 | Cover | cov | Brand header with report label | Branding | layout.headerBarBrand | N | - | Input C/AppCode |
| 3 | Cover | cov | Report title, scope, date, and objective summary | Narrative | content.longFormOverview | N | - | Input A heading and preamble |
| 4 | Cover | cov | Key context metrics (levels in scope, process groups, report sections) | KPI | kpi.card | N | - | Input A section list |
| 5 | Cover | cov | Contact/footer strip | Branding | layout.footerContactStrip | N | - | Input C defaults |
| 6 | Executive Summary | es | Executive narrative | Narrative | content.longFormOverview | N | - | Section 1 |
| 7 | Executive Summary | es | Risk themes and priorities split | Two-perspective narrative | content.twoColumnTextBlock | N | - | Section 1 |
| 8 | Executive Summary | es | Footer | Branding | layout.footerContactStrip | N | - | Input C defaults |
| 9 | Scope and Methodology | m | Scope, methodology, and controls narrative | Narrative | content.longFormOverview | N | - | Section 2 |
| 10 | Scope and Methodology | m | In-scope vs out-of-scope split | Two-perspective narrative | content.twoColumnTextBlock | N | - | Section 2.1 |
| 11 | Scope and Methodology | m | Footer | Branding | layout.footerContactStrip | N | - | Input C defaults |
| 12 | Baseline Landscape | b | Baseline narrative | Narrative | content.longFormOverview | N | - | Section 3 |
| 13 | Baseline Landscape | b | PLC brand distribution | Chart | chart.barCard | Y | bar | Section 3.1 PLC brands |
| 14 | Baseline Landscape | b | Instrument summary table | Table | table.simple | N | - | Section 3.1 instrument summary |
| 15 | Baseline Landscape | b | Footer | Branding | layout.footerContactStrip | N | - | Input C defaults |
| 16 | Framework and Scoring | fw | Level definitions and scoring narrative | Narrative | content.longFormOverview | N | - | Section 4 |
| 17 | Framework and Scoring | fw | Confidence tier list | Narrative | content.twoColumnTextBlock | N | - | Section 4.3 |
| 18 | Framework and Scoring | fw | Footer | Branding | layout.footerContactStrip | N | - | Input C defaults |
| 19 | Results by Process Group | r | Process-group score table | Table | table.simple | N | - | Section 5.1 |
| 20 | Results by Process Group | r | Average L1/L2/L3 score comparison | Chart | chart.barCard | Y | bar | Section 5.1 computed averages |
| 21 | Results by Process Group | r | Action priorities narrative | Narrative | content.longFormOverview | N | - | Section 5.3 |
| 22 | Results by Process Group | r | Footer | Branding | layout.footerContactStrip | N | - | Input C defaults |
| 23 | Plant-wide Findings | fnd | Findings 6.1-6.11 narrative | Narrative | content.longFormOverview | N | - | Section 6 |
| 24 | Plant-wide Findings | fnd | Findings grouped by operating vs governance themes | Two-perspective narrative | content.twoColumnTextBlock | N | - | Section 6 |
| 25 | Plant-wide Findings | fnd | Footer | Branding | layout.footerContactStrip | N | - | Input C defaults |
| 26 | Feasibility Implications | feas | Feasibility narrative by readiness tier | Narrative | content.longFormOverview | N | - | Section 7 |
| 27 | Feasibility Implications | feas | Qualitative readiness distribution | Chart | chart.gaugeSegments | Y | gauge | Section 7 classification synthesis |
| 28 | Feasibility Implications | feas | Footer | Branding | layout.footerContactStrip | N | - | Input C defaults |
| 29 | Technical Roadmap | rd | Roadmap principles and phase details narrative | Narrative | content.longFormOverview | N | - | Section 8 |
| 30 | Technical Roadmap | rd | Phase sequence 0-3 | Process | process.workflowStepper | N | - | Section 8.2-8.3 |
| 31 | Technical Roadmap | rd | Phase overview table | Table | table.simple | N | - | Section 8.2 |
| 32 | Technical Roadmap | rd | Footer | Branding | layout.footerContactStrip | N | - | Input C defaults |
| 33 | Risks and Data Gaps | gaps | Risks, assumptions, and gaps narrative | Narrative | content.longFormOverview | N | - | Section 9 |
| 34 | Risks and Data Gaps | gaps | Explicit gaps vs risks split | Two-perspective narrative | content.twoColumnTextBlock | N | - | Section 9 |
| 35 | Risks and Data Gaps | gaps | Footer | Branding | layout.footerContactStrip | N | - | Input C defaults |

## Step 1 Reference Map

| Object Type | Code(s) Produced/Updated | Source | Used By | Notes |
| ----------- | ------------------------ | ------ | ------- | ----- |
| Plan Artifact | INA-PL-GRP-TPL-PLAN-001 | Input A/B/C | Step 2, Step 3 | Draft mode; no placeholders required |
