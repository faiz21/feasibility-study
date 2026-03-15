# Appendix K - Risk Register

RODDING PLANT (INA-PL-RCP)

Document Date: 14 March 2026

## 1. Purpose of Appendix K

This appendix consolidates findings, notes, and issues into a structured risk register for Rodding Plant [INA-PL-RCP].

## 2. Risk Register Table

| ID | Category | Finding | Operational Effect | Business Risk | Digital Implication | Severity |
| --- | --- | --- | --- | --- | --- | --- |
| RK-01 | Data integration | Manual data input of event of time when a process starts and stop | Manual work increases error risk and slows reporting/analysis | To validate — frequency | Manual execution/recording | Medium |
| RK-02 | Quality sampling | in process QC pencatatan manual | Manual work increases error risk and slows reporting/analysis | To validate — frequency | Manual execution/recording | Medium |
| RK-03 | MTC weigher | Frequent Minor Repair on MTC Weigher | Unplanned stops/downtime reducing throughput | Frequent | To validate | Medium |
| RK-04 | Overhaul scheduling | Overhaul dihari selasa dan jumat setiap minggu, selasa 2 shinf jumat 1 shift | Unplanned stops/downtime reducing throughput | Weekly | To validate | Medium |
| RK-05 | Execution logging | Manual recording of times/downtime reasons reduces data reliability. | Inaccurate analysis and late problem identification (often end-of-shift). | Daily | Manual entry in HMI/Excel; end-shift review. | Medium |
| RK-06 | GB/BB labeling & traceability | Manual numbering/labeling causes duplicate/missing anode IDs. | Reduced traceability, impacting abnormality analysis and corrective actions. | To validate — frequency | Re-write with chalk/paint; manual reconciliation. | Medium |
| RK-07 | Lab reporting & approval | SQA reporting is slow due to manual transcription and staged approvals. | Longer lead time to deliver results; delays feedback to production teams. | Routine | PDF via email; prioritize urgent cases via direct message. | Medium |
| RK-08 | Data management | Lack of integrated database makes audit and root cause analysis time-consuming. | Searching historical evidence can take hours/half-day and slows CAPA. | Routine | Offline file storage and manual trend checks in Excel. | Medium |
| RK-09 | QA capacity | Instrument and manpower limits create QA bottlenecks (e.g., anode QA can slip beyond normal 3-day target). | Late delivery to internal users and potential production delays when QA blocks decisions. | To validate — frequency | Reprioritize workloads; send partial updates via WA/email. | Medium |
| RK-10 | PR401/PR402 | Alarm suhu crusher hanya buzzer (tanpa interlock) dan pernah terjadi kebakaran | Risiko kejadian kebakaran berulang dan kerusakan equipment; alarm tidak cukup untuk mitigasi otomatis. | To validate — frequency | Buzzer/alarm; rencana upgrade sensor seperti PR401. | High |
| RK-11 | Rod Straight Machine | RSM tidak terintegrasi PLC dan hanya limit switch | Kontrol/feedback digital minim; potensi kesulitan troubleshooting dan kualitas operasi. | To validate — frequency | Operasi berbasis limit switch. | Medium |
| RK-12 | Maintenance & procurement | Spare part lead time sangat lama | Risiko downtime berkepanjangan karena part datang >4 tahun. | To validate — frequency | Gunakan stok terbatas / improvisasi (To validate). | Medium |

## 3. Risk Theme Summary

- Data integrity risk: manual logging, Excel dependence, and unreliable timestamps undermine analysis quality.
- Control enforcement risk: alarm-only safety functions and missing interlocks leave abnormal conditions dependent on operator response.
- Maintenance continuity risk: spare-part delays, incomplete condition monitoring, and weak signal logging extend time-to-recover.
- Traceability risk: manual numbering, manual QC forms, and mis-shipment events weaken genealogy confidence.

## 4. High-Priority Risk Highlights

- Manual data input of event of time when a process starts and stop Observation: Manual data input of event of time when a process starts and stop. Operational effect: Manual work increases error risk and slows reporting/analysis. Business risk: Medium. Digital implication: Manual execution/recording | Owner: To validate — owner.
- in process QC pencatatan manual Observation: in process QC pencatatan manual. Operational effect: Manual work increases error risk and slows reporting/analysis. Business risk: Medium. Digital implication: Manual execution/recording | Owner: To validate — owner.
- Frequent Minor Repair on MTC Weigher Observation: Frequent Minor Repair on MTC Weigher. Operational effect: Unplanned stops/downtime reducing throughput. Business risk: Medium. Digital implication: To validate | Owner: To validate — owner.
- Overhaul dihari selasa dan jumat setiap minggu, selasa 2 shinf jumat 1 shift Observation: Overhaul dihari selasa dan jumat setiap minggu, selasa 2 shinf jumat 1 shift. Operational effect: Unplanned stops/downtime reducing throughput. Business risk: Medium. Digital implication: To validate | Owner: To validate — owner.
- Manual recording of times/downtime reasons reduces data reliability. Observation: Manual recording of times/downtime reasons reduces data reliability.. Operational effect: Inaccurate analysis and late problem identification (often end-of-shift).. Business risk: Medium. Digital implication: Manual entry in HMI/Excel; end-shift review. | Owner: Operations.

## 5. Gap and Validation Flags

- [To validate - customer names - not supplied in source dataset]
- [To validate - certifications in scope - source narrative leaves certifications unconfirmed]
- [To validate - complete utility instrumentation coverage - field evidence is partial]
