# Step 05 - Enriched Instruction Addendum

Global reference: `00-global-enriched-instruction.md`
Base schema: `plant-report-generator-enriched-base.schema.json`
Target schema: `plant-report-generator-05-enriched.schema.json`

## Intent
Produce report-ready transformed data for **Appendix D — Control Layer Scope: PLC Inventory** with consultant-grade 360 analysis, maturity scoring (0-100 + 5-level label), executive narrative packaging, and visualization-ready chart definitions.

## Required Inputs
- Source instruction: `plant-report-generator-05.md`
- Source schema: `plant-report-generator-05.json`
- Prerequisite steps: 1, 2, 3
- Evidence sources:
- `List Of PLC`
- `List Of Process Groups`
- `List Of SCADA`
- `List Of Findings & Notes`
- `List Of Issue`
- `List Of Related Solution Proposed`

## Transformation Rules into `step_payload`
- Preserve deterministic logic and stop conditions from Step 5 baseline artifacts.
- Map baseline step structure directly into `step_payload` with required keys: `document_id_pattern`, `prerequisite_steps`, `evidence_sources`, `sections`, `outputs`, `quality_gate`.
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
- Required charts for Step 5:
- `dist-overview` (bar): Distribution Overview
- `risk-heatmap` (heatmap): Risk and Exposure Heatmap
- `maturity-radar` (radar): Dimension Maturity Radar
- Every chart must include an `insight` field and deterministic data series.

## Required Executive Narrative Points
- Baseline posture summary for the appendix scope.
- Top maturity constraints and risk concentration.
- Immediate and near-term action emphasis (P1/P2/P3).
- Data-quality caveats and assumptions that affect confidence.

## Step-Level Quality Gate Stop Conditions
- PLC.Process Group invalid
- PLC.SCADA ID references non-existent SCADA code
- Lifecycle assessment uses non-numeric year

## Output Contract
- Output object must validate against `plant-report-generator-05-enriched.schema.json`.
- `source_step` must be `5` and `report_profile.title` must be exactly `Appendix D — Control Layer Scope: PLC Inventory`.
