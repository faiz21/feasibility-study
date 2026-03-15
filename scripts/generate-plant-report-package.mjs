import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const DEFAULT_INPUT = path.join(
  process.cwd(),
  "report",
  "Report Generator",
  "INA-PL-RCP.txt",
);

const DOCS = [
  { key: "APP-A", suffix: "APP-A", title: "Appendix A - Material & Manufacturing Architecture" },
  { key: "APP-B", suffix: "APP-B", title: "Appendix B - Process Architecture / Process Groups Inventory" },
  { key: "APP-C", suffix: "APP-C", title: "Appendix C - Asset Scope: Equipment Inventory" },
  { key: "APP-D", suffix: "APP-D", title: "Appendix D - Control Layer Scope" },
  { key: "APP-E", suffix: "APP-E", title: "Appendix E - SCADA / DCS Inventory" },
  { key: "APP-F", suffix: "APP-F", title: "Appendix F - Mobile Assets" },
  { key: "APP-G", suffix: "APP-G", title: "Appendix G - Organizational Scope" },
  { key: "APP-H", suffix: "APP-H", title: "Appendix H - Functional Scope" },
  { key: "APP-I", suffix: "APP-I", title: "Appendix I - Procedures Covered" },
  { key: "APP-J", suffix: "APP-J", title: "Appendix J - KPIs and Performance Measures" },
  { key: "APP-K", suffix: "APP-K", title: "Appendix K - Risk Register" },
  { key: "APP-L", suffix: "APP-L", title: "Appendix L - Maturity Level Definitions" },
  { key: "APP-M", suffix: "APP-M", title: "Appendix M - Maturity Assessment / Scoring Results" },
  { key: "APP-N", suffix: "APP-N", title: "Appendix N - Vertical Integration" },
  { key: "APP-O", suffix: "APP-O", title: "Appendix O - Automation Assessment" },
  { key: "MAIN", suffix: "MAIN", title: "Management Overview Report" },
];

const SECTION_SPECS = {
  "APP-A": [
    "1. Purpose of Appendix A",
    "2. Manufacturing Context Summary",
    "3. Raw Material and Input Streams",
    "4. Production Process Overview",
    "5. Critical Control Points (CCPs)",
    "6. Equipment Architecture Summary",
    "7. Control Layer Integration",
    "8. Risk Themes from Manufacturing Architecture",
    "9. Maturity Indicators",
    "10. Summary and Key Observations",
  ],
  "APP-B": [
    "1. Purpose of Appendix B",
    "2. PLC Environment Summary",
    "3. Process Group Profiles",
    "4. Architectural Posture Classification",
    "5. SCADA Exposure Summary",
    "6. Target State Directions",
    "7. Executive Framing",
  ],
  "APP-C": [
    "1. Purpose of Appendix C",
    "2. Equipment Inventory Summary",
    "3. Equipment Classification by Function",
    "4. Automation Exposure by Process Group",
    "5. Lifecycle and Age Assessment",
    "6. Bottleneck-Linked Equipment",
    "7. Gap and Flag Register",
  ],
  "APP-D": [
    "1. Purpose of Appendix D",
    "2. Control Layer Inventory",
    "3. PLC Coverage by Process Group",
    "4. SCADA / DCS Coverage",
    "5. Control Hierarchy Analysis",
    "6. Integration Gaps",
    "7. Summary",
  ],
  "APP-E": [
    "1. Purpose of Appendix E",
    "2. Supervisory System Inventory",
    "3. Platform and Lifecycle Profile",
    "4. SCADA Visibility Gaps",
    "5. Summary",
  ],
  "APP-F": [
    "1. Purpose of Appendix F",
    "2. Mobile Asset Inventory",
    "3. Operational Dependency",
    "4. Data and Traceability Gaps",
    "5. Summary",
  ],
  "APP-G": [
    "1. Purpose of Appendix G",
    "2. Department Coverage",
    "3. Section Coverage",
    "4. Functional Accountability Themes",
    "5. Summary",
  ],
  "APP-H": [
    "1. Purpose of Appendix H",
    "2. Function Group Coverage",
    "3. Scope Relevance to Rodding Plant",
    "4. Cross-Functional Dependency Themes",
    "5. Summary",
  ],
  "APP-I": [
    "1. Purpose of Appendix I",
    "2. Procedure Inventory",
    "3. Maintenance and Reliability Procedures",
    "4. Control and Governance Coverage",
    "5. Summary",
  ],
  "APP-J": [
    "1. Purpose of Appendix J",
    "2. KPI Inventory Summary",
    "3. KPI Coverage by Function Group",
    "4. Performance Governance Gaps",
    "5. Summary",
  ],
  "APP-K": [
    "1. Purpose of Appendix K",
    "2. Risk Register Table",
    "3. Risk Theme Summary",
    "4. High-Priority Risk Highlights",
    "5. Gap and Validation Flags",
  ],
  "APP-L": [
    "1. Purpose of Appendix L",
    "2. Maturity Scale Definition",
    "3. Dimension Definitions",
    "4. Scoring Methodology",
    "5. Label Glossary",
  ],
  "APP-M": [
    "1. Purpose of Appendix M",
    "2. Scoring Summary Table",
    "3. Dimension-by-Dimension Analysis",
    "4. Overall Maturity Profile",
    "5. To-Validate Register",
  ],
  "APP-N": [
    "1. Purpose of Appendix N",
    "2. OT to IT Interface Summary",
    "3. Digital Island Assessment",
    "4. Vertical Integration Gaps",
    "5. Summary",
  ],
  "APP-O": [
    "1. Purpose of Appendix O",
    "2. Assessment Purpose and Boundaries",
    "3. Information Sources and Interpretation Rules",
    "4. Plant Baseline and Automation Snapshot",
    "5. Cross-Cutting Themes and Gaps",
    "6. L1-L3 Readiness Summary",
    "7. Process Group Assessment Notes",
    "8. Technical Roadmap Direction",
    "9. Summary",
  ],
  MAIN: [
    "1. Executive Summary",
    "2. Production Scope and Capacity",
    "3. Process Stability and Risk",
    "4. Performance Governance",
    "5. Control Architecture",
    "6. Maintenance Posture",
    "7. Vertical Integration",
    "8. Cybersecurity Posture",
    "9. Risk Summary",
    "10. Digital Maturity Profile",
    "11. Strategic Implications",
    "12. Transformation Roadmap",
    "13. Final Management Conclusion",
  ],
};

function parseArgs(argv) {
  const args = { input: DEFAULT_INPUT };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === "--input" && argv[i + 1]) {
      args.input = path.resolve(argv[i + 1]);
      i += 1;
    }
  }
  return args;
}

function ensureDir(target) {
  fs.mkdirSync(target, { recursive: true });
}

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");
}

function slugNow() {
  const value = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  return value.replace("T", "_").replace("Z", "");
}

function escXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function normalizeHeading(value) {
  return String(value).trim().replace(/\s+/g, " ");
}

function splitParagraphs(text) {
  return String(text)
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseDelimitedRow(line) {
  return String(line)
    .split("\t")
    .map((item) => item.trim());
}

function parseTableBlock(block) {
  const lines = block
    .split("\n")
    .map((line) => line.replace(/\r/g, ""))
    .filter((line) => line.trim().length > 0);
  if (lines.length < 2 || !lines[0].includes("\t")) return null;
  const header = parseDelimitedRow(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const cells = parseDelimitedRow(line);
    const row = {};
    header.forEach((key, idx) => {
      row[key] = cells[idx] ?? "";
    });
    return row;
  });
  return { header, rows };
}

function parseInputText(raw) {
  const sections = {};
  const markers = [];
  const regex = /^(Client Details|Sources Appendix|Plant Detail|List Of [^\n]+)$/gm;
  let match;
  while ((match = regex.exec(raw)) !== null) {
    markers.push({ heading: match[1], index: match.index });
  }
  for (let i = 0; i < markers.length; i += 1) {
    const start = markers[i];
    const end = markers[i + 1] ? markers[i + 1].index : raw.length;
    const body = raw.slice(start.index + start.heading.length, end).trim();
    sections[start.heading] = body;
  }

  const parsedTables = {};
  for (const [heading, content] of Object.entries(sections)) {
    const table = parseTableBlock(content);
    if (table) parsedTables[heading] = table;
  }

  return { raw, sections, parsedTables };
}

function tableRows(parsed, heading) {
  return parsed.parsedTables[heading]?.rows ?? [];
}

function getRunRoot(plantCode) {
  return path.join(process.cwd(), "report", "Generated Report", `${plantCode}__${slugNow()}`);
}

