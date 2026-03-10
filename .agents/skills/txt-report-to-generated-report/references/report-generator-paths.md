# Report Generator Paths + Canonical Extraction Targets

## Instruction and Schema Sources (repo paths)
- Global enriched rules: `report/Report Generator/00-global-enriched-instruction.md`
- Step enriched instructions: `report/Report Generator/plant-report-generator-01-enriched.md` ... `plant-report-generator-18-enriched.md`
- Base schema: `report/Report Generator/plant-report-generator-enriched-base.schema.json`
- Step schemas: `report/Report Generator/plant-report-generator-01-enriched.schema.json` ... `plant-report-generator-18-enriched.schema.json`

## Default Input Example
- `report/Report Generator/INA-PL-GRP.txt`

## Step 01 Required Sections (canonical names)
These are the minimum extraction targets for `evidence_pack.json`:
- `List Of Related Departments`
- `List Of Related Sections`
- `List Of Related Solution Proposed`
- `List Of Related Function Group / Value Stream`
- `List Of Related Procedures`
- `List Of Related KPIs`
- `List Of Process Groups`
- `List Of Equipments`
- `List Of SCADA`
- `List Of PLC`
- `List Of Vehicle`
- `List Of Findings & Notes`
- `List Of Issue`
- `List Of Process Elicitation Result`
- `List Of File Used`

## Validation Expectations
- Every `step-XX.enriched.json` must validate against:
  - Base schema: `plant-report-generator-enriched-base.schema.json`
  - Step schema: `plant-report-generator-XX-enriched.schema.json`
- Draft behavior:
  - Missing/unknown values should be explicit as `To validate - <field>`
  - Output must still validate (keep required types and fields present).
