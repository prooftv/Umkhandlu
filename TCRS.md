# Truth Conflict Resolution System (TCRS)

Governance Audit & Evidence Preservation protocol for infrastructure reporting.

---

## 1. Core Principle

Infrastructure delivery produces multiple reports from multiple sources. These reports do not always agree.

Umkhandlu does not decide which source is correct. It:

> Records all source reports → preserves evidence → organises by authority classification → presents a verified reporting value for governance use.

The final reporting value is determined by the applicable governance authority in accordance with municipal verification processes.

---

## 2. Variance Types

| Type | Code | Example |
|---|---|---|
| Numerical | `numerical` | Contractor reports 70% / Engineer certifies 55% |
| Status | `status` | Contractor: "Phase complete" / PMU: "Still construction" |
| Timeline | `time` | Contractor: "Installed last week" / Engineer: "Not yet certified" |
| Workforce | `workforce` | Contractor: 80 workers / Site observation: 45 workers |
| Contextual | `political` | Councillor: "Project stalled" / PMU: "On schedule" |

---

## 3. Source Authority Classification

Sources are classified by governance authority level for reporting purposes:

| Rank | Source | Classification |
|---|---|---|
| 1 | Engineer certification | Highest technical authority |
| 2 | Municipality (official record) | Institutional authority |
| 3 | PMU verification | Programme management authority |
| 4 | Contractor report | Implementation report |
| 5 | CLO / Ward Councillor | Community governance input |
| 6 | Field observation | Operational observation |

---

## 4. Evidence Preservation Workflow

### Step 1 — Identify Variance

Operator identifies that two or more sources report different values for the same field on the same project.

### Step 2 — Record All Source Reports

Create a verification record (`conflictLog`) in Sanity. Add each source's reported value with date and evidence reference. **Never delete a source record.**

### Step 3 — Classify by Authority

Note the authority classification of each source. The highest-authority source with validated evidence informs the reporting value.

### Step 4 — Set Verified Reporting Value

Record the value to be used for public reporting in the `displayTruth` field.

### Step 5 — Set Verification Status

- 🟡 **Pending Review** — variance identified, not yet reviewed
- 🟠 **Under Review** — reporting value assigned, review ongoing
- 🟢 **Verified** — authoritative source confirmed final value
- 🔴 **Escalated** — requires management review or municipal decision

---

## 5. Escalation Flow

```
Operator identifies variance
  ↓
Engineer review (request IPC / clarification)
  ↓
PMU validation (cross-reference with monthly report)
  ↓
Site meeting (if technical disagreement persists)
  ↓
Municipal decision (final governance authority)
```

The system supports escalation tracking. It does not make escalation decisions.

---

## 6. Special Case Rules

### IF engineer data is unavailable

- Use PMU report as primary source
- Mark as "Unverified — engineer certification pending" in verification note
- Set status to `Under Review`

### IF contextual/political report conflicts with technical data

- Technical certification takes precedence for reporting purposes
- Contextual report is preserved in full with source attribution
- Both remain visible in the verification record

### IF no verifiable data exists for a reporting period

- Do NOT publish estimates or assumptions
- Record: "No verified data available for this reporting period"
- Set status to `Pending Review`

### IF a party disputes published data

- Party submits counter-report with evidence
- Operator adds as new source record entry
- If counter-report includes higher-authority evidence (e.g. engineer-signed document), reporting value is updated
- Full dispute history preserved in verification note

---

## 7. Information Layers

| Layer | Audience | Purpose |
|---|---|---|
| Public | Community | Single verified reporting value, phase, status |
| PMU | Project managers | Source comparison, variance tracking, evidence trail |
| Admin | Operators | Full source records, escalation status, verification history |

Currently implemented: Public layer (campaign detail page) + Admin layer (Sanity Studio verification records).

---

## 8. Monitoring Cadence

| Project Phase | Review Frequency |
|---|---|
| Construction | Weekly |
| Planning / Procurement | Monthly |
| Commissioning | Bi-weekly |
| Operational | Quarterly |

---

## 9. Unreachable Data Protocol

When data cannot be obtained from the primary source:

1. Document the attempt (date, method, who was contacted)
2. Fall back to next source in authority classification
3. Mark field as "unverified" in verification note
4. Set review reminder for next cadence cycle
5. If 2 consecutive cycles produce no data: escalate to PMU

---

## 10. Dispute / Takedown Protocol

If any party formally requests removal of published project data:

1. Do NOT delete content — set campaign status to `draft` (unpublishes immediately)
2. Create verification record documenting the dispute
3. Escalate to PMU within 24 hours
4. Only republish after written confirmation from applicable authority
5. Full dispute timeline preserved in verification note

---

## 11. Schema Reference

The `conflictLog` document type stores:

| Field | Purpose |
|---|---|
| `campaign` | Reference to the project |
| `field` | Which data point has variance |
| `conflictType` | Variance classification (numerical, status, time, workforce, contextual) |
| `claims[]` | Array of source records — each with source, reported value, date, evidence |
| `displayTruth` | Verified reporting value |
| `resolutionState` | Verification status (pending → under review → verified / escalated) |
| `escalationLevel` | Current escalation tier |
| `resolutionNote` | Verification note — how variance was resolved, by whom |
| `detectedAt` | Date variance identified |
| `resolvedAt` | Date verification confirmed |

---

## 12. Positioning

### Internal (operators, developers)

> TCRS — Truth Conflict Resolution System. Records competing claims, assigns authority weights, resolves display truth.

### External (municipalities, PMUs, audit)

> Governance Audit & Evidence Preservation Layer. Records, preserves, organises, and presents infrastructure reporting evidence from multiple sources in accordance with municipal verification processes.

### One-Line Definition

> Umkhandlu preserves all source reports on infrastructure performance, organises them by authority classification, and maintains a transparent, auditable evidence trail supporting governance accountability and PMS reporting requirements.

---

## 13. System Architecture Position

```
UMKHANDLU — The Missing Operating System
│
├── Community Participation Layer
├── Infrastructure Visibility Layer
├── Development Coordination Layer
├── Opportunity & Programme Layer
├── Council Oversight Layer
│
└── Governance Audit & Evidence Preservation Layer
        └── TCRS
              ├── Evidence Capture
              ├── Source Traceability
              ├── Verification Tracking
              ├── Audit History
              └── Reporting Support
```

TCRS is one module inside the operating system. It does not define the operating system.
