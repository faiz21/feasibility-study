# Plant Report Generator - Global Enriched Instruction Index

Instruction name: Plant Report Generator Enriched Layer
Revision: v1
Request type: Chained Instruction
Number of steps: 18
Mode options: `Draft Mode` | `Update Mode`

## Purpose
This enriched layer transforms baseline appendix outputs into client-ready report objects with 360 analysis, maturity assessment, visualization metadata, narrative packaging, and deterministic traceability.

Baseline files (`plant-report-generator-01..18.md/.json`) remain unchanged and continue to operate as the source deterministic contract.

## Enriched Output Contract (All Steps)
All enriched outputs must validate against:
- Base schema: `plant-report-generator-enriched-base.schema.json`
- Step schema: `plant-report-generator-XX-enriched.schema.json`

Required top-level blocks:
- `schema_version` = `1.0.0`
- `source_step`
- `report_profile`
- `metadata`
- `analysis_360`
- `visualization_pack`
- `narrative_pack`
- `traceability`
- `quality_gate`
- `step_payload`

## Deterministic Transformation Policy
- Use only evidence from validated source tables and prior required appendices.
- Keep code references and document IDs exact; no fabricated identifiers.
- Preserve source semantics; enrich presentation structure only.
- Any unknown or incomplete field must be represented as `To validate - <field>`.
- In Update Mode, stop on schema mismatch, broken references, invalid scoring constraints, or missing mandatory evidence anchors.

## Consultant Narrative Standard
Every summary and interpretation must follow:
1. Observation
2. Operational Effect
3. Business Risk
4. Digital Implication

Narrative requirements:
- Formal consultant tone
- Evidence-anchored claims
- No external assumptions unless explicitly provided

## 360 Analysis Dimension Model
Default dimension set (adapt per step scope):
- Process Integrity
- Asset and Control Reliability
- Supervisory and Data Visibility
- Performance Governance
- OT-IT Integration
- Cybersecurity and Resilience

Scoring model:
- Primary numeric score: 0..100
- Level labels: Initial, Developing, Defined, Managed, Optimized
- Confidence: 0..1 per dimension

Reference interpretation bands:
- 0-20: Initial
- 21-40: Developing
- 41-60: Defined
- 61-80: Managed
- 81-100: Optimized

## Visualization Selection Rules
Minimum per enriched step:
- KPI cards: at least 3
- Charts: at least 2 (recommended 3)
- Include one risk-oriented visualization for every step
- Include one maturity visualization for steps 13-17

Chart types allowed:
`bar`, `stacked_bar`, `line`, `area`, `pie`, `donut`, `radar`, `heatmap`, `table`

## Traceability and Quality Gates
- Every major claim must map to evidence references in `traceability`.
- `quality_gate.checks` must include deterministic check IDs and outcomes.
- `quality_gate.status` must be `pass`, `warning`, or `fail`.

