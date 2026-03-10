# Step 18 — Assembly Index (and Optional Combined Master Index)

**Global Reference:** See `00-global-instruction.md` for formatting rules and code patterns.
**Prerequisite:** ALL prior steps (1-17) and all outputs (1C, 2B–17B, 2A–17A) must exist.

---

## Objective

Produce an assembly index that enumerates all deliverables produced in this run and provides cross-reference traceability. This is the final step and seals the audit package.

---

## Required Sections (Exact Order)

### 1. Deliverables Index

| Deliverable | Document ID | Step | Source Inputs | Output Artifact |

Mandatory rows (one per deliverable):

| Step 1 — Normalized Data Pack | N/A | 1 | All Input 2 sections | Output 1A |
| Step 1 — Validation Log | N/A | 1 | All Input 2 sections | Output 1B |
| Step 1 — Reference Map | N/A | 1 | Data Pack | Output 1C |
| Step 2 — Appendix A | {PlantCode}-APP-A | 2 | Step 1 | Output 2A |
| Step 3 — Appendix B | {PlantCode}-APP-B | 3 | Step 1 | Output 3A |
| Step 4 — Appendix C | {PlantCode}-APP-C | 4 | Steps 1–3 | Output 4A |
| Step 5 — Appendix D | {PlantCode}-APP-D | 5 | Steps 1–3 | Output 5A |
| Step 6 — Appendix E | {PlantCode}-APP-E | 6 | Steps 1–5 | Output 6A |
| Step 7 — Appendix F | {PlantCode}-APP-F | 7 | Steps 1–6 | Output 7A |
| Step 8 — Appendix G | {PlantCode}-APP-G | 8 | Steps 1–7 | Output 8A |
| Step 9 — Appendix H | {PlantCode}-APP-H | 9 | Steps 1–8 | Output 9A |
| Step 10 — Appendix I | {PlantCode}-APP-I | 10 | Steps 1–9 | Output 10A |
| Step 11 — Appendix J | {PlantCode}-APP-J | 11 | Steps 1–10 | Output 11A |
| Step 12 — Appendix K | {PlantCode}-APP-K | 12 | Steps 1–11 | Output 12A |
| Step 13 — Appendix L | {PlantCode}-APP-L | 13 | Steps 1–12 | Output 13A |
| Step 14 — Appendix M | {PlantCode}-APP-M | 14 | Steps 1–13, 15 | Output 14A |
| Step 15 — Appendix N | {PlantCode}-APP-N | 15 | Steps 1–13 | Output 15A |
| Step 16 — Appendix O | {PlantCode}-APP-O | 16 | Steps 1–15 | Output 16A |
| Step 17 — Main Report | N/A | 17 | Steps 1–16 | Output 17A |

Also include all Reference Map outputs (1C, 2B–17B) as separate rows.

### 2. Cross-Reference Integrity Summary

Summarize:
- Validation status from Output 1B (error counts by severity)
- **Update Mode:** Confirm no STOP conditions were triggered in any step.
- **Draft Mode:** List steps with "To validate" markers (if any).

Format: short paragraph + summary table.

| Step | Document ID | Status | STOP Conditions Triggered | To Validate Markers |

### 3. Optional Combined Master Index (A–O Pointers)

Simple list of appendix titles and document IDs. Do NOT merge appendix bodies.

| Appendix | Title | Document ID |

Fixed rows: A through O.

---

## Outputs

- **Output 18A** — Assembly Index (markdown)
- **Output 18B** — Final Reference Map (master)

### Final Reference Map (Master) Format
| Deliverable | Document ID | Step | Produced From | Feeds Into |

---

## Quality Gate — Update Mode STOP If:
- Any appendix A–O is missing
- Any referenced Document ID is inconsistent with code pattern `{PlantCode}-APP-{Letter}`
- Cross-reference integrity summary indicates any unresolved STOP condition
