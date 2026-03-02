# Component Redesign Checklist

Use this checklist before finishing.

- Confirm execution started in `/plan` mode.
- Confirm `task_plan.md`, `findings.md`, and `progress.md` were created/updated.
- Confirm each component has a documented spec before coding.
- Confirm final component list was approved before implementation.
- For multi-component single-file input, confirm explicit user approval of the component list.
- Confirm per-component user confirmation captured: name, action, classification, path, sizing, color strategy, story scope.
- Confirm component classification is one of: `block`, `highlight`, `infographic`, `charts`.
- Confirm classification rule applied: `block` has no background, `highlight` has background.
- Confirm naming is general/portable and not over-focused on a specific report title unless explicitly requested.
- Confirm each requested component name was checked against existing files first.
- Confirm missing components were created when not found.
- Confirm created/updated report components are in `components/report`.
- Confirm updates preserve behavior unless a breaking change was requested.
- Confirm color values are sourced from client `color_palette`.
- Confirm standardized core UI tokens exist (fallback defaults allowed): `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `accent`, `accent-foreground`, `background`, `foreground`, `card`, `card-foreground`, `muted`, `muted-foreground`, `border`, `input`, `ring`.
- Confirm status tokens exist (fallback defaults allowed): `success`, `success-foreground`, `warning`, `warning-foreground`, `critical`, `critical-foreground`, `info`, `info-foreground`.
- Confirm report semantic tokens exist (fallback defaults allowed): `cover-background`, `cover-overlay`, `cover-title`, `cover-subtitle`, `section-title`, `section-body`, `kpi-value`, `kpi-label`, `chart-grid`, `chart-axis`, `chart-series-1`, `chart-series-2`, `chart-series-3`, `table-header`, `table-row`, `table-border`, `tag-background`, `tag-foreground`, `disabled-background`, `disabled-foreground`.
- Confirm component sizing uses a 12-column grid with explicit spans.
- Confirm accessibility basics still hold (semantic structure, keyboard flow, labels).
- Confirm story file exists for each created/updated component.
- Confirm stories include default and meaningful variant states.
- Confirm stories include context that makes 12-grid sizing visible.
- Confirm story args align with current component props.
- Run project validation commands relevant to component + Storybook changes.
- Summarize changed files and assumptions in the final output.
