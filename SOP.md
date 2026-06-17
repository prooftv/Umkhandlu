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
- `deliverables` (add milestone when engineer certifies completion)
- `totalDeliverables` (set once at project inception from contract scope)

**Progress measurement:**

Umkhandlu uses **milestone-based progress**, not percentage-based:
- ❌ "Contractor says 70% complete" (unverifiable claim)
- ✅ "3 of 6 certified deliverables completed = 50%" (auditable)

The `totalDeliverables` field is set once from the contract scope. As the engineer certifies each milestone, the operator adds it to `deliverables[]`. The progress bar derives from certified completions.

This aligns with IPC (Interim Payment Certificate) practice where payment is milestone-based, not percentage-based.

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

This returns campaign-level JSON with `deliverablesCertified`, `deliverableProgress`, `projectPhase`, sponsor/contact metadata, related areas/programs, and summary counts for notices, opportunities, development notices, verifications, community notes, and photos.

Then: compile PMU summary, cross-check with the published progress log, and compare the campaign export against `conflictLog` verification records for evidence consistency.

Note: The export includes brief `relatedOpportunities` and `relatedDevelopmentNotices` arrays (up to 10 items) to aid compliance reviews. For full notice or opportunity details, query the respective endpoints.

The export now also includes redacted `verifications` summaries. Each verification contains a truncated `resolutionNote` (first 200 characters) and `claims[].evidenceSummary` (first 200 characters) so auditors can review context without receiving full sensitive evidence files.

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
| Project scope | `totalDeliverables` | Once at project inception (from contract) |
| Milestone certified | `deliverables[]` | When engineer certifies a deliverable |
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
| Missing data | Mark as "pending update" internally. Do NOT fabricate. Follow Unreachable Data Protocol (TCRS §9). |
| Conflicting reports | Create `conflictLog` entry. Apply TCRS resolution engine (see §12 below). |
| Delayed updates | Continue timeline logically. Add note: "No update received for reporting period." |
| Unresponsive contractor | Document gap in progress log. Notify PMU. If 2 cycles: escalate per TCRS §9. |

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

---

## 12. Truth Conflict Resolution (TCRS Integration)

Full protocol: [TCRS.md](./TCRS.md)

### When to trigger

Any time two sources report different values for the same field on the same project.

### Operator workflow

```
1. IDENTIFY  — Two sources report different values for the same field
2. RECORD    — Create verification record in Studio (link to project, add all source reports)
3. CLASSIFY  — Identify highest-authority source with validated evidence
4. REPORT    — Set verified reporting value
5. STATUS    — Set verification status (pending / under review / verified / escalated)
6. ESCALATE  — If unresolvable: Engineer → PMU → Site Meeting → Municipality
```

### Authority classification (memorise these)

| Source | Authority Level |
|---|---|
| Engineer certification | Highest technical |
| Municipality | Institutional |
| PMU | Programme management |
| Contractor | Implementation report |
| CLO / Councillor | Community governance |
| Field observation | Operational |

### Key rules

- **Never delete a source record** — preserve all reported values
- **Engineer certification takes precedence** on technical data
- **Municipality has final governance authority** on status/phase closure
- **Contextual reports do NOT override technical certification** — but are preserved
- **No data = no assumption** — record "No verified data available"
- **The system records, preserves, organises, presents** — it does not decide

### Cadence for conflict checks

| Phase | Frequency |
|---|---|
| Construction | Weekly |
| Planning / Procurement | Monthly |
| Commissioning | Bi-weekly |
| Operational | Quarterly |

---

## 13. Field Capture Protocol

For operators without laptop access on-site:

### WhatsApp Template (send to project channel)

```
📍 SITE UPDATE — [Project Name]
📅 Date: [YYYY-MM-DD]
👷 Workers on site: [number]
📊 Estimated progress: [%]
🔧 Activity: [what's happening]
📸 [attach photo]
⚠️ Issues: [any problems observed]
Source: [your name / role]
```

### Offline protocol

1. Capture using WhatsApp template (works on low signal)
2. Photos auto-upload when signal returns
3. Operator structures into progressLog within 24 hours
4. If data conflicts with existing records: trigger TCRS

---

## 14. Dispute / Takedown Protocol

If any party formally requests removal of published project data:

1. Do NOT delete content
2. Set campaign status to `draft` (unpublishes immediately)
3. Create conflictLog documenting the dispute
4. Escalate to PMU within 24 hours
5. Only republish after written resolution confirmation
6. Full dispute timeline recorded in resolution note

---

## 15. Evidence Classification Levels

Not all information warrants the same treatment. Classify incoming intelligence before deciding what to publish:

| Level | Meaning | Source Examples | Umkhandlu Treatment |
|---|---|---|---|
| **Level 1 — Planning** | Mentioned in IDPs, sector plans, or community consultations | IDP community priorities, ward committee inputs, sector plan references | Store as `record` (type: external-resource). Reference in area page. Use in stakeholder meetings as engagement checklist. |
| **Level 2 — Approved** | Budgeted with defined KPIs, implementation targets, or formal commitment | IDP capital budget line items, SDBIP KPIs, council resolutions with budget allocation | Eligible for a campaign page with basic project metadata. Progress tracking begins when Level 3 evidence arrives. |
| **Level 3 — Active** | Contractor appointed, site activity confirmed, engineer verification available | IPC certificates, site diaries, PMU monthly reports, contractor WhatsApp updates | Full campaign with milestone tracking, media, community notices, verification records, and export. |

### Decision Rules

| Question | If Yes | If No |
|---|---|---|
| Is there a contractor on site? | Level 3 | Not yet |
| Is there a budget allocation with a KPI target? | At least Level 2 | Level 1 |
| Is it only mentioned in community input or planning documents? | Level 1 only | — |
| Can an engineer or PMU verify progress? | Level 3 | Cannot track milestones |

### Promotion Path

```
Level 1 (Planning intelligence)
    → Confirmed budget + KPI target → Level 2 (Approved)
        → Contractor + site activity + verification → Level 3 (Active)
```

Items stay at their current level until evidence justifies promotion. Do NOT create full campaign pages for Level 1 items — that produces empty shells that undermine platform credibility.

### Practical Application

- **Level 1:** "The IDP mentions bridge rehabilitation as a Ward 7 priority." → Store as external-resource record. Raise in PMU meeting.
- **Level 2:** "Buffalo River Abstraction Works has R40m WSIG allocation and a June 2026 target in the SDBIP." → Campaign created with project metadata.
- **Level 3:** "Engineer certified weir foundation at 25% complete. 45 workers on site." → Full progress tracking active.

---

## 16. One-Line System Definition

> Collect, verify, structure, resolve conflicts, and publish infrastructure data as a continuously updated, audit-ready, governance-accountable project intelligence layer.
