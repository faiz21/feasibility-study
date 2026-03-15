# Appendix O - Automation Assessment

RODDING PLANT (INA-PL-RCP)

Document Date: 14 March 2026

## 1. Purpose of Appendix O

This appendix packages the local automation assessment for Rodding Plant [INA-PL-RCP] in a board-ready structure focused on L1-L3 scope.

## 2. Assessment Purpose and Boundaries

- **Purpose:** Establish L1-L3 readiness and constraints for Rodding Plant as an input to the digital feasibility study.
- **In scope:** 17 process groups recorded for INA-PL-RCP, plus shared utilities and interfaces evidenced in the plant dataset.
- **Out of scope:** business case quantification, full enterprise architecture alignment, and solution deployment claims.

## 3. Information Sources and Interpretation Rules

- Evidence comes from structured plant tables, field findings, issue logs, and elicitation results.
- Explicit To validate and unknown markers are preserved without forced resolution.
- Interpretation is conservative where as-built details are incomplete.

## 4. Plant Baseline and Automation Snapshot

| Metric | Value |
| --- | --- |
| Total instruments | 670 |
| PLC readable | 544 |
| Relay | 28 |
| Closed loop | 0 |
| Obtained | 488 |
| Inferred | 182 |
| PLC rows | 10 |
| SCADA rows | 2 |

## 5. Cross-Cutting Themes and Gaps

- Manual data capture remains a plantwide constraint for production, quality, and planning interfaces.
- Dust, heat, and harsh operating conditions degrade sensor reliability and field trust.
- Alarm/event history and automatic interlock enforcement are inconsistent across critical stations.

## 6. L1-L3 Readiness Summary

| Layer | Assessment |
| --- | --- |
| L1 - Basic Control | Present but lifecycle-exposed; several controllers and interfaces require retrofit or renewal. |
| L2 - Supervisory | Partial; supervisory visibility exists but is incomplete and not consistently trusted. |
| L3 - Operations Management | Basic; workflows rely on paper, Excel, email, and manual reconciliation. |

## 7. Process Group Assessment Notes

- RCP Used Anode Receiving & Power-Free Conveyor (LO-401 / CR-401) [INA-PG-RCP-001] carries the note: Controls the unloading/loading sequence from the anode transport car onto the power-free conveyor, including conveyor permissives, indexing/accumulation logic, jam handling, and s....
- RCP Butt & Timbel Crushing / Pressing (PR-401/402, CR-401/402) [INA-PG-RCP-002] carries the note: Automates crushing cycles for used anode butts and pig-iron connection handling with hydraulic sequencing, guarding interlocks, overload and jam logic..
- RCP Crushed Butt & Return Crust Conveying to Bins [INA-PG-RCP-003] carries the note: Controls conveyors, diverters, and interlocks that route crushed butt and return crust to designated bins..
- RCP Crust Removal & Shot Blasting / Cleaning (SH-401, SH-405 + Return Crust Removal Station) [INA-PG-RCP-004] carries the note: Controls cleaning stations, guard interlocks, blast permissives, extraction permissives, and fault handling..
- RCP Nipple Cleaning + Graphite Coating + Nipple Drying (SH-402, GC-401, DR-401) [INA-PG-RCP-005] carries the note: Automates cleaning, coating, drying sequences and utility permissives..

## 8. Technical Roadmap Direction

- Stabilize instrumentation, signal logging, and interlock integrity in the most safety- and throughput-sensitive stations.
- Normalize PLC and SCADA visibility across retrofit-priority process groups.
- Establish trusted runtime, event, and genealogy capture before extending into predictive or advisory layers.

## 9. Summary

Appendix O confirms that INA-PL-RCP has enough existing control infrastructure to justify structured modernization, but not enough current data integrity to skip foundational stabilization.
