#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_INPUT = "supabase/Reports/report_page_template.json";
const TEMPLATE_PATH = "scripts/report-template-library/house-report-template.html";

const ROW_OVERRIDES = new Map([
  ["0387c6bb-eafe-451e-89c9-19c7f3c08806", { title: "Digital Solution Concept", family: "digital-solution" }],
  ["1d087919-6313-483e-8cb2-f8aafdf4c4c9", { title: "Appendix D - Control Layer Scope - PLC Inventory", family: "appendix" }],
  ["3bbc7876-2e66-4dd5-8f68-3dcb343103cd", { title: "Governed Generic Report Template", family: "generic", builder: "generic", pageKey: "GENERIC" }],
  ["4e580831-6033-41d4-bc71-7087750df548", { title: "Main Report", family: "overview", builder: "main", pageKey: "MAIN REPORT" }],
  ["51d1fe3d-a3df-4b71-95d8-3f37a0cfc858", { title: "Appendix K - Evidence Registers - Findings, Notes, and Issues", family: "appendix" }],
  ["56daed1b-9310-4ffa-a494-d785d7643706", { title: "Appendix N - Vertical Integration - OT / IT Systems Evaluation", family: "appendix" }],
  ["5bed0ef5-fa0a-4a10-a0a7-4a0d49fdfad2", { title: "Appendix M - Scoring Results - Plant Maturity Assessment Matrix", family: "appendix" }],
  ["5d6becbe-a47d-4e24-b36f-3c686948c29c", { title: "Function Group Report", family: "function-group" }],
  ["64c33e49-4f7a-451e-8cba-205697780b3d", { title: "Overview", family: "overview", builder: "overview", pageKey: "OVERVIEW" }],
  ["67a58c25-cad0-4444-ba33-a999936ec4ec", { title: "Appendix H - Functional Scope - Function Groups / Value Streams", family: "appendix" }],
  ["87721490-8138-47a2-b470-9cc3cd0fcd7c", { title: "Appendix B - Process Architecture - Process Groups Inventory", family: "appendix" }],
  ["9444fac3-2dc2-45e7-9bd0-e80fa2c1f73b", { title: "Appendix O - Automation Audit Report - Blank Template", family: "appendix", builder: "appendix-o", pageKey: "APP O" }],
  ["946253ea-7464-4eff-992b-bc1fb25d04b5", { title: "Appendix I - Procedural Scope - Procedures Covered", family: "appendix" }],
  ["9b8212d1-32b4-4cd3-a712-3699a3e1fc74", { title: "Appendix F - Mobile Assets - Vehicle & Mobile Asset Inventory", family: "appendix" }],
  ["a0429cd4-4be0-4d1a-afaa-ccae126f74c1", { title: "Appendix L - Audit Evaluation Framework - Parameter Dictionary & Scoring Logic", family: "appendix" }],
  ["a53906ac-c9fa-426e-bc44-37162da8e142", { title: "Overview", family: "overview", builder: "overview", pageKey: "OVERVIEW" }],
  ["b847ab18-0371-45a9-9988-d30a5ae1333e", { title: "Appendix C - Asset Scope - Equipment Inventory", family: "appendix" }],
  ["bb1e10b4-ca51-48b0-bbcf-d9856be58bb7", { title: "Overview", family: "overview", builder: "overview", pageKey: "OVERVIEW" }],
  ["bfa347c5-2f3a-4642-aad5-93cee38524f7", { title: "Appendix J - Performance Scope - KPIs & Performance Measures", family: "appendix" }],
  ["c8cda7f5-b0f6-40f6-8b06-e145c8ac609a", { title: "Cybersecurity Assessment Report", family: "cybersecurity" }],
  ["cd83fb71-31b1-47cf-8a30-e05d5ad939a2", { title: "Appendix E - Supervisory Control Scope - SCADA / DCS Inventory", family: "appendix" }],
  ["cdc1bf62-b65e-4e60-b951-1ecf7d95b657", { title: "Appendix A - Material & Manufacturing Architecture", family: "appendix" }],
  ["e7b63006-fa62-42a9-a9a8-6fcb0536bd59", { title: "Appendix G - Organizational Scope - Departments & Sections Involved", family: "appendix" }],
  ["e9ea90be-1324-4931-93a5-b6445fd98d98", { title: "Automation Assessment Report", family: "automation" }],
]);

