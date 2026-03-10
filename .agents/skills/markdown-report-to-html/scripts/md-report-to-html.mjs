import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { marked } from "marked";

function usage() {
  return `markdown-report-to-html

Commands:
  outline <input.md>
  sample  <input.md> [--out <file.html>] [--themes <report_themes.css url>] [--cover <image url>]
  storybook <input.md> [--public-dir <dir>] [--components-dir <dir>] [--title-prefix <name>] [--themes <report_themes.css url>] [--cover <image url>]
  json    <input.md> [--out <file.json>] [--with-sample-chart]
  report  <input.json> [--out <file.html>] [--data-url <report.json>] [--themes <report_themes.css url>] [--cover <image url>]

Defaults:
  - Outputs go next to the input file.
  - Sample HTML name: {report-name}_sample.html
  - JSON name: {report-name}.json
  - Final HTML name: {report-name}_report.html

Design reference:
  - public/automation_assessment_sample.html
  - public/report_themes.css
`;
}

function normalizeNewlines(input) {
  return String(input).replace(/\r\n/g, "\n");
}

function stripFrontmatter(markdown) {
  const text = normalizeNewlines(markdown);
  if (!text.startsWith("---\n")) return { frontmatter: {}, body: text };
  const end = text.indexOf("\n---\n", 4);
  if (end === -1) return { frontmatter: {}, body: text };
  const raw = text.slice(4, end).trim();
  const body = text.slice(end + "\n---\n".length);
  const frontmatter = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf(":");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!key) continue;
    frontmatter[key] = value;
  }
  return { frontmatter, body };
}