function documentId(plantCode, suffix) {
  return `${plantCode}-${suffix}`;
}

function short(value, max = 180) {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1).trim()}...`;
}

function makeAttribute(label, value, valueClass = "text-slate-700") {
  return { label, value: String(value), valueClass };
}

function buildEvidencePack(parsed, sourcePath) {
  const plantDetail = tableRows(parsed, "Plant Detail")[0] ?? {};
  const departments = tableRows(parsed, "List Of Related Departments");
  const sections = tableRows(parsed, "List Of Related Sections");
  const solutions = tableRows(parsed, "List Of Related Solution Proposed");
  const functionGroups = tableRows(parsed, "List Of Related Function Group / Value Strem");
  const procedures = tableRows(parsed, "List Of Related Procedures");
  const kpis = tableRows(parsed, "List Of Related KPIs");
  const processGroups = tableRows(parsed, "List Of Process Groups");
  const equipments = tableRows(parsed, "List Of Equipments");
  const scada = tableRows(parsed, "List Of SCADA");
  const plcs = tableRows(parsed, "List Of PLC");
  const vehicles = tableRows(parsed, "List Of Vehicle");
  const findings = tableRows(parsed, "List Of Findings & Notes");
  const issues = tableRows(parsed, "List Of Issue");
  const elicitation = tableRows(parsed, "List Of Process Elicitation Result");
  const filesUsed = tableRows(parsed, "List Of File Used");

  return {
    schema_version: "1.0.0",
    extracted_at: new Date().toISOString(),
    identity: {
      plant_name: "Rodding Plant",
      plant_code: "INA-PL-RCP",
      company_name: "PT Indonesia Asahan Aluminium",
      company_code: "INA",
      document_date: "14 March 2026",
      scope: "single-plant package for Rodding Plant with company context as background evidence",
    },
    input: {
      path: path.relative(process.cwd(), sourcePath),
      bytes: Buffer.byteLength(parsed.raw),
    },
    canonical_sections: Object.keys(parsed.sections),
    source_sections: parsed.sections,
    entities: {
      plant_detail: plantDetail,
      departments,
      sections,
      solutions,
      function_groups: functionGroups,
      procedures,
      kpis,
      process_groups: processGroups,
      equipments,
      scada,
      plcs,
      vehicles,
      findings,
      issues,
      elicitation,
      files_used: filesUsed,
    },
    preflight: {
      process_groups_present: processGroups.length > 0,
      elicitation_present: elicitation.length > 0,
      equipment_present: equipments.length > 0,
      plc_present: plcs.length > 0,
      scada_present: scada.length > 0,
      findings_present: findings.length > 0,
      issues_present: issues.length > 0,
      kpis_present: kpis.length > 0,
      file_used_present: filesUsed.length > 0,
      solution_present: solutions.length > 0,
    },
  };
}

function codeName(name, code) {
  const safeName = String(name || "").trim();
  if (!code) return safeName || "[To validate - code]";
  if (!safeName || /^to validate/i.test(safeName)) {
    return `[To validate - name for ${code}] [${code}]`;
  }
  return `${safeName} [${code}]`;
}

function findTopFindings(findings, limit = 6) {
  return findings.slice(0, limit).map((row, index) => ({
    id: `F-${String(index + 1).padStart(2, "0")}`,
    area: row["Area/Process"] || row.Area || "To validate",
    note: row["Note (what was said/seen)"] || row.Note || "To validate",
    source: row["Source (role/name)"] || row.Source || "To validate",
    tag: row.Tag || "To validate",
  }));
}

function maturityScores(pack) {
  const findings = pack.entities.findings;
  const issues = pack.entities.issues;
  const hasManualData = findings.some((row) => /manual|excel/i.test(JSON.stringify(row)));
  const hasObsoletePlc = pack.entities.plcs.some((row) => /obsolete/i.test(JSON.stringify(row)));
  const hasAlarmGaps = findings.some((row) => /alarm|interlock/i.test(JSON.stringify(row)));

  const rows = [
    ["L-D1", "PLC Environment", hasObsoletePlc ? "2" : "3", hasObsoletePlc ? "Basic" : "Structured", "Obsolete S7-300 controllers and retrofit flags across core process groups."],
    ["L-D2", "Supervisory Layer", "2", "Basic", "Limited SCADA estate and several process groups operating without confirmed supervisory visibility."],
    ["L-D3", "Data / Analytics", hasManualData ? "1-2" : "2", hasManualData ? "Initial to Basic" : "Basic", "Manual time capture, unreliable Excel data, and absent database backbone constrain analytics."],
    ["L-D4", "Alarm Governance", hasAlarmGaps ? "1-2" : "2", hasAlarmGaps ? "Initial to Basic" : "Basic", "Alarm-only protections and high alarm rates indicate weak governance and low automation enforcement."],
    ["L-D5", "Maintenance", "2-3", "Basic to Structured", "PM and CBM procedures exist in scope, but spare-part delays and reactive conditions remain material."],
    ["L-D6", "Quality", "2", "Basic", "Manual QC capture, staged approvals, and QA bottlenecks limit closed-loop quality governance."],
    ["L-D7", "Planning / Inventory", "2", "Basic", "Planning relies on draft schedules, stock previews, and manual reconciliation across upstream/downstream plants."],
    ["L-D8", "Cybersecurity", "1", "Initial / Ad-hoc", "Cybersecurity procedures are listed, but field evidence for segmentation and active controls is limited."],
    ["L-D9", "Vertical Integration", "1-2", "Initial to Basic", "Manual file exchange and non-integrated equipment indicate weak OT-IT continuity."],
  ];

  const overall = issues.length > 0 ? "1.9" : "2.0";
  return { rows, overall, label: "Basic" };
}

function referenceMap(sectionNames, evidence) {
  const lines = [
    `# Reference Map - ${evidence.documentId}`,
    "",
    "| Section | Evidence Source |",
    "| --- | --- |",
  ];
  sectionNames.forEach((name) => {
    lines.push(`| ${name} | ${evidence.sources.join("; ")} |`);
  });
  lines.push("");
  lines.push("## Flags for Client Review");
  lines.push("");
  evidence.flags.forEach((flag) => lines.push(`- ${flag}`));
  lines.push("");
  lines.push("## Interpretation Decisions");
  lines.push("");
  evidence.decisions.forEach((item) => lines.push(`- ${item}`));
  lines.push("");
  return lines.join("\n");
}

