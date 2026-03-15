# Appendix A - Material & Manufacturing Architecture

RODDING PLANT (INA-PL-RCP)

Document Date: 14 March 2026

## 1. Purpose of Appendix A

This appendix establishes the material and manufacturing context for Rodding Plant [INA-PL-RCP]. It uses the company context narrative, Rodding Plant detail, equipment scope, and control evidence to frame how rodding operations support the integrated aluminum value chain while retaining explicit validation flags where the source remains incomplete.

## 2. Manufacturing Context Summary

PT Indonesia Asahan Aluminium operates an integrated aluminum chain from carbon production to casting. Within that chain, Rodding Plant [INA-PL-RCP] performs anode preparation, cleaning, heating, connection, and cast-iron joining steps that determine whether prebake anodes can be consumed consistently by downstream reduction operations. The source evidence shows that throughput is constrained less by nominal equipment count than by instrumentation trust, control obsolescence, and manual handling dependencies.

## 3. Raw Material and Input Streams

- Primary rodding inputs include used anodes, rods, stubs, cast iron, graphite, compressed air, cooling water, and molten/aluminum holding support where coating steps require it.
- The wider company context also ties rodding performance to upstream green and baking operations, because anode quality and transport readiness directly affect rod joining outcomes.
- [To validate - exact rodding consumable balance - source tables do not quantify material consumption by step]

## 4. Production Process Overview

The in-scope process groups cover used anode receiving, crushing, conveying, crust removal, graphite coating, stub heating, holding furnace support, spraying support, induction furnaces, casting preparation, rod straightening, slot cutting, conveyor transport, dust collection, cooling water circulation, and crane interface controls. Together, these process groups show that rodding is an interconnected material-handling and joining system rather than a single workstation.

### 4.1 In-Scope Process Groups

| Code | Process Group | Lifecycle Note |
| --- | --- | --- |
| INA-PG-RCP-001 | RCP Used Anode Receiving & Power-Free Conveyor (LO-401 / CR-401) | Retrofit required (replace obsolete PLC) |
| INA-PG-RCP-002 | RCP Butt & Timbel Crushing / Pressing (PR-401/402, CR-401/402) | Retrofit required (replace obsolete PLC) |
| INA-PG-RCP-003 | RCP Crushed Butt & Return Crust Conveying to Bins | Retrofit required (replace obsolete PLC) |
| INA-PG-RCP-004 | RCP Crust Removal & Shot Blasting / Cleaning (SH-401, SH-405 + Return Crust Removal Station) | Renewal required (PLC not confirmed for this scope) |
| INA-PG-RCP-005 | RCP Nipple Cleaning + Graphite Coating + Nipple Drying (SH-402, GC-401, DR-401) | Renewal required (PLC not confirmed for this scope) |

## 5. Critical Control Points (CCPs)

- MTC weigher: Frequent Minor Repair on MTC Weigher Source: To validate — source.
- Planning / scheduling: Production planning coming from reduction plant dalam bentuk draft schedule, WIP 78 Source: To validate — source.
- Visual QC: Menggunakan manual QC untuk visual hasil baked green block Source: To validate — source.
- SPC / control: No SPC is implemented throughout the business and production process Source: To validate — source.
- Data integration: Manual data input of event of time when a process starts and stop Source: To validate — source.
- Data integration: Manually recorded data (especially time data) are unreliable, leading to inaccurate data analysis. Source: To validate — source.

## 6. Equipment Architecture Summary

| Code | Equipment | Process Group | Type |
| --- | --- | --- | --- |
| INA-EQP-RCP-001 | Loader | INA-PG-RCP-001 | INA-EQT-ALD |
| INA-EQP-RCP-002 | Loading Station Conveyor | INA-PG-RCP-001 | INA-EQT-CNV |
| INA-EQP-RCP-003 | Crust Breaker | INA-PG-RCP-001 | INA-EQT-CRB |
| INA-EQP-RCP-004 | Ladle Cross Charging Conveyor | INA-PG-RCP-010 | INA-EQT-CNV |
| INA-EQP-RCP-005 | Return Crust Sorter | INA-PG-RCP-003 | INA-EQT-SRT |
| INA-EQP-RCP-006 | Shot Blaster | INA-PG-RCP-004 | INA-EQT-RCL |
| INA-EQP-RCP-007 | Used Anode Scale | INA-PG-RCP-001 | INA-EQT-SMP |
| INA-EQP-RCP-008 | Hydraulic Anode Press (<200 kG) | INA-PG-RCP-002 | INA-EQT-HPR |

## 7. Control Layer Integration

The control baseline is mixed. 10 PLC rows are recorded for the plant, dominated by Siemens S7-300 controllers with several explicit retrofit or renewal flags. Supervisory visibility is limited, with 2 SCADA rows and at least one placeholder entry showing that parts of the plant operate without confirmed SCADA coverage. This pattern keeps the plant operational but leaves low-confidence digital traceability across several transitions.

## 8. Risk Themes from Manufacturing Architecture

- Manual numbering, time capture, and QC forms weaken genealogy integrity and slow abnormality analysis.
- Obsolete PLC assets and incomplete interlock enforcement elevate availability and safety exposure.
- Measurement distrust in silo levels, manual sounding, and non-integrated furnace/temperature data reduces planning confidence.

## 9. Maturity Indicators

| Dimension | Score | Label |
| --- | --- | --- |
| PLC Environment | 2 | Basic |
| Supervisory Layer | 2 | Basic |
| Data / Analytics | 1-2 | Initial to Basic |
| Alarm Governance | 1-2 | Initial to Basic |
| Maintenance | 2-3 | Basic to Structured |

## 10. Summary and Key Observations

Rodding Plant [INA-PL-RCP] sits at a critical junction between carbon preparation and reduction. The plant has extensive mechanical scope, but its digital posture remains basic because many core decisions still depend on manual recording, limited supervisory capture, and retrofit-priority PLC assets. The operational effect is slower diagnosis and weaker control confidence; the business risk is unstable anode readiness and avoidable downtime; the digital implication is that control, traceability, and data-quality foundations need to be stabilized before higher-order analytics can be trusted.