function isH1(line) {
  return /^#\s+/.test(line);
}
function isH2(line) {
  return /^##\s+/.test(line);
}
function isH3(line) {
  return /^###\s+/.test(line);
}
function headingText(line) {
  return line.replace(/^#{1,6}\s+/, "").trim();
}

function basenameNoExt(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

function defaultPalette() {
  return {
    primary: "#14b8a6",
    primaryHover: "#0d9488",
    primaryBg: "#0f766e",
    primaryBorder: "#134e4a",
    primaryText: "#99f6e4",
    bg: "#0b1220",
    surface: "#0f172a",
    text: "#e2e8f0",
    textMuted: "#94a3b8",
    border: "rgba(148, 163, 184, 0.18)",
    accentOrange: "#fb923c",
    accentRed: "#f87171",
    accentBlue: "#60a5fa",
  };
}

function mdToReportJson(markdown, { reportName, withSampleChart } = {}) {
  const { frontmatter, body } = stripFrontmatter(markdown);
  const lines = normalizeNewlines(body).split("\n");

  let titleFromH1 = "";
  let startIndex = 0;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (isH1(line)) {
      titleFromH1 = headingText(line);
      startIndex = i + 1;
    }
    break;
  }

  const metadata = {
    title: frontmatter.title || titleFromH1 || reportName || "Untitled Report",
    client: frontmatter.client || "",
    scope: frontmatter.scope || "Report",
    date: frontmatter.date || new Date().toISOString().slice(0, 10),
    status: frontmatter.status || "Draft",
  };

  const sections = [];
  let currentSection = null;
  let currentBlock = null;

  function ensureSection(title) {
    if (currentSection) return;
    currentSection = {
      id: sections.length + 1,
      title: title || "Main",
      components: [],
    };
    sections.push(currentSection);
  }

  function flushBlock() {
    if (!currentSection || !currentBlock) return;
    const md = currentBlock.markdown.join("\n").trim();
    if (!md) {
      currentBlock = null;
      return;
    }
    currentSection.components.push({
      type: "MarkdownBlock",
      title: currentBlock.title || null,
      html: marked.parse(md),
    });
    currentBlock = null;
  }

  for (let i = startIndex; i < lines.length; i += 1) {
    const line = lines[i];

    if (isH2(line)) {
      flushBlock();
      currentSection = {
        id: sections.length + 1,
        title: headingText(line) || `Section ${sections.length + 1}`,
        components: [],
      };
      sections.push(currentSection);
      currentBlock = null;
      continue;
    }

    if (isH3(line)) {
      ensureSection();
      flushBlock();
      currentBlock = { title: headingText(line), markdown: [] };
      continue;
    }

    ensureSection();
    if (!currentBlock) currentBlock = { title: null, markdown: [] };
    currentBlock.markdown.push(line);
  }
  flushBlock();

  if (withSampleChart) {
    const firstSection = sections[0];
    if (firstSection) {
      firstSection.components.push({
        type: "ChartBlock",
        title: "Sample Visualization",
        chartType: "bar",
        data: {
          label: "Score",
          labels: ["People", "Process", "Technology"],
          values: [72, 55, 63],
        },
      });
    }
  }

  return {
    metadata,
    theme: { palette: defaultPalette() },
    sections,
  };
}

function reportOutline(markdown, { reportName } = {}) {
  const { frontmatter, body } = stripFrontmatter(markdown);
  const lines = normalizeNewlines(body).split("\n");

  const outline = [];
  const vizHints = [];

  const firstH1Line = lines.find((line) => isH1(line));
  const title = frontmatter.title || (firstH1Line ? headingText(firstH1Line) : "") || reportName || "Untitled Report";

  outline.push(`# ${title}`);

  for (const line of lines) {
    if (isH2(line)) outline.push(`- ## ${headingText(line)}`);
    else if (isH3(line)) outline.push(`  - ### ${headingText(line)}`);

    if (/^\s*\|/.test(line) && /\|/.test(line)) {
      if (!vizHints.includes("Detected table(s): consider a bar/line chart.")) {
        vizHints.push("Detected table(s): consider a bar/line chart.");
      }
    }
    if (/(\d+)\s*%/.test(line)) {
      if (!vizHints.includes("Detected percentages: consider a stacked bar or KPI cards.")) {
        vizHints.push("Detected percentages: consider a stacked bar or KPI cards.");
      }
    }
  }

  if (vizHints.length === 0) {
    vizHints.push(
      "No obvious quantitative blocks detected: keep this report narrative-first (no charts), unless the reader benefits from a simple summary chart.",
    );
  }

  return { outline: outline.join("\n"), vizHints };
}

async function readTemplateBase() {
  const templatePath = new URL("../assets/report_template_base.html", import.meta.url);
  return fs.readFile(templatePath, "utf8");
}

function renderTemplate(htmlTemplate, variables) {
  return String(htmlTemplate).replace(/{{([A-Z0-9_]+)}}/g, (_, key) => {
    const value = variables[key];
    return value === undefined ? "" : String(value);
  });
}

function needsChartJs(data) {
  for (const section of data?.sections || []) {
    for (const comp of section?.components || []) {
      if (comp?.type === "ChartBlock") return true;
    }
  }
  return false;
}

function toStoryIdPart(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "report";
}

function toFileBase(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "report";
}

async function cmdStorybook(inputMdPath, flags) {
  const markdown = await fs.readFile(inputMdPath, "utf8");
  const reportNameRaw = basenameNoExt(inputMdPath);

  const titlePrefix = flags.titlePrefix || "sample_report";
  const storyId = toStoryIdPart(reportNameRaw);
  const fileBase = toFileBase(reportNameRaw);

  const publicDir = flags.publicDir || path.join(process.cwd(), "public", "sample_report");
  const componentsDir =
    flags.componentsDir || path.join(process.cwd(), "components", "sample_report");

  const publicHtmlName = `${fileBase}_sample.html`;
  const publicHtmlPath = path.join(publicDir, publicHtmlName);
  const storyPath = path.join(componentsDir, `${fileBase}.stories.tsx`);

  await fs.mkdir(publicDir, { recursive: true });
  await fs.mkdir(componentsDir, { recursive: true });

  // Generate the sample HTML directly into /public so Storybook can iframe it.
  const reportName = reportNameRaw;
  const data = mdToReportJson(markdown, { reportName, withSampleChart: false });
  const templateBase = await readTemplateBase();
  const chartJsTag = needsChartJs(data)
    ? '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js"></script>'
    : "";

  const html = renderTemplate(templateBase, {
    TITLE: `${data.metadata.title} (Sample)`,
    MODE: "sample",
    DATA_URL: "",
    DATA_JSON: JSON.stringify(data),
    // Use an absolute path so nested `public/sample_report/...` still finds the CSS in `public/`.
    REPORT_THEMES_CSS_URL: flags.themes || "/report_themes.css",
    COVER_IMAGE_URL:
      flags.cover ||
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop",
    CHART_JS_TAG: chartJsTag,
  });

  await fs.writeFile(publicHtmlPath, html, "utf8");

  const storyTitle = `${titlePrefix}/${storyId}`;
  const storySource = `import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: ${JSON.stringify(storyTitle)},
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj;

export const Sample: Story = {
  render: () => (
    <div style={{ height: "100vh", width: "100%" }}>
      <iframe
        title=${JSON.stringify(`${data.metadata.title} (Sample)`)}
        src=${JSON.stringify(`/sample_report/${publicHtmlName}`)}
        style={{ width: "100%", height: "100%", border: 0 }}
      />
    </div>
  ),
};
`;

  await fs.writeFile(storyPath, storySource, "utf8");

  process.stdout.write(`${publicHtmlPath}\n${storyPath}`);
}

async function cmdOutline(inputPath) {
  const markdown = await fs.readFile(inputPath, "utf8");
  const result = reportOutline(markdown, { reportName: basenameNoExt(inputPath) });
  process.stdout.write(`${result.outline}\n\n## Visualization suggestions\n`);
  for (const hint of result.vizHints) process.stdout.write(`- ${hint}\n`);
}

async function cmdJson(inputPath, flags) {
  const markdown = await fs.readFile(inputPath, "utf8");
  const reportName = basenameNoExt(inputPath);
  const outPath = flags.out || path.join(path.dirname(inputPath), `${reportName}.json`);
  const data = mdToReportJson(markdown, {
    reportName,
    withSampleChart: Boolean(flags.withSampleChart),
  });
  await fs.writeFile(outPath, JSON.stringify(data, null, 2), "utf8");
  process.stdout.write(outPath);
}

async function cmdSample(inputPath, flags) {
  const markdown = await fs.readFile(inputPath, "utf8");
  const reportName = basenameNoExt(inputPath);
  const outPath = flags.out || path.join(path.dirname(inputPath), `${reportName}_sample.html`);
  const data = mdToReportJson(markdown, { reportName, withSampleChart: false });

  const templateBase = await readTemplateBase();
  const chartJsTag = needsChartJs(data)
    ? '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js"></script>'
    : "";

  const html = renderTemplate(templateBase, {
    TITLE: `${data.metadata.title} (Sample)`,
    MODE: "sample",
    DATA_URL: "",
    DATA_JSON: JSON.stringify(data),
    REPORT_THEMES_CSS_URL: flags.themes || "report_themes.css",
    COVER_IMAGE_URL:
      flags.cover ||
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop",
    CHART_JS_TAG: chartJsTag,
  });

  await fs.writeFile(outPath, html, "utf8");
  process.stdout.write(outPath);
}

async function cmdReport(inputJsonPath, flags) {
  const jsonText = await fs.readFile(inputJsonPath, "utf8");
  const data = JSON.parse(jsonText);
  const reportName = basenameNoExt(inputJsonPath);
  const outPath = flags.out || path.join(path.dirname(inputJsonPath), `${reportName}_report.html`);

  const templateBase = await readTemplateBase();
  const chartJsTag = needsChartJs(data)
    ? '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js"></script>'
    : "";

  const dataUrl = flags.dataUrl || path.basename(inputJsonPath);
  const html = renderTemplate(templateBase, {
    TITLE: `${data?.metadata?.title || reportName} (Report)`,
    MODE: "report",
    DATA_URL: dataUrl,
    DATA_JSON: "null",
    REPORT_THEMES_CSS_URL: flags.themes || "report_themes.css",
    COVER_IMAGE_URL:
      flags.cover ||
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop",
    CHART_JS_TAG: chartJsTag,
  });

  await fs.writeFile(outPath, html, "utf8");
  process.stdout.write(outPath);
}

function parseFlags(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    if (key === "with-sample-chart") {
      flags.withSampleChart = true;
      continue;
    }
    const value = argv[i + 1];
    flags[key.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
    i += 1;
  }
  return flags;
}

async function main() {
  const [, , command, input, ...rest] = process.argv;
  if (!command || command === "--help" || command === "-h") {
    process.stdout.write(usage());
    return;
  }
  if (!input) {
    process.stderr.write("Missing input path.\n");
    process.stderr.write(usage());
    process.exitCode = 1;
    return;
  }

  const flags = parseFlags(rest);
  if (command === "outline") {
    await cmdOutline(input);
    return;
  }
  if (command === "json") {
    await cmdJson(input, flags);
    return;
  }
  if (command === "sample") {
    await cmdSample(input, flags);
    return;
  }
  if (command === "storybook") {
    await cmdStorybook(input, flags);
    return;
  }
  if (command === "report") {
    await cmdReport(input, flags);
    return;
  }

  process.stderr.write(`Unknown command: ${command}\n`);
  process.stderr.write(usage());
  process.exitCode = 1;
}

await main();
