# Task Plan — Admin Master Data Management

## Goal
Implement admin master-data management flows for clients, report types, report template pages, client template access, and client report assignment.

## Phases
1. **Discovery & Scope** *(complete)*
   - Review current admin pages, schema, and reusable UI patterns
   - Map required UX flow to existing database model

2. **Admin Flow Build** *(complete)*
   - Add/upgrade pages for:
     - Clients management
     - Report types management
     - Report type page manager
     - Client access mapping
     - Client report assignment
   - Add server actions for create/edit/delete/assign/unassign

3. **Navigation + UX coherence** *(complete)*
   - Update admin sidebar links and page headers
   - Add empty/error states and destructive warnings

4. **Validation & Handoff** *(complete)*
   - Run lint
   - Capture outcomes and known gaps

## Decisions
- Use server actions inside route pages for fast implementation and SSR consistency.
- Use current schema (`client_report_type_access`, `client_reports`, `report_page_templates`) without adding breaking DB changes unless required.

## Errors Encountered
| Error | Attempt | Resolution |
|---|---|---|
| None yet | - | - |

---

# Task Plan — Report Key Metrics Card (Multi Variant)

## Goal
Create a single reusable report component that matches the provided "Key metrics" card design and supports multiple variants in Storybook.

## Phases
1. **Plan & Confirm Spec** *(complete)*
   - Confirm component name, action, target path, grid spans, palette strategy, and story scope
2. **Implementation** *(complete)*
   - Create component under `components/report`
   - Add reusable variant + size handling
3. **Storybook Sync** *(complete)*
   - Add colocated CSF3 stories with default + meaningful variants in 12-grid wrappers
4. **Validation & Handoff** *(in progress)*
   - Run targeted lint/type checks
   - Report assumptions and outcomes

## Confirmed Component Spec
- Name: `sliceddescriptive&keyMettric` (implemented as `SlicedDescriptiveKeyMettric` in code-safe form)
- Action: `create`
- Target path: `components/report/sliced-descriptive-key-mettric.tsx`
- Story path: `components/report/sliced-descriptive-key-mettric.stories.tsx`
- 12-grid spans:
  - mobile: `col-span-12`
  - tablet: `md:col-span-6`
  - desktop: `lg:col-span-6` for left/right pairs, `lg:col-span-12` for full-width usage
- Color strategy: support `color_palette` keys with defaults (`primary`, `secondary`, `accent`, `background`, `text`)
- Story scope:
  - left variant
  - right variant
  - dark theme left/right
  - light theme left/right
  - palette override example

---

# Task Plan — Service Category Icon Set (Image Continuation)

## Goal
Create a reusable multi-component report section matching the provided service-category image with circular icons and centered labels.

## Phases
1. **Plan & Confirm Spec** *(complete)*
   - Confirm component list, names, file paths, variants, and story scope
2. **Implementation** *(complete)*
   - Create/update components under `components/report`
3. **Storybook Sync** *(complete)*
   - Add left/right and color variant stories in 12-column grid wrappers
4. **Validation & Handoff** *(complete)*
   - Run targeted lint
   - Summarize assumptions and results

## Confirmed Component Specs
- Name: `ServiceCategoryItem`
  - Action: `create`
  - Target path: `components/report/service-category-item.tsx`
  - Sizing: base `col-span-12`, `sm:col-span-6`, `md:col-span-4`
  - Color strategy: `color_palette` defaults + explicit tone (`blue`, `charcoal`, `gray`)
  - Story scope: tone variants + icon fallback
- Name: `ServiceCategoryGrid`
  - Action: `create`
  - Target path: `components/report/service-category-grid.tsx`
  - Sizing: base `col-span-12`, `md:col-span-6`, `lg:col-span-6` (left/right arrangement)
  - Color strategy: inherit item palette strategy
  - Story scope: left group, right group, mixed-tone set, palette override

---

# Task Plan — Client Branding In Report Templates

## Goal
Add client-level branding fields (logo + color palette) in client management and expose those values to report template rendering.

## Phases
1. **Discovery & Design** *(complete)*
   - Confirm current `clients` schema and admin client form fields
   - Confirm report render pipeline and template placeholder model

