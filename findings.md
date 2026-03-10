# Findings

## Schema and capabilities
- `clients` has `name`, `code`, `domain`, `default_locale`.
- `report_type_templates` has `name`, `description`, `category`, `granularity_id`, `is_active`.
- `report_page_templates` stores page templates with unique `(report_type_template_id, page_key)` and `(report_type_template_id, page_order)`.
- `client_report_type_access` exists for client-to-template enablement.
- `client_reports` exists for client-to-report assignment.

## Existing admin coverage
- Existing pages:
  - `/admin/clients` (read-only list)
  - `/admin/report-types` (read-only list)
  - `/admin/templates` (global template CRUD)
  - `/admin/reports` (analytics)
- Missing dedicated UX flows:
  - client access mapping UI
  - client report assignment UI
  - report-type-specific page manager
  - create/edit flows for clients and report types

## Implemented in this session
- `app/admin/clients/page.tsx` now supports:
  - create/edit/delete
  - search/filter/sort
  - relation counts (template access + report assignment)
  - guarded delete when reports are assigned
- `app/admin/report-types/page.tsx` now supports:
  - create/edit/delete with usage guard
  - filter by category/granularity/active
  - manage-pages deep link per type
- Added dedicated report-type pages manager:
  - `app/admin/report-types/[reportTypeId]/pages/page.tsx`
  - add/edit/delete and move up/down order
- Added client template access manager:
  - `app/admin/client-access/page.tsx`
  - dual-list add/remove interaction
- Added client report assignment manager:
  - `app/admin/client-reports/page.tsx`
  - assign published reports + filtered listing + unassign
- Updated sidebar navigation:
  - `app/admin/layout.tsx` includes `Client Access` and `Client Reports`.
- Added reusable confirmation submit control:
  - `components/ui/confirm-submit-dialog-button.tsx`
  - modal dialog UX for destructive admin actions (delete/unassign/remove access).
- Added reusable create/edit dialog shell:
  - `components/ui/form-dialog.tsx`
  - used for create/edit flows in clients, report types, report-type pages, and report assignment.
- Added active navigation highlighting:
  - `components/portal/nav-link.tsx`
  - integrated in `components/portal/app-shell.tsx`.
- Added compact row action menu primitive:
  - `components/ui/row-actions.tsx`
  - applied in clients and report-types list actions.
- Added reusable data-grid primitives:
  - `components/ui/data-grid.tsx`
  - applied to clients directory and client-reports assignment table for consistent table structure.
- Extended data-grid adoption to report types catalog:
  - `app/admin/report-types/page.tsx`
  - now uses the same table primitives and action pattern.

## Skill development note (markdown-report-to-html)
- Creating new folders under `.agents/skills` may require escalated sandbox permissions in this environment.
- `skill-creator/scripts/quick_validate.py` requires Python `yaml` (PyYAML) installed; otherwise it fails with `ModuleNotFoundError: No module named 'yaml'`.
- Report types catalog is now grouped by category for better scanability.

## Latest updates
- Removed standalone `/admin/templates` route and navigation link.
- Template management is now centralized under:
  - `/admin/report-types/[reportTypeId]/pages`
- Added migration for page-template asset fields:
  - `supabase/migrations/20260227_report_page_template_assets.sql`
  - columns: `readme_markdown` (text), `sample_data` (jsonb)
- Added upload support per page template:
  - HTML file (`.html`)
  - README file (`.md`)
  - sample data file (`.json`)
  - with textarea fallback and JSON validation.
- Added migration for client granularity mapping:
  - `supabase/migrations/20260227_client_granularity_access.sql`
  - join table `client_granularity_access` with RLS admin policy.
- Added admin client-granularity management page:
  - `app/admin/client-granularity/page.tsx`
  - multi-select granularities per client with replace-save server action.
- Added admin client-entities CRUD page:
  - `app/admin/client-entities/page.tsx`
  - grouped view by allowed granularities for selected client.
  - create/edit/delete flows restricted to configured client granularities.
- Updated admin navigation with:
  - `/admin/client-granularity`
  - `/admin/client-entities`
- Updated README route list for new pages.

## Constraints
- Current schema does not include `deleted_at` for soft delete, so delete behavior must be hard delete or guarded delete.

