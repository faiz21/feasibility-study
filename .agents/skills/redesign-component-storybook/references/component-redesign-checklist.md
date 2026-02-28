# Component Redesign Checklist

Use this checklist before finishing.

- Confirm final component list was approved before implementation.
- For multi-component single-file input, confirm explicit user approval of the component list.
- Confirm each requested component name was checked against existing files first.
- Confirm missing components were created when not found.
- Confirm created/updated report components are in `components/report`.
- Confirm updates preserve behavior unless a breaking change was requested.
- Confirm color values are sourced from client `color_palette`.
- Confirm these keys exist with fallback defaults when missing: `primary` `secondary` `accent` `background` `text`.
- Confirm component sizing uses a 12-column grid with explicit spans.
- Confirm accessibility basics still hold (semantic structure, keyboard flow, labels).
- Confirm story file exists for each created/updated component.
- Confirm stories include default and meaningful variant states.
- Confirm stories include context that makes 12-grid sizing visible.
- Confirm story args align with current component props.
- Run project validation commands relevant to component + Storybook changes.
- Summarize changed files and assumptions in the final output.
