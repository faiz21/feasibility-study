# Report Components: Concept & Usage Guide

The `@components/report` directory provides a highly modular, themeable suite of React components designed specifically to render beautiful, dynamic Markdown reports into HTML/React elements. 

These components act as a bridge between structured content (JSON generated from Markdown) and a premium frontend display.

## 1. Core Concepts

### 1.1 Headless Theming Engine
These components do not rely on hardcoded text colors or background colors. Instead, they rely on a powerful centralized theming utility: `report-theme.ts`.

When you use a component, you can still pass the existing `palette` object (`primary`, `secondary`, `accent`, `background`, `text`). Internally, the engine now normalizes it to a **full standardized token set** and injects token CSS variables scoped to each component wrapper.

Required standardized token groups:
- Core UI: `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `accent`, `accent-foreground`, `background`, `foreground`, `card`, `card-foreground`, `muted`, `muted-foreground`, `border`, `input`, `ring`
- Status: `success`, `success-foreground`, `warning`, `warning-foreground`, `critical`, `critical-foreground`, `info`, `info-foreground`
- Report semantic: `cover-background`, `cover-overlay`, `cover-title`, `cover-subtitle`, `section-title`, `section-body`, `kpi-value`, `kpi-label`, `chart-grid`, `chart-axis`, `chart-series-1`, `chart-series-2`, `chart-series-3`, `table-header`, `table-row`, `table-border`, `tag-background`, `tag-foreground`, `disabled-background`, `disabled-foreground`

**Minimum Configuration (Theme):**
Most components accept `palette` override inline. If only partial palette fields are supplied, deterministic fallback token defaults are applied.
```json
{
  "theme": {
    "palette": {
      "primary": "#0ea5e9", // The core brand color
      "secondary": "#1e293b", // Dark contrasting color
      "accent": "#f59e0b", // Highlight color
      "background": "#ffffff", // App/Report background
      "text": "#0f172a" // General text color
    }
  }
}
```

### 1.2 Grid Layout System
The components are designed to live inside a standard 12-column CSS grid. Every component accepts a `gridSpan` configuration.

**How to Use:**
You dictate how wide a component should strictly be by passing an object denoting the span width at different responsive breakpoints (`base` = mobile, `md` = tablet, `lg` = desktop).
```json
// Example: Full width on mobile, half width on desktop
"gridSpan": { "base": 12, "md": 6, "lg": 6 }
```

### 1.3 JSON Content Injection
The components are completely "dumb" regarding where data comes from. They expect primitive, JSON-serializable types. They NEVER expect React element children (`React.ReactNode`). This makes it exceptionally easy to store templates in databases or parse them from raw Markdown.

---

## 2. Component Utilization Guide

Below are the guidelines on how to use the major categories of components. For a complete list of every single component and its exact schema, please reference the adjacent `report_components_catalog.csv` file.

### Text & Narratives (`/text`)
Used for standard reading content.
*   **The Concept:** Instead of dumping a giant wall of `<p>` tags onto the screen, you break the report up. Use `NarrativeBlock` to introduce major H1/H2 sections loudly. Use `NarrativeCard` to isolate important paragraphs.
*   **Minimum Setup:** Most text components simply require a `content: string` prop containing the markdown/text.

### Lists (`/list`)
Used whenever the data is an array of items (bullets, ordered lists).
*   **The Concept:** Markdown lists (`- a \n - b`) are boring. These components upgrade them. Use `Checklist` for features. Use `SquareNumberedList` for sequential steps to make them look like a premium process flow.
*   **Minimum Setup:** An array of strings: `items: ["First step", "Second step"]`. Some premium lists (like `IconList`) require `items: [{ icon: string, text: string }]`.

### Metrics & Callouts (`/metric`)
Used to highlight specific data points, KPIs, or percentages found in the text.
*   **The Concept:** If the report says "Revenue increased by 45%", you don't just leave it in the text. You extract it and place it in a `ResultMetricCard` or a `SlicedKeyMetric` card to break visual monotony.
*   **Minimum Setup:** Typically requires a `title` or `label` and a `value` (e.g., `{ "label": "Revenue", "value": "+45%" }`).

### Charts (`/chart`)
Used for data visualization.
*   **The Concept:** Transforming tabular data into visual representations. If the report has data showing trends over time, map it to an `AreaTrendChart`. If it's a breakdown of categories, map it to a `DonutBreakdownChart`.
*   **Minimum Setup:** An array of `series` objects representing points on a graph: `series: [{ label: "Q1", value: 120 }, { label: "Q2", value: 150 }]`. The chart handles all the SVG rendering and scaling internally.

### Tables (`/table`)
Used for dense tabular data that doesn't fit into a chart.
*   **The Concept:** Tables are often necessary but hard to make look good. The `Table` component standardizes row styling. The `PerformanceTableBlock` is specifically meant for financial ledgers or metric comparisons.
*   **Minimum Setup:** Requires `headers` (an array of strings) and `rows` (an array of arrays of strings).

### Cover (`/cover`)
Used for the very first page of the HTML document.
*   **The Concept:** The cover page sets the aesthetic tone. It combines the company's brand logo, background imagery, and the core title of the document.
*   **Minimum Setup:** Requires `caseStudy` object metadata (title, subtitle, company name). `heroImageUrl` is highly recommended for visual impact.

---

## 3. Recommended Parsing Workflow (The Pipeline)

To successfully utilize this component library, your backend or parser should follow this workflow:

1.  **Parse Markdown:** Run the source Markdown through a parser to generate an AST (Abstract Syntax Tree). Look for headings (`#`, `##`), lists (`-`, `1.`), and blockquotes (`>`).
2.  **Assign Components:** 
    *   Map `H1/H2` intro text -> `NarrativeBlock`
    *   Map standard text -> `Paragraph`
    *   Map lists -> `IconList` or `Checklist`
    *   Detect percentages/metrics in text -> Extract to `ResultMetricCard`
