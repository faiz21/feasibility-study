import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const inputPath = path.join(
  repoRoot,
  "templates",
  "report_template",
  "template",
  "Automation_Assessment_Report.md",
);
const outputPath = path.join(repoRoot, "public", "automation_report_data_refined.json");

function normalizeNewlines(value) {
  return String(value).replace(/\r\n/g, "\n");
}

function isBlank(line) {
  return !String(line).trim();
}

function readNonEmptyLine(lines, startIndex) {
  for (let i = startIndex; i < lines.length; i += 1) {
    if (!isBlank(lines[i])) return { index: i, value: String(lines[i]).trim() };
  }
  return { index: lines.length, value: "" };
}

function stripNumbering(title) {
  return String(title)
    .replace(/^\d+\.\s+/, "")
    .replace(/^\d+\.\d+(?:\.\d+)*\s+/, "")
    .trim();
}

function parseMetadata(lines) {
  let cursor = 0;
  const title = readNonEmptyLine(lines, cursor);
  cursor = title.index + 1;

  const client = readNonEmptyLine(lines, cursor);
  cursor = client.index + 1;

  let scope = "";
  let date = "";

  while (cursor < lines.length) {
    const line = String(lines[cursor]).trim();
    if (line === "---") break;
    if (line.toLowerCase().startsWith("scope:")) scope = line.replace(/^scope:\s*/i, "").trim();
    if (line.toLowerCase().startsWith("document date:")) date = line.replace(/^document date:\s*/i, "").trim();
    cursor += 1;
  }

  return {
    metadata: {
      title: title.value,
      client: client.value,
      scope,
      date,
    },
  };
}

function splitTabs(line) {
  return String(line)
    .split("\t")
    .map((cell) => cell.trim())
    .filter((cell) => cell.length > 0);
}

function isTableMarker(line) {
  const trimmed = String(line).trim();
  return /^Column\s+\d+/i.test(trimmed) && trimmed.includes("\t");
}

function isBulletItem(line) {
  return /^\s*[*-]\s+/.test(line);
}

function bulletText(line) {
  return String(line).replace(/^\s*[*-]\s+/, "").trim();
}

function isOrderedItem(line) {
  return /^\s*\d+\.\s+/.test(line);
}

function orderedText(line) {
  return String(line).replace(/^\s*\d+\.\s+/, "").trim();
}

function isTopLevelSectionHeading(line, currentTopLevel) {
  const match = /^(\d+)\.\s+(.+)$/.exec(String(line).trim());
  if (!match) return false;
  const next = Number(match[1]);
  if (!Number.isInteger(next)) return false;
  if (next < 1 || next > 9) return false;
  if (next !== currentTopLevel + 1) return false;
  const text = match[2].trim();
  if (!text) return false;
  // Reduce false positives: lists often end in a period.
  if (text.endsWith(".")) return false;
  return true;
}

function isSubheading(line) {
  return /^\d+\.\d+(?:\.\d+)*\s+/.test(String(line).trim());
}

