# Markdown → Grid HTML (H1–H3)

This repo already uses a 12-column grid concept for report components. This document adds a simple, standalone **HTML grid renderer** that turns Markdown structure into a responsive grid layout.

## Mapping Rules

### Heading levels

- `# H1` → full-width banner block (`.h1-block`, span 12)
- `## H2` → full-width section header block (`.h2-block`, span 12)
- `### H3` → card block (`.card-block`, span 12 on mobile, span 6 on desktop)

### Body content

- Paragraphs/lists/code fences immediately after an H3 are rendered *inside* that H3 card.
- Body content not under an H3 becomes a full-width prose block (`.block.prose`, span 12).

## Grid System

The renderer uses a CSS grid container with 12 columns:

- `.grid12` → `grid-template-columns: repeat(12, 1fr)`
- `.span-12` → full width
- `.span-lg-6` → half width at ≥900px (two cards per row)

This keeps reading order deterministic while improving density on larger screens.

## Files

- Template: `/Users/faizafif/mv-project/feasibility-study/templates/markdown_grid/markdown-grid-template.html`
- Sample Markdown: `/Users/faizafif/mv-project/feasibility-study/templates/markdown_grid/sample.md`
- Converter script: `/Users/faizafif/mv-project/feasibility-study/scripts/markdown-to-grid-html.mjs`

## Usage

Generate HTML from Markdown:

```bash
npm run render:md-grid -- templates/markdown_grid/sample.md /tmp/sample-grid.html
```

Or call the script directly:

```bash
node scripts/markdown-to-grid-html.mjs templates/markdown_grid/sample.md /tmp/sample-grid.html
```