2. **Schema + Admin Client Updates** *(complete)*
   - Add migration for `clients.logo_url` and `clients.color_palette`
   - Extend `/admin/clients` create/edit actions + forms
   - Show branding preview in client table

3. **Template Render Branding Injection** *(complete)*
   - Load client branding in report detail page
   - Inject branding object into template render payload
   - Keep sensible defaults for missing branding

4. **Validation & Handoff** *(complete)*
   - Run lint for changed files
   - Update findings and progress logs

## Decisions
- Store palette as `jsonb` to keep one extensible field and avoid repeated migrations.
- Expose both `client.*` and `theme.*` placeholders to simplify HTML template authoring.

## Errors Encountered
| Error | Attempt | Resolution |
|---|---|---|
| None yet | - | - |

---

# Task Plan — Challenge/Solution/Results + Packages + Workflow/Highlights

## Goal
Create a reusable multi-component report composition matching the provided image: top triptych cards, package cards row, and workflow/highlights dual cards.

## Phases
1. **Plan & Confirm Spec** *(complete)*
   - Confirm final component list and per-component details
2. **Implementation** *(complete)*
   - Create/update components under `components/report`
3. **Storybook Sync** *(complete)*
   - Add CSF3 stories with grid-context variants
4. **Validation & Handoff** *(complete)*
   - Run targeted lint checks and summarize outputs

## Confirmed Component Specs
- Name: `ChallengeSolutionResultsCards`
  - Action: `create`
  - Target: `components/report/challenge-solution-results-cards.tsx`
  - 12-grid: base `12`, md `12`, lg `12` (internally 3 equal cards)
  - Color: `color_palette` defaults + per-card tone (`gray`, `charcoal`, `blue`)
  - Stories: default + long-content + palette override
- Name: `PackageCards`
  - Action: `create`
  - Target: `components/report/package-cards.tsx`
  - 12-grid: base `12`, md `12`, lg `12` (internally 3 equal cards)
  - Color: `color_palette` defaults + emphasis badge styling
  - Stories: default + 2-card variant + custom pricing labels
- Name: `NumberedList`
  - Action: `create`
  - Target: `components/report/numbered-list.tsx`
  - 12-grid: base `12`, md `12`, lg `6`
  - Color: `color_palette` defaults
  - Stories: default + compact steps
- Name: `Checklist`
  - Action: `create`
  - Target: `components/report/checklist.tsx`
  - 12-grid: base `12`, md `12`, lg `6`
  - Color: `color_palette` defaults
  - Stories: default + checklist-only + palette override
- Name: `ServiceOperationsShowcaseSection`
  - Action: `create`
  - Target: `components/report/service-operations-showcase-section.tsx`
  - 12-grid: base `12`, md `12`, lg `12`
  - Color: delegates to child components
  - Stories: full image-like composition

---

# Task Plan — Impact KPI + Program Cards Layout (New Screenshot)

## Goal
Create reusable report components matching the provided impact dashboard screenshot (top KPI icons + multi-card program metrics), with Storybook coverage and explicit 12-grid sizing.

## Phases
1. **Plan & Confirm Spec** *(in progress)*
   - Propose per-component spec from screenshot
   - Confirm names, class, sizing, color strategy, and story scope with user
2. **Implementation** *(pending)*
   - Create confirmed components in `components/report`
3. **Storybook Sync** *(pending)*
   - Add/align CSF3 stories for default + variants
4. **Validation & Handoff** *(pending)*
   - Run targeted lint checks
   - Summarize assumptions and outcomes

## Draft Component Specs (Pending User Confirmation)
- Name: `ImpactKpiStrip`
  - Action: `create`
  - Classification: `block`
  - Target: `components/report/impact-kpi-strip.tsx`
  - 12-grid: base `12`, md `12`, lg `12` (internally 3 KPI items)
  - Color: `color_palette` defaults + optional override
  - Stories: default, compact size, palette override
- Name: `ProgramImpactCard`
  - Action: `create`
  - Classification: `highlight`
  - Target: `components/report/program-impact-card.tsx`
  - 12-grid: base `12`, md `12`, lg `8` (wide variant) / `lg:4` (narrow variant)
  - Color: `color_palette` defaults + card tone variants
  - Stories: education-style wide card, narrow stacked metrics
