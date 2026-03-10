---
name: txt-report-to-generated-report
description: Transform a plant report .txt (e.g. report/Report Generator/INA-PL-GRP.txt) into a deterministic run folder under report/Generated Report/<run-id>/ containing evidence_pack.json, step-01..18.enriched.json (LLM-generated, schema-validated), and a combined report.md. Use when asked to convert/transform .txt plant reports using the Report Generator instruction chain in report/Report Generator/.
---

# TXT Report to Generated Report (Plant Report Generator)

## Goal
Given a plant report `.txt`, produce a per-run output folder under `report/Generated Report/` containing:
- `task_plan.md`, `findings.md`, `progress.md` (planning-with-files workflow)
- `input.txt` (source snapshot)
- `evidence_pack.json` (extracted evidence sections/tables)
- `step-01.enriched.json` ... `step-18.enriched.json` (enriched outputs, must validate)
- `report.md` (combined reader-friendly report assembled from step outputs)

Default mode: `Draft`.

## Source of Truth (do not copy into this skill)
All generator instructions and schemas live in `report/Report Generator/`:
- Global rules: `report/Report Generator/00-global-enriched-instruction.md`
- Step instructions: `report/Report Generator/plant-report-generator-01-enriched.md` ... `plant-report-generator-18-enriched.md`
- Base schema: `report/Report Generator/plant-report-generator-enriched-base.schema.json`
- Step schemas: `report/Report Generator/plant-report-generator-XX-enriched.schema.json`

## Run Directory Convention
Create a unique run directory:
`report/Generated Report/<input-stem>__YYYYMMDD_HHMMSS/`

Inside the run directory create:
- `task_plan.md`
- `findings.md`
- `progress.md`

These files are the persistent working memory for the run. Update them after each phase.

## Workflow (Draft Mode)
1. **Initialize run folder**
   - Create the run directory.
   - Copy the input `.txt` into `input.txt`.
   - Create planning files:
     - `task_plan.md`: phases + status + acceptance criteria
     - `findings.md`: extraction issues + open questions + To validate list
     - `progress.md`: timestamped log of actions and outputs created

2. **Extract evidence pack**
   - Run:
     - `node .agents/skills/txt-report-to-generated-report/scripts/extract-evidence-pack.mjs <input.txt> <runDir>/evidence_pack.json`
   - Review `extraction_warnings` and write them into `findings.md`.

3. **Generate enriched step outputs (01..18)**
   - Read the global rules and the step instruction:
     - `00-global-enriched-instruction.md`
     - `plant-report-generator-XX-enriched.md`
   - Use ONLY evidence from `evidence_pack.json` and the input `.txt`.
   - Produce `step-XX.enriched.json` that conforms to:
     - base schema + step schema
   - Deterministic policy:
     - No fabricated identifiers.
     - Unknown/missing fields must be explicit as `To validate - <field>`.
     - Populate `quality_gate.checks` with concrete IDs/outcomes.
   - After each step:
     - Update `progress.md` (what was generated + any warnings).
     - Update `findings.md` for unresolved fields.

4. **Validate enriched outputs**
   - Run:
     - `node .agents/skills/txt-report-to-generated-report/scripts/validate-enriched-outputs.mjs --schemas-dir "report/Report Generator" --run-dir "<runDir>"`
   - If validation fails:
     - Fix the specific step JSON(s) and re-run validation.

5. **Assemble combined Markdown**
   - Run:
     - `node .agents/skills/txt-report-to-generated-report/scripts/assemble-report-md.mjs "<runDir>" "<runDir>/report.md"`
   - The output should be readable and structured by steps.

## Update Mode (optional strict mode)
Use `Update` when updating an existing run folder and you want strict blocking behavior:
- Stop on schema mismatch, broken cross references, or missing mandatory evidence anchors per global rules.
- Do not overwrite validated outputs without explaining why in `progress.md`.

## Acceptance Criteria
- `evidence_pack.json` exists and contains the canonical required sections (see references).
- `step-01..18.enriched.json` all validate against their schemas.
- `report.md` exists and includes per-step executive summary, key findings, risks (if present), and recommended actions.

## References
- See `references/report-generator-paths.md` for exact paths and canonical section names.