function parseReport(markdown) {
  const lines = normalizeNewlines(markdown).split("\n");
  const { metadata } = parseMetadata(lines);

  const sections = [];
  let currentSection = null;
  let currentTopLevel = 0;

  function ensureSection(number, title) {
    currentSection = { id: String(number), title: stripNumbering(title), components: [] };
    sections.push(currentSection);
    currentTopLevel = number;
  }

  function pushComponent(comp) {
    if (!currentSection) return;
    if (!comp) return;
    currentSection.components.push(comp);
  }

  function pushParagraph(text) {
    const content = String(text).trim();
    if (!content) return;
    pushComponent({ type: "Paragraph", content });
  }

  function pushSubheading(text) {
    const value = String(text).trim();
    if (!value) return;
    pushComponent({ type: "Subheading", text: stripNumbering(value) });
  }

  function pushHighlightList(items) {
    const cleaned = items.map((it) => String(it).trim()).filter(Boolean);
    if (!cleaned.length) return;
    pushComponent({ type: "HighlightList", items: cleaned });
  }

  function pushSimpleTable(headers, rows) {
    const cleanedHeaders = (headers ?? []).map((h) => String(h).trim()).filter(Boolean);
    const cleanedRows = (rows ?? [])
      .map((row) => row.map((cell) => String(cell).trim()))
      .filter((row) => row.some(Boolean));
    if (!cleanedHeaders.length || !cleanedRows.length) return;
    pushComponent({ type: "SimpleTable", headers: cleanedHeaders, rows: cleanedRows });
  }

  let i = 0;
  // Skip metadata preamble (up to first ---).
  while (i < lines.length && String(lines[i]).trim() !== "---") i += 1;
  while (i < lines.length && String(lines[i]).trim() === "---") i += 1;

  while (i < lines.length) {
    const line = String(lines[i] ?? "");

    if (isBlank(line)) {
      i += 1;
      continue;
    }

    if (String(line).trim() === "---") {
      i += 1;
      continue;
    }

    if (isTopLevelSectionHeading(line, currentTopLevel)) {
      const match = /^(\d+)\.\s+(.+)$/.exec(String(line).trim());
      const number = Number(match[1]);
      const title = match[2];
      ensureSection(number, title);
      i += 1;
      continue;
    }

    if (!currentSection) {
      i += 1;
      continue;
    }

    if (isSubheading(line)) {
      pushSubheading(line);
      i += 1;
      continue;
    }

    if (isTableMarker(line)) {
      const headerLine = String(lines[i + 1] ?? "");
      const headers = splitTabs(headerLine);
      const rows = [];
      let j = i + 2;
      while (j < lines.length) {
        const rowLine = String(lines[j] ?? "");
        if (isBlank(rowLine)) break;
        if (String(rowLine).trim() === "---") break;
        if (!rowLine.includes("\t")) break;
        rows.push(splitTabs(rowLine));
        j += 1;
      }
      pushSimpleTable(headers, rows);
      i = j + 1;
      continue;
    }

    if (isBulletItem(line)) {
      const items = [];
      let j = i;
      while (j < lines.length && isBulletItem(lines[j])) {
        items.push(bulletText(lines[j]));
        j += 1;
      }
      pushHighlightList(items);
      i = j;
      continue;
    }

    if (isOrderedItem(line) && !isTopLevelSectionHeading(line, currentTopLevel)) {
      const items = [];
      let j = i;
      while (j < lines.length && isOrderedItem(lines[j])) {
        items.push(orderedText(lines[j]));
        j += 1;
      }
      pushHighlightList(items);
      i = j;
      continue;
    }

    // Paragraph block (collect until a structural boundary).
    const para = [];
    let j = i;
    while (j < lines.length) {
      const l = String(lines[j] ?? "");
      if (isBlank(l)) break;
      if (String(l).trim() === "---") break;
      if (isTopLevelSectionHeading(l, currentTopLevel)) break;
      if (isSubheading(l)) break;
      if (isTableMarker(l)) break;
      if (isBulletItem(l)) break;
      if (isOrderedItem(l)) break;
      para.push(String(l).trim());
      j += 1;
    }
    pushParagraph(para.join(" "));
    i = j + 1;
  }

  return { metadata, sections };
}

function main() {
  const markdown = fs.readFileSync(inputPath, "utf8");
  const report = parseReport(markdown);

  const sectionCount = report.sections.length;
  if (sectionCount !== 9) {
    throw new Error(
      `Expected 9 top-level sections (1..9) but parsed ${sectionCount}. Check heading parsing rules.`,
    );
  }

  for (const section of report.sections) {
    if (!section.components.length) {
      throw new Error(`Section ${section.id} "${section.title}" has no components.`);
    }
  }

  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  // eslint-disable-next-line no-console
  console.log(`Wrote ${outputPath} (${sectionCount} sections).`);
}

main();