## Enriched Step File Index
| Step | Title | Enriched Instruction | Enriched Schema |
|---|---|---|---|
| 01 | Ingest & Normalize Data Pack | [plant-report-generator-01-enriched.md](./plant-report-generator-01-enriched.md) | [plant-report-generator-01-enriched.schema.json](./plant-report-generator-01-enriched.schema.json) |
| 02 | Appendix A — Material & Manufacturing Architecture | [plant-report-generator-02-enriched.md](./plant-report-generator-02-enriched.md) | [plant-report-generator-02-enriched.schema.json](./plant-report-generator-02-enriched.schema.json) |
| 03 | Appendix B — Process Architecture: Process Groups Inventory | [plant-report-generator-03-enriched.md](./plant-report-generator-03-enriched.md) | [plant-report-generator-03-enriched.schema.json](./plant-report-generator-03-enriched.schema.json) |
| 04 | Appendix C — Asset Scope: Equipment Inventory | [plant-report-generator-04-enriched.md](./plant-report-generator-04-enriched.md) | [plant-report-generator-04-enriched.schema.json](./plant-report-generator-04-enriched.schema.json) |
| 05 | Appendix D — Control Layer Scope: PLC Inventory | [plant-report-generator-05-enriched.md](./plant-report-generator-05-enriched.md) | [plant-report-generator-05-enriched.schema.json](./plant-report-generator-05-enriched.schema.json) |
| 06 | Appendix E — Supervisory Control Scope: SCADA/DCS Inventory | [plant-report-generator-06-enriched.md](./plant-report-generator-06-enriched.md) | [plant-report-generator-06-enriched.schema.json](./plant-report-generator-06-enriched.schema.json) |
| 07 | Appendix F — Mobile Assets: Vehicle & Mobile Asset Inventory | [plant-report-generator-07-enriched.md](./plant-report-generator-07-enriched.md) | [plant-report-generator-07-enriched.schema.json](./plant-report-generator-07-enriched.schema.json) |
| 08 | Appendix G — Organizational Scope: Departments & Sections Involved | [plant-report-generator-08-enriched.md](./plant-report-generator-08-enriched.md) | [plant-report-generator-08-enriched.schema.json](./plant-report-generator-08-enriched.schema.json) |
| 09 | Appendix H — Functional Scope: Function Groups / Value Streams | [plant-report-generator-09-enriched.md](./plant-report-generator-09-enriched.md) | [plant-report-generator-09-enriched.schema.json](./plant-report-generator-09-enriched.schema.json) |
| 10 | Appendix I — Procedural Scope: Procedures Covered | [plant-report-generator-10-enriched.md](./plant-report-generator-10-enriched.md) | [plant-report-generator-10-enriched.schema.json](./plant-report-generator-10-enriched.schema.json) |
| 11 | Appendix J — Performance Scope: KPIs & Performance Measures | [plant-report-generator-11-enriched.md](./plant-report-generator-11-enriched.md) | [plant-report-generator-11-enriched.schema.json](./plant-report-generator-11-enriched.schema.json) |
| 12 | Appendix K — Evidence Registers: Findings, Notes, and Issues | [plant-report-generator-12-enriched.md](./plant-report-generator-12-enriched.md) | [plant-report-generator-12-enriched.schema.json](./plant-report-generator-12-enriched.schema.json) |
| 13 | Appendix L — Audit Evaluation Framework: Parameter Dictionary & Scoring Logic | [plant-report-generator-13-enriched.md](./plant-report-generator-13-enriched.md) | [plant-report-generator-13-enriched.schema.json](./plant-report-generator-13-enriched.schema.json) |
| 14 | Appendix M — Scoring Results: Plant Maturity Assessment Matrix | [plant-report-generator-14-enriched.md](./plant-report-generator-14-enriched.md) | [plant-report-generator-14-enriched.schema.json](./plant-report-generator-14-enriched.schema.json) |
| 15 | Appendix N — Vertical Integration: OT <-> IT Systems Evaluation | [plant-report-generator-15-enriched.md](./plant-report-generator-15-enriched.md) | [plant-report-generator-15-enriched.schema.json](./plant-report-generator-15-enriched.schema.json) |
| 16 | Appendix O — Automation Audit Report: Blank Template | [plant-report-generator-16-enriched.md](./plant-report-generator-16-enriched.md) | [plant-report-generator-16-enriched.schema.json](./plant-report-generator-16-enriched.schema.json) |
| 17 | Main Report Narrative — Management Overview Report | [plant-report-generator-17-enriched.md](./plant-report-generator-17-enriched.md) | [plant-report-generator-17-enriched.schema.json](./plant-report-generator-17-enriched.schema.json) |
| 18 | Assembly Index (and Optional Combined Master Index) | [plant-report-generator-18-enriched.md](./plant-report-generator-18-enriched.md) | [plant-report-generator-18-enriched.schema.json](./plant-report-generator-18-enriched.schema.json) |

## Compatibility Rule
This enriched layer is additive. Original step chain remains runnable without modification.
