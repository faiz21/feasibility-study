# Management Overview Report

RODDING PLANT (INA-PL-RCP)

Document Date: 14 March 2026

## 1. Executive Summary

Rodding Plant [INA-PL-RCP] is a critical enabling facility in PT Indonesia Asahan Aluminium's integrated aluminum chain. The assessment baseline indicates a **Basic** digital maturity profile, with meaningful installed control assets but persistent manual execution, partial supervisory visibility, and fragmented data governance (INA-PL-RCP-APP-A, INA-PL-RCP-APP-D, INA-PL-RCP-APP-M).

| Dimension | Score (1-5) | Maturity Interpretation |
| --- | --- | --- |
| Automation Coverage | 2 | Basic |
| Supervisory Integration | 2 | Basic |
| Performance Governance | 1-2 | Initial to Basic |
| Vertical Integration | 1-2 | Initial to Basic |
| Cybersecurity and Segmentation | 1 | Initial / Ad-hoc |
| Overall Digital Maturity | 1.9 | Basic |

- Installed control assets remain operational, but the estate is exposed by obsolete PLC platforms and retrofit-priority process groups (INA-PL-RCP-APP-B, INA-PL-RCP-APP-D).
- Manual event capture, quality transcription, and stock coordination limit both performance governance and traceability confidence (INA-PL-RCP-APP-J, INA-PL-RCP-APP-K).
- Safety- and availability-critical stations still depend on alarms, manual intervention, or incomplete signal logging rather than governed interlocks and trusted history (INA-PL-RCP-APP-A, INA-PL-RCP-APP-K).
- Vertical integration remains weak because planning, QA, and plant-floor evidence flow through fragmented documents instead of one governed data backbone (INA-PL-RCP-APP-N).

## 2. Production Scope and Capacity

The production scope covers receiving, crushing, cleaning, heating, coating, joining, transfer, and utility support steps needed to convert baked anodes and rod components into rodded anodes for downstream reduction consumption (INA-PL-RCP-APP-A, INA-PL-RCP-APP-B).

- Design capacity is cited as approximately 252 pcs/shift, while actual performance is closer to 180-200 pcs/shift in the findings log (INA-PL-RCP-APP-K).
- Capacity suppression is linked to weighing delays, manual QC, stock-preview dependency, overhaul cadence, and weak instrumentation trust (INA-PL-RCP-APP-K, INA-PL-RCP-APP-J).

## 3. Process Stability and Risk

Process stability is weakened by equipment bottlenecks, incomplete measurement capture, alarm-only protections, and inconsistent control integration across critical stations (INA-PL-RCP-APP-D, INA-PL-RCP-APP-K).

- Manual numbering and manual time capture reduce abnormality analysis speed and traceability confidence (INA-PL-RCP-APP-K).
- Crusher temperature alarms without automatic interlock leave fire-risk mitigation partly dependent on operator response (INA-PL-RCP-APP-K).
- Pneumatic contamination, dust leakage, and weak utility monitoring create recurring instability in support systems that directly affect core equipment uptime (INA-PL-RCP-APP-C, INA-PL-RCP-APP-K).

## 4. Performance Governance

- A broad KPI library exists, but source evidence shows KPI trust is undermined by manual capture and absent SPC deployment (INA-PL-RCP-APP-J).
- Planning and reporting still rely on draft schedules, manual previews, email, and spreadsheets rather than one governed operational record (INA-PL-RCP-APP-J, INA-PL-RCP-APP-N).
- Quality turnaround remains a gating factor because lab and approval workflows are sequential and document-centric (INA-PL-RCP-APP-I, INA-PL-RCP-APP-K).

## 5. Control Architecture

The PLC environment is broad but lifecycle-exposed, with multiple S7-300 controllers and several explicit retrofit or renewal recommendations across core process groups (INA-PL-RCP-APP-D, INA-PL-RCP-APP-M).

The supervisory layer exists but is partial. Confirmed SCADA coverage is limited, some rows remain to validate, and important field signals still stop at local alarm or manual capture instead of entering a trusted supervisory history (INA-PL-RCP-APP-E, INA-PL-RCP-APP-M).

