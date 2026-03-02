# Report Rendering Concept & Architecture

This document elaborates on the end-to-end conceptual architecture and workflow for converting raw Markdown report content into beautiful, dynamically rendered, theme-aware React/HTML components.

---

## Architecture Overview

The core objective is to decouple the **content**, the **layout (template)**, and the **presentation (components + theme)**. This decoupling allows us to take a standard Markdown file—such as the `Automation_Assessment_Report.md`—and dynamically render it using a suite of high-fidelity React components (like those detailed in `report_components_catalog.csv`), while rigidly adhering to a client-specific color palette.

The workflow is broken down into four distinct phases:
1. Content Parsing & Outline Generation
2. Component Mapping & Intelligence
3. Artifact Generation (HTML & JSON)
4. Client-Side Rendering & Theming

---

## Phase 1: Content Analysis & Outline Generation

The rendering engine begins by parsing the raw Markdown template. It traverses the document to build an Abstract Syntax Tree (AST), identifying the structured outlines.

*   **Heading Extraction:** The engine extracts H1, H2, and H3 elements to construct the underlying "Outline" or "Table of Contents".
*   **Content Grouping:** For each section (e.g., Section 1.1.1), the content beneath the heading is grouped. The engine categorizes these blocks into primitives:
    *   Paragraphs
    *   Bullet Lists / Numbered Lists
    *   Tables
    *   Quotes

---

## Phase 2: Component Mapping & Intelligence

Once the content is broken into primitive sections, the engine analyzes the semantic context of each block to select the most appropriate visual component from the `@components/report` catalog. Instead of simply rendering a standard HTML `<p>` or `<ul>`, the engine upgrades the presentation:

*   **Section Headers & Introductions:** An H1 or H2 followed by a brief intro is mapped to a `NarrativeBlock` or `NarrativeCard` for high visual impact.
*   **Standard Text:** Mapped to the `Paragraph` component for clean, highly legible typography.
*   **Lists:** 
    *   Standard bullets might be mapped to a `BulletSummaryBlock` or `Checklist`.
    *   Step-by-step instructions or ordered lists map to `SquareNumberedList`.
    *   Feature lists can map to `IconList` to add premium visual markers.
*   **Metrics & Data:** If the engine detects key percentages or KPIs in the text, it extracts them into a `ResultMetricCard` or `DualMetricBlock`. 
*   **Tabular Data:** Markdown tables are converted to the styled `Table` component or `PerformanceTableBlock` if numerical/financial.
*   **Cover Page:** The beginning of the document maps to the `Cover Page` component, absorbing metadata like the report title, subtitle, and an injected hero image.

**Component Combinations:**
To enrich the visualization further, the engine is not limited to 1:1 mapping. It can intelligently combine multiple components or nest them within structured layouts (like `MultiColumnSection` or `ServiceOperationsShowcaseSection`) based on the content context. For example:
*   An `IconCard` can be combined with a `NarrativeBlock` to contextualize a key point.
*   A `NarrativeBlock` can be displayed alongside a chart (`AreaTrendChart`, `DonutBreakdownChart`, etc.) or metric card to pair data visualization with descriptive findings.
*   Narrative text can be split across columns with metrics interspersed, creating a high-fidelity visual composition from simple markdown content.

---

## Phase 3: Artifact Generation (HTML & JSON)

After structural analysis and component mapping, the engine generates three distinct artifacts to facilitate the decoupled rendering.

### 1. The HTML Template (`template.html`)
A structural shell that represents the layout grid and container for the report. This file is extremely lightweight and usually consists of a 12-column CSS layout grid and root mounting points.

### 2. The Output JSON Data (`content.json`)
This file represents the actual extracted text, data, and configuration mapped specifically to the props expected by the React components. 
**Example:**
```json
{
  "section_1": [
    {
      "component": "NarrativeBlock",
      "props": {
        "title": "Executive Summary",
        "content": "PT Indonesia Asahan Aluminium operates the Green Plant...",
        "size": "md"
      }
    },
    {
      "component": "BulletSummaryBlock",
      "props": {
        "items": [
          "Distributed multi-brand PLC estate.",
          "Significant manual RPM settings.",
          "Instrument accuracy issues."
        ]
      }
    }
  ]
}
```

### 3. The Template Structure schema (`template.json`)
This acts as the blueprint or schema dictating the *structure* of the report. It is used to validate `content.json` before rendering to ensure all required components and props match the design requirements.

---

## Phase 4: Client-Side Rendering & Hydration

When the client (e.g., a user's browser or an exported web view) opens the report, the final rendering pipeline executes:

1.  **Fetching Assets:** The client fetches the `template.html` shell, the `content.json` payload, and the `template.json` blueprint.
2.  **Compatibility Check:** The rendering engine checks the validity of `content.json` against `template.json` to ensure the data shape is correct and all mapped component names exist in the local registry (from `report_components_catalog.csv`).
3.  **Theming Engine Execution:** The client's specific configured color palette is resolved via the Headless Theming Engine (`report-theme.ts`). Colors are injected into the DOM as scoped CSS variables (e.g., `--charts-primary`, `--result-card-bg`).
    *   **Fallback system:** Even if a client only provides a `primary` brand color, the engine auto-generates secondary, accent, and background tones.
4.  **Component Mounting:** The loop iterates over `content.json`, dynamically instantiating each React component inside the grid system (using the `gridSpan` configurations) and passing the extracted JSON data as props.

The final result is a beautiful, highly interactive, and uniquely branded React application generated entirely from a static Markdown document.