- Name: `ProgressStatCard`
  - Action: `create`
  - Classification: `highlight`
  - Target: `components/report/progress-stat-card.tsx`
  - 12-grid: base `12`, md `12`, lg `6`
  - Color: `color_palette` defaults + bar fill/muted track tokens
  - Stories: default, alternate percentages, palette override

---

# Task Plan — Sales Analysis Infographic (6 Components)

## Goal
Implement exactly 6 reusable report components matching the uploaded infographic layout.

## Phases
1. **Plan & Confirm Spec** *(in progress)*
   - Confirm the exact 6 component names and classifications
2. **Implementation** *(pending)*
   - Create components under `components/report`
3. **Storybook Sync** *(pending)*
   - Add CSF3 stories in 12-column grid wrappers
4. **Validation & Handoff** *(pending)*
   - Run targeted lint checks and summarize

## Draft 6-Component Spec (Pending User Confirmation)
1. `SalesAnalysisIntro`
   - Action: `create`
   - Classification: `infographic`
   - Path: `components/report/sales-analysis-intro.tsx`
   - Grid spans: `12 / 12 / 12`
  - Story scope: default, long bullet copy
2. `ProfitExpenseKPI`
   - Action: `create`
   - Classification: `block`
  - Path: `components/report/profit-expense-kpi.tsx`
  - Grid spans: `12 / 6 / 6`
  - Story scope: default, custom percentage values

---

# Task Plan — Client-Side Reader App (Domain-Matched Access)

## Goal
Implement a client-facing app based on `client_interaction_concept.md` with this flow:
1) login + domain/company validation,
2) report type landing cards with counts,
3) report list by type,
4) report reading page,
5) right-side page navigation (compact code → hover reveal name),
6) reading analytics + rating.

## Architecture Decisions (Next.js + Supabase)
- Use App Router Server Components by default for data fetch and route rendering.
- Keep auth/session enforcement on server (`requireRole("client")`) and middleware.
- Use server actions for mutations (rating submit, progress writes where needed).
- Reader app only shows published reports assigned to the reader’s client.
- Domain match is enforced after login against `clients.domain` and persisted to profile client scope.

## Phases
1. **Access Control Baseline** *(complete)*
   - Verify middleware/session flow and client role protection.
   - Add/confirm post-login domain-match gate (email domain vs `clients.domain`).
   - Redirect non-matching users to auth error page with clear guidance.

2. **Landing: Report Types** *(complete)*
   - Build client landing page with report type cards from `client_report_type_access`.
   - Show per-card report counts (published + accessible + assigned).
   - Add empty states for no access/no reports.

3. **Report List by Type** *(complete)*
   - Build route for selected report type listing.
   - Filter by `client_id`, selected `report_type_template_id`, and `reports.status = published`.
   - Include entity metadata and publish dates.

4. **Reader Experience + Right Rail Nav** *(complete)*
   - Enhance reading page to support right-side page rail:
     - compact circles/code by default
     - reveal page names on hover
     - jump-to-page behavior
   - Ensure mobile fallback nav (drawer/stack).

5. **Reading Analytics + Rating** *(complete)*
   - Track report/page interactions (`report_page_activity`, `report_resume`).
   - Implement rating/review submit path (`report_ratings`) in reader UI.
   - Surface completion/rated state in reader footer/sidebar.

6. **QA + Hardening** *(complete)*
   - Route-level loading/error/empty states.
   - Permissions regression checks.
   - Lint + smoke test core reader routes.

## Proposed Route/File Plan
- `app/reports/page.tsx` — report type landing cards (or split to dedicated landing route if needed)
- `app/reports/[reportTypeId]/page.tsx` — reports list for selected type (new)
- `app/reports/[reportId]/page.tsx` — reader page + right-side page nav
- `components/portal/report-viewer.tsx` — right-rail nav interaction updates
- `app/auth/post-login/route.ts` or equivalent redirect guard — domain match enforcement
- `lib/portal/auth.ts` / `middleware.ts` — policy integration points

## Query/Policy Notes
- Reader visibility must satisfy all:
  - `profiles.role = client`
  - matching `profiles.client_id`
  - client access to report type (`client_report_type_access`)
  - report assignment visibility (`client_reports`) and `status = published`