## New task discovery (client branding)
- `clients` currently stores `name`, `code`, `domain`, `default_locale`, but no branding fields.
- `/admin/clients` create/edit forms currently manage only name/code/domain/default locale.
- Report HTML rendering happens in `app/reports/[reportId]/page.tsx` using `renderTemplate(html, content)` where placeholders resolve via flattened object keys.
- Best insertion point for branding data is the render payload before calling `renderTemplate`, so templates can use extra placeholders without changing storage for report page content.

## Client branding implementation
- Added migration `supabase/migrations/20260228_client_branding.sql`:
  - `clients.logo_url` (`text`, nullable)
  - `clients.color_palette` (`jsonb`, non-null default with keys `primary`, `secondary`, `accent`, `background`, `text`)
- Updated `/admin/clients`:
  - create/edit actions now persist `logo_url` + `color_palette`
  - create/edit forms include logo URL and color picker inputs
  - client directory table now shows branding preview (logo + swatches)
- Updated report render path (`app/reports/[reportId]/page.tsx`):
  - loads client branding with page data
  - injects extra template payload keys:
    - `client.logo_url`, `client.color_palette.*`, and other client metadata
    - `theme.*` color aliases
    - `branding.logo_url` + `branding.*` color aliases
- Existing templates remain compatible because original page content is preserved and branding keys are additive.

## New task discovery (report key metrics multi-variant component)
- User requested a single component with multiple variants based on provided visual reference.
- Existing report components currently include:
  - `components/report/cover-page.tsx`
  - `components/report/narrative-card.tsx`
  - `components/report/quote-blocks.tsx`
- No existing `KeyMetricsCard` component found in `components/report`.
- Visual reference characteristics inferred:
  - rounded container with large top corners
  - heading + body paragraph
  - two stacked metric rows (icon + large value + label)
  - at least two visual themes (blue and dark/charcoal)
- Constraints from skill:
  - component must be created in `components/report`
  - Storybook must be colocated and include meaningful variants in 12-grid context
  - color handling must honor `color_palette` defaults when not provided
- User confirmed variant direction should be `left` or `right` rather than size-based variants.
- User requested component naming as `sliceddescriptive&keyMettric`; implementation will use code-safe identifier/file naming while preserving requested naming in Storybook title/labels.
- Created new report component: `components/report/sliced-descriptive-key-mettric.tsx`.
- Created matching Storybook file: `components/report/sliced-descriptive-key-mettric.stories.tsx`.
- Implemented variants as requested: `left` and `right` (slice orientation via asymmetric rounded corners).
- Added tone options (`navy`, `charcoal`, `light`) plus `color_palette` override support with required five keys and fallback defaults.
- Storybook title uses requested naming: `Report/sliceddescriptive&keyMettric`.

## New task discovery (service category icon set)
- User asked to continue with multi-component creation from uploaded image.
- Existing `components/report/icon-list.tsx` is list-oriented and not a direct match for the image's circular icon category tiles.
- Best-fit decomposition for reuse:
  - `ServiceCategoryItem` for circular icon + centered 2-line label
  - `ServiceCategoryGrid` for 3-column responsive group composition and tone distribution
- The image implies left/right grouped layouts and three circle tones (blue, charcoal, gray).
- Created `components/report/service-category-item.tsx` for circular icon + centered label tiles with tone variants (`blue`, `charcoal`, `gray`).
- Created `components/report/service-category-grid.tsx` as reusable composition wrapper with `left/right` layout modes.
- Created `components/report/service-category-grid.stories.tsx` with image-like composition coverage and palette override scenario.
- 12-grid applied explicitly via `gridSpan` on section and items (`base/md/lg` spans).

## New task discovery (operations showcase composition)
- User requested a new multi-component build from image via `$redesign-component-storybook`.
- Image includes three distinct zones:
  - top row: Challenges/Solutions/Results card trio
  - middle row: package pricing cards under "Our Packages"
  - bottom row: workflow numbered list + highlights checklist
- Existing report components partially overlap but do not provide a full composable set matching this exact structure and visual hierarchy.
- Proposed approach is to create dedicated reusable components in `components/report` and one section-level composition wrapper.
- User refined naming: `WorkflowProcessCard -> NumberedList` and `HighlightsChecklistCard -> Checklist`.
- Implemented new components:
  - `components/report/challenge-solution-results-cards.tsx`
  - `components/report/package-cards.tsx`
  - `components/report/numbered-list.tsx`
  - `components/report/checklist.tsx`
  - `components/report/service-operations-showcase-section.tsx`
- Implemented Storybook coverage:
  - `components/report/challenge-solution-results-cards.stories.tsx`
  - `components/report/package-cards.stories.tsx`
  - `components/report/numbered-list.stories.tsx`
  - `components/report/checklist.stories.tsx`
  - `components/report/service-operations-showcase-section.stories.tsx`
