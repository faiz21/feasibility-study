# Appendix D - Control Layer Scope

RODDING PLANT (INA-PL-RCP)

Document Date: 14 March 2026

## 1. Purpose of Appendix D

This appendix establishes the control-layer baseline for Rodding Plant [INA-PL-RCP] by consolidating PLC and SCADA evidence into one deterministic view.

## 2. Control Layer Inventory

| Code | PLC Tag | Model | Process Group | Lifecycle | Action |
| --- | --- | --- | --- | --- | --- |
| INA-PLC-RCP-001 | Rodding Process Control System | Simatic S7-300 | INA-PL-RCP | To validate | Add redundancy, rationalize alarms. |
| INA-PLC-RCP-002 | PLC Auxillary Butt & Crust | Siemens S7-300 | INA-PL-RCP | Obsolete | To validate |
| INA-PLC-RCP-003 | PLC P1-F1 P1-R1 | Siemens S7-300 | INA-PL-RCP | To validate | To validate |
| INA-PLC-RCP-004 | PLC P2-F1 P2-F2 P2-R1 P2-R2 | Simatic S7-300 | INA-PL-RCP | To validate | To validate |
| INA-PLC-RCP-005 | P3 Relay/ PLC tidak difungsikan | Simatic S7-300 | INA-PL-RCP | To validate | To validate |
| INA-PLC-RCP-006 | PLC P4-F2 P4-R1 | Simatic S7-300 | INA-PL-RCP | To validate | To validate |
| INA-PLC-RCP-007 | PLC AC-401 | Simatic S7-300 | INA-PL-RCP | To validate | To validate |
| INA-PLC-RCP-008 | PLC HF Rodding | Simatic S7-1200 | INA-PL-RCP | To validate | To validate |
| INA-PLC-RCP-009 | PLC RSM | Simatic S7-1200 | INA-PL-RCP | To validate | To validate |
| INA-PLC-RCP-010 | PLC ASCM (Anode Shot Cutting Machine) | Simatic S7-300 | INA-PL-RCP | To validate | To validate |

## 3. PLC Coverage by Process Group

- RCP Used Anode Receiving & Power-Free Conveyor (LO-401 / CR-401) [INA-PG-RCP-001] is associated with 10 PLC record or inherited plant-level controller context.
- RCP Butt & Timbel Crushing / Pressing (PR-401/402, CR-401/402) [INA-PG-RCP-002] is associated with 10 PLC record or inherited plant-level controller context.
- RCP Crushed Butt & Return Crust Conveying to Bins [INA-PG-RCP-003] is associated with 10 PLC record or inherited plant-level controller context.
- RCP Crust Removal & Shot Blasting / Cleaning (SH-401, SH-405 + Return Crust Removal Station) [INA-PG-RCP-004] is associated with 10 PLC record or inherited plant-level controller context.
- RCP Nipple Cleaning + Graphite Coating + Nipple Drying (SH-402, GC-401, DR-401) [INA-PG-RCP-005] is associated with 10 PLC record or inherited plant-level controller context.
- RCP Stub Heating & Drying [INA-PG-RCP-006] is associated with 10 PLC record or inherited plant-level controller context.
- RCP Aluminium Holding Furnace Control (HF-401) [INA-PG-RCP-007] is associated with 10 PLC record or inherited plant-level controller context.
- RCP Aluminium Spraying System & Compressed Air Interface (SP line + air permissives/alarms) [INA-PG-RCP-008] is associated with 10 PLC record or inherited plant-level controller context.
- RCP Induction Furnaces – Pig Iron Melting (IF-401 A/B/C) [INA-PG-RCP-009] is associated with 10 PLC record or inherited plant-level controller context.
- RCP Casting Preparation, Charging & Pouring (CS-401 / HS-401/402 / AC-401 / CHP-401 + Crucible Hoist Interface) [INA-PG-RCP-010] is associated with 10 PLC record or inherited plant-level controller context.

## 4. SCADA / DCS Coverage

| Code | Name | Brand | Model | Year |
| --- | --- | --- | --- | --- |
| INA-SC-RCP-001 | Rodding Process SCADA | Siemens | SIMATIC IPC547E | 2.009 |
| INA-SC-RCP-002 | Rodding No SCADA | To validate | To validate | To validate — Year of Built |

## 5. Control Hierarchy Analysis

The control hierarchy is not fully harmonized. Local PLCs and HMIs remain central to plant execution, while enterprise-grade supervisory and historian continuity appear partial. This weakens alarm governance, structured event capture, and cross-area transparency even where machine control is locally present.

## 6. Integration Gaps

- RSM is not integrated to the main PLC and has only limit-switch feedback.
- Several sensors provide local alarm only, with no SCADA logging or automatic interlock action.
- Holding furnace, induction furnace, and coating measurements are not fully connected to supervisory systems.

## 7. Summary

The control layer is sufficient for day-to-day operation but not yet structured for high-confidence diagnostics, governed alarms, or integration-heavy digital use cases.