const FAMILY_PALETTES = {
  appendix: { tint50: "#eff6ff", tint100: "#dbeafe", tint800: "#1e40af", primary: "#3b82f6", accent: "#0ea5e9", dark: "#0f172a", roadmapBg: "#1e293b" },
  overview: { tint50: "#eff6ff", tint100: "#dbeafe", tint800: "#1e40af", primary: "#3b82f6", accent: "#0ea5e9", dark: "#0f172a", roadmapBg: "#1e293b" },
  cybersecurity: { tint50: "#fef2f2", tint100: "#fee2e2", tint800: "#991b1b", primary: "#ef4444", accent: "#14b8a6", dark: "#0f172a", roadmapBg: "#111827" },
  automation: { tint50: "#f0fdfa", tint100: "#ccfbf1", tint800: "#0f766e", primary: "#14b8a6", accent: "#0ea5e9", dark: "#0f172a", roadmapBg: "#134e4a" },
  "function-group": { tint50: "#eef2ff", tint100: "#e0e7ff", tint800: "#3730a3", primary: "#4f46e5", accent: "#10b981", dark: "#0f172a", roadmapBg: "#1e293b" },
  "digital-solution": { tint50: "#f0f9ff", tint100: "#e0f2fe", tint800: "#075985", primary: "#0ea5e9", accent: "#14b8a6", dark: "#0f172a", roadmapBg: "#1e293b" },
  generic: { tint50: "#f8fafc", tint100: "#e2e8f0", tint800: "#334155", primary: "#475569", accent: "#0ea5e9", dark: "#0f172a", roadmapBg: "#1e293b" },
};

function parseArgs(argv) {
  const args = { input: DEFAULT_INPUT };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--input") {
      args.input = argv[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (token === "-h" || token === "--help") {
      console.log("Usage: node scripts/normalize-report-page-templates.mjs [--input path]");
      process.exit(0);
    }
    throw new Error(`Unknown argument: ${token}`);
  }
  return args;
}

