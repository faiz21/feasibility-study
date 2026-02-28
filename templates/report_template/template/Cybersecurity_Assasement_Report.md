
# CYBERSECURITY ASSESSMENT REPORT

**PT Indonesia Asahan Aluminium (INALUM)**
Scope: Operational Technology (OT) Environment
Assessment Basis: OT Cybersecurity Control Topics
Final Score: **34.29 / 100**

---

# 1. Executive Summary

The OT Cybersecurity maturity of INALUM is assessed at **34.29%**, indicating a **Low-to-Moderate maturity level**.

The environment shows:

* Operational control systems functioning with basic protections
* Partial access controls and physical security
* Informal governance practices
* Significant structural gaps in OT cybersecurity architecture
* Very limited vulnerability management and secure configuration practices

The primary risk exposure lies in:

* Lack of formal OT governance structure
* Absence of OT-DMZ and strong network segmentation
* No structured OT vulnerability management
* No secure configuration baselines
* Limited monitoring and incident response capability
* Weak SIS governance controls

This maturity level places INALUM at **elevated risk of production disruption, quality impact, and potential safety exposure** in the event of a cyber incident.

---

# 2. Overall Score Interpretation

| Category | Final %       | Risk Level                       |
| -------- | ------------- | -------------------------------- |
| 0–25%    | Critical Risk | High likelihood of severe impact |
| 26–40%   | High Risk     | Structural gaps present          |
| 41–60%   | Moderate Risk | Foundational controls exist      |
| 61–80%   | Managed       | Formal governance in place       |
| 81–100%  | Mature        | Optimized & monitored            |

**INALUM Score: 34.29% → High Risk Tier**

This indicates:

* Controls are mostly reactive or informal
* Architecture not aligned to IEC 62443 best practices
* Governance not yet structured at enterprise OT level

---

# 3. Domain-by-Domain Analysis

---

## 3.1 Safety Instrumented Systems (SIS) Security

Score: 30%

### Strengths

* Safety interlocks exist at equipment level
* SIS events likely stored in PLC/SCADA logs

### Gaps

* No documented SIS network segregation
* No bypass logging or structured review
* No independent safety logic review process
* No SIS-specific MOC

### Risk

* Safety bypass could occur without detection
* Undocumented safety logic changes
* Reduced auditability during incident investigations

### Severity

High (especially for smelter and furnace environments)

---

## 3.2 OT Governance & Risk Management

Score: 28%

### Strengths

* IT and OT functions exist
* Corporate IT policies likely in place

### Gaps

* No OT-specific cybersecurity governance charter
* No OT risk register covering safety/production impacts
* No OT KPIs or dashboard
* No role-based OT cybersecurity training

### Risk

* No accountability framework
* No visibility of OT cyber exposure at executive level
* Risk decisions not formally documented

---

## 3.3 OT Asset Inventory & Visibility

Score: 45%

### Strengths

* PLC and SCADA inventories exist
* Lifecycle estimates recorded
* Model/type information available

### Gaps

* No centralized firmware tracking
* No IT/OT data flow documentation
* No formal asset criticality model

### Risk

* Obsolete assets unmanaged
* Hidden integration pathways
* Increased attack surface unknown to management

---

## 3.4 Architecture & Network Segmentation

Score: 17.78% (Critical Weakness)

### Strengths

* Partial segregation via dual-SCADA architecture
* No known direct PLC internet exposure

### Gaps

* No OT-DMZ
* No jump server architecture
* No firewall rule governance
* No zone/conduit model documentation
* No wireless/IIoT segmentation evidence

### Risk

This is one of the **highest structural risk areas**:

* Malware spread from IT to OT possible
* No formal barrier between enterprise and control layers
* Remote attack propagation risk

---

## 3.5 Identity & Access Management (OT)

Score: 40%

### Strengths

* Engineering access present
* SCADA logs capture user activity
* Default credentials likely removed

### Gaps

* No Privileged Access Management (PAM)
* No break-glass governance
* No periodic access review
* No service account lifecycle management

### Risk

* Shared or unmanaged accounts
* Inability to attribute changes to individuals
* Privilege creep over time

---

## 3.6 Remote Access & Third-Party Connectivity

Score: 28.8%

### Strengths

* VPN likely used
* No rogue remote modems observed
* Antivirus scanning likely present

### Gaps

* No MFA enforcement
* No session recording
* No zone-based restriction
* No vendor account expiration
* No remote log correlation with MOC

### Risk

* Vendor compromise path
* Remote access abuse undetected
* Change traceability weak

---

## 3.7 Secure Configuration & Hardening

Score: 10.91% (Critical Weakness)

### Gaps

* No defined OT secure baseline
* No application allowlisting
* No configuration drift detection
* No structured hardening review

### Risk

* Workstations may contain unnecessary services
* Increased ransomware exposure
* Uncontrolled system drift

This is a **Priority 1 remediation area**.

