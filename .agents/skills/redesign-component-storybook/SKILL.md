---
name: redesign-component-storybook
description: Create or update frontend components by component name and keep Storybook coverage aligned. Use when a user asks to build missing components, redesign existing ones, or refactor UI structure for one or more named components, and expects matching Storybook stories to be created or updated in the same task.
---

# Create/Update Component + Storybook

Create or update the requested components, preserve behavior unless change is requested, and update Storybook stories so visual states remain testable and documented.

## Required Input

Collect:
- Component names (required; one or many)
- Optional redesign direction (brand/theme/layout/mood)
- Constraints (keep API stable, keep accessibility, mobile-first, etc.)

If direction is missing, infer from the existing design system and nearby components.

Before implementation, confirm the final list of components to create/update with the user.
For multi-component requests from a single uploaded file, treat confirmation as mandatory and do not generate code before confirmation.

## Workflow

### 1) Locate Target Components
- Check for existing component file first for each provided name.
- If found, treat as update flow: detect props, variants, and usage sites.
- If not found, treat as create flow: add a new component file under `components/report`.
- Locate matching story files (`*.stories.tsx` or `*.stories.ts`).

### 2) Enforce Report Component Location
- Create and update report components in `components/report`.
- Keep Storybook stories colocated in `components/report` unless repo conventions explicitly require a different story path.

### 3) Create/Update Implementation
- For existing components, apply visual redesign in component code and styles only.
- For missing components, create the component with a minimal, accessible, reusable API.
- Preserve public API and event behavior unless user requests breaking changes.
- Keep accessibility intact: semantic elements, keyboard usage, and labels.
- Reuse project tokens/utilities before introducing new styling primitives.

### 4) Apply Color Configuration
- Read client palette data from `color_palette` column first.
- Require these five base keys in component styling:
  - `primary` (default `#0f172a`)
  - `secondary` (default `#334155`)
  - `accent` (default `#0ea5e9`)
  - `background` (default `#ffffff`)
  - `text` (default `#0f172a`)
- If `color_palette` is missing or incomplete, use defaults for missing keys and note assumptions.

### 5) Apply 12-Column Grid Sizing
- Use a 12-column grid system when defining component width/layout.
- State component size explicitly with 12-grid spans.
- For responsive behavior, define spans by breakpoint when relevant.
- Ensure Storybook stories render components in grid context so sizing behavior is visible.

### 6) Sync Storybook
- Create a story file when missing; update when present.
- Use CSF3 with typed `Meta` and `StoryObj`.
- Ensure stories cover:
  - Default state
  - At least one meaningful variant
  - Interaction or disabled/loading/error state when relevant
- Keep story `title` and component import paths consistent with repo conventions.

### 7) Verify
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
- Files changed for component code
- Files changed for Storybook stories
- Component location used (`components/report`)
- 12-grid span decisions used by component/breakpoint
- Palette source used (`color_palette`) and fallback details
- Validation commands run and pass/fail summary
- Any assumptions (for example inferred redesign direction)

## Reference

Use [component-redesign-checklist.md](references/component-redesign-checklist.md) as a completion checklist before finishing.