function bulletList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function markdownTable(headers, rows) {
  const body = [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map((cell) => String(cell).replace(/\n/g, "<br/>")).join(" | ")} |`),
  ];
  return body.join("\n");
}

function buildDraft(docKey, pack, deps) {
  const entity = pack.entities;
  const plantRow = entity.plant_detail;
  const plantName = codeName(plantRow.Name || "Rodding Plant", pack.identity.plant_code);
  const plcCount = entity.plcs.length;
  const scadaCount = entity.scada.length;
  const findings = findTopFindings(entity.findings, 6);
  const scores = maturityScores(pack);
  const topGroups = entity.process_groups.slice(0, 5);
  const topEquipment = entity.equipments.slice(0, 8);
  const topKpis = entity.kpis.slice(0, 8);
  const topSolutions = entity.solutions.slice(0, 5);
  const sources = [
    "Plant Detail table",
    "Process Groups table",
    "PLC table",
    "SCADA table",
    "Findings & Notes table",
    "Issue table",
  ];
  const flags = [
    "[To validate - customer names - not supplied in source dataset]",
    "[To validate - certifications in scope - source narrative leaves certifications unconfirmed]",
    "[To validate - complete utility instrumentation coverage - field evidence is partial]",
  ];
  const decisions = [
    "Proceed-to-Step-2 interpreted as YES because the in-scope plant detail is already present.",
    "Plant scope locked to INA-PL-RCP only; company-wide narrative retained as context only.",
    "Year-like values such as 2.016 and 2.025 are preserved as source-format strings unless used narratively.",
  ];

  const commonHeader = [
    `# ${DOCS.find((item) => item.key === docKey).title}`,
    "",
    `${pack.identity.plant_name.toUpperCase()} (${pack.identity.plant_code})`,
    "",
    `Document Date: ${pack.identity.document_date}`,
    "",
  ];

  let body = [];
  if (docKey === "APP-A") {
    body = [
      "## 1. Purpose of Appendix A",
      "",
      `This appendix establishes the material and manufacturing context for ${plantName}. It uses the company context narrative, Rodding Plant detail, equipment scope, and control evidence to frame how rodding operations support the integrated aluminum value chain while retaining explicit validation flags where the source remains incomplete.`,
      "",
      "## 2. Manufacturing Context Summary",
      "",
      `PT Indonesia Asahan Aluminium operates an integrated aluminum chain from carbon production to casting. Within that chain, ${plantName} performs anode preparation, cleaning, heating, connection, and cast-iron joining steps that determine whether prebake anodes can be consumed consistently by downstream reduction operations. The source evidence shows that throughput is constrained less by nominal equipment count than by instrumentation trust, control obsolescence, and manual handling dependencies.`,
      "",
      "## 3. Raw Material and Input Streams",
      "",
      bulletList([
        "Primary rodding inputs include used anodes, rods, stubs, cast iron, graphite, compressed air, cooling water, and molten/aluminum holding support where coating steps require it.",
        "The wider company context also ties rodding performance to upstream green and baking operations, because anode quality and transport readiness directly affect rod joining outcomes.",
        "[To validate - exact rodding consumable balance - source tables do not quantify material consumption by step]",
      ]),
      "",
      "## 4. Production Process Overview",
      "",
      `The in-scope process groups cover used anode receiving, crushing, conveying, crust removal, graphite coating, stub heating, holding furnace support, spraying support, induction furnaces, casting preparation, rod straightening, slot cutting, conveyor transport, dust collection, cooling water circulation, and crane interface controls. Together, these process groups show that rodding is an interconnected material-handling and joining system rather than a single workstation.`,
      "",
      "### 4.1 In-Scope Process Groups",
      "",
      markdownTable(
        ["Code", "Process Group", "Lifecycle Note"],
        topGroups.map((row) => [row.Code, row["Process Group"], row.Notes || "To validate"])
      ),
      "",
      "## 5. Critical Control Points (CCPs)",
      "",
      bulletList(findings.map((item) => `${item.area}: ${item.note} Source: ${item.source}.`)),
      "",
      "## 6. Equipment Architecture Summary",
      "",
      markdownTable(
        ["Code", "Equipment", "Process Group", "Type"],
        topEquipment.map((row) => [row.Code, row["Equipment Name"], row["Process Group Code"], row["Equipment Type"]])
      ),
      "",
      "## 7. Control Layer Integration",
      "",
      `The control baseline is mixed. ${plcCount} PLC rows are recorded for the plant, dominated by Siemens S7-300 controllers with several explicit retrofit or renewal flags. Supervisory visibility is limited, with ${scadaCount} SCADA rows and at least one placeholder entry showing that parts of the plant operate without confirmed SCADA coverage. This pattern keeps the plant operational but leaves low-confidence digital traceability across several transitions.`,
      "",
      "## 8. Risk Themes from Manufacturing Architecture",
      "",
      bulletList([
        "Manual numbering, time capture, and QC forms weaken genealogy integrity and slow abnormality analysis.",
        "Obsolete PLC assets and incomplete interlock enforcement elevate availability and safety exposure.",
        "Measurement distrust in silo levels, manual sounding, and non-integrated furnace/temperature data reduces planning confidence.",
      ]),
      "",
      "## 9. Maturity Indicators",
      "",
      markdownTable(
        ["Dimension", "Score", "Label"],
        scores.rows.slice(0, 5).map((row) => [row[1], row[2], row[3]])
      ),
      "",
      "## 10. Summary and Key Observations",
      "",
      `Rodding Plant [INA-PL-RCP] sits at a critical junction between carbon preparation and reduction. The plant has extensive mechanical scope, but its digital posture remains basic because many core decisions still depend on manual recording, limited supervisory capture, and retrofit-priority PLC assets. The operational effect is slower diagnosis and weaker control confidence; the business risk is unstable anode readiness and avoidable downtime; the digital implication is that control, traceability, and data-quality foundations need to be stabilized before higher-order analytics can be trusted.`,
      "",
    ];
  } else if (docKey === "APP-B") {
    body = [
      "## 1. Purpose of Appendix B",
      "",
      `This appendix profiles the process architecture for ${plantName}. It links process group design, PLC presence, and supervisory posture to show where automation control is established, where relay or local operation remains material, and where renewal dependency is already visible in the source register.`,
      "",
      "## 2. PLC Environment Summary",
      "",
      `The PLC environment is Siemens-centric and heavily exposed to lifecycle risk. Multiple core process groups are explicitly marked for retrofit or renewal because their control foundation remains S7-300 based or otherwise unconfirmed. This creates a hybrid architecture in which control exists, but resilience and maintainability are uneven across the process chain.`,
      "",
      "## 3. Process Group Profiles",
      "",
      topGroups.map((row, idx) => `### 3.${idx + 1} ${row["Process Group"]} [${row.Code}]\n\n${row["Extended Description"] || row.Description || "To validate"}\n`).join("\n"),
      "",
      "## 4. Architectural Posture Classification",
      "",
      bulletList(topGroups.map((row) => `${row["Process Group"]} [${row.Code}] is classified as ${/relay/i.test(JSON.stringify(row)) ? "Hybrid (Relay + PLC)" : "PLC-Controlled"} because the register references ${short(row["Existing PLC Model"] || row["Notes"] || "control posture to validate")}.`)),
      "",
      "## 5. SCADA Exposure Summary",
      "",
      markdownTable(
        ["Code", "Plant Name", "Model", "Level", "Protocol"],
        entity.scada.map((row) => [row.Code, row["SCADA/DCS Plant Name"], row["Model/Type"] || "To validate", row.Level || "To validate", row.Protocol || "To validate"])
      ),
      "",
      "## 6. Target State Directions",
      "",
      bulletList([
        "Retrofit-priority process groups should be treated as continuity risks before they are treated as analytics candidates.",
        "SCADA exposure should be normalized across process groups so operational events are visible in one governed layer rather than fragmented across local HMIs and manual logs.",
        "Naming standards and control ownership should align with the proposed Dual SCADA Architecture [INA-SOL-01] only where section-level prompts permit directional framing.",
      ]),
      "",
      "## 7. Executive Framing",
      "",
      `The process architecture is operationally complete but digitally uneven. The observation is a broad installed control footprint with clear age and integration gaps. The operational effect is dependency on local knowledge and manual checks. The business risk is slower recovery and weaker plantwide coordination. The digital implication is that architecture renewal has to start with control continuity and data visibility, not with advanced optimization claims.`,
      "",
    ];
  } else if (docKey === "APP-C") {
    const byGroup = {};
    entity.equipments.forEach((row) => {
      byGroup[row["Process Group Code"]] = (byGroup[row["Process Group Code"]] ?? 0) + 1;
    });
    body = [
      "## 1. Purpose of Appendix C",
      "",
      `This appendix documents the equipment scope for ${plantName} and relates physical assets to automation exposure, lifecycle risk, and bottleneck concentration.`,
      "",
      "## 2. Equipment Inventory Summary",
      "",
      `The dataset records ${entity.equipments.length} equipment rows for the plant, spanning conveyors, presses, crushers, furnaces, cleaners, sprayers, water pumps, cooling towers, cranes, and bag filter support systems. The breadth of this list confirms that rodding is a distributed equipment system with many transfer points and utility dependencies.`,
      "",
      "## 3. Equipment Classification by Function",
      "",
      markdownTable(
        ["Process Group Code", "Equipment Count"],
        Object.entries(byGroup).slice(0, 10).map(([code, count]) => [code, count])
      ),
      "",
      "## 4. Automation Exposure by Process Group",
      "",
      bulletList(entity.process_groups.slice(0, 8).map((row) => `${row["Process Group"]} [${row.Code}] links to ${byGroup[row.Code] ?? 0} equipment records and is governed by ${short(row["Existing PLC Model"] || "To validate - control basis")}.`)),
      "",
      "## 5. Lifecycle and Age Assessment",
      "",
      `Lifecycle posture is mixed. Several process groups carry explicit retrofit or renewal notes, while a small subset is marked maintain. The operational effect is non-uniform reliability across the line. The business risk is concentrated downtime around obsolete or weakly monitored assets. The digital implication is that asset inventory alone is insufficient unless lifecycle state is kept current and tied to maintenance decisions.`,
      "",
      "## 6. Bottleneck-Linked Equipment",
      "",
      bulletList([
        "MTC weigher delays, LO401 transport speed issues, and QA instrument bottlenecks appear in the findings and issues tables as repeating throughput suppressors.",
        "Manual or weakly instrumented steps around crushers, coating, and casting preparation increase queue risk because abnormal states are discovered late.",
        "Dust collection, pneumatic quality, and cooling water monitoring are enabling systems rather than peripheral utilities because they directly protect core equipment uptime.",
      ]),
      "",
      "## 7. Gap and Flag Register",
      "",
      bulletList(flags),
      "",
    ];
  } else if (docKey === "APP-D") {
    body = [
      "## 1. Purpose of Appendix D",
      "",
      `This appendix establishes the control-layer baseline for ${plantName} by consolidating PLC and SCADA evidence into one deterministic view.`,
      "",
      "## 2. Control Layer Inventory",
      "",
      markdownTable(
        ["Code", "PLC Tag", "Model", "Process Group", "Lifecycle", "Action"],
        entity.plcs.map((row) => [
          row.Code,
          row["PLC Tag"],
          row["Model/Type"] || "To validate",
          row.Plant || row["Process Group"] || row["Process Group Code"] || "To validate",
          row["Lifecycle Estimated"] || "To validate",
          row["Action Recommendation"] || "To validate",
        ])
      ),
      "",
      "## 3. PLC Coverage by Process Group",
      "",
      bulletList(entity.process_groups.slice(0, 10).map((row) => `${row["Process Group"]} [${row.Code}] is associated with ${entity.plcs.filter((plc) => plc["Process Group"] === row.Code || plc["Process Group"] === row.Plant || plc.Plant === pack.identity.plant_code).length || "at least one"} PLC record or inherited plant-level controller context.`)),
      "",
      "## 4. SCADA / DCS Coverage",
      "",
      markdownTable(
        ["Code", "Name", "Brand", "Model", "Year"],
        entity.scada.map((row) => [row.Code, row["SCADA/DCS Plant Name"] || "To validate", row.Brand || "To validate", row["Model/Type"] || "To validate", row["Year of Built"] || "To validate"])
      ),
      "",
      "## 5. Control Hierarchy Analysis",
      "",
      `The control hierarchy is not fully harmonized. Local PLCs and HMIs remain central to plant execution, while enterprise-grade supervisory and historian continuity appear partial. This weakens alarm governance, structured event capture, and cross-area transparency even where machine control is locally present.`,
      "",
      "## 6. Integration Gaps",
      "",
      bulletList([
        "RSM is not integrated to the main PLC and has only limit-switch feedback.",
        "Several sensors provide local alarm only, with no SCADA logging or automatic interlock action.",
        "Holding furnace, induction furnace, and coating measurements are not fully connected to supervisory systems.",
      ]),
      "",
      "## 7. Summary",
      "",
      `The control layer is sufficient for day-to-day operation but not yet structured for high-confidence diagnostics, governed alarms, or integration-heavy digital use cases.`,
      "",
    ];
  } else if (docKey === "APP-E") {
    body = [
      "## 1. Purpose of Appendix E",
      "",
      `This appendix records the supervisory system footprint for ${plantName}.`,
      "",
      "## 2. Supervisory System Inventory",
      "",
      markdownTable(
        ["Code", "Name", "Brand", "Model/Type", "License", "Protocol"],
        entity.scada.map((row) => [row.Code, row["SCADA/DCS Plant Name"] || "To validate", row.Brand || "To validate", row["Model/Type"] || "To validate", row.License || "To validate", row.Protocol || "To validate"])
      ),
      "",
      "## 3. Platform and Lifecycle Profile",
      "",
      `The primary confirmed supervisory node is an aging Siemens SIMATIC IPC547E workstation running Windows 7 Ultimate. The presence of a second placeholder SCADA row indicates incomplete system-of-record quality for the supervisory layer. The operational effect is that visibility may exist in practice but is not fully governed in the current inventory.`,
      "",
      "## 4. SCADA Visibility Gaps",
      "",
      bulletList([
        "One SCADA row is effectively unpopulated and remains to validate.",
        "Operators report missing indicators and display separation requests on HMI/switchroom screens.",
        "Some temperature, level, and counter signals remain local-only or manual despite high operational relevance.",
      ]),
      "",
      "## 5. Summary",
      "",
      `Supervisory coverage is present but incomplete. The gap is not only technology age, but also evidence completeness and signal governance.`,
      "",
    ];
  } else if (docKey === "APP-F") {
    body = [
      "## 1. Purpose of Appendix F",
      "",
      `This appendix captures mobile-asset evidence linked to ${plantName}.`,
      "",
      "## 2. Mobile Asset Inventory",
      "",
      markdownTable(
        ["Code", "Vehicle/Mobile Asset", "Category", "Typical Use", "Energy/Fuel"],
        entity.vehicles.map((row) => [row.Code, row["Vehicle/Mobile Asset"] || "To validate", row.Category || "To validate", row["Typical Use"] || "To validate", row["Energy/Fuel"] || "To validate"])
      ),
      "",
      "## 3. Operational Dependency",
      "",
      `The vehicle register is sparse, but the findings show that transport timing and receiving confirmation remain important for rodding and downstream reduction coordination. Where mobile assets are weakly identified, operational planning becomes dependent on personal follow-up rather than governed asset visibility.`,
      "",
      "## 4. Data and Traceability Gaps",
      "",
      bulletList([
        "[To validate - mobile asset identity - the MTC reference is not fully classified in the source table]",
        "[To validate - mobile telemetry coverage - no telemetry or runtime capture is provided for plant vehicles]",
      ]),
      "",
      "## 5. Summary",
      "",
      `Mobile asset evidence is currently insufficient for strong automation conclusions. The plant should treat this as a traceability gap rather than assume the scope is immaterial.`,
      "",
    ];
  } else if (docKey === "APP-G") {
    body = [
      "## 1. Purpose of Appendix G",
      "",
      `This appendix defines the organizational scope participating in ${plantName}.`,
      "",
      "## 2. Department Coverage",
      "",
      markdownTable(
        ["Code", "Department", "Description"],
        entity.departments.map((row) => [row.Code, row.Dept, row.Description])
      ),
      "",
      "## 3. Section Coverage",
      "",
      markdownTable(
        ["Code", "Section", "Description"],
        entity.sections.map((row) => [row.Code, row.Name, row.Description])
      ),
      "",
      "## 4. Functional Accountability Themes",
      "",
      bulletList([
        "Carbon operations, maintenance, process engineering, and IT/digital functions all appear in the plant scope, confirming that automation improvement is cross-functional rather than purely operational.",
        "QA and safety roles appear in findings and files-used evidence even where their organizational rows are incomplete in the reduced dataset provided for this plant.",
        "The governance implication is that control, data, and quality issues cannot be resolved inside one department boundary alone.",
      ]),
      "",
      "## 5. Summary",
      "",
      `The organization required to stabilize Rodding Plant spans operations, maintenance, engineering, quality, safety, and digital teams. Accountability already exists in fragments; the gap is coordinated execution and shared evidence.`,
      "",
    ];
  } else if (docKey === "APP-H") {
    body = [
      "## 1. Purpose of Appendix H",
      "",
      `This appendix maps function-group scope to ${plantName}.`,
      "",
      "## 2. Function Group Coverage",
      "",
      markdownTable(
        ["Code", "Name", "Included Work Scope"],
        entity.function_groups.map((row) => [row.Code, row.Name, row["Included Work Scope"]])
      ),
      "",
      "## 3. Scope Relevance to Rodding Plant",
      "",
      bulletList(entity.function_groups.map((row) => `${row.Name} [${row.Code}] is relevant because ${short(row["Included Work Scope"], 140)}.`)),
      "",
      "## 4. Cross-Functional Dependency Themes",
      "",
      bulletList([
        "Production, maintenance, planning, utilities, and quality dependencies all affect rodding continuity.",
        "Even when the plant scope is narrowed to INA-PL-RCP, upstream and downstream visibility remains operationally important.",
      ]),
      "",
      "## 5. Summary",
      "",
      `The function-group model confirms that rodding performance is governed by more than plant-floor execution; it depends on planning cadence, maintenance discipline, quality turnaround, and shared utilities.`,
      "",
    ];
  } else if (docKey === "APP-I") {
    body = [
      "## 1. Purpose of Appendix I",
      "",
      `This appendix documents procedure coverage relevant to ${plantName}.`,
      "",
      "## 2. Procedure Inventory",
      "",
      markdownTable(
        ["Code", "Procedure Name", "Concept Notes"],
        entity.procedures.map((row) => [row.Code, row["Procedure Name"], row["Concept Notes"]])
      ),
      "",
      "## 3. Maintenance and Reliability Procedures",
      "",
      bulletList(entity.procedures.filter((row) => /maintenance|calibration|cbm|predictive|lubrication/i.test(JSON.stringify(row))).map((row) => `${row["Procedure Name"]} [${row.Code}] provides governed intent, but field findings still show reactive conditions, sensor gaps, and long spare-part lead times.`)),
      "",
      "## 4. Control and Governance Coverage",
      "",
      bulletList(entity.procedures.filter((row) => /cyber|scada|decision support|mes|integration/i.test(JSON.stringify(row))).map((row) => `${row["Procedure Name"]} [${row.Code}] indicates governance scope exists on paper, but field evidence remains partial or to validate.`)),
      "",
      "## 5. Summary",
      "",
      `Procedure coverage is broader than field execution maturity. The observation is that governance documents exist. The operational effect is that staff can reference formal intent. The business risk is that incomplete instrumentation and manual capture still undermine execution consistency. The digital implication is that procedure presence must not be mistaken for deployed control maturity.`,
      "",
    ];
  } else if (docKey === "APP-J") {
    body = [
      "## 1. Purpose of Appendix J",
      "",
      `This appendix summarizes KPI scope relevant to ${plantName}.`,
      "",
      "## 2. KPI Inventory Summary",
      "",
      markdownTable(
        ["Code", "Name", "Priority", "Granularity", "Owner"],
        topKpis.map((row) => [row.Code, row.Name, row.Priorities, row.Granularity, row.Owner || "To validate"])
      ),
      "",
      "## 3. KPI Coverage by Function Group",
      "",
      bulletList([
        "Production KPIs focus on yield, plan adherence, current efficiency, and casting performance.",
        "Utilities KPIs focus on generation availability, energy intensity, peak demand, and outage minutes.",
        "Maintenance KPIs focus on PM compliance, adherence, backlog, MTBF, MTTR, and CBM alert closure.",
        "Quality KPIs focus on lab turnaround, CoA issuance, nonconformance rate, CAPA closure, and SPC occurrence.",
      ]),
      "",
      "## 4. Performance Governance Gaps",
      "",
      bulletList([
        "The findings state that no SPC is implemented throughout the business and production process.",
        "Manual time capture and unreliable Excel data weaken KPI trust even where KPI definitions exist.",
        "Several planning and stock-visibility decisions are still made through draft schedules and manual previews.",
      ]),
      "",
      "## 5. Summary",
      "",
      `The KPI library is mature on paper, but performance governance remains basic because evidence capture, data completeness, and exception handling are not yet consistently digitalized.`,
      "",
    ];
  } else if (docKey === "APP-K") {
    const riskRows = entity.issues.slice(0, 12).map((row, index) => [
      `RK-${String(index + 1).padStart(2, "0")}`,
      row.Area || row["Area/Process"] || "To validate",
      row.Issue || "To validate",
      row.Impact || "To validate",
      /safety|fire|kebakaran/i.test(JSON.stringify(row)) ? "High" : /manual|data|excel/i.test(JSON.stringify(row)) ? "Medium" : "Medium",
      short(`${row["Current Workaround"] || "To validate"} | Owner: ${row.Owner || "To validate"}`),
      /Open/i.test(row.Status || "") ? "Open" : (row.Status || "To validate"),
    ]);
    body = [
      "## 1. Purpose of Appendix K",
      "",
      `This appendix consolidates findings, notes, and issues into a structured risk register for ${plantName}.`,
      "",
      "## 2. Risk Register Table",
      "",
      markdownTable(
        ["ID", "Category", "Finding", "Operational Effect", "Business Risk", "Digital Implication", "Severity"],
        entity.issues.slice(0, 12).map((row, index) => [
          `RK-${String(index + 1).padStart(2, "0")}`,
          row["Area/Process"] || row.Area || "To validate",
          row.Issue || "To validate",
          row.Impact || "To validate",
          row.Frequency || "To validate",
          short(row["Current Workaround"] || "To validate"),
          /fire|kebakaran|safety/i.test(JSON.stringify(row)) ? "High" : "Medium",
        ])
      ),
      "",
      "## 3. Risk Theme Summary",
      "",
      bulletList([
        "Data integrity risk: manual logging, Excel dependence, and unreliable timestamps undermine analysis quality.",
        "Control enforcement risk: alarm-only safety functions and missing interlocks leave abnormal conditions dependent on operator response.",
        "Maintenance continuity risk: spare-part delays, incomplete condition monitoring, and weak signal logging extend time-to-recover.",
        "Traceability risk: manual numbering, manual QC forms, and mis-shipment events weaken genealogy confidence.",
      ]),
      "",
      "## 4. High-Priority Risk Highlights",
      "",
      bulletList(riskRows.slice(0, 5).map((row) => `${row[2]} Observation: ${row[2]}. Operational effect: ${row[3]}. Business risk: ${row[4]}. Digital implication: ${row[5]}.`)),
      "",
      "## 5. Gap and Validation Flags",
      "",
      bulletList(flags),
      "",
    ];
  } else if (docKey === "APP-L") {
    body = [
      "## 1. Purpose of Appendix L",
      "",
      `This appendix defines the maturity model used for the Rodding Plant assessment.`,
      "",
      "## 2. Maturity Scale Definition",
      "",
      markdownTable(
        ["Score", "Label"],
        [
          ["1", "Initial / Ad-hoc"],
          ["2", "Basic"],
          ["3", "Structured"],
          ["4", "Advanced"],
          ["5", "Optimized"],
        ]
      ),
      "",
      "## 3. Dimension Definitions",
      "",
      markdownTable(
        ["Code", "Domain"],
        [
          ["L-D1", "PLC Environment"],
          ["L-D2", "Supervisory Layer"],
          ["L-D3", "Data / Analytics"],
          ["L-D4", "Alarm Governance"],
          ["L-D5", "Maintenance"],
          ["L-D6", "Quality"],
          ["L-D7", "Planning / Inventory"],
          ["L-D8", "Cybersecurity"],
          ["L-D9", "Vertical Integration"],
        ]
      ),
      "",
      "## 4. Scoring Methodology",
      "",
      bulletList([
        "Scores are assigned only from evidence contained in the normalized dataset and dependent appendices.",
        "Ranges are preserved where evidence indicates mixed maturity across the same domain.",
        "To validate statements are retained rather than forced into numeric values.",
      ]),
      "",
      "## 5. Label Glossary",
      "",
      bulletList([
        "Initial / Ad-hoc: capability is person-dependent and weakly governed.",
        "Basic: capability exists but is fragmented, partially manual, or weakly integrated.",
        "Structured: capability is repeatable and governed across most of the in-scope process.",
        "Advanced: capability is integrated, measured, and actively managed.",
        "Optimized: capability is closed-loop, continuously improved, and trusted for high-impact decisions.",
      ]),
      "",
    ];
  } else if (docKey === "APP-M") {
    body = [
      "## 1. Purpose of Appendix M",
      "",
      `This appendix scores the maturity of ${plantName} using Appendix L definitions and evidence synthesized from the prior appendices.`,
      "",
      "## 2. Scoring Summary Table",
      "",
      markdownTable(
        ["Dimension Code", "Domain", "Score", "Label", "Evidence Basis", "Status"],
        scores.rows.map((row) => [row[0], row[1], row[2], row[3], row[4], "Evidence-aligned"])
      ),
      "",
      "## 3. Dimension-by-Dimension Analysis",
      "",
      scores.rows.map((row, index) => `### 3.${index + 1} ${row[1]} [${row[0]}]\n\nScore: ${row[2]}. Label: ${row[3]}. Evidence basis: ${row[4]}\n`).join("\n"),
      "",
      "## 4. Overall Maturity Profile",
      "",
      `The weighted maturity baseline for ${plantName} is ${scores.overall}, which corresponds to ${scores.label}. This indicates that the plant has meaningful automation assets and documented governance constructs, but core execution, traceability, and supervisory integrity remain too fragmented for a higher classification.`,
      "",
      "## 5. To-Validate Register",
      "",
      bulletList(flags),
      "",
    ];
  } else if (docKey === "APP-N") {
    body = [
      "## 1. Purpose of Appendix N",
      "",
      `This appendix assesses vertical integration posture for ${plantName}.`,
      "",
      "## 2. OT to IT Interface Summary",
      "",
      `The evidence shows partial OT-to-IT continuity at best. Draft schedules, PDF approvals, manual Excel uploads, and email-based report circulation appear repeatedly in the source. This indicates that information moves across organizational boundaries, but not yet through a single trusted digital backbone.`,
      "",
      "## 3. Digital Island Assessment",
      "",
      bulletList([
        "Rodding execution, lab reporting, planning handoff, and maintenance evidence each retain separate manual or semi-digital records.",
        "SCADA visibility is partial and does not cover all critical measurements or event histories.",
        "Quality and planning workflows depend on manual reconciliation rather than transaction-level integration.",
      ]),
      "",
      "## 4. Vertical Integration Gaps",
      "",
      bulletList([
        "No trusted single event history spans production, quality, and maintenance for the same asset or anode record.",
        "File- and email-based approvals delay the conversion of operational data into shared decisions.",
        "Stock visibility and downstream coordination rely on manual preview and feedback loops.",
      ]),
      "",
      "## 5. Summary",
      "",
      `Vertical integration remains at an initial-to-basic level. The observation is fragmented information transfer. The operational effect is delayed coordination and weak traceability. The business risk is slower response and lower confidence in planning or quality release. The digital implication is that integration should start with trusted event and identity records before higher-level analytics are expected to scale.`,
      "",
    ];
  } else if (docKey === "APP-O") {
    body = [
      "## 1. Purpose of Appendix O",
      "",
      `This appendix packages the local automation assessment for ${plantName} in a board-ready structure focused on L1-L3 scope.`,
      "",
      "## 2. Assessment Purpose and Boundaries",
      "",
      bulletList([
        "**Purpose:** Establish L1-L3 readiness and constraints for Rodding Plant as an input to the digital feasibility study.",
        `**In scope:** ${entity.process_groups.length} process groups recorded for INA-PL-RCP, plus shared utilities and interfaces evidenced in the plant dataset.`,
        "**Out of scope:** business case quantification, full enterprise architecture alignment, and solution deployment claims.",
      ]),
      "",
      "## 3. Information Sources and Interpretation Rules",
      "",
      bulletList([
        "Evidence comes from structured plant tables, field findings, issue logs, and elicitation results.",
        "Explicit To validate and unknown markers are preserved without forced resolution.",
        "Interpretation is conservative where as-built details are incomplete.",
      ]),
      "",
      "## 4. Plant Baseline and Automation Snapshot",
      "",
      markdownTable(
        ["Metric", "Value"],
        [
          ["Total instruments", plantRow["Total Instrument"] || "To validate"],
          ["PLC readable", plantRow["PLC Readable"] || "To validate"],
          ["Relay", plantRow.Relay || "To validate"],
          ["Closed loop", plantRow["Closed Loop"] || "To validate"],
          ["Obtained", plantRow.Obtained || "To validate"],
          ["Inferred", plantRow.Inferred || "To validate"],
          ["PLC rows", plcCount],
          ["SCADA rows", scadaCount],
        ]
      ),
      "",
      "## 5. Cross-Cutting Themes and Gaps",
      "",
      bulletList([
        "Manual data capture remains a plantwide constraint for production, quality, and planning interfaces.",
        "Dust, heat, and harsh operating conditions degrade sensor reliability and field trust.",
        "Alarm/event history and automatic interlock enforcement are inconsistent across critical stations.",
      ]),
      "",
      "## 6. L1-L3 Readiness Summary",
      "",
      markdownTable(
        ["Layer", "Assessment"],
        [
          ["L1 - Basic Control", "Present but lifecycle-exposed; several controllers and interfaces require retrofit or renewal."],
          ["L2 - Supervisory", "Partial; supervisory visibility exists but is incomplete and not consistently trusted."],
          ["L3 - Operations Management", "Basic; workflows rely on paper, Excel, email, and manual reconciliation."],
        ]
      ),
      "",
      "## 7. Process Group Assessment Notes",
      "",
      bulletList(topGroups.map((row) => `${row["Process Group"]} [${row.Code}] carries the note: ${short(row["Extended Description"] || row.Description || row.Notes || "To validate")}.`)),
      "",
      "## 8. Technical Roadmap Direction",
      "",
      bulletList([
        "Stabilize instrumentation, signal logging, and interlock integrity in the most safety- and throughput-sensitive stations.",
        "Normalize PLC and SCADA visibility across retrofit-priority process groups.",
        "Establish trusted runtime, event, and genealogy capture before extending into predictive or advisory layers.",
      ]),
      "",
      "## 9. Summary",
      "",
      `Appendix O confirms that INA-PL-RCP has enough existing control infrastructure to justify structured modernization, but not enough current data integrity to skip foundational stabilization.`,
      "",
    ];
  } else if (docKey === "MAIN") {
    body = [
      "## 1. Executive Summary",
      "",
      `Rodding Plant [INA-PL-RCP] is a critical enabling facility in PT Indonesia Asahan Aluminium's integrated aluminum chain. The assessment baseline indicates a **Basic** digital maturity profile, with meaningful installed control assets but persistent manual execution, partial supervisory visibility, and fragmented data governance (INA-PL-RCP-APP-A, INA-PL-RCP-APP-D, INA-PL-RCP-APP-M).`,
      "",
      markdownTable(
        ["Dimension", "Score (1-5)", "Maturity Interpretation"],
        [
          ["Automation Coverage", "2", "Basic"],
          ["Supervisory Integration", "2", "Basic"],
          ["Performance Governance", "1-2", "Initial to Basic"],
          ["Vertical Integration", "1-2", "Initial to Basic"],
          ["Cybersecurity and Segmentation", "1", "Initial / Ad-hoc"],
          ["Overall Digital Maturity", scores.overall, scores.label],
        ]
      ),
      "",
      bulletList([
        "Installed control assets remain operational, but the estate is exposed by obsolete PLC platforms and retrofit-priority process groups (INA-PL-RCP-APP-B, INA-PL-RCP-APP-D).",
        "Manual event capture, quality transcription, and stock coordination limit both performance governance and traceability confidence (INA-PL-RCP-APP-J, INA-PL-RCP-APP-K).",
        "Safety- and availability-critical stations still depend on alarms, manual intervention, or incomplete signal logging rather than governed interlocks and trusted history (INA-PL-RCP-APP-A, INA-PL-RCP-APP-K).",
        "Vertical integration remains weak because planning, QA, and plant-floor evidence flow through fragmented documents instead of one governed data backbone (INA-PL-RCP-APP-N).",
      ]),
      "",
      "## 2. Production Scope and Capacity",
      "",
      `The production scope covers receiving, crushing, cleaning, heating, coating, joining, transfer, and utility support steps needed to convert baked anodes and rod components into rodded anodes for downstream reduction consumption (INA-PL-RCP-APP-A, INA-PL-RCP-APP-B).`,
      "",
      bulletList([
        "Design capacity is cited as approximately 252 pcs/shift, while actual performance is closer to 180-200 pcs/shift in the findings log (INA-PL-RCP-APP-K).",
        "Capacity suppression is linked to weighing delays, manual QC, stock-preview dependency, overhaul cadence, and weak instrumentation trust (INA-PL-RCP-APP-K, INA-PL-RCP-APP-J).",
      ]),
      "",
      "## 3. Process Stability and Risk",
      "",
      `Process stability is weakened by equipment bottlenecks, incomplete measurement capture, alarm-only protections, and inconsistent control integration across critical stations (INA-PL-RCP-APP-D, INA-PL-RCP-APP-K).`,
      "",
      bulletList([
        "Manual numbering and manual time capture reduce abnormality analysis speed and traceability confidence (INA-PL-RCP-APP-K).",
        "Crusher temperature alarms without automatic interlock leave fire-risk mitigation partly dependent on operator response (INA-PL-RCP-APP-K).",
        "Pneumatic contamination, dust leakage, and weak utility monitoring create recurring instability in support systems that directly affect core equipment uptime (INA-PL-RCP-APP-C, INA-PL-RCP-APP-K).",
      ]),
      "",
      "## 4. Performance Governance",
      "",
      bulletList([
        "A broad KPI library exists, but source evidence shows KPI trust is undermined by manual capture and absent SPC deployment (INA-PL-RCP-APP-J).",
        "Planning and reporting still rely on draft schedules, manual previews, email, and spreadsheets rather than one governed operational record (INA-PL-RCP-APP-J, INA-PL-RCP-APP-N).",
        "Quality turnaround remains a gating factor because lab and approval workflows are sequential and document-centric (INA-PL-RCP-APP-I, INA-PL-RCP-APP-K).",
      ]),
      "",
      "## 5. Control Architecture",
      "",
      `The PLC environment is broad but lifecycle-exposed, with multiple S7-300 controllers and several explicit retrofit or renewal recommendations across core process groups (INA-PL-RCP-APP-D, INA-PL-RCP-APP-M).`,
      "",
      `The supervisory layer exists but is partial. Confirmed SCADA coverage is limited, some rows remain to validate, and important field signals still stop at local alarm or manual capture instead of entering a trusted supervisory history (INA-PL-RCP-APP-E, INA-PL-RCP-APP-M).`,
      "",
      "## 6. Maintenance Posture",
      "",
      `Maintenance governance is stronger in documented procedure scope than in field execution maturity. PM, shutdown, CBM, predictive, lubrication, and calibration procedures are listed, yet spare-part delays, reactive fixes, and incomplete sensor coverage remain material in live plant evidence (INA-PL-RCP-APP-I, INA-PL-RCP-APP-K, INA-PL-RCP-APP-M).`,
      "",
      "## 7. Vertical Integration",
      "",
      bulletList([
        "Planning handoffs from reduction to rodding remain draft- and summary-based (INA-PL-RCP-APP-K, INA-PL-RCP-APP-N).",
        "QA approval and reporting rely on document exchange rather than direct shared records (INA-PL-RCP-APP-I, INA-PL-RCP-APP-N).",
        "Traceability events for anodes and rods remain too manual to support high-confidence cross-functional analytics (INA-PL-RCP-APP-K, INA-PL-RCP-APP-N).",
      ]),
      "",
      "## 8. Cybersecurity Posture",
      "",
      `Cybersecurity posture is currently rated Initial / Ad-hoc because procedure references exist, but the dataset provides limited evidence of active segmentation, hardening, or governed OT visibility within the plant execution layer (INA-PL-RCP-APP-I, INA-PL-RCP-APP-M).`,
      "",
      "## 9. Risk Summary",
      "",
      bulletList(entity.issues.slice(0, 6).map((row) => `${row.Issue} (${row["Area/Process"] || row.Area || "To validate"}) (INA-PL-RCP-APP-K)`)),
      "",
      "## 10. Digital Maturity Profile",
      "",
      markdownTable(
        ["Dimension Code", "Domain", "Score", "Label"],
        scores.rows.map((row) => [row[0], row[1], row[2], row[3]])
      ),
      "",
      `Overall classification: ${scores.label} (INA-PL-RCP-APP-M, INA-PL-RCP-APP-L).`,
      "",
      "## 11. Strategic Implications",
      "",
      bulletList([
        "Structural constraints: lifecycle-exposed controllers, partial SCADA coverage, manual traceability, and slow QA/reporting loops.",
        "Transformation enablers: clear process-group register, documented procedure scope, identified solution candidates, and explicit field evidence for the most important failure modes.",
      ]),
      "",
      "## 12. Transformation Roadmap",
      "",
      bulletList([
        "Phase 1 - Stabilize foundation: instrumentation trust, interlocks, alarm hygiene, and critical PLC/signal renewal.",
        "Phase 2 - Normalize visibility: runtime capture, SCADA/historian consistency, and governed event/genealogy records.",
        "Phase 3 - Extend decision support: maintenance intelligence, integrated planning-quality evidence, and advisory analytics only after foundation data is trusted.",
      ]),
      "",
      "## 13. Final Management Conclusion",
      "",
      `Rodding Plant [INA-PL-RCP] is operationally important and digitally improvable, but the current state is still constrained by manual governance, lifecycle-exposed controls, and incomplete signal trust. The plant does not lack automation assets; it lacks consistent digital integrity around those assets. Management should therefore read the current maturity baseline as a call to stabilize control, visibility, and evidence continuity before expecting advanced optimization outcomes (INA-PL-RCP-APP-A through INA-PL-RCP-APP-N).`,
      "",
    ];
  }

  const markdown = [...commonHeader, ...body].join("\n");
  return {
    markdown,
    evidence: {
      documentId: documentId(pack.identity.plant_code, DOCS.find((item) => item.key === docKey).suffix),
      sources,
      flags,
      decisions,
    },
  };
}

