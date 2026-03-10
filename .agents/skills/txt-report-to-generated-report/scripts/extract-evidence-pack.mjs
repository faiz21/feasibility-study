import fs from "node:fs";
import path from "node:path";

function normalizeNewlines(value) {
  return String(value).replace(/\r\n/g, "\n");
}

function isBlank(line) {
  return !String(line ?? "").trim();
}

function isHeadingLine(line) {
  // Headings in the .txt tend to be standalone lines with surrounding blank lines.
  const trimmed = String(line ?? "").trim();
  if (!trimmed) return false;
  if (trimmed.length > 120) return false;
  // Reduce false positives for tabular rows.
  if (trimmed.includes("\t")) return false;
  return /^[A-Za-z0-9].*$/.test(trimmed);
}

function splitTabs(line) {
  return String(line)
    .split("\t")
    .map((cell) => cell.trim());
}

function parseTabTable(lines, startIndex) {
  const header = splitTabs(lines[startIndex]);
  if (header.length < 2) return null;
  const rows = [];
  let i = startIndex + 1;
  while (i < lines.length) {
    const line = lines[i];
    if (isBlank(line)) break;
    if (!String(line).includes("\t")) break;
    const cells = splitTabs(line);
    const row = {};
    for (let c = 0; c < header.length; c += 1) {
      const key = header[c] || `col_${c + 1}`;
      row[key] = cells[c] ?? "";
    }
    rows.push(row);
    i += 1;
  }
  return { header, rows, nextIndex: i };
}

const CANONICAL_SECTIONS = [
  "List Of Related Departments",
  "List Of Related Sections",
  "List Of Related Solution Proposed",
  "List Of Related Function Group / Value Stream",
  "List Of Related Procedures",
  "List Of Related KPIs",
  "List Of Process Groups",
  "List Of Equipments",
  "List Of SCADA",
  "List Of PLC",
  "List Of Vehicle",
  "List Of Findings & Notes",
  "List Of Issue",
  "List Of Process Elicitation Result",
  "List Of File Used",
];

function canonicalizeHeading(heading) {
  const trimmed = String(heading ?? "").trim();
  const direct = CANONICAL_SECTIONS.find((s) => s.toLowerCase() === trimmed.toLowerCase());
  return direct ?? trimmed;
}

function normalizeHeading(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replaceAll("&", "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function editDistance(a, b) {
  // Levenshtein distance, small inputs (headings) only.
  const s = String(a);
  const t = String(b);
  const n = s.length;
  const m = t.length;
  if (n === 0) return m;
  if (m === 0) return n;
  const dp = new Array(m + 1);
  for (let j = 0; j <= m; j += 1) dp[j] = j;
  for (let i = 1; i <= n; i += 1) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= m; j += 1) {
      const tmp = dp[j];
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);
      prev = tmp;
    }
  }
  return dp[m];
}

function findBestHeadingIndex(lines, wantedHeading) {
  const wantedNorm = normalizeHeading(wantedHeading);
  let best = { idx: -1, dist: Number.POSITIVE_INFINITY, line: "" };

  for (let i = 0; i < lines.length; i += 1) {
    const line = String(lines[i] ?? "").trim();
    if (!line) continue;
    if (line.includes("\t")) continue;
    // Heuristic: headings usually don't end with a period and are not too long.
    if (line.length > 160) continue;

    const norm = normalizeHeading(line);
    if (!norm) continue;

    // Fast path exact.
    if (norm === wantedNorm) return { idx: i, line, dist: 0 };

    // Compare prefix similarity first to avoid weird matches.
    const prefixLen = Math.min(18, wantedNorm.length, norm.length);
    if (prefixLen > 0 && wantedNorm.slice(0, prefixLen) !== norm.slice(0, prefixLen)) continue;

    const dist = editDistance(norm, wantedNorm);
    if (dist < best.dist) best = { idx: i, dist, line };
  }

  // Allow minor typos (e.g. "Strem" vs "Stream").
  return best.dist <= 4 ? best : { idx: -1, dist: Number.POSITIVE_INFINITY, line: "" };
}

function main() {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];

  if (!inputPath || !outputPath) {
    console.error("Usage: node extract-evidence-pack.mjs <input.txt> <output.json>");
    process.exit(2);
  }

  const absIn = path.resolve(process.cwd(), inputPath);
  const absOut = path.resolve(process.cwd(), outputPath);
  const text = normalizeNewlines(fs.readFileSync(absIn, "utf8"));
  const lines = text.split("\n");

  const extractionWarnings = [];
  const sections = {};

  // Pre-index headings for naive section boundary detection.
  const headingIndices = [];
  for (let i = 0; i < lines.length; i += 1) {
    const prev = lines[i - 1] ?? "";
    const line = lines[i] ?? "";
    const next = lines[i + 1] ?? "";
    if (isHeadingLine(line) && isBlank(prev) && isBlank(next)) {
      headingIndices.push(i);
    }
  }
  const headingIndexSet = new Set(headingIndices);

  function nextHeadingIndex(fromIndex) {
    for (let i = fromIndex + 1; i < lines.length; i += 1) {
      if (headingIndexSet.has(i)) return i;
    }
    return lines.length;
  }

  for (const wantedHeading of CANONICAL_SECTIONS) {
    const match = findBestHeadingIndex(lines, wantedHeading);
    const idx = match.idx;
    if (idx === -1) {
      extractionWarnings.push(`Missing section heading: ${wantedHeading}`);
      continue;
    }

    const start = idx + 1;
    const end = nextHeadingIndex(idx);
    const blockLines = lines.slice(start, end);
    const raw = blockLines.join("\n").trim();

    const parsedTables = [];
    let cursor = 0;
    while (cursor < blockLines.length) {
      if (isBlank(blockLines[cursor])) {
        cursor += 1;
        continue;
      }
      if (String(blockLines[cursor]).includes("\t")) {
        const table = parseTabTable(blockLines, cursor);
        if (table && table.rows.length) {
          parsedTables.push({ header: table.header, rows: table.rows });
          cursor = table.nextIndex + 1;
          continue;
        }
      }
      cursor += 1;
    }

    const key = canonicalizeHeading(wantedHeading);
    sections[key] = {
      heading: wantedHeading,
      matched_heading: match.line,
      matched_distance: match.dist,
      matched_line_index: idx + 1,
      raw,
      tables: parsedTables,
    };
  }

  const output = {
    schema_version: "0.1.0",
    extracted_at: new Date().toISOString(),
    input: {
      path: inputPath,
      bytes: Buffer.byteLength(text, "utf8"),
    },
    canonical_sections: CANONICAL_SECTIONS,
    sections,
    extraction_warnings: extractionWarnings,
  };

  fs.mkdirSync(path.dirname(absOut), { recursive: true });
  fs.writeFileSync(absOut, JSON.stringify(output, null, 2) + "\n", "utf8");

  if (extractionWarnings.length) {
    console.error("Extraction warnings:");
    for (const w of extractionWarnings) console.error(`- ${w}`);
  }
}

main();
