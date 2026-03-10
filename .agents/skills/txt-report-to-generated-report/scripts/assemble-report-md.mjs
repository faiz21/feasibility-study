import fs from "node:fs";
import path from "node:path";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function listStepOutputs(runDir) {
  return fs
    .readdirSync(runDir)
    .filter((name) => /^step-\d{2}\.enriched\.json$/i.test(name))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
}

function safeText(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") return value;
  return String(value);
}

function mdEscape(value) {
  return safeText(value).replaceAll("\r", "").trim();
}

function formatActions(actions) {
  if (!Array.isArray(actions) || !actions.length) return "_No actions provided._";
  return actions
    .map((a) => {
      const action = mdEscape(a?.action ?? "");
      const priority = mdEscape(a?.priority ?? "");
      const owner = mdEscape(a?.owner ?? "");
      const weeks = a?.timeline_weeks ?? "";
      return `- **${priority || "P?"}** ${action}${owner ? ` (Owner: ${owner})` : ""}${weeks ? ` (Weeks: ${weeks})` : ""}`;
    })
    .join("\n");
}

function formatCharts(charts) {
  if (!Array.isArray(charts) || !charts.length) return "_No charts provided._";
  return charts
    .map((c) => `- \`${mdEscape(c?.chart_id ?? "")}\` (${mdEscape(c?.type ?? "")}): ${mdEscape(c?.title ?? "")}\n  - Insight: ${mdEscape(c?.insight ?? "")}`)
    .join("\n");
}

function main() {
  const runDir = process.argv[2];
  const outPath = process.argv[3];
  if (!runDir || !outPath) {
    console.error("Usage: node assemble-report-md.mjs <runDir> <output.md>");
    process.exit(2);
  }

  const absRun = path.resolve(process.cwd(), runDir);
  const absOut = path.resolve(process.cwd(), outPath);

  const stepFiles = listStepOutputs(absRun);
  if (!stepFiles.length) {
    console.error(`No step outputs found in: ${absRun}`);
    process.exit(2);
  }

  const steps = stepFiles.map((name) => readJson(path.join(absRun, name)));
  const first = steps[0] ?? {};

  const title = mdEscape(first?.metadata?.company ?? "Plant Report") + " - Generated Report";
  const company = mdEscape(first?.metadata?.company ?? "");
  const plant = mdEscape(first?.metadata?.plant ?? "");
  const reportDate = mdEscape(first?.metadata?.report_date ?? "");
  const documentId = mdEscape(first?.metadata?.document_id ?? "");
  const status = mdEscape(first?.metadata?.status ?? "");

  const lines = [];
  lines.push(`# ${title}`);
  lines.push("");
  lines.push(`- Company: ${company || "-"}`);
  lines.push(`- Plant: ${plant || "-"}`);
  lines.push(`- Report date: ${reportDate || "-"}`);
  lines.push(`- Document ID: ${documentId || "-"}`);
  lines.push(`- Status: ${status || "-"}`);
  lines.push("");

  for (const step of steps) {
    const stepNo = step?.source_step ?? "";
    const appendix = mdEscape(step?.report_profile?.appendix_code ?? "");
    const stepTitle = mdEscape(step?.report_profile?.title ?? `Step ${stepNo}`);
    const overallScore = safeText(step?.analysis_360?.overall_score ?? "");
    const overallLevel = mdEscape(step?.analysis_360?.overall_level ?? "");
    const execSummary = mdEscape(step?.narrative_pack?.executive_summary ?? "");
    const keyFindings = Array.isArray(step?.analysis_360?.key_findings)
      ? step.analysis_360.key_findings.map((f) => `- ${mdEscape(f)}`).join("\n")
      : "_No key findings provided._";

    lines.push(`## ${appendix ? `${appendix} - ` : ""}${stepTitle}`);
    lines.push("");
    lines.push(`- Step: ${stepNo}`);
    lines.push(`- Overall: ${overallScore}${overallLevel ? ` (${overallLevel})` : ""}`);
    lines.push("");

    if (execSummary) {
      lines.push("### Executive Summary");
      lines.push(execSummary);
      lines.push("");
    }

    lines.push("### Key Findings");
    lines.push(keyFindings);
    lines.push("");

    lines.push("### Recommended Actions");
    lines.push(formatActions(step?.narrative_pack?.recommended_actions));
    lines.push("");

    lines.push("### Charts");
    lines.push(formatCharts(step?.visualization_pack?.charts));
    lines.push("");
  }

  fs.mkdirSync(path.dirname(absOut), { recursive: true });
  fs.writeFileSync(absOut, lines.join("\n") + "\n", "utf8");
  console.log(`Wrote ${absOut}`);
}

main();

