#!/usr/bin/env node

import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_INPUT = "supabase/Reports/report_page_template.json";
const DEFAULT_OUTPUT = "supabase/Reports/Generated/html_templates";
const MAX_FILENAME_LEN = 180;

function parseArgs(argv) {
  const args = {
    input: DEFAULT_INPUT,
    output: DEFAULT_OUTPUT,
    dryRun: false,
    overwrite: true,
    strict: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--input") {
      args.input = argv[i + 1] ?? "";
      i += 1;
      continue;
    }
    if (token === "--output") {
      args.output = argv[i + 1] ?? "";
      i += 1;
      continue;
    }
    if (token === "--dry-run") {
      args.dryRun = true;
      continue;
    }
    if (token === "--strict") {
      args.strict = true;
      continue;
    }
    if (token === "--overwrite") {
      args.overwrite = true;
      continue;
    }
    if (token === "--no-overwrite") {
      args.overwrite = false;
      continue;
    }
    if (token === "--help" || token === "-h") {
      printHelp();
      process.exit(0);
    }
    throw new Error(`Unknown argument: ${token}`);
  }

  if (!args.output.trim()) {
    throw new Error("--output cannot be empty");
  }

  return args;
}

function printHelp() {
  // Keep this compact so usage is obvious from terminal.
  console.log(`Usage:
  node scripts/generate-report-page-templates-html.mjs [options]

Options:
  --input <path>        Input JSON file (default: ${DEFAULT_INPUT})
  --output <path>       Output folder (default: ${DEFAULT_OUTPUT})
  --dry-run             Print intended outputs without writing files
  --strict              Stop on first invalid record
  --overwrite           Overwrite existing files (default)
  --no-overwrite        Do not overwrite existing files
  -h, --help            Show this help
`);
}

