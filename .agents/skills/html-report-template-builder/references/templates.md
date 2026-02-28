# HTML Report Template Builder Templates

## Required Output Filenames

Use one shared `template_name` and generate these files exactly:
- `{template_name}_template.md`
- `{template_name}_template.json`
- `{template_name}_template.html`

`{template_name}_template.md` is mandatory and must explain how JSON is generated from the actual source document.

## Step 1 Output Contract

### Document Outline Table

| Order | Section ID | Heading | Subsections (ordered list) | Notes |
| ----: | ---------- | ------- | -------------------------- | ----- |

### Component Mapping Plan

| Order | PageTitle | Section ID | Block Summary | BlockType | Component Type | Needs Chart? (Y/N) | Chart Type | Data Source |
| ----: | --------- | ---------- | ------------- | --------- | -------------- | ------------------ | ---------- | ----------- |

### Step 1 Reference Map

| Object Type | Code(s) Produced/Updated | Source | Used By | Notes |
| ----------- | ------------------------ | ------ | ------- | ----- |
| Plan Artifact | `{AppCode}-TPL-PLAN-001` | Input A/B/C | Step 2, Step 3, Step 4 | Draft may contain `To validate` |

## Step 2 Output Contract

### JSON Root Shape

```json
{
  "schemaVersion": 1,
  "document": {
    "title": "",
    "client": "",
    "plant": "",
    "scope": "",
    "date": "",
    "tags": [],
    "locale": "en"
  },
  "pages": [
    {
      "schemaVersion": 1,
      "pageTitle": "",
      "layout": []
    }
  ]
}
```

### Mandatory Component Envelope

```json
{
  "type": "component.typeKey",
  "id": "stable-id",
  "data": {},
  "meta": {
    "locale": "en",
    "tags": [],
    "createdAt": "ISO-8601"
  }
}
```

### Rich Text Blocks

```json
{
  "blocks": [
    { "t": "h2", "text": "Heading" },
    { "t": "p", "text": "Paragraph..." },
    { "t": "ul", "items": ["Item 1", "Item 2"] }
  ]
}
```

### Step 2 Reference Map

| Object Type | Code(s) Produced/Updated | Source | Used By | Notes |
| ----------- | ------------------------ | ------ | ------- | ----- |
| JSON Template | `{AppCode}-TPL-JSON-001` | Step 1 plan + Inputs | Step 3, Step 4 | Draft placeholders only in Draft |

**File output:** `{template_name}_template.json`

## Step 3 Output Contract

### HTML Skeleton

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Report Renderer</title>
  <style>
    :root { --bg: #f3f5f7; --card: #ffffff; --ink: #111827; --muted: #6b7280; --line: #d1d5db; --brand: #0f172a; }
  </style>
</head>
<body>
  <main id="app"></main>
  <script>
    const DOC = window.__DOC__ || { pages: [] };
    const R = {};

    function renderRichText(rt) { /* h2/p/ul only */ }
    function renderNode(node) {
      const fn = R[node?.type] || R.__unknown;
      return fn(node || {});
    }
    R.__unknown = (node) => `<section><h3>Unknown component</h3><pre>${JSON.stringify(node, null, 2)}</pre></section>`;

    function renderPage(page) {
      const blocks = (page?.layout || []).map(renderNode).join("");
      return `<article>${blocks}</article>`;
    }

    document.getElementById("app").innerHTML = (DOC.pages || []).map(renderPage).join("");
  </script>
</body>
</html>
```

### Step 3 Reference Map

| Object Type | Code(s) Produced/Updated | Source | Used By | Notes |
| ----------- | ------------------------ | ------ | ------- | ----- |
| HTML Template | `{AppCode}-TPL-HTML-001` | Step 2 JSON + Inputs | Runtime renderer, Step 4 | Must be single-file |

**File output:** `{template_name}_template.html`

## Step 3.5 Output Contract

### Template Method Markdown Skeleton

```md
# {Template Title} Template Method

## Source Document
- Input file/text:
- Detected title:
- Detected top-level sections:
- Detected subsections:

## JSON Generation Method (From Actual Document)
1. Normalize input text and preserve heading order.
2. Split into pages by top-level sections.
3. Map each source block to approved component types.
4. Build `pages[].layout[]` in deterministic order.
5. Generate deterministic IDs (`{sectionKey}-{abbr}-{###}`).

## Section-to-JSON Mapping
| Section | Source Block Summary | Component Type | JSON Path |
| ------- | -------------------- | -------------- | --------- |

## Data and Placeholder Notes
- Draft placeholders:
- Missing chart series:

## Re-run Instructions
1. Replace source document input.
2. Re-run Step 1 -> Step 2 -> Step 3 with same inventory.
3. Verify IDs, ordering, and registry coverage.
```

**File output:** `{template_name}_template.md`

## Step 4 Output Contract

### Storybook Story Skeleton (CSF3)

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { CaseStudyPageRenderer } from "@/components/case-study/renderer/page-renderer";

const sampleDoc = {
  schemaVersion: 1,
  document: { title: "Sample", locale: "en" },
  pages: []
};

const meta = {
  title: "Case Study/Generated/Page Renderer",
  component: CaseStudyPageRenderer,
  args: {
    page: sampleDoc.pages[0],
    locale: "en"
  }
} satisfies Meta<typeof CaseStudyPageRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MissingDataSafe: Story = {
  args: {
    page: { schemaVersion: 1, pageTitle: "Fallback", layout: [] }
  }
};
```

### Step 4 Reference Map

| Object Type | Code(s) Produced/Updated | Source | Used By | Notes |
| ----------- | ------------------------ | ------ | ------- | ----- |
| Storybook Stories | `{AppCode}-TPL-STORY-001` | Step 2 JSON + Step 3 registry | Storybook runtime | Include page-level and per-type coverage |

## Prompt Pack

1. Draft full run
`Run Draft Mode using the provided document and component inventory. Produce {template_name}_template.md, {template_name}_template.json, {template_name}_template.html, and Step 4 Storybook stories. Use To validate only when required.`

2. Update full run (strict)
`Run Update Mode. Stop if AppCode or component inventory is missing. Produce {template_name}_template.md, {template_name}_template.json (no placeholders), {template_name}_template.html (full registry coverage), and Step 4 Storybook stories with full type coverage.`

3. Draft Step 1 only
`Do Step 1 only: produce the Document Outline Table and Component Mapping Plan, including chart/infographic decisions with justification.`

4. Update integrity audit
`Audit latest JSON, HTML, and Storybook: verify all section headings exist, registry coverage is 100%, story coverage is 100% for used component types, all component types are approved, and IDs are gapless and unique. Stop on violations.`

5. New component request
`Identify content blocks not representable by current components. Propose new component keys with data schema and justification, and provide fallback mappings.`

6. Storybook only
`Using existing Step 2 JSON and Step 3 HTML registry, generate Step 4 Storybook stories in CSF3 with a page-level story and one story per used component type.`
