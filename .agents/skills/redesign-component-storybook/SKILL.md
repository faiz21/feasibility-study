---
name: redesign-component-storybook
description: Create or update frontend components by component name and keep Storybook coverage aligned. Use when a user asks to build missing components, redesign existing ones, or refactor UI structure for one or more named components, and expects matching Storybook stories to be created or updated in the same task.
---

# Create/Update Component + Storybook

Create or update the requested components, preserve behavior unless change is requested, and update Storybook stories so visual states remain testable and documented.

## Planning Files (Mandatory)

Always start execution with `/plan` before making implementation edits.

Before implementation, create or update these files in the workspace root:
- `task_plan.md`: ordered implementation plan and status
- `findings.md`: discovered component paths, dependencies, and constraints
- `progress.md`: execution log with completed/in-progress/pending updates

Keep the files current while working. Do not skip file-based planning for multi-component tasks.

## Required Input

Collect:
- Component names (required; one or many)
- Optional redesign direction (brand/theme/layout/mood)
- Constraints (keep API stable, keep accessibility, mobile-first, etc.)

If direction is missing, infer from the existing design system and nearby components.

Before implementation, confirm the final list of components to create/update with the user.
For multi-component requests from a single uploaded file, treat confirmation as mandatory and do not generate code before confirmation.

For each component that will be created or updated, discuss and confirm with the user:
- Component name
- Action (`create` or `update`)
- Classification (`block`, `highlight`, `infographic`, `charts`)
- Target file path (must be under `components/report` for report components)
- 12-grid sizing by breakpoint (for example mobile/tablet/desktop spans)
- Color choice strategy (`color_palette` defaults only or explicit per-component overrides)
- Storybook scope (states/variants to include)
- General content naming (portable names, not overly tied to a specific report title/source)

## Workflow

### 1) Plan and Confirm Per-Component Specs
- Build a per-component spec list in `task_plan.md` before coding.
- For each component, record the confirmed details:
  - name
  - action (`create`/`update`)
  - classification
  - target file path
  - grid spans by breakpoint
  - color handling from `color_palette`
  - required Storybook states
- Ask for user confirmation of each component spec before generating or editing code.

### 2) Classify Component Type
- Assign every component to exactly one class:
  - `block`: component without background
  - `highlight`: component with background
  - `infographic`
  - `charts`
- If classification is ambiguous, confirm with user before implementation.

### 3) Locate Target Components
- Check for existing component file first for each provided name.
- If found, treat as update flow: detect props, variants, and usage sites.
- If not found, treat as create flow: add a new component file under `components/report`.
- Locate matching story files (`*.stories.tsx` or `*.stories.ts`).

### 4) Enforce Report Component Location
- Create and update report components in `components/report`.
- Keep Storybook stories colocated in `components/report` unless repo conventions explicitly require a different story path.

### 5) Create/Update Implementation
- For existing components, apply visual redesign in component code and styles only.
- For missing components, create the component with a minimal, accessible, reusable API.
- Preserve public API and event behavior unless user requests breaking changes.
- Keep accessibility intact: semantic elements, keyboard usage, and labels.
- Reuse project tokens/utilities before introducing new styling primitives.
- Prefer general content labels and section naming that remain reusable across reports, including screenshot-derived inputs.
- Avoid overfitting naming to one source title unless the user explicitly asks for title-specific naming.

### 6) Apply Color Configuration
- Read client palette data from `color_palette` column first.
- Require this standardized token set in component styling:
  - Core UI tokens:
    - `primary`, `primary-foreground`
    - `secondary`, `secondary-foreground`
    - `accent`, `accent-foreground`
    - `background`, `foreground`
    - `card`, `card-foreground`
    - `muted`, `muted-foreground`
    - `border`, `input`, `ring`
  - Status tokens:
    - `success`, `success-foreground`
    - `warning`, `warning-foreground`
    - `critical`, `critical-foreground`
    - `info`, `info-foreground`
  - Report semantic tokens:
    - `cover-background`, `cover-overlay`, `cover-title`, `cover-subtitle`
    - `section-title`, `section-body`
    - `kpi-value`, `kpi-label`
    - `chart-grid`, `chart-axis`, `chart-series-1`, `chart-series-2`, `chart-series-3`
    - `table-header`, `table-row`, `table-border`
    - `tag-background`, `tag-foreground`
    - `disabled-background`, `disabled-foreground`
- If `color_palette` is missing or incomplete, fill missing tokens with deterministic defaults and note assumptions.

### 7) Apply 12-Column Grid Sizing
- Use a 12-column grid system when defining component width/layout.
- State component size explicitly with 12-grid spans.
- For responsive behavior, define spans by breakpoint when relevant.
- Ensure Storybook stories render components in grid context so sizing behavior is visible.

### 8) Sync Storybook
- Create a story file when missing; update when present.
- Use CSF3 with typed `Meta` and `StoryObj`.
- Ensure stories cover:
  - Default state
  - At least one meaningful variant
  - Interaction or disabled/loading/error state when relevant
- Keep story `title` and component import paths consistent with repo conventions.

### 9) Verify
- Run targeted checks that validate component and story integrity (build/type/lint/storybook checks available in repo).
- Resolve breakages introduced by redesign or story updates.

## Storybook Rules

- Do not leave stories with stale props after component API changes.
- Prefer deterministic args over mock randomness.
- Keep controls useful by defining `argTypes` only where needed.
- Avoid screenshot-only stories; each story must be runnable and semantically meaningful.

## Output Contract

Return:
- List of components created/updated
- Per-component confirmation summary (name, action, classification, sizing, color choice, story scope)
- Files changed for component code
- Files changed for Storybook stories
- Component location used (`components/report`)
- 12-grid span decisions used by component/breakpoint
- Palette source used (`color_palette`) and fallback details
- Token coverage summary (missing tokens filled with defaults)
- Validation commands run and pass/fail summary
- Any assumptions (for example inferred redesign direction)

## Reference

Use [component-redesign-checklist.md](references/component-redesign-checklist.md) as a completion checklist before finishing.
