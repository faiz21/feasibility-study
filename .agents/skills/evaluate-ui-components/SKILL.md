---
name: evaluate-ui-components
description: Evaluate UI components for layout quality and visual consistency, with emphasis on spacing, padding, alignment, typography, hierarchy, responsiveness, and accessibility. Use when a user asks to audit component quality, review UI polish, find design inconsistencies, or verify spacing and padding in frontend code.
---

# Evaluate UI Components

Audit one or more components for visual quality and implementation quality, then return concrete, fix-oriented findings.

## Input Contract

Collect or infer:
- Component scope (single component, page section, or full screen)
- Source of truth (existing code, Storybook, screenshot, Figma, design tokens)
- Platform targets (desktop, tablet, mobile)
- Constraints (design system rules, no-API-change, deadline)

If key inputs are missing, proceed with best-effort assumptions and state them.

## Token Standard (When Applicable)

When auditing client report themes or report content components, enforce this standardized token list:
- Core UI: `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `accent`, `accent-foreground`, `background`, `foreground`, `card`, `card-foreground`, `muted`, `muted-foreground`, `border`, `input`, `ring`
- Status: `success`, `success-foreground`, `warning`, `warning-foreground`, `critical`, `critical-foreground`, `info`, `info-foreground`
- Report semantic: `cover-background`, `cover-overlay`, `cover-title`, `cover-subtitle`, `section-title`, `section-body`, `kpi-value`, `kpi-label`, `chart-grid`, `chart-axis`, `chart-series-1`, `chart-series-2`, `chart-series-3`, `table-header`, `table-row`, `table-border`, `tag-background`, `tag-foreground`, `disabled-background`, `disabled-foreground`

Flag missing token definitions as `P1` when they block consistent theming; otherwise `P2`.

## Audit Workflow

### 1) Build Context Quickly
- Locate component files and related styles.
- Locate design tokens and spacing scale when available.
- Check Storybook stories or UI screenshots for visual states.

### 2) Run Structured UI Evaluation
Evaluate with [ui-component-audit-checklist.md](references/ui-component-audit-checklist.md).

Prioritize:
- Spacing and padding consistency
- Grid rhythm and alignment
- Typography hierarchy and legibility
- Visual hierarchy and affordance clarity
- Responsive behavior at common breakpoints
- Accessibility-impacting UI issues (contrast, target size, focus visibility)

### 3) Score Severity and Confidence
Use this severity model:
- `P0`: Blocks usage or causes severe accessibility/interaction failure.
- `P1`: High visual or UX defect with clear user impact.
- `P2`: Moderate quality issue; polish or consistency debt.
- `P3`: Minor cosmetic issue or optional improvement.

Always include confidence (`high`, `medium`, `low`) per finding.

### 4) Provide Fix-Ready Output
For each finding, return:
- Component/file path
- Problem statement (specific and testable)
- Why it matters (UX/design-system impact)
- Suggested fix (token/value-level guidance)
- Severity and confidence

When possible, provide exact token substitutions (for example `p-5 -> p-4`, `gap-7 -> gap-6`) instead of vague advice.

## Execution Rules

- Prefer existing design tokens over introducing one-off values.
- Preserve behavior and public component API unless user requests a redesign.
- Do not propose contradictory fixes across breakpoints.
- Avoid generic feedback; each finding must map to a concrete element/state.
- If no major issues are found, explicitly state that and list remaining minor polish opportunities.

## Suggested Checks

Use fast repo checks before finalizing:
- `rg` to find hard-coded spacing values and non-token styles
- Storybook stories for state and breakpoint verification
- Existing lint/type/test scripts if available for regression confidence

## Output Format

Return sections in this order:
1. Scope and assumptions
2. Findings (ordered by severity)
3. Quick-win fixes (highest impact, lowest effort)
4. Optional deeper improvements