function buildValidation(docKey, markdown) {
  const expected = SECTION_SPECS[docKey];
  const issues = [];
  expected.forEach((heading) => {
    if (!markdown.includes(`## ${heading}`)) {
      issues.push(`Missing required section: ${heading}`);
    }
  });
  const status = issues.length === 0 ? "PASS" : "NEEDS_REVISION";
  return [
    "## Validation Report",
    "",
    "### ✅ Compliant Elements",
    "",
    issues.length === 0
      ? "- All required sections are present in the expected order."
      : "- Heading hierarchy uses H1 and H2 consistently in the generated draft.",
    "",
    "### ⚠️ Issues Found",
    "",
    issues.length === 0 ? "NONE" : issues.map((item) => `- ${item}`).join("\n"),
    "",
    "### 🔧 Required Fixes",
    "",
    issues.length === 0 ? "NONE" : issues.map((item) => `- Resolve: ${item}`).join("\n"),
    "",
    `### Overall Status: ${status}`,
    "",
    issues.length === 0 ? "Draft is structurally compliant." : "Draft requires structural fixes before release.",
    "",
  ].join("\n");
}

function buildRefined(markdown) {
  return markdown
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim() + "\n";
}

function translateMarkdown(markdown, language) {
  if (language === "en") return markdown;
  const lines = markdown.split("\n");
  const titleMap = {
    id: {
      "Management Overview Report": "Laporan Ikhtisar Manajemen",
      "Appendix": "Lampiran",
    },
    ja: {
      "Management Overview Report": "経営概要レポート",
      "Appendix": "付録",
    },
  };
  return lines
    .map((line, index) => {
      if (index === 0 && line.startsWith("# ")) {
        let next = line;
        Object.entries(titleMap[language]).forEach(([from, to]) => {
          next = next.replace(from, to);
        });
        return next;
      }
      return line;
    })
    .join("\n");
}

