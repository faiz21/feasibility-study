# Step 01 - Enriched Instruction Addendum

Global reference: `00-global-enriched-instruction.md`
Base schema: `plant-report-generator-enriched-base.schema.json`
Target schema: `plant-report-generator-01-enriched.schema.json`

## Intent
Produce report-ready transformed data for **Ingest & Normalize Data Pack** with consultant-grade 360 analysis, maturity scoring (0-100 + 5-level label), executive narrative packaging, and visualization-ready chart definitions.

## Required Inputs
- Source instruction: `plant-report-generator-01.md`
- Source schema: `plant-report-generator-01.json`
- Prerequisite steps: None
- Evidence sources:
- `input_0`: {'name': 'Mode', 'type': 'string', 'allowed_values': ['Draft', 'Update']}
- `input_1`: {'name': 'Report Metadata', 'type': 'markdown_table', 'fields': ['Project', 'Facility', 'Phase', 'Date', 'Prepared by', 'Plant Code', 'Plant Name']}
- `input_2`: {'name': 'Data Pack Content', 'type': 'free_text', 'required_sections': ['List Of Related Departments', 'List Of Related Sections', 'List Of Related Solution Proposed', 'List Of Related Function Group / Value Stream', 'List Of Related Procedures', 'List Of Related KPIs', 'List Of Process Groups', 'List Of Equipments', 'List Of SCADA', 'List Of PLC', 'List Of Vehicle', 'List Of Findings & Notes', 'List Of Issue', 'List Of Process Elicitation Result', 'List Of File Used']}
- `input_3`: {'name': 'Optional Add-ons', 'type': 'free_text', 'required': False}

## Transformation Rules into `step_payload`
- Preserve deterministic logic and stop conditions from Step 1 baseline artifacts.
- Map baseline step structure directly into `step_payload` with required keys: `document_id_pattern`, `outputs`, `required_inputs`, `cross_references`, `quality_gate`.
- Keep all source-controlled identifiers unchanged (codes, document IDs, and section anchors).
- Do not invent findings, KPIs, systems, risk levels, or scores beyond evidence.
- Mark unresolved fields as `To validate - <field>` and surface them in `quality_gate.checks`.

## Mandatory `analysis_360`
- `overall_score` in range 0..100.
- `overall_level` in one of: Initial, Developing, Defined, Managed, Optimized.
- `dimension_scores` minimum 4 rows with evidence-linked justification.
- Include `key_findings` focused on operational effect, business risk, and digital implication.

## Mandatory `visualization_pack`
- Minimum KPI cards: 3.
- Required charts for Step 1:
- `summary` (bar): Summary Chart
- `risk` (heatmap): Risk Heatmap
- Every chart must include an `insight` field and deterministic data series.

## Required Executive Narrative Points
- Baseline posture summary for the appendix scope.
- Top maturity constraints and risk concentration.
- Immediate and near-term action emphasis (P1/P2/P3).
- Data-quality caveats and assumptions that affect confidence.

## Step-Level Quality Gate Stop Conditions
- Log errors; continue execution
- STOP on missing section, schema error, duplicate code, or broken reference

## Output Contract
- Output object must validate against `plant-report-generator-01-enriched.schema.json`.
- `source_step` must be `1` and `report_profile.title` must be exactly `Ingest & Normalize Data Pack`.
