# Step 13 - Enriched Instruction Addendum

Global reference: `00-global-enriched-instruction.md`
Base schema: `plant-report-generator-enriched-base.schema.json`
Target schema: `plant-report-generator-13-enriched.schema.json`

## Intent
Produce report-ready transformed data for **Appendix L — Audit Evaluation Framework: Parameter Dictionary & Scoring Logic** with consultant-grade 360 analysis, maturity scoring (0-100 + 5-level label), executive narrative packaging, and visualization-ready chart definitions.

## Required Inputs
- Source instruction: `plant-report-generator-13.md`
- Source schema: `plant-report-generator-13.json`
- Prerequisite steps: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
- Evidence sources:
- `APP-D`
- `APP-E`
- `APP-H`
- `APP-I`
- `APP-J`
- `APP-K`
- `APP-N (when available)`

## Transformation Rules into `step_payload`
- Preserve deterministic logic and stop conditions from Step 13 baseline artifacts.
- Map baseline step structure directly into `step_payload` with required keys: `document_id_pattern`, `prerequisite_steps`, `evidence_sources`, `immutable_elements`, `default_weights`, `sections`, `outputs`, `quality_gate`.
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
- Required charts for Step 13:
- `weight-waterfall` (bar): Scoring Weight Profile
- `criteria-radar` (radar): Parameter Criteria Balance
- `risk-mapping` (heatmap): Risk Mapping Matrix
- Every chart must include an `insight` field and deterministic data series.

## Required Executive Narrative Points
- Baseline posture summary for the appendix scope.
- Top maturity constraints and risk concentration.
- Immediate and near-term action emphasis (P1/P2/P3).
- Data-quality caveats and assumptions that affect confidence.

## Step-Level Quality Gate Stop Conditions
- Any of the nine dimensions is missing, renamed, or reordered
- Maturity scale (Section 3.1) is altered
- Any plant score is included in Appendix L
- Weight totals do not equal 100 or override is incomplete
- Parameters introduced, removed, or renumbered

## Output Contract
- Output object must validate against `plant-report-generator-13-enriched.schema.json`.
- `source_step` must be `13` and `report_profile.title` must be exactly `Appendix L — Audit Evaluation Framework: Parameter Dictionary & Scoring Logic`.
