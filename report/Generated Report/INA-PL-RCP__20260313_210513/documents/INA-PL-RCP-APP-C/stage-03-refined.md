# Appendix C - Asset Scope: Equipment Inventory

RODDING PLANT (INA-PL-RCP)

Document Date: 14 March 2026

## 1. Purpose of Appendix C

This appendix documents the equipment scope for Rodding Plant [INA-PL-RCP] and relates physical assets to automation exposure, lifecycle risk, and bottleneck concentration.

## 2. Equipment Inventory Summary

The dataset records 27 equipment rows for the plant, spanning conveyors, presses, crushers, furnaces, cleaners, sprayers, water pumps, cooling towers, cranes, and bag filter support systems. The breadth of this list confirms that rodding is a distributed equipment system with many transfer points and utility dependencies.

## 3. Equipment Classification by Function

| Process Group Code | Equipment Count |
| --- | --- |
| INA-PG-RCP-001 | 5 |
| INA-PG-RCP-010 | 2 |
| INA-PG-RCP-003 | 3 |
| INA-PG-RCP-004 | 1 |
| INA-PG-RCP-002 | 4 |
| INA-PG-RCP-011 | 1 |
| INA-PG-RCP-014 | 1 |
| INA-PG-RCP-005 | 3 |
| INA-PG-RCP-017 | 1 |
| INA-PG-RCP-008 | 1 |

## 4. Automation Exposure by Process Group

- RCP Used Anode Receiving & Power-Free Conveyor (LO-401 / CR-401) [INA-PG-RCP-001] links to 5 equipment records and is governed by Simatic S7-300,Siemens S7-300.
- RCP Butt & Timbel Crushing / Pressing (PR-401/402, CR-401/402) [INA-PG-RCP-002] links to 4 equipment records and is governed by Simatic S7-300.
- RCP Crushed Butt & Return Crust Conveying to Bins [INA-PG-RCP-003] links to 3 equipment records and is governed by Siemens S7-300.
- RCP Crust Removal & Shot Blasting / Cleaning (SH-401, SH-405 + Return Crust Removal Station) [INA-PG-RCP-004] links to 1 equipment records and is governed by Simatic S7-300.
- RCP Nipple Cleaning + Graphite Coating + Nipple Drying (SH-402, GC-401, DR-401) [INA-PG-RCP-005] links to 3 equipment records and is governed by Simatic S7-300.
- RCP Stub Heating & Drying [INA-PG-RCP-006] links to 0 equipment records and is governed by Simatic S7-300.
- RCP Aluminium Holding Furnace Control (HF-401) [INA-PG-RCP-007] links to 1 equipment records and is governed by Simatic S7-1200.
- RCP Aluminium Spraying System & Compressed Air Interface (SP line + air permissives/alarms) [INA-PG-RCP-008] links to 1 equipment records and is governed by Simatic S7-1200.

## 5. Lifecycle and Age Assessment

Lifecycle posture is mixed. Several process groups carry explicit retrofit or renewal notes, while a small subset is marked maintain. The operational effect is non-uniform reliability across the line. The business risk is concentrated downtime around obsolete or weakly monitored assets. The digital implication is that asset inventory alone is insufficient unless lifecycle state is kept current and tied to maintenance decisions.

## 6. Bottleneck-Linked Equipment

- MTC weigher delays, LO401 transport speed issues, and QA instrument bottlenecks appear in the findings and issues tables as repeating throughput suppressors.
- Manual or weakly instrumented steps around crushers, coating, and casting preparation increase queue risk because abnormal states are discovered late.
- Dust collection, pneumatic quality, and cooling water monitoring are enabling systems rather than peripheral utilities because they directly protect core equipment uptime.

## 7. Gap and Flag Register

- [To validate - customer names - not supplied in source dataset]
- [To validate - certifications in scope - source narrative leaves certifications unconfirmed]
- [To validate - complete utility instrumentation coverage - field evidence is partial]
