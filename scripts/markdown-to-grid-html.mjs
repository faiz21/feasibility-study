import fs from "node:fs";
import path from "node:path";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function tokenizePath(inputPath) {
  return String(inputPath)
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .map((part) => part.trim())
    .filter(Boolean);
}

function getByPath(input, inputPath) {
  if (!inputPath) return input;
  const tokens = tokenizePath(inputPath);
  let current = input;

  for (const token of tokens) {
    if (current === null || current === undefined) return undefined;
    if (Array.isArray(current)) {
      const index = Number(token);
      if (!Number.isInteger(index)) return undefined;
      current = current[index];
      continue;
    }
    if (typeof current !== "object") return undefined;
    current = current[token];
  }

  return current;
}

function toStringValue(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}

function toPrettyJson(value) {
  return JSON.stringify(value ?? null, null, 2);
}

function renderExpression(content, expression, raw) {
  const expr = String(expression).trim();
  const isJsonExpr = expr.startsWith("json:");
  const valuePath = isJsonExpr ? expr.slice("json:".length).trim() : expr;
  const resolved = getByPath(content, valuePath);
  const value = isJsonExpr ? toPrettyJson(resolved) : toStringValue(resolved);
  return raw ? value : escapeHtml(value);
}

function renderTemplate(htmlTemplate, content) {
  return String(htmlTemplate)
    .replace(/{{{\s*([^{}]+)\s*}}}/g, (_, expression) => renderExpression(content, expression, true))
    .replace(/{{\s*([^{}]+)\s*}}/g, (_, expression) => renderExpression(content, expression, false));
}

function slugify(text, used) {
  const base = String(text)
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

  const nextCount = (used.get(base) ?? 0) + 1;
  used.set(base, nextCount);
  return nextCount === 1 ? base : `${base}-${nextCount}`;
}

function normalizeNewlines(input) {
  return String(input).replace(/\r\n/g, "\n");
}