- Domain match check should normalize case and subdomain handling rules explicitly.

## Errors Encountered
| Error | Attempt | Resolution |
|---|---|---|
| None yet | - | - |
3. `SalesByProductDonut`
   - Action: `create`
   - Classification: `charts`
   - Path: `components/report/sales-by-product-donut.tsx`
   - Grid spans: `12 / 6 / 6`
   - Story scope: default, alternate series
4. `NewClientsNarrative`
   - Action: `create`
   - Classification: `block`
   - Path: `components/report/new-clients-narrative.tsx`
   - Grid spans: `12 / 6 / 6`
   - Story scope: default, compact text
5. `GainsBulletSummary`
   - Action: `create`
   - Classification: `block`
   - Path: `components/report/gains-bullet-summary.tsx`
   - Grid spans: `12 / 6 / 6`
   - Story scope: default, one-bullet variant
6. `GainsAreaChart`
   - Action: `create`
   - Classification: `charts`
   - Path: `components/report/gains-area-chart.tsx`
   - Grid spans: `12 / 6 / 6`
   - Story scope: default, alternate trend

## Confirmed 6 Components (General Naming)
1. `IconBulletIntro` — `create` — `infographic` — `components/report/icon-bullet-intro.tsx` — grid `12/12/12`
2. `DualMetricBlock` — `create` — `block` — `components/report/dual-metric-block.tsx` — grid `12/6/6`
3. `DonutBreakdownChart` — `create` — `charts` — `components/report/donut-breakdown-chart.tsx` — grid `12/6/6`
4. `IconTextNarrative` — `create` — `block` — `components/report/icon-text-narrative.tsx` — grid `12/6/6`
5. `BulletSummaryBlock` — `create` — `block` — `components/report/bullet-summary-block.tsx` — grid `12/6/6`
6. `AreaTrendChart` — `create` — `charts` — `components/report/area-trend-chart.tsx` — grid `12/6/6`

## Sales Analysis Infographic Phase Status
1. **Plan & Confirm Spec** *(complete)*
2. **Implementation** *(complete)*
3. **Storybook Sync** *(complete)*
4. **Validation & Handoff** *(complete)*

---

# Task Plan — Report Component Re-evaluation (Palette/Typography/MUI/Overlay)

## Goal
Re-evaluate `components/report` and standardize generated components with color picker props, typography picker props, MUI icons, and stronger background-image contrast overlays.

## Phases
1. **Audit** *(complete)*
2. **Implementation** *(complete)*
3. **Validation** *(complete)*

## Scope Completed
- Added MUI dependencies in project.
- Reworked generated components to accept `colorPicker` (5-key palette object) and `typography` props.
- Replaced report-folder Lucide icon usage with MUI icons.
- Added hero image contrast overlay control to `cover-page.tsx`.

---

# Task Plan — Full Report Component UI Audit + Remediation

## Goal
Audit all components under `components/report` for UI consistency/responsiveness/accessibility-impacting quality issues, then apply non-breaking fixes and keep Storybook/docs/catalog aligned.

## Scope Confirmation
- User request interpreted as explicit confirmation to evaluate all report components and apply fixes where needed.
- Action: `update` for existing components and stories only (no new report components created).
- Constraints: preserve API/behavior, keep Storybook runnable, update `report_component_readme.md` and `report_components_catalog.csv` when changes are made.

## Phase Status
1. **Plan + Inventory** *(complete)*
2. **UI Audit (all `components/report`)** *(complete)*
3. **Targeted Remediation + Storybook Sync** *(complete)*
4. **Validation + Handoff** *(in progress)*

## Confirmed Update Specs (Changed Files)
1. `AreaTrendChart`
   - Action: `update`
   - Classification: `charts`
   - Path: `components/report/chart/area-trend-chart.tsx`
   - Grid spans: unchanged (`12/6/6` default)
   - Color strategy: keep `color_palette` via `resolveReportPalette`
   - Storybook scope impact: responsive rendering behavior in existing stories
2. `HighlightList`
   - Action: `update`
   - Classification: `highlight`
   - Path: `components/report/list/highlight-list.tsx`
   - Grid spans: unchanged (`12/12/6` default)
   - Color strategy: replace hardcoded marker colors with palette vars
   - Storybook scope impact: all mode stories (`icon/checklist/number/bullet`)