- All components use `report-grid` and `report-theme` utilities for explicit 12-grid spans and palette fallback behavior.
- Refactor request received: merge `NumberedList` and `Checklist` into one reusable `HighlightList`.
- Added `components/report/highlight-list.tsx` with modes: `icon`, `checklist`, `number`, `bullet`.
- Updated `components/report/numbered-list.tsx` and `components/report/checklist.tsx` to wrappers over `HighlightList` to preserve API compatibility.
- Updated `components/report/service-operations-showcase-section.tsx` to directly use `HighlightList` in `number` and `checklist` modes.

## New task discovery (impact KPI + program cards screenshot)
- User requested a new implementation using `$redesign-component-storybook` based on the latest uploaded screenshot.
- Screenshot structure appears to include:
  - top strip of 3 icon KPI items
  - middle row with one wide program card and one narrow stacked metrics card
  - lower row with one stacked stat card and one progress-bar stat card
- Existing report components partially overlap style tokens and grid helpers (`report-theme`, `report-grid`), but no single component set matches this exact composition.
- Draft proposal prepared as three reusable components:
  - `ImpactKpiStrip` (`block`)
  - `ProgramImpactCard` (`highlight`)
  - `ProgressStatCard` (`highlight`)
- Per skill requirements, implementation is pending explicit user confirmation of per-component specs (name, action, class, paths, grid spans, color strategy, story scope).

## New task discovery (sales analysis infographic; exactly 6 components)
- User requested a 6-component implementation from uploaded infographic image.
- Layout segments identified:
  - top intro row: icon/title + bracketed bullets
  - middle-left KPI block: profitability vs expense
  - middle-right donut chart: sales by product/year
  - lower-left narrative block: new clients
  - bottom-left bullets block: gains
  - bottom-right area chart: gains trend
- Proposed implementation maps each segment to one component (total = 6).
- Naming constraint applied: generalized component names were used instead of report-specific names.
- User adjustment applied: `DualMetricBlock` (instead of `DualKPIBlock`).
- Implemented exactly 6 components under `components/report` with required classifications (`infographic`, `block`, `charts`).
- Added colocated Storybook stories for each of the 6 components with default + meaningful variants in 12-column grid wrappers.

## Re-evaluation findings (components/report)
- Generated components already had palette support via `palette`; added explicit `colorPicker` prop alias for picker-style usage while keeping backward compatibility.
- Added typography picker support via new `ReportTypography` and `typographyVars` in `report-theme.ts`.
- Migrated report-folder icon usage from Lucide to MUI (`@mui/icons-material`).
- Background-image contrast check:
  - `cover-page.tsx` had no full-scene overlay on hero image; added `heroOverlayOpacity` and overlay layer.
  - Other report components with synthetic background patterns already had overlay layers.

## New task discovery (client-side reader app planning)
- User requested planning-first execution using:
  - `planning-with-files`
  - `nextjs-best-practices`
  - `nextjs-supabase-auth`
- Source concept file: `client_interaction_concept.md`.
- Required reader flow:
  1. login and domain/company match
  2. landing cards for accessible report types (`client_report_type_access`) + report counts
  3. report list per selected type
  4. report reader
  5. right-side page nav (compact code → hover reveal page name)
  6. reading analytics + rating

## Architecture guidance captured for implementation
- App Router: server components by default; client components only for interactive UI (rail hover/state).
- Supabase auth: enforce reader role and session server-side; avoid token handling in client.
- Domain match should run as a guarded post-login step and map to `profiles.client_id` scope.
- Reader data visibility must combine:
  - role/client scope (`profiles`)
  - report type access (`client_report_type_access`)
  - report assignment (`client_reports`)
  - publish status (`reports.status = published`)

## Planned implementation surface
- `app/reports/page.tsx` (landing/report type cards with counts) or dedicated reader landing route.
- `app/reports/[reportTypeId]/page.tsx` (type-specific report list).
- `app/reports/[reportId]/page.tsx` + `components/portal/report-viewer.tsx` (reader + right rail).
- auth redirect/domain gate in `app/auth/post-login/*` and/or middleware/auth helpers.

## Phase 1 implementation (domain-matched access baseline)
- Updated `app/auth/post-login/page.tsx`:
  - normalized email domain parsing (`www.`-insensitive, lowercase)
  - always resolves `clients.domain` for client role logins
  - blocks login when email domain is not registered
  - rebinds `profiles.client_id` to matched domain client when needed
