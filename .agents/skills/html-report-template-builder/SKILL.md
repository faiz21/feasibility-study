---
name: html-report-template-builder
description: Convert a structured report into governed Step 1 plan + Step 2 JSON template + Step 3 single-file HTML renderer + Step 4 Storybook stories with deterministic IDs, component mapping, chart decisions, and mode-aware validation. Use when asked to transform report text into CMS-ready JSON/HTML, generate Storybook coverage for report components, run Draft/Update chained instructions, or audit renderer and story coverage.
---

# HTML Report Template Builder

## Overview

Use a **hybrid process** that aligns to the rendering concept in `rendering_concept_readme.md` while preserving existing operational behavior.

Concept-aligned phases:
1. Phase 1 - Content Parsing & Outline Generation
2. Phase 2 - Component Mapping & Intelligence
3. Phase 3 - Artifact Generation (Core)
4. Phase 4 - Client-Side Rendering & Theming

Operational deliverables remain deterministic and explicit:
1. Document Outline + Component Mapping Plan
2. CMS-ready JSON template
3. Single-file HTML renderer
4. Storybook stories for page-level and component coverage

Use this skill in exactly one operating mode per run: `Draft` or `Update`.

## Required Inputs

Collect inputs as markdown table, list, or free text:

1. Input A (mandatory): source report text with headings.
2. Input B (mandatory): approved component inventory (type keys).
3. Input C (mandatory in Update, optional in Draft): branding/meta (`AppCode`, logo/contact, locale).
4. Input D (optional): chart data blocks or numeric metrics.

Treat these as authoritative inventory sources unless user overrides:
- `/Users/faizafif/mv-project/feasibility-study/components/report/report_components_catalog.csv`
- `/Users/faizafif/mv-project/feasibility-study/components/case-study/registry.ts`

## Theme Token Standard (Mandatory)

Use this standardized token list for all client themes across report renderer and report content components. Do not invent alternate token names.

Core UI tokens:
- `primary`, `primary-foreground`
- `secondary`, `secondary-foreground`
- `accent`, `accent-foreground`
- `background`, `foreground`
- `card`, `card-foreground`
- `muted`, `muted-foreground`
- `border`, `input`, `ring`

Status tokens:
- `success`, `success-foreground`
- `warning`, `warning-foreground`
- `critical`, `critical-foreground`
- `info`, `info-foreground`

Report semantic tokens:
- `cover-background`, `cover-overlay`, `cover-title`, `cover-subtitle`
- `section-title`, `section-body`
- `kpi-value`, `kpi-label`
- `chart-grid`, `chart-axis`, `chart-series-1`, `chart-series-2`, `chart-series-3`
- `table-header`, `table-row`, `table-border`
- `tag-background`, `tag-foreground`
- `disabled-background`, `disabled-foreground`

If any token is missing in source theme input, populate deterministic fallback values and record the fallback map in `{template_name}_template.md`.

## Modes

Choose exactly one mode and state it before output.

1. Draft Mode
- Allow `To validate — ...` only for genuinely missing/ambiguous input.
- Permit chart placeholder series only when numeric data is absent.

2. Update Mode
- Reject placeholders.
- Stop on input contract violations.
- Stop when output requires unapproved component keys and user did not permit new-component proposal.

## Deterministic Rules

Apply these in all phases and steps:

1. Normalize whitespace while preserving paragraph order and heading text.
2. Order sections by numeric heading (`1..N`, then `X.1..X.n`, then deeper levels).
3. Split pages as one top-level section per page; split long sections (about 900-1200 words) only after completed subsection or table.
4. Apply selection precedence: narrative -> tables -> KPI -> charts -> quotes.
5. Use lowercase stable IDs, gapless by section:
- Page: `{sectionKey}-p##`
- Component: `{sectionKey}-{abbr}-{###}`
- Template: `{AppCode}-TPL-###`

Use abbreviations:
- `hdr`, `ftr`, `wmk`, `ttl`, `meta`, `lfo`, `2ct`, `ico`, `sst`, `tbl`, `bar`, `don`, `gau`, `wfs`, `plr`, `kpi`, `cdg`

Use section keys:
- `cov`, `es`, `m`, `b`, `fw`, `r`, `fnd`, `feas`, `rd`, `gaps`

## Required File Naming Convention

For every run, derive `template_name` from the document title or user-provided slug and write outputs with these exact names:
- `{template_name}_template.md`
- `{template_name}_template.json`
- `{template_name}_template.html`

Use lowercase kebab-case for `template_name` unless user explicitly requests a different style.

The markdown file is mandatory and must explain JSON derivation process from source content and compatibility constraints.

## Hybrid Workflow (Concept Phases + Operational Steps)

### Phase 1 - Content Parsing & Outline Generation (Operational Step 1)

Produce:
1. Document Outline Table
2. Component Mapping Plan

Parsing requirements:
- Parse markdown into structured outline (H1/H2/H3 + grouped blocks)
- Identify primitives: paragraph, list, table, quote
- Preserve deterministic section ordering and page split rules

Map blocks deterministically:
- Narrative -> `report.text.narrativeBlock`
- Two-perspective narrative -> `report.section.multiColumn`
- Tables -> `report.table.table`
- Priority lists (3-5) -> `list.goalsWithIcons` or `content.iconBulletsCard`
- Roadmap/phases -> `report.list.squareNumberedList` or `report.table.table`
- Problem/solution/result -> `pillars.challengeSolutionResult`

Add charts only when data-justified:
- Category + count -> `report.chart.charts`
- Two-part split -> `chart.donutCard`
- Maturity/comparison by category -> `report.chart.charts`
- Qualitative confidence only -> `report.metric.gaugeNarrativeGrid` (Draft placeholder allowed)