3. `ReportCoverPage`
   - Action: `update`
   - Classification: `highlight`
   - Path: `components/report/cover/cover-page.tsx`
   - Grid spans: page-level composition (unchanged)
   - Color strategy: remove hardcoded dark strip color and use `secondary`
   - Storybook scope impact: existing cover stories retain same props
4. `Paragraph Story`
   - Action: `update`
   - Classification: `block`
   - Path: `components/report/text/paragraph.stories.tsx`
   - Grid spans: unchanged (`12` wrapper)
   - Color strategy: unchanged
   - Storybook scope impact: corrected title/index naming
- Validation update: `npm run build-storybook` (pass), targeted eslint on changed report files (pass).
- **Validation + Handoff** moved to *(complete)* for this task.
- Full-coverage verification completed across all 37 generated report components with per-file status matrix recorded in `findings.md`.
- Additional remediations applied to: `package-cards`, `gauge-narative-grid-block`, `donut-breakdown-chart`, `donut-chart-block`.
- Follow-up full-pass request completed: all 37 generated components rechecked (non-sampled), additional fixes applied, docs/catalog updated, validation passed.

---

# Task Plan — Align Template-Builder Instruction to Rendering Concept (Hybrid)

## Goal
Align `html-report-template-builder` instruction flow with `rendering_concept_readme.md` using a hybrid 4-phase model while preserving existing output naming and Storybook generation behavior.

## Phases
1. **Discovery & Gap Assessment** *(complete)*
   - Reviewed current skill instruction structure and rendering concept phases.
   - Identified mismatch between step-centric instruction and concept-centric rendering lifecycle.

2. **Instruction Spec Rewrite** *(complete)*
   - Reframed skill into 4 concept phases:
     - Content Parsing & Outline Generation
     - Component Mapping & Intelligence
     - Artifact Generation
     - Client-Side Rendering & Theming
   - Kept deterministic operational behavior and `{template_name}_template.*` naming.

3. **Planning Files Synchronization** *(complete)*
   - Added alignment task documentation across planning files.
   - Captured rationale, contracts affected, and validation checklist.

4. **Validation & Handoff** *(complete)*
   - Performed instruction consistency and naming checks.
   - Confirmed quality-gate expansion and Storybook `sample.json` requirement inclusion.

## Completion Checklist (Updated Quality Gates)
- [x] Parsing Integrity Gate documented
- [x] Mapping Integrity Gate documented
- [x] Artifact Contract Gate documented
- [x] Client-Side Compatibility Gate documented
- [x] Theme/Fallback Gate documented
- [x] Storybook Integrity Gate documented

## Decisions
- Kept output naming convention unchanged (`{template_name}_template.md/.json/.html`).
- Kept Storybook as a mandatory phase extension after artifact generation.
- Added compatibility contract requirements in template markdown output.

---

# Task Plan — Report Token Standardization (All `components/report` + Storybook)

## Goal
Standardize report component styling to the required full token contract, remove hard-coded semantic color values from report components/stories, and keep APIs stable.

## Phases
1. **Planning bootstrap** *(complete)*
   - Added migration scope and phased batch order
2. **Baseline audit** *(complete)*
   - Identified remaining hard-coded semantic colors and non-token story backgrounds
3. **Token engine refactor** *(complete)*
   - Introduced canonical `ReportColorTokens` + deterministic fallbacks in `report-theme.ts`
4. **Phased component migration** *(complete)*
   - Updated cover/text/list/metric/chart/table/card/section components with token-driven color usage
5. **Storybook alignment** *(complete)*
   - Replaced non-tokenized story backgrounds and chart/palette literals with token references
6. **Docs/catalog sync** *(in progress)*
   - Update report docs/catalog token guidance for the new contract
7. **Validation + closeout** *(pending)*
   - Run lint and capture completion status

## Decisions
- Keep existing component prop APIs (`palette`, `colorPicker`, `gridSpan`) stable.
- Enforce strict internal token usage by resolving all component styles through `report-theme.ts`.
- Phase 6 (**Docs/catalog sync**) is now complete.
- Phase 7 (**Validation + closeout**) complete: `npm run lint` passed with warnings only (no errors).
