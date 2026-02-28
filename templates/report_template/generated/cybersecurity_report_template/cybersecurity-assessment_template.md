Mode: Draft

# Step 1 - Document Outline and Component Mapping Plan

## Document Outline Table

| Order | Section ID | Heading | Subsections (ordered list) | Notes |
| ----: | ---------- | ------- | -------------------------- | ----- |
| 0 | cov | Cover | Report metadata, score, scope | Deterministic cover from report preamble |
| 1 | es | 1. Executive Summary | Maturity summary, key risks, business exposure | Narrative + risk split |
| 2 | m | 2. Overall Score Interpretation | Risk-tier table and interpretation | Includes score placement |
| 3 | fnd | 3. Domain-by-Domain Analysis | 3.1-3.14 domain strengths/gaps/risks | Condensed multi-domain narrative |
| 4 | r | 4. Risk Prioritization | Top 5 critical weaknesses | Table + bar chart |
| 5 | b | 5. Maturity Classification | Layer status and overall level | Table + summary narrative |
| 6 | feas | 6. Business Risk Implications | Operational risk impacts for smelting/power/casting | Narrative |
| 7 | rd | 7. Recommended Remediation Roadmap | Phase 1-3 actions | Workflow + narrative |
| 8 | gaps | 8. Conclusion | Structural fragility, urgent priorities | Closing summary |

## Component Mapping Plan

| Order | PageTitle | Section ID | Block Summary | BlockType | Component Type | Needs Chart? (Y/N) | Chart Type | Data Source |
| ----: | --------- | ---------- | ------------- | --------- | -------------- | ------------------ | ---------- | ----------- |
| 1 | Cover | cov | Watermark background | Layout | layout.watermarkBackgroundPattern | N | - | Template style |
| 2 | Cover | cov | Header brand and report name | Branding | layout.headerBarBrand | N | - | Report title |
| 3 | Cover | cov | Scope and baseline context | Narrative | content.longFormOverview | N | - | Report preamble |
| 4 | Cover | cov | Final score KPI | KPI | kpi.card | N | - | Final score 34.29 |
| 5 | Cover | cov | Footer metadata | Branding | layout.footerContactStrip | N | - | Client/scope/date |
| 6 | Executive Summary | es | Summary narrative | Narrative | content.longFormOverview | N | - | Section 1 |
| 7 | Executive Summary | es | Primary risks vs consequences | Two-perspective narrative | content.twoColumnTextBlock | N | - | Section 1 |
| 8 | Executive Summary | es | Footer | Branding | layout.footerContactStrip | N | - | Section context |
| 9 | Score Interpretation | m | Tier table | Table | table.simple | N | - | Section 2 table |
| 10 | Score Interpretation | m | Score interpretation narrative | Narrative | content.longFormOverview | N | - | Section 2 |
| 11 | Score Interpretation | m | Footer | Branding | layout.footerContactStrip | N | - | Section context |
| 12 | Domain Analysis | fnd | Domain findings condensed summary | Narrative | content.longFormOverview | N | - | Section 3 |
| 13 | Domain Analysis | fnd | Weakest domains visualization | Chart | chart.barCard | Y | bar | Section 3 domain scores |
| 14 | Domain Analysis | fnd | Stronger domains visualization | Chart | chart.barCard | Y | bar | Section 3 domain scores |
| 15 | Domain Analysis | fnd | Footer | Branding | layout.footerContactStrip | N | - | Section context |
| 16 | Risk Prioritization | r | Top-5 weakness table | Table | table.simple | N | - | Section 4 |
| 17 | Risk Prioritization | r | Top-5 score comparison | Chart | chart.barCard | Y | bar | Section 4 |
| 18 | Risk Prioritization | r | Footer | Branding | layout.footerContactStrip | N | - | Section context |
| 19 | Maturity Classification | b | Layer maturity table | Table | table.simple | N | - | Section 5 |
| 20 | Maturity Classification | b | Overall level narrative | Narrative | content.longFormOverview | N | - | Section 5 |
| 21 | Maturity Classification | b | Footer | Branding | layout.footerContactStrip | N | - | Section context |
| 22 | Business Risk Implications | feas | Business impact narrative | Narrative | content.longFormOverview | N | - | Section 6 |
| 23 | Business Risk Implications | feas | Qualitative impact mix | Chart | chart.gaugeSegments | Y | gauge | Section 6 synthesis |
| 24 | Business Risk Implications | feas | Footer | Branding | layout.footerContactStrip | N | - | Section context |
| 25 | Remediation Roadmap | rd | Phase sequence | Process | process.workflowStepper | N | - | Section 7 |
| 26 | Remediation Roadmap | rd | Roadmap details summary | Narrative | content.longFormOverview | N | - | Section 7 |
| 27 | Remediation Roadmap | rd | Footer | Branding | layout.footerContactStrip | N | - | Section context |
| 28 | Conclusion | gaps | Closing narrative | Narrative | content.longFormOverview | N | - | Section 8 |
| 29 | Conclusion | gaps | Footer | Branding | layout.footerContactStrip | N | - | Section context |

## Step 1 Reference Map

| Object Type | Code(s) Produced/Updated | Source | Used By | Notes |
| ----------- | ------------------------ | ------ | ------- | ----- |
| Plan Artifact | CYB-INALUM-TPL-PLAN-001 | Input A/B | Step 2, Step 3 | Draft mode, no placeholders required |