### Phase 2 - Component Mapping & Intelligence (Operational Step 1 continuation)

Keep deterministic mapping rules and add semantic-upgrade guidance:
- Intro/section narrative upgrades to `report.text.narrativeBlock` or `report.section.multiColumn`
- Metrics extraction may upgrade into `report.metric.resultMetricCard`, `report.chart.charts`, `chart.donutCard`, or `report.metric.gaugeNarrativeGrid`
- Table-like prose should upgrade into `report.table.table` when shape is stable

Enforce approved inventory only (Input B + authoritative registry sources).

### Phase 3 - Artifact Generation (Core) (Operational Steps 2 + 3 + 3.5)

Generate and save artifacts:

#### Step 2: JSON Template
Return one JSON block and save it as `{template_name}_template.json` with:
- `schemaVersion` (int)
- `document` (meta object)
- `theme.tokens` (all standardized tokens above; explicit values)
- `pages` (ordered array; each page includes `layout[]`)

Each component object must include:
- `type`, `id`, `data`, `meta`

Use this layout order on every page:
1. `report.layout.watermark` (optional, once)
2. `report.layout.headerBar`
3. mapped content components
4. `report.layout.footerStrip`

Rich text blocks are limited to `h2`, `p`, `ul` unless inventory explicitly permits more.

#### Step 3: HTML Renderer Template
Return one `.html` file saved as `{template_name}_template.html` that:
1. Reads `window.__DOC__`
2. Renders `pages[]` sequentially
3. Uses registry dispatch `R[type] = rendererFn`
4. Implements safe rich-text renderer (`h2`, `p`, `ul`)
5. Includes safe unknown fallback (quality gate still requires none used)

If no chart engine is included, render chart cards as styled placeholders while preserving data payload.

#### Step 3.5: Template Method Markdown
Return one markdown file saved as `{template_name}_template.md` that documents:
1. Input document summary and detected headings/subheadings
2. Deterministic mapping decisions from source blocks to component types
3. Section/subsection to JSON page/layout conversion
4. ID generation log (section key + abbreviations + gapless sequence)
5. Any `To validate` placeholders (Draft only) and missing data notes
6. Re-run instructions for deterministic regeneration
7. Compatibility contract:
   - expected block envelope
   - required fields (`type`, `id`, `data`, `meta`)
   - supported rich-text tokens (`h2`, `p`, `ul`)

Concept mapping note for documentation:
- `template.html` concept -> `{template_name}_template.html`
- `content.json` concept -> `{template_name}_template.json`
- structure/schema contract -> `{template_name}_template.md`

### Phase 4 - Client-Side Rendering & Theming (Operational Step 4 extension)

After artifact generation, produce Storybook artifacts and compatibility checks.

#### Step 4: Storybook Stories
Return Storybook artifacts:
1. Story file(s) in CSF3 format for components used in JSON and renderer registry
2. Save generated template stories under:
   - `/Users/faizafif/mv-project/feasibility-study/components/case-study/renderer/report_template/`
3. Use Storybook title namespace:
   - `report_template/<Template or Client Name>`
4. Runtime renderer requirement:
   - Use a dedicated renderer in `components/case-study/renderer/report_template/` that maps generated JSON blocks to concrete components from `/Users/faizafif/mv-project/feasibility-study/components/report/**`.
   - Do not use `CASE_STUDY_RENDERERS` for `report_template/*` stories unless explicitly requested by user.
5. At minimum include:
- one page-level renderer story (full-page render from sample payload)
- one grouped or per-type component coverage story
6. Story args must reference deterministic sample data derived from Step 2 JSON
7. Add `Default` story and at least one edge-case variant for unknown/missing data safety
8. Stories should consume `sample.json` from each generated template folder

Prefer existing patterns in:
- `/Users/faizafif/mv-project/feasibility-study/components/case-study/renderer/report_template/**/*.stories.tsx`
- `/Users/faizafif/mv-project/feasibility-study/components/report/**/*.stories.tsx`

## Quality Gates

Always run these checks before final output:

1. Mode compliance
- Draft: placeholders only where input missing
- Update: no placeholders

2. Input contract integrity
- Input B is present and unambiguous
- Update requires non-empty `AppCode`

3. Parsing integrity gate
- Headings and block grouping are preserved from source markdown

4. Mapping integrity gate
- Each mapped block is traceable in markdown rationale

5. Artifact contract gate
- `{template_name}_template.json` validates required envelope
- `{template_name}_template.html` implements render pipeline and safe fallback
- `{template_name}_template.md` includes derivation + ID log + rerun instructions + compatibility contract

6. Schema/ordering integrity
- Section/page order deterministic
- Output filenames exactly match `{template_name}_template.md/.json/.html`

7. ID integrity
- IDs are stable, unique, lowercase, gapless by section

8. Client-side compatibility gate
- JSON types are fully covered by renderer registry
- Fallback exists but should not be used for known mapped types

9. Theme/token gate
- JSON includes all standardized theme tokens (`theme.tokens`)
- Renderer maps CSS variables directly from standardized token names
- Missing input tokens are replaced with deterministic defaults and logged in template markdown

10. Storybook integrity gate
- Story coverage includes page renderer + component coverage + edge-case safety
- Stories follow CSF3 and compile with existing Storybook config
- Stories consume `sample.json` and avoid invalid payload guard failures

If any gate fails in Update mode, stop and report blocking violations.

## Output Templates

Use `/Users/faizafif/mv-project/feasibility-study/.agents/skills/html-report-template-builder/references/templates.md` for output skeletons:
- Step 1 tables
- Step 2 component envelope and JSON shape
- Step 3 HTML renderer scaffold
- Step 4 Storybook story scaffold
- Prompt pack variants (full run, step-only, audit, new-component proposal)
