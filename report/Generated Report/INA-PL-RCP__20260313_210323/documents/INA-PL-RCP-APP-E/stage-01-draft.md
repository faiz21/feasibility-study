# Appendix E - SCADA / DCS Inventory

RODDING PLANT (INA-PL-RCP)

Document Date: 14 March 2026

## 1. Purpose of Appendix E

This appendix records the supervisory system footprint for Rodding Plant [INA-PL-RCP].

## 2. Supervisory System Inventory

| Code | Name | Brand | Model/Type | License | Protocol |
| --- | --- | --- | --- | --- | --- |
| INA-SC-RCP-001 | Rodding Process SCADA | Siemens | SIMATIC IPC547E | Perpetual License | To validate |
| INA-SC-RCP-002 | Rodding No SCADA | To validate | To validate | To validate | To validate |

## 3. Platform and Lifecycle Profile

The primary confirmed supervisory node is an aging Siemens SIMATIC IPC547E workstation running Windows 7 Ultimate. The presence of a second placeholder SCADA row indicates incomplete system-of-record quality for the supervisory layer. The operational effect is that visibility may exist in practice but is not fully governed in the current inventory.

## 4. SCADA Visibility Gaps

- One SCADA row is effectively unpopulated and remains to validate.
- Operators report missing indicators and display separation requests on HMI/switchroom screens.
- Some temperature, level, and counter signals remain local-only or manual despite high operational relevance.

## 5. Summary

Supervisory coverage is present but incomplete. The gap is not only technology age, but also evidence completeness and signal governance.