- Updated `lib/portal/auth.ts`:
  - `requireRole("client")` now redirects to `/auth/post-login` when `profile.client_id` is missing.
- This hardens reader route access so client users cannot proceed without domain-backed client scoping.

## Phase 2 + 4 implementation updates
- Updated `app/reports/page.tsx` to compute report-type cards from `client_report_type_access` and attach published report counts from `reports`.
- Updated `app/reports/[typeId]/[reportId]/page.tsx` to include `report_page_templates.page_key` in resolved page payloads as `code`.
- Updated `components/portal/report-viewer.tsx` right-rail navigation to display per-page code chips (e.g. `P1` or template key), while keeping hover-reveal page titles and active state highlighting.

## Phase 3 implementation updates
- Updated `app/reports/page.tsx` to count only reports assigned to the current client (`client_reports`) and published in `reports`, avoiding global counts.
- Updated `app/reports/[typeId]/page.tsx` to list only reports assigned to the current client and filtered by selected report type + published status.
- This enforces assignment-level visibility in the client report-type listing flow instead of relying on implicit RLS behavior.

## Phase 5 implementation updates
- Updated `app/reports/[typeId]/[reportId]/page.tsx` to preload existing `report_resume` and `report_ratings` for the current user and pass them into the viewer.
- Updated `components/portal/report-viewer.tsx` to:
  - resume to the last viewed page/scroll position when available
  - show progress sync timestamp after successful activity/resume writes
  - support rating + optional review note submission with inline success/error feedback
  - keep rating submit disabled while request is in-flight.

## Phase 6 implementation updates
- Added route-level hardening UI for reports experience:
  - `app/reports/loading.tsx`
  - `app/reports/error.tsx`
  - `app/reports/not-found.tsx`
  - `app/reports/[typeId]/loading.tsx`
  - `app/reports/[typeId]/[reportId]/loading.tsx`
- Replaced report list thumbnail `<img>` with `next/image` in `app/reports/[typeId]/page.tsx` to align with Next.js image best practices and remove lint warning.
- Full lint now passes with zero warnings.
- Added lightweight smoke runner `scripts/smoke-reports-routes.mjs` and npm script `smoke:reports` for route checks:
  - unauthenticated redirects to `/login`
  - optional authenticated non-500 checks on `/reports`, `/reports/[typeId]`, `/reports/[typeId]/[reportId]`.

## Admin client-preview mode updates
- Added secure preview cookie helpers in `lib/portal/admin-preview.ts` to start/stop selected-client preview from admin.
- Updated `requireRole("client")` in `lib/portal/auth.ts` to allow admin users into `/reports` only when preview cookie is present; mapped to selected `client_id`.
- Added admin UI in `app/admin/reports/page.tsx`:
  - choose client
  - open `/reports` without separate client login
  - stop preview mode.
- Updated reader flow so admin preview does not record interactions/reviews:
  - disabled activity/rating calls in `components/portal/report-viewer.tsx` when preview mode is active
  - skipped `report_resume` write and access logging on report open in `app/reports/[typeId]/[reportId]/page.tsx`.

## New task discovery (full `components/report` UI audit + remediation)
- User explicitly requested skill-driven full audit of `components/report` and direct fixes after evaluation.
- Required companion updates were also requested for:
  - `components/report/report_component_readme.md`
  - `components/report/report_components_catalog.csv`

## Audit scope and assumptions
- Scope: all component and story files under `components/report/**`.
- Source of truth used: component code, Storybook story metadata, report theme helpers (`report-theme.ts`, `report-grid.ts`).
- Platform targets assumed: desktop/tablet/mobile.
- Constraint assumed: no public API breaking changes.

## Audit findings (ordered by severity)
- P1 (high confidence): `components/report/chart/area-trend-chart.tsx`
  - Problem: chart SVG used `min-w-[520px]` causing forced horizontal overflow on narrow viewports.
  - Impact: degraded mobile readability and scroll friction.
  - Fix applied: removed fixed min-width and kept full-width responsive SVG (`h-auto w-full`) with responsive label font fallback.
- P2 (high confidence): `components/report/list/highlight-list.tsx`
  - Problem: marker chip used hardcoded colors (`#d1d5db`/`#111827`) bypassing palette.
  - Impact: inconsistent theming vs `color_palette` and reduced visual coherence across branded reports.
  - Fix applied: switched chip to palette-driven variables (`background`/`text`/`secondary`-tinted border).