---

## 3.8 Vulnerability & Patch Management

Score: 9.23% (Critical Weakness)

### Gaps

* No OT-safe vulnerability scanning
* No compensating control framework
* No risk-based remediation tracking
* No EOL mitigation strategy

### Risk

* Legacy PLC/DCS unmonitored
* Unpatched vulnerabilities accumulate
* No prioritization of remediation

This is the **lowest maturity domain**.

---

## 3.9 Monitoring, Logging & Detection

Score: 27%

### Strengths

* SCADA logs exist
* Equipment alarms present

### Gaps

* No centralized SOC integration
* No ICS anomaly detection
* No protocol-level monitoring
* No time synchronization governance
* No OT-DMZ monitoring

### Risk

* Attacks may remain undetected
* No behavioral anomaly detection
* Poor forensic capability

---

## 3.10 Incident Response (OT-Specific)

Score: 31.58%

### Strengths

* Corporate IR likely exists
* Operational hierarchy defined

### Gaps

* No OT-specific playbook
* No tabletop exercises
* No safe containment runbook
* No OT forensic procedures

### Risk

* Incorrect containment could disrupt production
* No coordinated cross-plant response
* Lessons learned not formally tracked

---

## 3.11 Backup & Recovery

Score: 21.43%

### Strengths

* PLC backups exist

### Gaps

* No immutable backups
* No tested OT DR exercises
* No defined RTO/RPO
* No tamper protection

### Risk

* Ransomware could encrypt backups
* Recovery timeline unknown
* Extended downtime risk

---

## 3.12 Physical Security

Score: 60% (Relative Strength)

### Strengths

* Industrial site access control
* Cabinets physically enclosed
* Visitor control present

### Gap

* No formal OT log review process

This is one of the stronger domains.

---

## 3.13 Supplier & OEM Management

Score: 32.73%

### Strengths

* Contracts likely include clauses
* Vendor tools exist

### Gaps

* No periodic third-party review
* No update integrity verification

---

## 3.14 Quality / GxP-Impact System Security

Score: 60%

### Strengths

* Audit trails exist
* Data retained

### Gaps

* No regulatory-grade validation control
* Manual data entry reduces integrity assurance

---

# 4. Risk Prioritization (Top 5 Critical Weaknesses)

1. Vulnerability & Patch Management (9.23%)
2. Secure Configuration & Hardening (10.91%)
3. Architecture & Network Segmentation (17.78%)
4. Backup & Recovery (21.43%)
5. OT Governance & Risk Management (28%)

These domains represent structural risk exposure.

---

# 5. Maturity Classification

| Layer              | Status                         |
| ------------------ | ------------------------------ |
| Governance         | Informal                       |
| Architecture       | Partially segregated           |
| Identity           | Partially controlled           |
| Monitoring         | Reactive                       |
| Vulnerability Mgmt | Absent                         |
| Hardening          | Absent                         |
| Incident Response  | IT-centric, not OT-specialized |

Overall classification:
**Level 2 – Basic Operational Security (Below IEC 62443 SL2 readiness)**

---

# 6. Business Risk Implications for INALUM

Given INALUM’s industrial profile (Smelting, Power, Casting):

Potential impact areas:

* Potline instability
* Furnace trip / metal solidification risk
* Quality deviation (Fe, chemistry, temperature control)
* Environmental compliance exposure
* Production downtime > 24–72 hours in worst-case ransomware scenario
* Supply chain delay

---

# 7. Recommended Remediation Roadmap (High-Level)

## Phase 1 – Structural Foundation (0–6 Months)

* Establish OT Cybersecurity Governance Charter
* Define OT risk register
* Design OT-DMZ architecture
* Implement network segmentation plan
* Define secure baseline configuration
* Implement controlled remote access with MFA

## Phase 2 – Control Stabilization (6–12 Months)

* Deploy OT-safe vulnerability scanning
* Implement patch governance framework
* Deploy centralized log collection
* Implement time synchronization (NTP/PTP)
* Introduce backup immutability
* Define RTO/RPO and conduct recovery drill

## Phase 3 – Advanced Monitoring (12–24 Months)

* Deploy ICS IDS / anomaly detection
* Integrate OT logs to SOC
* Implement privileged access management (PAM)
* Formalize OT IR playbooks and exercises
* Establish vendor governance framework

---

# 8. Conclusion

INALUM’s OT cybersecurity posture is currently **operational but structurally fragile**.

While basic protections and physical controls exist, the organization lacks:

* Formal OT governance
* Structured segmentation architecture
* Vulnerability management
* Secure configuration discipline
* Advanced monitoring capability

The current 34.29% maturity score places INALUM in a **High Risk category**, particularly given the criticality of smelting and power generation operations.

Immediate architectural and governance improvements are required to:

* Reduce ransomware exposure
* Protect production continuity
* Safeguard safety systems
* Enable digital transformation initiatives safely

---