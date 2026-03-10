---
name: markdown-report-to-html
description: Convert a Markdown report (.md) into (1) a styled sample HTML file and (2) a JSON-driven final HTML report with fully dynamic content and a dynamic color palette. Use when a user provides a Markdown report and wants a professional, clean, cover-page-first report design aligned to the styling in public/automation_assessment_sample.html and public/report_themes.css.
---

# Markdown Report to HTML

Follow this workflow to turn a Markdown report into an HTML report that matches the design language of `public/automation_assessment_sample.html`.

## Inputs

- A Markdown file path, e.g. `reports/automation.md`
- Design reference: `public/automation_assessment_sample.html`
- Theme variables: `public/report_themes.css`

## Outputs

Always generate:

1. `{report-name}_sample.html` (static sample preview)
2. `{report-name}.json` (content + theme)
3. `{report-name}_report.html` (final renderer that loads JSON)

Also: always include a cover page (first page) in both HTML files.

## Required planning process (use planning-with-files)

Use [$planning-with-files](/Users/faizafif/mv-project/feasibility-study/.agents/skills/planning-with-files/SKILL.md) style planning:

- Keep notes and decisions in `findings.md`
- Log actions and test results in `progress.md`
- Track phases/status in `task_plan.md`

Do not overwrite existing planning content; append a clearly labeled section for this report conversion.

## Step-by-step workflow

### 1) Evaluate and design the report

1. Read the entire Markdown file end-to-end.
2. Verify heading structure:
   - `#` for the report title (cover title)
   - `##` for major sections
   - `###` for subsection blocks (content blocks)
3. Understand what the report is trying to deliver to the reader:
   - audience (exec / ops / technical)
   - key takeaways
   - calls-to-action / decisions
4. Determine the best professional visualization approach:
   - narrative-first by default
   - add charts only when they clarify quantitative comparisons
5. Decide whether to add a sample chart:
   - if the doc includes tables, scores, or repeated metrics, propose 1–2 charts
6. Re-evaluate scope:
   - confirm you can support the whole document mapping with the chosen structure

Create an outline summary + visualization proposals:

```bash
node .agents/skills/markdown-report-to-html/scripts/md-report-to-html.mjs outline path/to/report.md
```

### 2) Ask for confirmation

Ask the user to confirm:

- the outline (sections/subsections)
- the visualization plan (no charts vs. specific chart blocks)
- any content restructuring needed for clarity (heading fixes)

Do not proceed to HTML generation until the user confirms.

### 3) Build the sample HTML (static preview)

Generate a styled sample HTML preview:

```bash
node .agents/skills/markdown-report-to-html/scripts/md-report-to-html.mjs sample path/to/report.md
```

This writes `{report-name}_sample.html` next to the `.md` file by default.

### 3b) Publish the sample HTML to Storybook (`sample_report/*`)

Create a Storybook preview story that iframes the generated sample HTML, under the `sample_report` folder:

```bash
node .agents/skills/markdown-report-to-html/scripts/md-report-to-html.mjs storybook path/to/report.md
```

This writes:

- `public/sample_report/{report-name}_sample.html`
- `components/sample_report/{report-name}.stories.tsx` (Storybook title: `sample_report/{report-name}`)

### 4) Ask for confirmation

Ask the user to confirm:

- cover page quality (title, subtitle/client, metadata row)
- typography hierarchy (H1/H2/H3 mapping)
- spacing, readability, and any missing sections
- whether to enable sample chart blocks

### 5) Generate the JSON (static outline titles, dynamic content)

After confirmation, generate JSON:

```bash
node .agents/skills/markdown-report-to-html/scripts/md-report-to-html.mjs json path/to/report.md
```

Optional (only if the user confirmed adding a sample chart):

```bash
node .agents/skills/markdown-report-to-html/scripts/md-report-to-html.mjs json path/to/report.md --with-sample-chart
```

### 6) Build the final HTML (JSON-driven renderer + dynamic palette)

Generate the final renderer HTML that loads the JSON at runtime:

```bash
node .agents/skills/markdown-report-to-html/scripts/md-report-to-html.mjs report path/to/report.json
```

Palette behavior:

- The JSON contains `theme.palette`.
- The final HTML applies it to CSS variables, so colors update dynamically (not only text).

## Implementation notes

- This skill uses the project dependency `marked` to convert Markdown -> HTML.
- The HTML output is designed to work with `public/report_themes.css` and the Tailwind CDN, similar to the design reference.
- If the user wants 1:1 matching with `public/automation_assessment_sample.html`, treat that file as the source of truth for layout and adjust `assets/report_template_base.html` rather than rewriting the renderer logic.