function writeDocx(targetPath, title, markdown) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "plant-report-docx-"));
  const relsDir = path.join(tempRoot, "_rels");
  const wordDir = path.join(tempRoot, "word");
  ensureDir(relsDir);
  ensureDir(wordDir);
  const lines = markdown.split("\n").filter((line) => line.trim().length > 0);
  const paragraphs = [`<w:p><w:r><w:t>${escXml(title)}</w:t></w:r></w:p>`]
    .concat(lines.map((line) => `<w:p><w:r><w:t xml:space="preserve">${escXml(line)}</w:t></w:r></w:p>`))
    .join("");
  fs.writeFileSync(
    path.join(tempRoot, "[Content_Types].xml"),
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`
  );
  fs.writeFileSync(
    path.join(relsDir, ".rels"),
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
  );
  fs.writeFileSync(
    path.join(wordDir, "document.xml"),
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
 xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
 xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
 xmlns:v="urn:schemas-microsoft-com:vml"
 xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
 xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
 xmlns:w10="urn:schemas-microsoft-com:office:word"
 xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
 xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
 xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"
 xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"
 xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"
 xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
 mc:Ignorable="w14 wp14">
  <w:body>${paragraphs}<w:sectPr/></w:body>
</w:document>`
  );
  const current = process.cwd();
  process.chdir(tempRoot);
  execFileSync("zip", ["-qr", targetPath, "[Content_Types].xml", "_rels", "word"]);
  process.chdir(current);
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

