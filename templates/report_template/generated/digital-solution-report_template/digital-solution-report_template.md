Mode: Draft
Template Name: digital-solution-report
Template Code: INA-SOL-02-DSR-TPL-001

# digital-solution-report_template.md

## 1) Input document summary and detected headings

### Source summary
Source describes solution blueprint for **INA-SOL-02 — MES Planning & Scheduling** for INALUM, focused on integrated finite planning and scheduling across carbon, potline, and casting.

### Detected top-level headings and ordered blocks
1. Solution Identification
2. Background / Context
3. Purpose
4. Objectives
5. Scope Included
6. Out of Scope
7. Open Questions
8. Appendix A + Reference Map markers
9. Module table
10. Feature table
11. User Roles table
12. Data Point table
13. Integration Points table
14. R&R Matrix table
15. Solution KPI table
16. Glossaries table

## 2) Deterministic mapping decisions

### Mapping rules applied
- Narrative paragraphs -> `content.longFormOverview`
- Two-perspective split (included vs excluded) -> `content.twoColumnTextBlock`
- Structured tabular blocks -> `table.simple`
- Sequenced operational flow -> `process.workflowStepper`
- Quantified category distributions -> `chart.barCard`
- Summary KPI snapshot -> `kpi.card`
- Repeated page framing -> `layout.headerBarBrand` + `layout.footerContactStrip` (+ `layout.watermarkBackgroundPattern`)

### Chart decisions (data-justified)
- `chart.barCard` used for coverage snapshots derived from provided counts:
  - Modules by count (6)
  - Features by count (23)
  - User roles by function cluster summary
  - Data mappings by direction summary (input/output/bidirectional)

No non-justified chart placeholders introduced.

## 3) Section-to-page conversion into JSON layout blocks

### Page split policy
One top-level logical section per page, using section keys and deterministic order:
- `cov`: cover and solution identity
- `es`: context, purpose, objectives
- `m`: scope included, out-of-scope, open questions
- `b`: module architecture
- `fw`: feature architecture
- `r`: user role model
- `fnd`: data mappings
- `feas`: integration points
- `rd`: R&R matrix + KPI framework
- `gaps`: glossary and validation notes

### Page composition order enforced
Each page layout follows:
1. `layout.watermarkBackgroundPattern` (optional, used here)
2. `layout.headerBarBrand`
3. Mapped content blocks
4. `layout.footerContactStrip`

## 4) ID generation log (section key + abbreviation + sequence)

### Page IDs
- `cov-p01`, `es-p02`, `m-p03`, `b-p04`, `fw-p05`, `r-p06`, `fnd-p07`, `feas-p08`, `rd-p09`, `gaps-p10`

### Component ID pattern
`{sectionKey}-{abbr}-{###}` with gapless sequence per section.

Examples:
- Cover: `cov-wmk-001`, `cov-hdr-002`, `cov-lfo-003`, `cov-kpi-004`, `cov-ftr-005`
- Executive summary: `es-wmk-001`, `es-hdr-002`, `es-lfo-003`, `es-ftr-004`
- Scope/method page: `m-wmk-001`, `m-hdr-002`, `m-2ct-003`, `m-lfo-004`, `m-ftr-005`

All IDs are lowercase and unique.

## 5) To validate placeholders and missing data notes

Draft-mode validation notes preserved from source intent:
- Planning horizon and granularity values: **To validate**
- Sequencing freeze windows and resequencing governance: **To validate**
- Exact integration ownership boundaries (ERP/EXT-EXEC/EXT-HR/EXT-MGMT): **To validate**
- Full KPI calculation definitions (manual re-keying rate, adherence formulas): **To validate**

These were represented as narrative notes; no invalid schema placeholders were added.

## 6) Re-run instructions

To regenerate deterministically from updated source text:
1. Keep `template_name = mes-planning-scheduling`.
2. Re-parse headings in source order, preserving paragraph ordering.
3. Re-apply mapping precedence:
   - narrative -> table -> KPI -> chart -> workflow
4. Maintain section/page order: `cov, es, m, b, fw, r, fnd, feas, rd, gaps`.
5. Re-generate IDs per section from `001` with same abbreviations.
6. Rebuild:
   - `digital-solution-report_template.json`
   - `digital-solution-report_template.html`
   - Storybook file aligned to JSON path and schema.

## Step 1 Tables

### Document Outline Table

| Order | Section ID | Heading | Subsections (ordered list) | Notes |
| ----: | ---------- | ------- | -------------------------- | ----- |
| 0 | cov | Solution Identification | code, name, description, target intent | Cover context page |
| 1 | es | Background + Purpose + Objectives | background, purpose, objective bullets | Narrative consolidation |
| 2 | m | Scope Definition | included scope, out-of-scope, open questions | Includes To validate list |
| 3 | b | Module Architecture | INA-MOD-02-001..006 | Module table rendered |
| 4 | fw | Feature Architecture | INA-FTR-02-001..023 | Feature table summary + chart |
| 5 | r | User Role Model | INA-RLM-04-* | Role table summary |
| 6 | fnd | Data Mapping | INA-DSM-02-* | Data direction summary |
| 7 | feas | Integration Points | INA-IP-02-* | Integration registry summary |
| 8 | rd | Governance & KPI | INA-RRM-02-* + INA-KPI-* | Workflow + KPI table |
| 9 | gaps | Glossary & Validation | INA-GLS-02-* + TBD notes | Closing control notes |

### Component Mapping Plan

| Order | PageTitle | Section ID | Block Summary | BlockType | Component Type | Needs Chart? (Y/N) | Chart Type | Data Source |
| ----: | --------- | ---------- | ------------- | --------- | -------------- | ------------------ | ---------- | ----------- |
| 1 | Cover | cov | Solution context and KPI snapshot | Narrative + KPI | content.longFormOverview + kpi.card | N | - | Solution detail text |
| 2 | Executive Summary | es | Background, purpose, objectives | Narrative | content.longFormOverview | N | - | Sections 2-4 |
| 3 | Scope | m | Included vs excluded + open questions | Two-column + narrative | content.twoColumnTextBlock + content.longFormOverview | N | - | Sections 5-7 |
| 4 | Modules | b | Module catalog | Table | table.simple | N | - | Module table |
| 5 | Features | fw | Feature catalog summary | Table + chart | table.simple + chart.barCard | Y | bar | Feature table |
| 6 | Roles | r | Role model summary | Table + chart | table.simple + chart.barCard | Y | bar | User role table |
| 7 | Data Mappings | fnd | DSM summary | Table + chart | table.simple + chart.barCard | Y | bar | Data point table |
| 8 | Integration Points | feas | Interface registry summary | Table | table.simple | N | - | Integration point table |
| 9 | Governance & KPI | rd | R&R + KPI + flow | Table + workflow | table.simple + process.workflowStepper | N | - | R&R + KPI table |
| 10 | Glossary | gaps | Glossary + validation notes | Narrative + table | content.longFormOverview + table.simple | N | - | Glossary table |
