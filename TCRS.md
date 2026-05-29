# Truth Conflict Resolution System (TCRS)

Protocol for governing competing claims about infrastructure project data.

---

## 1. Core Principle

There is no single truth source in infrastructure delivery. Truth is **layered, weighted, and time-bound**.

Umkhandlu does NOT "correct" conflicting data. It:

> Records conflict → assigns authority weight → resolves display truth

---

## 2. Conflict Types

| Type | Code | Example |
|---|---|---|
| 🟥 Numerical | `numerical` | Contractor: 70% complete / Engineer: 55% complete |
| 🟧 Status | `status` | Contractor: "Phase complete" / PMU: "Still construction" |
| 🟨 Time | `time` | Contractor: "Installed last week" / Engineer: "Not yet certified" |
| 🟦 Workforce / EPWP | `workforce` | Contractor: 80 workers / Site observation: 45 workers |
| 🟪 Political / Context | `political` | Councillor: "Project stalled" / PMU: "On schedule" |

---

## 3. Source of Truth Hierarchy

| Rank | Source | Weight |
|---|---|---|
| 1 | Engineer certification | 100 |
| 2 | Municipality (official record) | 90 |
| 3 | PMU verification | 85 |
| 4 | Contractor report | 60 |
| 5 | CLO / Ward Councillor | 40 |
| 6 | Operator observation | 30 |

---

## 4. Conflict Resolution Rule Engine

### Step 1 — Detect

Operator identifies conflicting data from two or more sources on the same field.

### Step 2 — Store All Versions

Create a `conflictLog` document in Sanity. Add each claim with source, value, date, and evidence reference. **Never delete a claim.**

### Step 3 — Apply Authority Weight

The source with the highest weight AND validated evidence determines display truth.

### Step 4 — Set Display Truth

Record the resolved value in `displayTruth` field. This is what the public page shows.

### Step 5 — Flag Dispute State

Set `resolutionState`:
- 🟡 **Pending** — conflict detected, unresolved
- 🟠 **Partially Resolved** — display truth assigned, disagreement persists
- 🟢 **Resolved** — authoritative source confirmed final value
- 🔴 **Escalated** — requires site meeting or municipal decision

---

## 5. Escalation Flow

```
Operator detects conflict
  ↓
Engineer review (request clarification / IPC)
  ↓
PMU validation (cross-reference with monthly report)
  ↓
Site meeting (if technical disagreement persists)
  ↓
Municipal decision (final authority — binding)
```

---

## 6. Special Case Rules

### IF engineer data is missing

- Use PMU + contractor average
- Mark as `UNVERIFIED ESTIMATE` in resolution note
- Set state to `partial`

### IF political actor conflicts with technical data

- Technical data overrides public narrative
- BUT conflict is recorded and visible in PMU view
- Political claim stored with full context

### IF site has no verifiable data

- Do NOT publish assumptions
- Record: "No verified data available for this reporting period"
- Set state to `pending`

### IF contractor disputes published data

- Contractor submits counter-claim with evidence
- Operator adds as new claim entry
- Re-evaluate weight: if contractor provides engineer-signed document, weight elevates
- Resolution note documents the dispute and outcome

---

## 7. Display Layers

| Layer | Audience | Shows |
|---|---|---|
| 🔵 Public | Community | Single resolved value, phase, status |
| 🟡 PMU | Project managers | Conflicts, source comparison, variance |
| 🔴 Admin | Operators | Full raw logs, escalation status, all claims |

Currently implemented: Public layer (campaign detail page) + Admin layer (Sanity Studio conflictLog documents).

---

## 8. Cadence

| Project Phase | Check-in Frequency |
|---|---|
| Construction | Weekly |
| Planning / Procurement | Monthly |
| Commissioning | Bi-weekly |
| Operational | Quarterly |

---

## 9. Unreachable Data Protocol

When data cannot be obtained from the primary source:

1. Document the attempt (date, method, who was contacted)
2. Fall back to next source in hierarchy
3. Mark field as `unverified` in resolution note
4. Set review reminder for next cadence cycle
5. If 2 consecutive cycles produce no data: escalate to PMU

---

## 10. Dispute / Takedown Protocol

If any party formally requests removal of published data:

1. Do NOT delete — set campaign status to `draft` (unpublishes)
2. Create conflictLog entry documenting the dispute
3. Escalate immediately to PMU
4. Only republish after resolution is confirmed
5. Document full dispute timeline in resolution note

---

## 11. Schema Reference

The `conflictLog` document type stores:

| Field | Purpose |
|---|---|
| `campaign` | Reference to the project |
| `field` | Which data point is contested |
| `conflictType` | Classification (numerical, status, time, workforce, political) |
| `claims[]` | Array of competing values with source, weight, date, evidence |
| `displayTruth` | Resolved public-facing value |
| `resolutionState` | Lifecycle state (pending → partial → resolved / escalated) |
| `escalationLevel` | Current escalation tier |
| `resolutionNote` | How it was resolved |
| `detectedAt` | When conflict was identified |
| `resolvedAt` | When final resolution confirmed |

---

## 12. One-Line Definition

> Umkhandlu's TCRS preserves all conflicting infrastructure reports, assigns authority-based weights to each source, and generates a transparent, auditable "display truth" while maintaining full disagreement history for governance accountability.