- P2 (high confidence): `components/report/cover/cover-page.tsx`
  - Problem: lower-right strip used hardcoded `#202226` instead of palette token.
  - Impact: theme drift when non-default palettes are used.
  - Fix applied: replaced hardcoded value with `var(--cover-secondary)`.
- P2 (high confidence): `components/report/text/paragraph.stories.tsx`
  - Problem: Storybook title was `Report/NarrativeCard (Grid)` although component/story is paragraph.
  - Impact: confusing component discovery and potential indexing noise.
  - Fix applied: renamed story title to `Report/Paragraph`.

## Documentation/catalog sync updates
- Added a dedicated “UI Audit Fix Notes (2026-03-01)” section in `report_component_readme.md`.
- Updated CSV descriptions for:
  - `Cover Page`
  - `Highlight List`
  - `Area Trend Chart`
  to reflect the new palette/responsive behavior.
## Full Coverage Matrix (Generated Components)
- Total components reviewed: 37

| Component File | Status |
|---|---|
| `components/report/card/box-with-icon-card.tsx` | reviewed-no-change |
| `components/report/card/challenge-solution-results-cards.tsx` | reviewed-no-change |
| `components/report/card/icon-card.tsx` | reviewed-no-change |
| `components/report/card/package-cards.tsx` | fixed |
| `components/report/chart/age-distribution-bars.tsx` | reviewed-no-change |
| `components/report/chart/area-trend-chart.tsx` | fixed |
| `components/report/chart/charts.tsx` | reviewed-no-change |
| `components/report/chart/donut-breakdown-chart.tsx` | fixed |
| `components/report/chart/donut-chart-block.tsx` | fixed |
| `components/report/cover/cover-page.tsx` | fixed |
| `components/report/cover/report-cover.tsx` | reviewed-no-change |
| `components/report/list/bullet-summary-block.tsx` | reviewed-no-change |
| `components/report/list/checklist.tsx` | reviewed-no-change |
| `components/report/list/highlight-list.tsx` | fixed |
| `components/report/list/icon-list.tsx` | reviewed-no-change |
| `components/report/list/narrative-list-block.tsx` | reviewed-no-change |
| `components/report/list/numbered-list.tsx` | reviewed-no-change |
| `components/report/list/square-numbered-list.tsx` | reviewed-no-change |
| `components/report/metric/dual-metric-block.tsx` | reviewed-no-change |
| `components/report/metric/gauge-narative-grid-block.tsx` | fixed |
| `components/report/metric/result-metric-card.tsx` | reviewed-no-change |
| `components/report/metric/sliced-descriptive-key-metric.tsx` | reviewed-no-change |
| `components/report/metric/summary-highlight.tsx` | reviewed-no-change |
| `components/report/section/multi-column-section.tsx` | reviewed-no-change |
| `components/report/section/service-category-grid.tsx` | reviewed-no-change |
| `components/report/section/service-category-item.tsx` | reviewed-no-change |
| `components/report/section/service-operations-showcase-section.tsx` | reviewed-no-change |
| `components/report/table/demographics-block.tsx` | reviewed-no-change |
| `components/report/table/performance-table-block.tsx` | reviewed-no-change |
| `components/report/table/table.tsx` | reviewed-no-change |
| `components/report/text/icon-bullet-intro.tsx` | reviewed-no-change |
| `components/report/text/icon-text-narrative.tsx` | reviewed-no-change |
| `components/report/text/narrative-block.tsx` | reviewed-no-change |
| `components/report/text/narrative-card.tsx` | reviewed-no-change |
| `components/report/text/paragraph.tsx` | reviewed-no-change |
| `components/report/text/quote-blocks.tsx` | reviewed-no-change |
| `components/report/text/quote-statement.tsx` | reviewed-no-change |

## Full-pass recheck update (all 37 generated report components)
- Re-audited all generated components under `components/report` (non-sampling pass).
- Additional findings fixed in this pass:
  - `components/report/table/performance-table-block.tsx`
    - Replaced blue-specific row border with secondary-token border.
    - Replaced hardcoded trend icon colors with CSS vars (`--performance-table-positive`, `--performance-table-negative`).
  - `components/report/text/quote-blocks.tsx`
    - Raised smallest ribbon text from `11px` to `text-xs` for better legibility.
- Re-validated after these fixes:
  - `npm run build-storybook` pass
  - targeted eslint pass