## 6. Maintenance Posture

Maintenance governance is stronger in documented procedure scope than in field execution maturity. PM, shutdown, CBM, predictive, lubrication, and calibration procedures are listed, yet spare-part delays, reactive fixes, and incomplete sensor coverage remain material in live plant evidence (INA-PL-RCP-APP-I, INA-PL-RCP-APP-K, INA-PL-RCP-APP-M).

## 7. Vertical Integration

- Planning handoffs from reduction to rodding remain draft- and summary-based (INA-PL-RCP-APP-K, INA-PL-RCP-APP-N).
- QA approval and reporting rely on document exchange rather than direct shared records (INA-PL-RCP-APP-I, INA-PL-RCP-APP-N).
- Traceability events for anodes and rods remain too manual to support high-confidence cross-functional analytics (INA-PL-RCP-APP-K, INA-PL-RCP-APP-N).

## 8. Cybersecurity Posture

Cybersecurity posture is currently rated Initial / Ad-hoc because procedure references exist, but the dataset provides limited evidence of active segmentation, hardening, or governed OT visibility within the plant execution layer (INA-PL-RCP-APP-I, INA-PL-RCP-APP-M).

## 9. Risk Summary

- Manual data input of event of time when a process starts and stop (Data integration) (INA-PL-RCP-APP-K)
- in process QC pencatatan manual (Quality sampling) (INA-PL-RCP-APP-K)
- Frequent Minor Repair on MTC Weigher (MTC weigher) (INA-PL-RCP-APP-K)
- Overhaul dihari selasa dan jumat setiap minggu, selasa 2 shinf jumat 1 shift (Overhaul scheduling) (INA-PL-RCP-APP-K)
- Manual recording of times/downtime reasons reduces data reliability. (Execution logging) (INA-PL-RCP-APP-K)
- Manual numbering/labeling causes duplicate/missing anode IDs. (GB/BB labeling & traceability) (INA-PL-RCP-APP-K)

## 10. Digital Maturity Profile

| Dimension Code | Domain | Score | Label |
| --- | --- | --- | --- |
| L-D1 | PLC Environment | 2 | Basic |
| L-D2 | Supervisory Layer | 2 | Basic |
| L-D3 | Data / Analytics | 1-2 | Initial to Basic |
| L-D4 | Alarm Governance | 1-2 | Initial to Basic |
| L-D5 | Maintenance | 2-3 | Basic to Structured |
| L-D6 | Quality | 2 | Basic |
| L-D7 | Planning / Inventory | 2 | Basic |
| L-D8 | Cybersecurity | 1 | Initial / Ad-hoc |
| L-D9 | Vertical Integration | 1-2 | Initial to Basic |

Overall classification: Basic (INA-PL-RCP-APP-M, INA-PL-RCP-APP-L).

## 11. Strategic Implications

- Structural constraints: lifecycle-exposed controllers, partial SCADA coverage, manual traceability, and slow QA/reporting loops.
- Transformation enablers: clear process-group register, documented procedure scope, identified solution candidates, and explicit field evidence for the most important failure modes.

## 12. Transformation Roadmap

- Phase 1 - Stabilize foundation: instrumentation trust, interlocks, alarm hygiene, and critical PLC/signal renewal.
- Phase 2 - Normalize visibility: runtime capture, SCADA/historian consistency, and governed event/genealogy records.
- Phase 3 - Extend decision support: maintenance intelligence, integrated planning-quality evidence, and advisory analytics only after foundation data is trusted.

## 13. Final Management Conclusion

Rodding Plant [INA-PL-RCP] is operationally important and digitally improvable, but the current state is still constrained by manual governance, lifecycle-exposed controls, and incomplete signal trust. The plant does not lack automation assets; it lacks consistent digital integrity around those assets. Management should therefore read the current maturity baseline as a call to stabilize control, visibility, and evidence continuity before expecting advanced optimization outcomes (INA-PL-RCP-APP-A through INA-PL-RCP-APP-N).
