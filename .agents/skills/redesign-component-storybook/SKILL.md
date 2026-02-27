---
name: redesign-component-storybook
description: Redesign existing frontend components by component name and keep Storybook coverage aligned. Use when a user asks to restyle, modernize, refactor UI structure, or improve UX for one or more named components, and expects matching Storybook stories to be created or updated in the same task.
---

# Redesign Component Storybook

Redesign the requested components, preserve behavior unless change is requested, and update Storybook stories so visual states remain testable and documented.

## Required Input

Collect:
- Component names (required; one or many)
- Optional redesign direction (brand/theme/layout/mood)
- Constraints (keep API stable, keep accessibility, mobile-first, etc.)

If direction is missing, infer from the existing design system and nearby components.

## Workflow

### 1) Locate Target Components
- Find each component file from the provided name.
- Detect props, variants, and usage sites.
- Locate matching story files (`*.stories.tsx` or `*.stories.ts`).

### 2) Redesign Implementation
- Apply visual redesign in component code and styles only.
- Preserve public API and event behavior unless user requests breaking changes.
- Keep accessibility intact: semantic elements, keyboard usage, and labels.
- Reuse project tokens/utilities before introducing new styling primitives.

### 3) Sync Storybook
- Create a story file when missing; update when present.
- Use CSF3 with typed `Meta` and `StoryObj`.
- Ensure stories cover:
  - Default state
  - At least one meaningful variant
  - Interaction or disabled/loading/error state when relevant
- Keep story `title` and component import paths consistent with repo conventions.

### 4) Verify
- Run targeted checks that validate component and story integrity (build/type/lint/storybook checks available in repo).
- Resolve breakages introduced by redesign or story updates.

## Storybook Rules

- Do not leave stories with stale props after component API changes.
- Prefer deterministic args over mock randomness.
- Keep controls useful by defining `argTypes` only where needed.
- Avoid screenshot-only stories; each story must be runnable and semantically meaningful.

## Output Contract

Return:
- List of components redesigned
- Files changed for component code
- Files changed for Storybook stories
- Validation commands run and pass/fail summary
- Any assumptions (for example inferred redesign direction)

## Reference

Use [component-redesign-checklist.md](references/component-redesign-checklist.md) as a completion checklist before finishing.