function sanitizeTitle(title) {
  return String(title)
    .toLowerCase()
    .replace(/[\u0000-\u001f\u007f]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();
}

function buildBaseFilename(title, id) {
  const safeTitle = sanitizeTitle(title) || "untitled";
  const suffix = `-${id}`;
  const maxTitleLen = Math.max(20, MAX_FILENAME_LEN - suffix.length);
  const truncatedTitle = safeTitle.slice(0, maxTitleLen);
  return `${truncatedTitle}${suffix}`;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function resolveTitleSeed(row) {
  if (isNonEmptyString(row?.page_title)) return row.page_title.trim();
  if (isNonEmptyString(row?.title)) return row.title.trim();
  if (isNonEmptyString(row?.page_key)) return row.page_key.trim();
  return "";
}

function resolveDisplayTitle(row, id) {
  const titleSeed = resolveTitleSeed(row);
  if (titleSeed) return titleSeed;
  return `Untitled ${id}`;
}

function buildFallbackHtml(row, id) {
  const title = resolveDisplayTitle(row, id);
  const pageKey = isNonEmptyString(row?.page_key) ? row.page_key.trim() : "-";
  const reportTypeTemplateId = isNonEmptyString(row?.report_type_template_id)
    ? row.report_type_template_id.trim()
    : "-";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    :root { color-scheme: light; }
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #f5f7fb;
      color: #172033;
    }
    main {
      max-width: 720px;
      margin: 48px auto;
      padding: 32px;
      background: #ffffff;
      border: 1px solid #d8e0ee;
      border-radius: 16px;
      box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
    }
    h1 { margin: 0 0 12px; font-size: 28px; }
    p { line-height: 1.6; margin: 0 0 12px; }
    dl {
      display: grid;
      grid-template-columns: 180px 1fr;
      gap: 8px 16px;
      margin: 24px 0 0;
    }
    dt { font-weight: 700; }
    dd { margin: 0; }
    .notice {
      margin-top: 20px;
      padding: 16px;
      border-radius: 12px;
      background: #fff4e5;
      border: 1px solid #f0c36d;
      color: #7c4a03;
    }
  </style>
</head>
<body>
  <main>
    <h1>${escapeHtml(title)}</h1>
    <p>This file was generated because the source row does not contain an <code>html_template</code> value yet.</p>
    <div class="notice">Add the final HTML template into <code>report_page_template.json</code> or Supabase to replace this fallback file on the next export.</div>
    <dl>
      <dt>ID</dt>
      <dd>${escapeHtml(id)}</dd>
      <dt>Page Key</dt>
      <dd>${escapeHtml(pageKey)}</dd>
      <dt>Report Type Template ID</dt>
      <dd>${escapeHtml(reportTypeTemplateId)}</dd>
    </dl>
  </main>
</body>
</html>
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(process.cwd(), args.input);
  const outputDir = path.resolve(process.cwd(), args.output);

  let raw;
  try {
    raw = await readFile(inputPath, "utf8");
  } catch (error) {
    throw new Error(`Failed to read input JSON: ${inputPath}\n${error instanceof Error ? error.message : String(error)}`);
  }

  let rows;
  try {
    rows = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${inputPath}\n${error instanceof Error ? error.message : String(error)}`);
  }

  if (!Array.isArray(rows)) {
    throw new Error("Input JSON top-level must be an array.");
  }

  if (!args.dryRun) {
    await mkdir(outputDir, { recursive: true });
    const existingEntries = await readdir(outputDir, { withFileTypes: true });
    await Promise.all(
      existingEntries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
        .map((entry) => rm(path.join(outputDir, entry.name))),
    );
  }

  let written = 0;
  let skipped = 0;
  let collisions = 0;
  let fallbackWritten = 0;
  const skippedReasons = [];
  const usedNames = new Map();
  const lines = [];

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const id = row?.id;
    const title = resolveTitleSeed(row) || "untitled";
    const html = row?.html_template;

    if (!isNonEmptyString(id)) {
      skipped += 1;
      const reason = `index ${index}: missing id`;
      skippedReasons.push(reason);
      if (args.strict) throw new Error(reason);
      continue;
    }
    const baseName = buildBaseFilename(title, id);
    let fileName = `${baseName}.html`;
    const seenCount = usedNames.get(fileName) ?? 0;
    if (seenCount > 0) {
      collisions += 1;
      fileName = `${baseName}-dup-${seenCount}.html`;
    }
    usedNames.set(`${baseName}.html`, seenCount + 1);

    lines.push(fileName);

    if (!args.dryRun) {
      const destination = path.join(outputDir, fileName);
      if (!args.overwrite) {
        // For no-overwrite mode, preserve prior output by skipping duplicates found in this run.
        // This mode is primarily for cautious export workflows.
        try {
          await readFile(destination, "utf8");
          continue;
        } catch {
          // File does not exist yet; proceed to write.
        }
      }
      const outputHtml = isNonEmptyString(html) ? String(html) : buildFallbackHtml(row, id);
      await writeFile(destination, outputHtml, "utf8");
      written += 1;
      if (!isNonEmptyString(html)) {
        fallbackWritten += 1;
      }
    }
  }

  console.log(`Input:  ${inputPath}`);
  console.log(`Output: ${outputDir}`);
  console.log(`Total: ${rows.length}`);
  console.log(`Written: ${args.dryRun ? 0 : written}`);
  console.log(`Fallback generated: ${args.dryRun ? 0 : fallbackWritten}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Collisions: ${collisions}`);
  if (args.dryRun) {
    console.log("\nDry run targets:");
    lines.slice(0, 200).forEach((line) => console.log(`- ${line}`));
    if (lines.length > 200) {
      console.log(`... (${lines.length - 200} more)`);
    }
  }
  if (skippedReasons.length > 0) {
    console.log("\nSkipped details (first 20):");
    skippedReasons.slice(0, 20).forEach((reason) => console.log(`- ${reason}`));
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