3.  **Generate JSON payload:** Construct the massive JSON tree containing the component names and their resulting `props`.
4.  **Render Loop:** In your React application, loop through the JSON sections and dynamically instantiate the components from this library using the provided payload.

---

## 4. UI Audit Fix Notes (2026-03-01)

Recent consistency and responsiveness fixes applied across `components/report`:

- **Full report token standardization (current pass)**
  - Added canonical `ReportColorTokens` resolver in `report-theme.ts`.
  - Removed remaining hard-coded semantic color values from report components/stories.
  - Story wrappers and chart sample colors now use token references instead of fixed slate/hex values.

- `cover/cover-page.tsx`
  - Replaced one hard-coded dark background (`#202226`) with palette-driven `secondary` color token for theme consistency.
- `list/highlight-list.tsx`
  - Replaced hard-coded icon chip colors with palette variables so list markers adapt to `color_palette`.
- `chart/area-trend-chart.tsx`
  - Removed forced `min-width` in SVG container to prevent horizontal overflow on small screens.
  - Label font now uses a responsive clamp fallback for better mobile legibility.
- `text/paragraph.stories.tsx`
  - Corrected Storybook title from `Report/NarrativeCard (Grid)` to `Report/Paragraph` for accurate indexing and discoverability.
- `card/package-cards.tsx`
  - Package price badge now uses `secondary` palette token (no fixed gray tone).
- `metric/gauge-narative-grid-block.tsx`
  - Gauge remainder ring and center fill now use palette variables (`secondary` and `background`) instead of fixed grays.
- `chart/donut-breakdown-chart.tsx`
  - Empty-series donut fallback now uses palette background token.
- `chart/donut-chart-block.tsx`
  - Added optional palette support and tokenized donut center fill.
- `table/performance-table-block.tsx`
  - Replaced hardcoded blue border with secondary-token border tint.
  - Moved trend icon colors into component CSS variables for cleaner theming control.
- `text/quote-blocks.tsx`
  - Increased smallest ribbon text from `11px` to `text-xs` for better readability/accessibility.
