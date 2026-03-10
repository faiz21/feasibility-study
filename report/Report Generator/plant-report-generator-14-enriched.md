# Step 14 - Enriched Instruction Addendum

Global reference: `00-global-enriched-instruction.md`
Base schema: `plant-report-generator-enriched-base.schema.json`
Target schema: `plant-report-generator-14-enriched.schema.json`

## Intent
Produce report-ready transformed data for **Appendix M — Scoring Results: Plant Maturity Assessment Matrix** with consultant-grade 360 analysis, maturity scoring (0-100 + 5-level label), executive narrative packaging, and visualization-ready chart definitions.

## Required Inputs
- Source instruction: `plant-report-generator-14.md`
- Source schema: `plant-report-generator-14.json`
- Prerequisite steps: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15
- Evidence sources:
- `To validate`


## Transformation Rules into `step_payload`
- Preserve deterministic logic and stop conditions from Step 14 baseline artifacts.
- Map baseline step structure directly into `step_payload` with required keys: `document_id_pattern`, `prerequisite_steps`, `sections`, `outputs`, `quality_gate`.
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
- Required charts for Step 14:
- `maturity-matrix` (heatmap): Plant Maturity Matrix
- `domain-score-radar` (radar): Domain Score Radar
- `weighted-score-bar` (bar): Weighted Dimension Scores
- Every chart must include an `insight` field and deterministic data series.

## Required Executive Narrative Points
- Baseline posture summary for the appendix scope.
- Top maturity constraints and risk concentration.
- Immediate and near-term action emphasis (P1/P2/P3).
- Data-quality caveats and assumptions that affect confidence.

## Step-Level Quality Gate Stop Conditions
- Any dimension score conflicts with Appendix L criteria
- Required evidence anchor missing per matrix row
- Risk level does not match Appendix L mapping
- Weighted average miscalculated or incorrectly rounded
- Solution code not in Solution table referenced

## Output Contract
- Output object must validate against `plant-report-generator-14-enriched.schema.json`.
- `source_step` must be `14` and `report_profile.title` must be exactly `Appendix M — Scoring Results: Plant Maturity Assessment Matrix`.