function extractEmbeddedData(html) {
  const match = String(html || "").match(/<script[^>]+id=["']report-data["'][^>]*>([\s\S]*?)<\/script>/i);
  if (!match) return null;
  try {
    return JSON.parse(match[1].trim());
  } catch {
    return null;
  }
}

function normalizeTheme(theme, family) {
  const palette = FAMILY_PALETTES[family] || FAMILY_PALETTES.generic;
  return {
    ...palette,
    ...(theme || {}),
    tint50: theme?.tint50 || palette.tint50,
    tint100: theme?.tint100 || palette.tint100,
    tint800: theme?.tint800 || palette.tint800,
    primary: theme?.primary || palette.primary,
    accent: theme?.accent || palette.accent,
    dark: theme?.dark || palette.dark,
    roadmapBg: theme?.roadmapBg || palette.roadmapBg,
  };
}

function heroFor(family, title) {
  const lower = String(title || "").toLowerCase();
  if (family === "cybersecurity") return "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop";
  if (family === "automation") return "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop";
  if (family === "function-group") return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop";
  if (family === "digital-solution") return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2670&auto=format&fit=crop";
  if (lower.includes("control") || lower.includes("plc")) return "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2670&auto=format&fit=crop";
  if (lower.includes("scada") || lower.includes("integration")) return "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2668&auto=format&fit=crop";
  if (lower.includes("mobile")) return "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2670&auto=format&fit=crop";
  if (lower.includes("organizational")) return "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2670&auto=format&fit=crop";
  if (lower.includes("procedural") || lower.includes("performance")) return "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2670&auto=format&fit=crop";
  if (lower.includes("material") || lower.includes("process") || lower.includes("asset")) return "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop";
  if (lower.includes("overview") || lower.includes("main report")) return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop";
  return "https://images.unsplash.com/photo-1580982331584-3c588cf4ecfb?q=80&w=2670&auto=format&fit=crop";
}

function baseOverviewData(title, subtitle, scopeLabel) {
  return {
    theme: normalizeTheme({}, "overview"),
    metadata: {
      title,
      subtitle,
      documentId: scopeLabel,
      company: "Client Name",
      plant: "Site / Business Unit",
      date: "March 2026",
      status: "Template Ready",
      templateFamily: "overview",
    },
    highlights: [
      { label: "Audience", value: "Executive Steering Team" },
      { label: "Scope", value: "Management Overview" },
      { label: "Use Case", value: "Client Report Framing" },
      { label: "Mode", value: "Reusable Template" },
    ],
    sections: {
      summary: {
        title: "Executive Summary",
        subtitle: "House-standard management overview structure",
        text: "This governed template is designed for executive summaries, management briefings, and report landing pages. It keeps all report content inside the embedded JSON payload and renders the full page from JavaScript so the output stays portable and deterministic.",
        takeaway: "Use this shell for overview pages that need polished narrative framing, KPI snapshots, priority stacks, and a clear roadmap without depending on external assets or local data files.",
      },
      scorecard: {
        title: "Summary KPIs",
        subtitle: "Replace these with report-specific metrics",
        metrics: [
          { label: "Priority Streams", value: "4", subtext: "Strategic work packages" },
          { label: "Executive Risks", value: "3", subtext: "Escalated items" },
          { label: "Decision Gates", value: "2", subtext: "Immediate approvals" },
          { label: "Data Sources", value: "6", subtext: "Validated inputs" },
          { label: "Owner Groups", value: "5", subtext: "Cross-functional" },
          { label: "Reporting Cadence", value: "Monthly", subtext: "Recommended" },
        ],
      },
      focusAreas: {
        title: "Focus Areas",
        subtitle: "Core narrative modules for an overview page",
        cards: [
          {
            title: "Executive Framing",
            text: "Open with a concise statement that explains why the report matters, what changed, and what leadership should pay attention to first.",
            bullets: ["What happened", "Why it matters", "What decision is required"],
          },
          {
            title: "Performance Snapshot",
            text: "Translate detailed evidence into a compact scorecard so the overview page can stand alone before readers open appendices or deeper sections.",
            bullets: ["KPI summary", "Risk posture", "Strategic signal"],
          },
          {
            title: "Action Direction",
            text: "End the page with a prioritised action stack and roadmap so the page drives decisions instead of only summarising context.",
            bullets: ["Immediate actions", "Owners", "Timing"],
          },
        ],
      },
      priorities: {
        title: "Priority Stack",
        subtitle: "Example structure for executive action items",
        items: [
          { title: "Stabilise Inputs", text: "Confirm the evidence base, reporting cadence, and owner accountability before making downstream commitments.", owner: "Program Lead", timing: "0-30 Days" },
          { title: "Align Decisions", text: "Use the overview to collapse detailed analysis into a small set of leadership decisions with explicit tradeoffs.", owner: "Steering Committee", timing: "30-60 Days" },
          { title: "Mobilise Execution", text: "Translate priorities into sequenced workstreams with measurable checkpoints and clear operational ownership.", owner: "Workstream Owners", timing: "60-90 Days" },
        ],
      },
      roadmap: {
        title: "Recommended Roadmap",
        subtitle: "Phase-based execution framing",
        phases: [
          { phase: "Phase 1", title: "Baseline", duration: "0-30 Days", focus: "Confirm scope, owners, and required evidence." },
          { phase: "Phase 2", title: "Decision", duration: "30-60 Days", focus: "Prioritise actions and lock executive commitments." },
          { phase: "Phase 3", title: "Mobilise", duration: "60-90 Days", focus: "Launch delivery workstreams and reporting cadence." },
          { phase: "Phase 4", title: "Review", duration: "90+ Days", focus: "Measure outcomes and refine next-wave priorities." },
        ],
      },
      referenceMap: {
        title: "Reference Map",
        subtitle: "Suggested appendix linkage",
        columns: ["Section", "Purpose", "Typical Source"],
        rows: [
          ["Executive Summary", "Board-ready narrative", "Main report body"],
          ["Summary KPIs", "High-signal performance snapshot", "Analytical appendix tables"],
          ["Priority Stack", "Decision-oriented actions", "Workshop outputs / recommendations"],
          ["Roadmap", "Sequenced next steps", "Program planning artifacts"],
        ],
      },
    },
  };
}

function buildMainReportData() {
  const data = baseOverviewData("Main Report", "Management overview and decision summary", "MAIN REPORT");
  data.metadata.company = "Client Portfolio";
  data.metadata.plant = "Multi-site Program";
  data.highlights = [
    { label: "Audience", value: "Executive Sponsors" },
    { label: "Scope", value: "Portfolio Summary" },
    { label: "Coverage", value: "Cross-appendix" },
    { label: "Status", value: "Ready for Adaptation" },
  ];
  data.sections.summary.text = "This managed main-report template gives the program a governed landing page for strategic narrative, KPI framing, and leadership action sequencing. It is intentionally generic so detailed report substance can be inserted without inheriting broken or mismatched appendix content.";
  data.sections.summary.takeaway = "Main-report pages should synthesise the evidence base, highlight the decision signal, and point readers to deeper appendices only when they need detail.";
  return data;
}

function buildGenericTemplateData() {
  const data = baseOverviewData("Governed Generic Report Template", "Fallback template aligned to the house report standard", "GENERIC");
  data.metadata.templateFamily = "generic";
  data.theme = normalizeTheme({}, "generic");
  data.highlights = [
    { label: "Purpose", value: "Safe Fallback" },
    { label: "Architecture", value: "JSON-driven" },
    { label: "Rendering", value: "Single-file HTML" },
    { label: "Status", value: "Governed" },
  ];
  data.sections.summary.text = "This generic governed fallback replaces raw placeholder files and empty exports. It provides a valid report shell with the required house-standard architecture so teams can fill in real content later without shipping broken templates.";
  data.sections.summary.takeaway = "Even when source content is missing, the exported file should still be a valid report template with embedded JSON, reusable sections, and the same visual quality as the rest of the suite.";
  return data;
}

function buildAppendixOData() {
  return {
    theme: normalizeTheme({ primary: "#14b8a6", accent: "#0ea5e9" }, "appendix"),
    metadata: {
      title: "Appendix O - Automation Audit Report - Blank Template",
      subtitle: "Governed appendix shell for a separate automation audit deliverable",
      documentId: "APP O",
      company: "Client Name",
      plant: "Facility / Scope",
      date: "March 2026",
      status: "Template Ready",
      templateFamily: "appendix",
    },
    sections: {
      purpose: {
        text: "Appendix O is reserved for a separate automation audit deliverable. This governed template provides the correct appendix shell so teams can populate the page with plant-specific findings, scoring, and recommendations without shipping a raw placeholder export.",
        takeaway: "Use this appendix when the automation audit is delivered as a standalone canvas or annex that still needs to match the visual and technical standard of the main report suite.",
      },
      overview: {
        metrics: [
          { label: "Template Mode", value: "Blank", subtext: "Awaiting project content" },
          { label: "Target Use", value: "Appendix", subtext: "Separate deliverable" },
          { label: "Content Blocks", value: "6", subtext: "Standard appendix sections" },
          { label: "Output Type", value: "Single-file HTML", subtext: "Portable" },
        ],
        basis: [
          "Replace the placeholder summary with the audit purpose and scope.",
          "Insert the plant-specific register, findings, and risk posture in the sections below.",
          "Keep all report text inside the embedded JSON block so the output remains deterministic.",
        ],
      },
      inventory: [
        {
          code: "APP-O-001",
          name: "Automation Audit Register Placeholder",
          brand: "To define",
          model: "To define",
          year: "To define",
          processGroup: "To define",
          scada: "To define",
          backup: "To define",
          network: "To define",
          io: "To define",
          observations: "Populate this register with the core equipment, controls, or scope objects covered by the Appendix O deliverable.",
        },
      ],
      observations: [
        {
          id: "summary",
          title: "How To Populate This Appendix",
          bullets: [
            "Replace the placeholder register with the audit-specific inventory or scope listing.",
            "Insert the key observations as dark cards or chart-backed insight panels.",
            "Summarise risk posture, recommendations, and appendix-to-report traceability in the closing sections.",
          ],
        },
      ],
      riskPosture: [
        {
          dimension: "Template Readiness",
          posture: "House-standard shell available",
          exposure: "Low",
          notes: "The appendix no longer exports as a placeholder fragment and is ready for project-specific content.",
        },
      ],
      priorities: [
        "Add the audit narrative and scoring summary.",
        "Load the final evidence register or inventory table.",
        "Link the appendix to the main-report recommendation stack.",
      ],
      referenceMap: [
        {
          section: "Appendix O",
          inputs: "Automation audit evidence, plant findings, scoring tables, roadmap outputs",
          anchors: "Populate with project-specific references",
        },
      ],
    },
  };
}

function applyTemplate(template, data, heroUrl) {
  return template
    .replace("__REPORT_DATA__", JSON.stringify(data, null, 2))
    .replace(/__HERO_URL__/g, heroUrl);
}

function defaultBuilder(kind) {
  if (kind === "main") return buildMainReportData();
  if (kind === "appendix-o") return buildAppendixOData();
  if (kind === "generic") return buildGenericTemplateData();
  return baseOverviewData("Overview", "Management overview template", "OVERVIEW");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(process.cwd(), args.input);
  const templatePath = path.resolve(process.cwd(), TEMPLATE_PATH);

  const [rawInput, rawTemplate] = await Promise.all([
    readFile(inputPath, "utf8"),
    readFile(templatePath, "utf8"),
  ]);

  const rows = JSON.parse(rawInput);
  if (!Array.isArray(rows)) {
    throw new Error("Input JSON top-level must be an array.");
  }

  const normalized = rows.map((row) => {
    const override = ROW_OVERRIDES.get(row.id);
    const family = override?.family || "generic";
    const title = override?.title || row.title || `Report ${row.id}`;
    const extracted = override?.builder ? null : extractEmbeddedData(row.html_template);
    const data = extracted || defaultBuilder(override?.builder || "generic");

    data.theme = normalizeTheme(data.theme, family);
    data.metadata = { ...(data.metadata || {}), title: data.metadata?.title || title, templateFamily: family };
    if (!data.metadata.subtitle) {
      data.metadata.subtitle = family === "appendix"
        ? "Governed appendix template"
        : family === "overview"
          ? "Management overview template"
          : family === "generic"
            ? "Governed report fallback"
            : data.metadata.company || "";
    }
    if (!data.metadata.status) {
      data.metadata.status = "Template Ready";
    }

    return {
      ...row,
      title,
      page_key: row.page_key || override?.pageKey || row.page_key,
      html_template: applyTemplate(rawTemplate, data, heroFor(family, title)),
    };
  });

  await writeFile(inputPath, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  console.log(`Normalized ${normalized.length} report page templates in ${args.input}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