## Rendering Concept Alignment (Instruction-Level)

### Gap analysis (previous vs updated instruction)
- Previous instruction was primarily operational-step driven; rendering concept expects a lifecycle view (parse -> map -> generate -> render).
- Previous quality gates covered structure/IDs/registry/story, but did not explicitly gate:
  - parsing integrity,
  - mapping traceability,
  - client-side compatibility behavior,
  - theme fallback behavior.
- Previous markdown generation requirement existed, but compatibility contract requirements were not explicit.

### Why hybrid mapping was chosen
- Preserves existing deterministic production workflow and file outputs.
- Introduces concept-level architecture semantics without breaking current template generation behavior.
- Minimizes implementation risk while improving instruction clarity and auditability.

### Naming compatibility rationale
- Retained `{template_name}_template.*` to avoid breaking existing generated template directories, references, and Storybook imports.
- Concept artifact naming (`template.html`, `content.json`, `template.json`) is now documented as a mapping note inside instruction markdown requirements rather than as enforced output filenames.

### Storybook extension rationale
- Storybook remains required to validate rendering semantics post-generation.
- Explicitly tied stories to `sample.json` per template folder to stabilize test payload behavior and avoid guard-validation regressions.

### Public instruction interface impact
- `SKILL.md` now exposes phase-oriented semantics aligned to rendering concept.
- Quality gates expanded to include parsing/mapping/compatibility/theme checks.
- Storybook contract now requires `sample.json`-based payload usage.

## Report token standardization audit (2026-03-01)

### Scope and assumptions
- Scope: all `components/report/**/*.tsx`, all report stories, report theme/docs/catalog files.
- Targets: desktop/tablet/mobile as represented in current stories and responsive class usage.
- Constraint: preserve existing component public APIs unless unavoidable.

### Findings (ordered by severity)
- `P1` (high): `components/report/report-theme.ts` only exposed legacy 5-key palette model and lacked mandatory standardized token contract.
  - Why it matters: blocked deterministic token-driven theming across all report components.
  - Fix applied: added `ReportColorTokens`, canonical resolver with deterministic defaults, and `paletteVars` emission for full required tokens plus legacy aliases.
  - Confidence: high.

- `P1` (high): Multiple report components used hard-coded semantic colors (`#...`, `bg-zinc-*`, `bg-slate-*`) for key UI surfaces/states.
  - Why it matters: inconsistent theming and client palette mismatch risk.
  - Fix applied: replaced with token variables via `paletteVars(...)` in cover/text/metric/chart/table/card/section components.
  - Confidence: high.

- `P2` (medium): Storybook wrappers and chart example data used fixed slate/hex values, reducing token behavior visibility.
  - Why it matters: visual regression checks in stories were not validating tokenized themes.
  - Fix applied: migrated stories to tokenized backgrounds and token-referenced color values.
  - Confidence: high.

### Quick-win fixes
- `bg-slate-100`/`bg-slate-50` wrappers → tokenized `bg-muted` / `bg-background` in report stories.
- Fixed-tone card/circle variants (`gray`, `charcoal`) → token semantic variables (`secondary`, `card-foreground`, foreground tokens).
- Hard-coded chart/table indicator colors → status/table token variables.

### Optional deeper improvements
- Add automated CI check to fail on semantic hard-coded colors under `components/report` (excluding `report-theme.ts`).
- Add snapshot-based Storybook test matrix for token override combinations.

---

## Markdown to HTML conversion — `automation-audit_template.md` (2026-03-02)

### Source
- Input Markdown: `templates/report_template/generated/automation_audit_template/automation-audit_template.md`
- Observation: this Markdown is itself a *template/mapping plan* (lots of tables, deterministic IDs, component mapping), not the narrative report content.

### Outline (H1/H2)
- `# Step 1 - Document Outline and Component Mapping Plan`
  - `## Document Outline Table`
  - `## Component Mapping Plan`
  - `## Step 1 Reference Map`
  - `## Source Document Summary`
  - `## Deterministic Mapping Decisions`
  - `## Section to Page/Layout Conversion`
  - `## ID Generation Log`
  - `## Draft Placeholder and Missing Data Notes`
  - `## Re-run Instructions (Deterministic)`
  - `## Compatibility Contract`

### Visualization decision
- Recommendation: no charts for this conversion (tables are already the primary structure).

### Output collision risk
- The target folder already contains `automation-audit_template.json` and `automation-audit_template_report.html`; the conversion should avoid overwriting those unless explicitly requested.