function isFenceStart(line) {
  return /^\s*```/.test(line);
}

function parseFenceInfo(line) {
  const match = /^\s*```(\w+)?\s*$/.exec(line);
  return { lang: match?.[1] ?? "" };
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
  return line.replace(/^#{1,3}\s+/, "").trim();
}

function isUlItem(line) {
  return /^\s*[-*]\s+/.test(line);
}
function isOlItem(line) {
  return /^\s*\d+\.\s+/.test(line);
}
function listItemText(line) {
  return line
    .replace(/^\s*[-*]\s+/, "")
    .replace(/^\s*\d+\.\s+/, "")
    .trim();
}

function isBlockquote(line) {
  return /^\s*>\s+/.test(line);
}
function blockquoteText(line) {
  return line.replace(/^\s*>\s+/, "").trim();
}

function renderInlineMinimal(text) {
  const escaped = escapeHtml(text);
  // Minimal inline formatting (safe because the source is escaped first).
  return escaped
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function markdownToGridBlocks(markdown) {
  const lines = normalizeNewlines(markdown).split("\n");
  const usedSlugs = new Map();

  const out = [];
  let openCard = false;
  let seenFirstH1 = false;
  const preamble = [];

  function closeCard() {
    if (!openCard) return;
    out.push("</div></article>");
    openCard = false;
  }

  function emitOutside(innerHtml, extraClasses = "") {
    out.push(`<div class="block prose span-12 ${extraClasses}">${innerHtml}</div>`);
  }

  function emitNarrative(innerHtml) {
    emitOutside(innerHtml, "span-lg-8center");
  }

  function emitInContext(innerHtml, { narrative = true } = {}) {
    if (openCard) out.push(innerHtml);
    else if (narrative) emitNarrative(innerHtml);
    else emitOutside(innerHtml);
  }

  let i = 0;
  let firstH1Title = "";

  function isTableSeparator(line) {
    return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
  }

  function isTableRow(line) {
    const trimmed = String(line).trim();
    if (!trimmed) return false;
    if (!trimmed.includes("|")) return false;
    // Heuristic: must have at least two pipes.
    return (trimmed.match(/\|/g) || []).length >= 2;
  }

  function splitTableRow(line) {
    const raw = String(line).trim();
    const normalized = raw.startsWith("|") ? raw : `|${raw}`;
    const normalized2 = normalized.endsWith("|") ? normalized : `${normalized}|`;
    const parts = normalized2.split("|").slice(1, -1);
    return parts.map((cell) => cell.trim());
  }

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (isH1(line)) {
      closeCard();
      const title = headingText(line);
      if (!firstH1Title) firstH1Title = title;
      seenFirstH1 = true;
      const id = slugify(title, usedSlugs);
      out.push(
        `<section class="block h1-block span-12" id="${escapeHtml(id)}"><h2><a class="anchor" href="#${escapeHtml(id)}">${renderInlineMinimal(
          title,
        )}</a></h2></section>`,
      );
      i += 1;
      continue;
    }

    if (isH2(line)) {
      closeCard();
      const title = headingText(line);
      const id = slugify(title, usedSlugs);
      out.push(
        `<section class="block h2-block span-12" id="${escapeHtml(id)}"><h3><a class="anchor" href="#${escapeHtml(id)}">${renderInlineMinimal(
          title,
        )}</a></h3></section>`,
      );
      i += 1;
      continue;
    }

    if (isH3(line)) {
      closeCard();
      const title = headingText(line);
      const id = slugify(title, usedSlugs);
      out.push(
        `<article class="block card-block span-12 span-lg-4" id="${escapeHtml(
          id,
        )}"><h4><a class="anchor" href="#${escapeHtml(id)}">${renderInlineMinimal(
          title,
        )}</a></h4><div class="prose">`,
      );
      openCard = true;
      i += 1;
      continue;
    }

    if (!seenFirstH1) {
      // Capture preamble (e.g., "Mode: Draft") for the cover badge.
      preamble.push(line.trim());
      i += 1;
      continue;
    }

    // GitHub-flavored markdown tables
    if (isTableRow(line) && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const headers = splitTableRow(line);
      i += 2; // skip header + separator
      const rows = [];
      while (i < lines.length && isTableRow(lines[i])) {
        const row = splitTableRow(lines[i]);
        rows.push(row);
        i += 1;
      }

      const thead = `<thead><tr>${headers
        .map((h) => `<th>${renderInlineMinimal(h)}</th>`)
        .join("")}</tr></thead>`;
      const tbody = `<tbody>${rows
        .map(
          (row) =>
            `<tr>${headers
              .map((_, idx) => `<td>${renderInlineMinimal(row[idx] ?? "")}</td>`)
              .join("")}</tr>`,
        )
        .join("")}</tbody>`;

      emitInContext(
        `<div class="table-wrap"><table class="tbl">${thead}${tbody}</table></div>`,
        { narrative: false },
      );
      continue;
    }

    if (isFenceStart(line)) {
      const { lang } = parseFenceInfo(line);
      const fenceLang = lang ? ` data-lang="${escapeHtml(lang)}"` : "";
      i += 1;
      const codeLines = [];
      while (i < lines.length && !isFenceStart(lines[i])) {
        codeLines.push(lines[i]);
        i += 1;
      }
      if (i < lines.length && isFenceStart(lines[i])) i += 1;
      const code = escapeHtml(codeLines.join("\n"));
      emitInContext(`<pre${fenceLang}><code>${code}</code></pre>`, { narrative: true });
      continue;
    }

    if (isUlItem(line) || isOlItem(line)) {
      const ordered = isOlItem(line);
      const items = [];
      while (i < lines.length && (isUlItem(lines[i]) || isOlItem(lines[i]))) {
        items.push(listItemText(lines[i]));
        i += 1;
      }
      const tag = ordered ? "ol" : "ul";
      const lis = items.map((t) => `<li>${renderInlineMinimal(t)}</li>`).join("");
      emitInContext(`<${tag}>${lis}</${tag}>`, { narrative: true });
      continue;
    }

    if (isBlockquote(line)) {
      const parts = [];
      while (i < lines.length && isBlockquote(lines[i])) {
        parts.push(blockquoteText(lines[i]));
        i += 1;
      }
      emitInContext(`<blockquote><p>${renderInlineMinimal(parts.join(" "))}</p></blockquote>`, { narrative: true });
      continue;
    }

    // Paragraph
    const paragraphLines = [];
    while (i < lines.length) {
      const candidate = lines[i];
      if (!candidate.trim()) break;
      if (isH1(candidate) || isH2(candidate) || isH3(candidate)) break;
      if (isFenceStart(candidate) || isUlItem(candidate) || isOlItem(candidate) || isBlockquote(candidate))
        break;
      if (isTableRow(candidate) && i + 1 < lines.length && isTableSeparator(lines[i + 1])) break;
      paragraphLines.push(candidate.trim());
      i += 1;
    }
    const paragraphText = paragraphLines.join(" ");
    emitInContext(`<p>${renderInlineMinimal(paragraphText)}</p>`, { narrative: true });
  }

  closeCard();

  return { html: out.join("\n"), title: firstH1Title, preamble };
}

function parseArgs(argv) {
  const args = { template: "", input: "", output: "" };
  const rest = [];

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--template") {
      args.template = argv[i + 1] ?? "";
      i += 1;
      continue;
    }
    rest.push(token);
  }

  args.input = rest[0] ?? "";
  args.output = rest[1] ?? "";
  return args;
}

function usage() {
  const cmd = path.basename(process.argv[1] ?? "markdown-to-grid-html.mjs");
  return [
    "Markdown → Grid HTML",
    "",
    `Usage: node scripts/${cmd} <input.md> <output.html> [--template <template.html>]`,
    "",
    "Defaults:",
    "- template: templates/markdown_grid/markdown-grid-template.html",
  ].join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.input || !args.output) {
    console.error(usage());
    process.exit(1);
  }

  const inputPath = path.resolve(process.cwd(), args.input);
  const outputPath = path.resolve(process.cwd(), args.output);
  const templatePath = path.resolve(
    process.cwd(),
    args.template || "templates/markdown_grid/markdown-grid-template.html",
  );

  const markdown = fs.readFileSync(inputPath, "utf8");
  const template = fs.readFileSync(templatePath, "utf8");

  const { html, title, preamble } = markdownToGridBlocks(markdown);
  const inferredTitle = title || path.basename(inputPath, path.extname(inputPath));
  const preambleHtml = (preamble || [])
    .filter(Boolean)
    .map((line) => `<span class="chip">${renderInlineMinimal(line)}</span>`)
    .join("");

  const model = {
    document: { title: inferredTitle },
    content: { html, preamble_html: preambleHtml, source_path: args.input },
    generated: { at: new Date().toISOString() },
    theme_css_vars: "",
  };

  const rendered = renderTemplate(template, model);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, rendered, "utf8");
  process.stdout.write(`${outputPath}\n`);
}

main().catch((error) => {
  console.error(error?.stack || error?.message || String(error));
  process.exit(1);
});
