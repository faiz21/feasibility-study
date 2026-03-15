# Appendix B - Process Architecture / Process Groups Inventory

RODDING PLANT (INA-PL-RCP)

Document Date: 14 March 2026

## 1. Purpose of Appendix B

This appendix profiles the process architecture for Rodding Plant [INA-PL-RCP]. It links process group design, PLC presence, and supervisory posture to show where automation control is established, where relay or local operation remains material, and where renewal dependency is already visible in the source register.

## 2. PLC Environment Summary

The PLC environment is Siemens-centric and heavily exposed to lifecycle risk. Multiple core process groups are explicitly marked for retrofit or renewal because their control foundation remains S7-300 based or otherwise unconfirmed. This creates a hybrid architecture in which control exists, but resilience and maintainability are uneven across the process chain.

## 3. Process Group Profiles

### 3.1 RCP Used Anode Receiving & Power-Free Conveyor (LO-401 / CR-401) [INA-PG-RCP-001]

Controls the unloading/loading sequence from the anode transport car onto the power-free conveyor, including conveyor permissives, indexing/accumulation logic, jam handling, and safety interlocks.

### 3.2 RCP Butt & Timbel Crushing / Pressing (PR-401/402, CR-401/402) [INA-PG-RCP-002]

Automates crushing cycles for used anode butts and pig-iron connection handling with hydraulic sequencing, guarding interlocks, overload and jam logic.

### 3.3 RCP Crushed Butt & Return Crust Conveying to Bins [INA-PG-RCP-003]

Controls conveyors, diverters, and interlocks that route crushed butt and return crust to designated bins.

### 3.4 RCP Crust Removal & Shot Blasting / Cleaning (SH-401, SH-405 + Return Crust Removal Station) [INA-PG-RCP-004]

Controls cleaning stations, guard interlocks, blast permissives, extraction permissives, and fault handling.

### 3.5 RCP Nipple Cleaning + Graphite Coating + Nipple Drying (SH-402, GC-401, DR-401) [INA-PG-RCP-005]

Automates cleaning, coating, drying sequences and utility permissives.

## 4. Architectural Posture Classification

- RCP Used Anode Receiving & Power-Free Conveyor (LO-401 / CR-401) [INA-PG-RCP-001] is classified as PLC-Controlled because the register references Simatic S7-300,Siemens S7-300.
- RCP Butt & Timbel Crushing / Pressing (PR-401/402, CR-401/402) [INA-PG-RCP-002] is classified as PLC-Controlled because the register references Simatic S7-300.
- RCP Crushed Butt & Return Crust Conveying to Bins [INA-PG-RCP-003] is classified as PLC-Controlled because the register references Siemens S7-300.
- RCP Crust Removal & Shot Blasting / Cleaning (SH-401, SH-405 + Return Crust Removal Station) [INA-PG-RCP-004] is classified as PLC-Controlled because the register references Simatic S7-300.
- RCP Nipple Cleaning + Graphite Coating + Nipple Drying (SH-402, GC-401, DR-401) [INA-PG-RCP-005] is classified as PLC-Controlled because the register references Simatic S7-300.

## 5. SCADA Exposure Summary

| Code | Plant Name | Model | Level | Protocol |
| --- | --- | --- | --- | --- |
| INA-SC-RCP-001 | Rodding Process SCADA | SIMATIC IPC547E | Process SCADA | To validate |
| INA-SC-RCP-002 | Rodding No SCADA | To validate | To validate | To validate |

## 6. Target State Directions

- Retrofit-priority process groups should be treated as continuity risks before they are treated as analytics candidates.
- SCADA exposure should be normalized across process groups so operational events are visible in one governed layer rather than fragmented across local HMIs and manual logs.
- Naming standards and control ownership should align with the proposed Dual SCADA Architecture [INA-SOL-01] only where section-level prompts permit directional framing.

## 7. Executive Framing

The process architecture is operationally complete but digitally uneven. The observation is a broad installed control footprint with clear age and integration gaps. The operational effect is dependency on local knowledge and manual checks. The business risk is slower recovery and weaker plantwide coordination. The digital implication is that architecture renewal has to start with control continuity and data visibility, not with advanced optimization claims.
