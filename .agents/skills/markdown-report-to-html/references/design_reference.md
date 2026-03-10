# Design reference mapping

This skill targets the same overall visual language as:

- `public/automation_assessment_sample.html`
- `public/report_themes.css`

## Required UX elements

- Always include a **cover page**.
- Keep the report clean and professional: generous whitespace, strong typographic hierarchy, readable body text.
- Prefer a single-column narrative flow for most content (centered within a wider grid), similar to the reference.

## Theme + palette

The HTML template expects `public/report_themes.css` to define baseline CSS variables (via `[data-theme="..."]`), and then optionally overrides them at runtime via JSON:

- `theme.palette.primary` -> `--report-primary`
- `theme.palette.bg` -> `--report-bg`
- `theme.palette.surface` -> `--report-surface`
- `theme.palette.text` -> `--report-text`
- `theme.palette.textMuted` -> `--report-text-muted`
- `theme.palette.border` -> `--report-border`
- and optional accents (`accentOrange`, `accentRed`, `accentBlue`)

If the JSON contains a palette, the renderer applies it via `document.documentElement.style.setProperty(...)`.

