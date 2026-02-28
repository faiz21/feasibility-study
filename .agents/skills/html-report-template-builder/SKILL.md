---
name: html-report-template-builder
description: Convert a structured report into governed Step 1 plan + Step 2 JSON template + Step 3 single-file HTML renderer + Step 4 Storybook stories with deterministic IDs, component mapping, chart decisions, and mode-aware validation. Use when asked to transform report text into CMS-ready JSON/HTML, generate Storybook coverage for report components, run Draft/Update chained instructions, or audit renderer and story coverage.
---

# HTML Report Template Builder

## Overview

Generate a deterministic 4-step deliverable chain:
1. Document Outline + Component Mapping Plan
2. CMS-ready JSON template
3. Single-file HTML renderer that covers every used component type
4. Storybook stories for used renderer components and page-level preview

Use this skill in exactly one operating mode per run: `Draft` or `Update`.

## Required Inputs

Collect inputs as markdown table, list, or free text:

1. Input A (mandatory): source report text with headings.
2. Input B (mandatory): approved component inventory (type keys).
3. Input C (mandatory in Update, optional in Draft): branding/meta (`AppCode`, logo/contact, locale).
4. Input D (optional): chart data blocks or numeric metrics.

Treat these as authoritative inventory sources unless user overrides:
- `/Users/faizafif/mv-project/feasibility-study/components/component_list.md`
- `/Users/faizafif/mv-project/feasibility-study/components/case-study/registry.ts`

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

Apply these in all steps:

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

## Step Workflow

### Step 1: Decompose and Plan

Produce:
1. Document Outline Table
2. Component Mapping Plan

Map blocks deterministically:
- Narrative -> `content.longFormOverview`
- Two-perspective narrative -> `content.twoColumnTextBlock`
- Tables -> `table.simple`
- Priority lists (3-5) -> `list.goalsWithIcons` or `content.iconBulletsCard`
- Roadmap/phases -> `process.workflowStepper` or `table.simple`
- Problem/solution/result -> `pillars.challengeSolutionResult`

Add charts only when data-justified:
- Category + count -> `chart.barCard`
- Two-part split -> `chart.donutCard`
- Maturity/comparison by category -> `chart.barCard`
- Qualitative confidence only -> `chart.gaugeSegments` (Draft placeholder allowed)

### Required File Naming Convention

For every run, derive `template_name` from the document title or user-provided slug and write outputs with these exact names:
- `{template_name}_template.md`
- `{template_name}_template.json`
- `{template_name}_template.html`

Use lowercase kebab-case for `template_name` unless user explicitly requests a different style.
The markdown file is mandatory and must explain the JSON derivation process from the actual source document content.

### Step 2: Generate JSON Template

Return one JSON block and save it as `{template_name}_template.json` with:
- `schemaVersion` (int)
- `document` (meta object)
- `pages` (ordered array; each page includes `layout[]`)

Each component object must include:
- `type`, `id`, `data`, `meta`

Use this layout order on every page:
1. `layout.watermarkBackgroundPattern` (optional, once)
2. `layout.headerBarBrand`
3. mapped content components
4. `layout.footerContactStrip`

Rich text blocks are limited to `h2`, `p`, `ul` unless inventory explicitly permits more.

### Step 3: Generate HTML Renderer Template

Return one `.html` file saved as `{template_name}_template.html` that:
1. Reads `window.__DOC__`
2. Renders `pages[]` sequentially
3. Uses registry dispatch `R[type] = rendererFn`
4. Implements safe rich-text renderer (`h2`, `p`, `ul`)
5. Includes safe unknown fallback (quality gate still requires none used)

If no chart engine is included, render chart cards as styled placeholders while preserving data payload.

### Step 3.5: Generate Template Method Markdown

Return one markdown file saved as `{template_name}_template.md` that documents:
1. Input document summary and detected headings/subheadings.
2. Deterministic mapping decisions from document blocks to component types.
3. How each section/subsection was converted into JSON pages/layout blocks.
4. ID generation log (section key + component abbreviations + gapless sequence).
5. Any `To validate` placeholders (Draft only) and missing data notes.
6. Re-run instructions for producing the same JSON from an updated source document.

### Step 4: Generate Storybook Stories

Return Storybook artifacts after HTML generation:
1. Story file(s) in CSF3 format for components used in Step 2 JSON and Step 3 registry.
2. At minimum include:
- one page-level renderer story (full-page render from sample `window.__DOC__`)
- one story per unique component type used in JSON (or a grouped story module if project convention requires grouping)
3. Story args must reference deterministic sample data derived from Step 2 JSON.
4. Add `Default` story per file and include at least one edge-case variant for unknown/missing data safety.

Prefer existing patterns in:
- `/Users/faizafif/mv-project/feasibility-study/components/case-study/**/*.stories.tsx`

## Quality Gates

Always run these checks before final output:

1. Mode compliance
- Draft: placeholders only where input missing
- Update: no placeholders

2. Input contract integrity
- Input B is present and unambiguous
- Update requires non-empty `AppCode`

3. Schema/ordering integrity
- Step outputs match declared format
- Section/page order is deterministic
- Output filenames exactly match `{template_name}_template.md/.json/.html`

4. ID integrity
- IDs are stable, unique, lowercase, gapless by section

5. Registry integrity
- HTML registry covers 100% of component types used in JSON

6. Storybook integrity
- Story coverage includes all used component types and page renderer
- Stories follow CSF3 and compile with existing Storybook config
- Story sample payloads stay consistent with Step 2 schema

If any gate fails in Update mode, stop and report blocking violations.

## Output Templates

Use `/Users/faizafif/mv-project/feasibility-study/.agents/skills/html-report-template-builder/references/templates.md` for exact output skeletons:
- Step 1 tables
- Step 2 component envelope and JSON shape
- Step 3 HTML renderer scaffold
- Step 4 Storybook story scaffold
- Prompt pack variants (full run, step-only, audit, new-component proposal)