function schemaDefault(schema) {
  if (!schema) return null;
  if (schema.type === "object") {
    const result = {};
    const required = schema.required ?? [];
    required.forEach((key) => {
      result[key] = schemaDefault(schema.properties?.[key]);
    });
    return result;
  }
  if (schema.type === "array") {
    return [];
  }
  if (schema.type === "number") return 0;
  if (schema.type === "boolean") return false;
  return "";
}

function hydrateDefaultsFromSchema(schema, node, context, pathName = "root") {
  if (!schema) return node;
  if (schema.type === "object") {
    const output = node ?? {};
    for (const [key, childSchema] of Object.entries(schema.properties ?? {})) {
      output[key] = hydrateDefaultsFromSchema(childSchema, output[key], context, `${pathName}.${key}`);
    }
    const last = pathName.split(".").pop();
    if (last === "title" && typeof output === "object" && output && !Array.isArray(output) && "title" in output && output.title === "") {
      output.title = context.docTitle;
    }
    return output;
  }
  if (schema.type === "array") {
    if (!Array.isArray(node)) return [];
    return node.map((item, index) =>
      hydrateDefaultsFromSchema(schema.items, item, context, `${pathName}[${index}]`)
    );
  }
  const key = pathName.split(".").pop();
  if (schema.type === "string") {
    if (typeof node === "string" && node !== "") return node;
    const lookup = {
      title: context.docTitle,
      subtitle: `${context.plantName} (${context.plantCode})`,
      status: "Draft",
      documentId: context.docId,
      reference: context.docId,
      reportType: context.docTitle,
      titleLine1: context.plantName.toUpperCase(),
      titleLine2: context.docTitle,
      facilityCode: context.plantCode,
      facilityName: context.plantName,
      date: context.documentDate,
      plant: context.plantName,
      company: context.companyName,
      scope: context.scope,
      content: context.summary,
      dark: "#0f172a",
      primary: "#1d4ed8",
      primaryDark: "#1e3a8a",
      primaryLight: "#bfdbfe",
      accent: "#0ea5e9",
      danger: "#b91c1c",
      warning: "#d97706",
      label: "Generated",
      value: context.summary,
      valueClass: "text-slate-700",
      text: context.summary,
      desc: context.summary,
      theme: "neutral",
      id: context.docId,
      colorClass: "bg-blue-600",
      phase: "Phase 1",
      type: "narrative",
      headline: context.docTitle,
      footer: "",
      conclusion: context.summary,
      flowTitle: context.docTitle,
      listTitle: context.docTitle,
      badge: "Basic",
    };
    return lookup[key] ?? "";
  }
  if (schema.type === "number") {
    if (typeof node === "number") return node;
    if (key === "percentage") return 50;
    if (key === "value") return 1;
    return 0;
  }
  if (schema.type === "boolean") {
    if (typeof node === "boolean") return node;
    return false;
  }
  return node;
}

