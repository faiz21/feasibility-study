# Report Template Standard

## Scope

This standard defines how report templates consume `.json` content and client branding consistently across:
- global design tokens
- client color palette overrides
- JSON path binding in HTML templates

## 1) Token Model

Use two token layers:

1. Global tokens (system defaults)
- Source: `/Users/faizafif/mv-project/feasibility-study/app/globals.css`
- Examples: `--background`, `--foreground`, `--primary`, `--chart-1..5`, `--radius`

2. Client tokens (runtime overrides per report/client)
- Inject from server payload:
  - `theme_tokens` object
  - `theme_css_vars` CSS declaration string
- Keys:
  - `--client-primary`
  - `--client-secondary`
  - `--client-accent`
  - `--client-background`
  - `--client-text`

Client colors are validated as safe hex colors with fallback defaults.

## 2) Palette Contract

Expected client palette JSON shape:

```json
{
  "primary": "#0f172a",
  "secondary": "#334155",
  "accent": "#0ea5e9",
  "background": "#ffffff",
  "text": "#0f172a"
}
```

If a key is missing or invalid, the default is used.

## 3) Template Binding Standard

Use placeholders in HTML template strings:

1. Escaped value binding
- `{{ client.name }}`
- `{{ pages.0.title }}`
- `{{ sections[0].heading }}`

2. Raw binding (trusted HTML only)
- `{{{ content.html }}}`

3. JSON debug/placeholder binding
- `{{ json:pages }}`
- `{{ json:document.meta }}`

These are resolved by:
- `/Users/faizafif/mv-project/feasibility-study/lib/portal/template.ts`

## 4) Recommended Placement Rules

1. Branding
- Header logo: `{{ client.logo_url }}`
- Client name/code: `{{ client.name }}`, `{{ client.code }}`

2. Theme variables in template `<style>`

```html
<style>
  :root { {{ theme_css_vars }} }
  body {
    background: var(--client-background, #ffffff);
    color: var(--client-text, #0f172a);
  }
  .report-header {
    background: var(--client-primary, #0f172a);
  }
  .accent {
    color: var(--client-accent, #0ea5e9);
  }
</style>
```

3. Section content
- Map each JSON section to one deterministic container.
- Prefer explicit slots instead of ad-hoc inline string concat.

## 5) JSON-to-Location Rules

1. Keep template schema-driven:
- Each layout block type maps to one renderer location/container.

2. Avoid implicit coupling:
- Do not rely on display text to decide placement.
- Use explicit JSON paths and component `type`.

3. Deterministic order:
- Render `pages[]` in array order.
- Render each `layout[]` in array order.

4. Safe fallback:
- Missing path resolves to empty string.
- Unknown component types render a visible safe fallback block.

## 6) Minimum Template Checklist

Before publishing a template:

1. Includes client theme variable support (`theme_css_vars`).
2. Uses standardized bindings (`{{ }}`, `{{{ }}}`, `{{ json: }}`).
3. Uses deterministic JSON paths for all required fields.
4. Handles missing optional keys without throwing.
5. Keeps renderer coverage aligned with used component types.

## 7) Component Selection Standard

Select components by content semantics, not by visual preference.

1. Narrative text (single stream)
- Use `content.longFormOverview`

2. Parallel/comparative narrative (left/right)
- Use `content.twoColumnTextBlock`

3. Structured records with headers
- Use `table.simple`

4. Short priority/goal lists (3-5 items)
- Use `list.goalsWithIcons` or `content.iconBulletsCard`

5. KPI-focused numeric summary
- Use `kpi.card`, `kpi.grid2x2`, or `kpi.strip3`

6. Process/phases/journey
- Use `process.workflowStepper`

7. Challenge/Solution/Result pattern
- Use `pillars.challengeSolutionResult`

8. Charts (data-driven only)
- `chart.barCard`: category/value comparison
- `chart.donutCard`: part-to-whole with small category count
- `chart.gaugeSegments`: segmented distribution or confidence bands

Do not add charts when no numeric basis exists (except approved Draft placeholders).

## 8) Animation and Motion Standard

Use motion only to improve comprehension and hierarchy.

1. Allowed motion categories
- Entry reveal (`fade-up`, `fade-in`) for page and major section blocks
- Staggered list/card reveal for scanability
- Subtle emphasis transitions for KPI/value updates

2. Disallowed patterns
- Infinite decorative loops
- High-amplitude parallax
- Motion that competes with chart readability

3. Timing constraints
- Duration: 120-320ms for UI transitions
- Stagger step: 40-80ms between sibling items
- Easing: standard ease-out

4. Accessibility
- Respect `prefers-reduced-motion: reduce`
- Disable non-essential animation under reduced motion

5. JSON motion contract (optional per component)

```json
{
  "meta": {
    "motion": {
      "preset": "fade-up",
      "durationMs": 180,
      "delayMs": 40,
      "disabledWhenReducedMotion": true
    }
  }
}
```

Renderer should ignore unknown motion presets safely.

## 9) Renderer Slot and Registry Standard

Every template renderer should define:

1. Type registry
- `R[type] = rendererFn`
- Must cover all component types used by the JSON payload

2. Slot model
- Header slot: branding and top metadata
- Body slot: ordered content blocks
- Footer slot: contact/meta controls

3. Dispatch safety
- Unknown types render explicit fallback block
- Missing `data` keys must not throw

4. Deterministic placement function
- `renderPage(page)` loops `layout[]` in order
- `renderNode(node)` dispatches by `type`
- No placement logic based on visible text labels
