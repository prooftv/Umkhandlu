# Infrastructure Documentation SOP

Standard Operating Procedure for the Infrastructure Documentation & Reporting Operator role.

---

## 1. Purpose

To define how raw infrastructure project data (from contractors, engineers, PMUs, and site activity) is:

**collected → verified → structured → published** into the Umkhandlu system.

This ensures:
- Audit-ready consistency
- PMU reporting alignment
- Lifecycle tracking accuracy
- Public transparency integrity

---

## 2. Role Definition

**You are NOT:**
- A project manager
- A technical engineer
- A contractor representative
- A municipal decision-maker

**You ARE:**

A structured documentation operator responsible for converting field and governance data into a verified public record system.

---

## 3. Input Sources

You only accept inputs from these 4 verified channels:

| Source | What they provide |
|---|---|
| **Contractor** | Site diary extracts, WhatsApp updates, progress claims, photos/videos |
| **Engineer** | IPC summaries (certified progress %), site instructions, inspection confirmations |
| **PMU** | Monthly progress summaries, delay notifications, stakeholder meeting notes, employment verification |
| **Municipality** | Official phase changes, project status updates, formal notices or approvals |

---

## 4. Operating Cycle

### Step 1 — Data Collection (Receive Only)

Frequency: daily or every 2–3 days

Collect: messages, photos, reports, meeting notes.

**Rule:** Do NOT structure immediately. First store raw inputs in working log.

### Step 2 — Validation (Consistency Check)

Before updating system, verify:
- Does information match previous entries?
- Does engineer data align with contractor claims?
- Are numbers consistent (workforce, % completion)?

**If conflict exists:** flag internally as "requires clarification." Do NOT publish conflicting data.

### Step 3 — Structuring (Core Function)

Convert raw data into structured fields:

**Progress Log Entry format:**
```
DATE + VERIFIED ACTIVITY + IMPACT
```

Example:
```
2025-08-15: Engineer-certified foundation works reached 60% completion. 
45 local workers active on site. Rising main installation commenced in Section B.
```

**Metadata updates** — only when confirmed:
- `beneficiaries` (employment numbers)
- `projectPhase` (only engineer/PMU confirmed)
- `deliverables` status

**Evidence linking:**
- Images → `gallery[]`
- Documents → `documents[]`

### Step 4 — System Update (Sanity CMS)

In Studio, update ONLY:
- `progressLog` (append, never overwrite)
- `gallery` (add new media)
- `beneficiaries` (if confirmed)
- `projectPhase` (only validated change)
- `status` (only major milestone changes)

### Step 5 — Publication

After update: click **Publish**. ISR refresh triggers automatically. Public page updates within seconds.

### Step 6 — Monthly Report Extraction

At end of month:
```
GET /api/campaigns/export?token=<TOKEN>
```

Then: compile PMU summary, cross-check with progress log, produce structured monthly report.

---

## 5. Decision Rules

| Rule | Logic |
|---|---|
| **No unverified data** | If contractor says it → NOT enough. If engineer confirms → VALID. |
| **Engineer overrides contractor** | If conflict, engineer certification wins. |
| **PMU overrides narrative, not data** | PMU can request clarification but cannot override certified engineer data. |
| **Municipality controls status only** | Only municipality can change status to COMPLETED or approve phase closure. |

---

## 6. Schema Field Mapping

| SOP Step | Sanity Field | When to update |
|---|---|---|
| Validated activity | `progressLog[]` | Every confirmed update (weekly minimum) |
| Site photos | `gallery[]` | Every site visit or contractor submission |
| Certificates/reports | `documents[]` | When engineer issues IPC or report |
| Employment numbers | `beneficiaries` | When PMU confirms EPWP numbers |
| Local businesses | `localSMMEs` | When confirmed by PMU |
| Phase transition | `projectPhase` | Only when engineer/PMU certifies milestone |
| Project completion | `status` → completed | Only when municipality confirms |
| Final reporting | `impactSummary` | After completion, for CSR/compliance report |
| Stakeholder comms | Create `notice` with `relatedCampaign` | For public announcements about the project |

---

## 7. Pipeline Flow

```
RAW INPUT (contractor/engineer/PMU)
    ↓
VALIDATION (SOP rules — verify before structuring)
    ↓
progressLog[] (timeline entry — primary truth record)
    ↓
gallery[] / documents[] (evidence attachment)
    ↓
beneficiaries / localSMMEs (if confirmed numbers)
    ↓
projectPhase (if certified milestone)
    ↓
status (if major state change)
    ↓
PUBLISH (ISR update — page live in seconds)
    ↓
EXPORT (monthly PMU report via API)
```

---

## 8. Error Handling

| Situation | Action |
|---|---|
| Missing data | Mark as "pending update" internally. Do NOT fabricate. |
| Conflicting reports | Flag internally. Escalate to PMU contact. |
| Delayed updates | Continue timeline logically. Add note: "No update received for reporting period." |
| Unresponsive contractor | Document gap in progress log. Notify PMU. |

---

## 9. Weekly Output Standard

Each week MUST produce:
- Minimum 1 structured `progressLog` entry
- At least 1 media update (if available)
- Confirmation of current phase status consistency

---

## 10. Key Operating Principle

> "Nothing enters the system unless it can survive engineer or PMU verification logic."

---

## 11. One-Line Summary

Collect raw infrastructure updates, verify against authority sources, structure into lifecycle records, and publish as a continuously updated PMU-ready project intelligence layer.