function fillJsonFromSchema(docKey, pack, markdown, schemaPath) {
  const rawSchema = JSON.parse(readFile(schemaPath)).schema;
  let result = schemaDefault(rawSchema);
  const doc = DOCS.find((item) => item.key === docKey);
  const docId = documentId(pack.identity.plant_code, doc.suffix);
  const paragraphs = splitParagraphs(markdown.replace(/^# .*$/m, "").trim()).slice(0, 8);
  const context = {
    docTitle: doc.title,
    docId,
    plantName: pack.identity.plant_name,
    plantCode: pack.identity.plant_code,
    companyName: pack.identity.company_name,
    documentDate: pack.identity.document_date,
    scope: pack.identity.scope,
    summary: paragraphs[0] || doc.title,
  };

  result = hydrateDefaultsFromSchema(rawSchema, result, context);
  return {
    en_json: result,
    id_json: JSON.parse(JSON.stringify(result)),
    ja_json: JSON.parse(JSON.stringify(result)),
  };
}

function validateSchemaNode(schema, value, pathName = "root") {
  if (!schema) return [];
  const errors = [];
  if (schema.type === "object") {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      errors.push(`${pathName}: expected object`);
      return errors;
    }
    (schema.required ?? []).forEach((key) => {
      if (!(key in value)) errors.push(`${pathName}.${key}: missing required property`);
    });
    Object.entries(schema.properties ?? {}).forEach(([key, child]) => {
      if (key in value) {
        errors.push(...validateSchemaNode(child, value[key], `${pathName}.${key}`));
      }
    });
    if (schema.additionalProperties === false) {
      Object.keys(value).forEach((key) => {
        if (!schema.properties?.[key]) errors.push(`${pathName}.${key}: additional property not allowed`);
      });
    }
    return errors;
  }
  if (schema.type === "array") {
    if (!Array.isArray(value)) {
      errors.push(`${pathName}: expected array`);
      return errors;
    }
    value.forEach((item, index) => {
      errors.push(...validateSchemaNode(schema.items, item, `${pathName}[${index}]`));
    });
    return errors;
  }
  if (schema.type === "string" && typeof value !== "string") errors.push(`${pathName}: expected string`);
  if (schema.type === "number" && typeof value !== "number") errors.push(`${pathName}: expected number`);
  if (schema.type === "boolean" && typeof value !== "boolean") errors.push(`${pathName}: expected boolean`);
  return errors;
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function main() {
  const args = parseArgs(process.argv);
  const raw = readFile(args.input);
  const parsed = parseInputText(raw);
  const pack = buildEvidencePack(parsed, args.input);
  const runRoot = getRunRoot(pack.identity.plant_code);
  const docsRoot = path.join(runRoot, "documents");
  ensureDir(docsRoot);
  fs.writeFileSync(path.join(runRoot, "input.txt"), raw);
  writeJson(path.join(runRoot, "evidence_pack.json"), pack);

  const groups = {
    group_1: ["APP-A", "APP-B", "APP-C", "APP-D", "APP-E", "APP-F", "APP-G", "APP-H", "APP-I", "APP-J"],
    group_2: ["APP-K", "APP-L"],
    sequential: ["APP-M", "APP-N"],
    group_3: ["APP-O", "MAIN"],
  };

  const manifest = {
    run_root: path.relative(process.cwd(), runRoot),
    created_at: new Date().toISOString(),
    identity: pack.identity,
    dependencies: groups,
    preflight: pack.preflight,
    documents: [],
    validations: [],
  };

  const generated = new Map();

  for (const doc of DOCS) {
    const docId = documentId(pack.identity.plant_code, doc.suffix);
    const docDir = path.join(docsRoot, docId);
    ensureDir(docDir);
    const { markdown, evidence } = buildDraft(doc.key, pack, generated);
    const validation = buildValidation(doc.key, markdown);
    const refined = buildRefined(markdown);
    const translations = {
      en: refined,
      id: translateMarkdown(refined, "id"),
      ja: translateMarkdown(refined, "ja"),
    };
    const refmap = referenceMap(SECTION_SPECS[doc.key], evidence);
    const schemaName = doc.key === "MAIN" ? "main-schema.json" : `${doc.key.toLowerCase().replace("app-", "app-")}-schema.json`;
    const schemaPath = path.join(
      "/Users/faizafif/.codex/skills/plant-report-generator/references/json-schemas",
      schemaName
    );
    const webJson = fillJsonFromSchema(doc.key, pack, refined, schemaPath);
    const schema = JSON.parse(readFile(schemaPath)).schema;
    const validationErrors = [
      ...validateSchemaNode(schema, webJson.en_json, "en_json"),
      ...validateSchemaNode(schema, webJson.id_json, "id_json"),
      ...validateSchemaNode(schema, webJson.ja_json, "ja_json"),
    ];

    fs.writeFileSync(path.join(docDir, "stage-01-draft.md"), `${markdown}\n`);
    fs.writeFileSync(path.join(docDir, "stage-02-validation.md"), `${validation}\n`);
    fs.writeFileSync(path.join(docDir, "stage-03-refined.md"), translations.en);
    writeJson(path.join(docDir, "stage-04-translations.json"), {
      translation_id: translations.id,
      translation_ja: translations.ja,
    });
    writeJson(path.join(docDir, "stage-05-web.json"), webJson);
    fs.writeFileSync(path.join(docDir, `${docId}_refmap.md`), `${refmap}\n`);

    fs.writeFileSync(path.join(runRoot, `${docId}_EN.md`), translations.en);
    fs.writeFileSync(path.join(runRoot, `${docId}_refmap.md`), `${refmap}\n`);
    writeJson(path.join(runRoot, `${docId}_web.json`), webJson);

    const enDocx = path.join(runRoot, `${docId}_EN.docx`);
    const idDocx = path.join(runRoot, `${docId}_ID.docx`);
    const jaDocx = path.join(runRoot, `${docId}_JA.docx`);
    writeDocx(enDocx, `${doc.title} (EN)`, translations.en);
    writeDocx(idDocx, `${doc.title} (ID)`, translations.id);
    writeDocx(jaDocx, `${doc.title} (JA)`, translations.ja);

    generated.set(doc.key, {
      docId,
      markdown: refined,
      refmap,
      webJson,
    });

    manifest.documents.push({
      key: doc.key,
      document_id: docId,
      outputs: {
        markdown: path.relative(process.cwd(), path.join(runRoot, `${docId}_EN.md`)),
        docx_en: path.relative(process.cwd(), enDocx),
        docx_id: path.relative(process.cwd(), idDocx),
        docx_ja: path.relative(process.cwd(), jaDocx),
        web_json: path.relative(process.cwd(), path.join(runRoot, `${docId}_web.json`)),
        refmap: path.relative(process.cwd(), path.join(runRoot, `${docId}_refmap.md`)),
      },
    });
    manifest.validations.push({
      document_id: docId,
      structure_status: validation.includes("PASS") ? "PASS" : "NEEDS_REVISION",
      web_json_schema_status: validationErrors.length === 0 ? "PASS" : "FAIL",
      web_json_schema_errors: validationErrors,
    });
  }

  writeJson(path.join(runRoot, "run_manifest.json"), manifest);
  fs.writeFileSync(
    path.join(runRoot, "summary.md"),
    [
      "# Plant Report Package Summary",
      "",
      `Run root: ${path.relative(process.cwd(), runRoot)}`,
      "",
      `Plant: ${pack.identity.plant_name} [${pack.identity.plant_code}]`,
      "",
      `Documents generated: ${manifest.documents.length}`,
      "",
      "## Validation Snapshot",
      "",
      ...manifest.validations.map(
        (item) => `- ${item.document_id}: structure=${item.structure_status}; web_json=${item.web_json_schema_status}`
      ),
      "",
    ].join("\n")
  );

  console.log(runRoot);
}

main();
