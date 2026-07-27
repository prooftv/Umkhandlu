# Truth Conflict Resolution System (TCRS)

The Evidence Layer of Umkhandlu — preserving institutional memory across infrastructure, participation, governance, and compliance.

---

## 1. Core Principle

Umkhandlu manages the public record. Multiple sources contribute to that record. Those sources do not always agree, and statutory processes require proof that events occurred.

TCRS governs two functions:

1. **Variance Resolution** — When sources disagree, preserve all claims and present a verified reporting value
2. **Evidence Preservation** — When proof is required, maintain timestamped, traceable, auditable records

The system does not decide which source is correct. It does not certify compliance. It:

> Records → preserves → organises by authority classification → presents for governance use.

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

These records are implemented as Sanity `conflictLog` documents that reference the campaign and store:
- `field`, `conflictType`, `claims[]`, `displayTruth`, `resolutionState`, `resolutionNote`, `detectedAt`, and `resolvedAt`.
- Each claim includes `source`, `value`, `date`, and `evidence`.

The campaign page fetches these records as `verificationRecords` and renders them in collapsible summaries.

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

> TCRS — The Evidence Layer. Preserves institutional memory across infrastructure, participation, governance, and compliance. Handles variance resolution when sources disagree.

### External (municipalities, PMUs, audit)

> Governance Audit & Evidence Preservation Layer. Records, preserves, organises, and presents performance and compliance evidence from multiple sources in accordance with municipal verification processes.

### One-Line Definition

> Umkhandlu’s evidence layer preserves all source reports, publication records, participation evidence, and governance decisions — maintaining a transparent, auditable institutional memory supporting accountability, compliance, and community oversight.

---

## 13. System Architecture Position

```
UMKHANDLU — Community-Scale Institutional Memory
│
├── Layer 1 — Community Communication
│       Public notices, announcements, meetings, alerts
│
├── Layer 2 — Governance Records
│       Minutes, resolutions, policies, reports, infrastructure records
│
├── Layer 3 — Evidence Preservation
│       Attachments, public comments, conflict logs, development notices
│
├── Layer 4 — Institutional Memory
│       Record lineage, parent/child relationships, decision provenance,
│       governance history, origin traceability
│
└── Layer 5 — Governance Evidence (derived output)
        Proof of publication certificates, lineage certificates,
        governance audit packages, public verification outputs
```

Layers 1–4 are primary records — inputs and institutional memory.
Layer 5 is derived output — the system reasoning about its own records to produce structured, verifiable evidence.

Layer 5 outputs are never edited directly. They are regenerated from the underlying records. If the records change, the output changes. That is the integrity mechanism.

The recurring pattern across all layers:

> Public Record → Participation → Evidence → Traceability

Every module answers the same question in different contexts: *"Can you prove what happened?"*

---

## 14. Proof of Publication Protocol

Statutory notices require proof that proper notification occurred. TCRS provides this through structured evidence preservation.

### The Legal Question

Every statutory notice eventually faces one question:

> "Can you prove that the community was properly notified?"

| Context | Who asks | What they need |
|---|---|---|
| SPLUMA application | Municipality | Proof of 30-day public inspection |
| EIA process | Environmental consultant | Proof of public participation |
| Estate notice | Master of the High Court | Proof of publication |
| Liquidation | Attorney / creditors | Proof of notice to affected parties |
| Traditional council | Induna / community | Proof the notice was issued |

### What the System Preserves (Automatically)

| Evidence | Field | Purpose |
|---|---|---|
| Publication date | `publishDate` | When the notice went live |
| Comment deadline | `commentDeadline` | Mandatory inspection window end |
| Retention period | `retentionPeriod` | Minimum publication duration |
| Legal mandate | `legalMandate` | Governing Act reference |
| Documents hosted | `documents[]` | EIA reports, site plans available for download |
| Map location | `geopoint` | Site pinned on public map |
| Public URL | System-generated | Permanent, indexable, accessible |
| Notice status | `status` | Lifecycle: open → closed → approved/rejected |
| Applicant | `applicant` | Who submitted the notice |
| Reference number | `referenceNumber` | Official application reference |

### Proof of Publication Certificate

The platform generates a formal certificate that an applicant can submit to the municipality, court, or authority as proof of compliance. The certificate contains:

```
┌─────────────────────────────────────────────────────────┐
│           PROOF OF PUBLICATION CERTIFICATE               │
│                                                         │
│  Platform:        Umkhandlu [Council Name]              │
│  Certificate No:  [auto-generated]                      │
│  Date Issued:     [current date]                        │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  NOTICE DETAILS                                         │
│  Title:           [notice title]                        │
│  Type:            [EIA / SPLUMA / Estate / etc.]        │
│  Legal Mandate:   [NEMA / SPLUMA / Insolvency Act]      │
│  Reference No:    [application reference]               │
│  Applicant:       [developer / attorney name]           │
│                                                         │
│  PUBLICATION RECORD                                     │
│  Published:       [publishDate]                         │
│  Comment Deadline: [commentDeadline]                    │
│  Days Published:  [calculated]                          │
│  Retention:       [retentionPeriod]                     │
│  Public URL:      [permanent link]                      │
│  Status:          [current status]                      │
│                                                         │
│  DOCUMENTS HOSTED                                       │
│  1. [document title] — available for public download    │
│  2. [document title] — available for public download    │
│                                                         │
│  SITE LOCATION                                          │
│  Address:         [location]                            │
│  Coordinates:     [lat, lng]                            │
│  Map:             Publicly visible on community map     │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  This certificate confirms that the above notice was    │
│  published on the Umkhandlu community platform and      │
│  remained publicly accessible for the stated duration.  │
│  The notice, supporting documents, and site location    │
│  were available for public inspection at the URL above. │
│                                                         │
│  Issued by: Unami Foundation (Platform Operator)        │
│  Contact:   [operator email]                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### How This Connects to TCRS

The certificate is not a governance decision. It is **evidence preservation output**.

The system:
- Records when the notice was published
- Preserves what was available
- Tracks how long it remained visible
- Generates a structured proof document

It does NOT:
- Certify that the notice content is correct
- Guarantee that the community read it
- Replace official gazette publication where required
- Make legal determinations about compliance

### Revenue Implication

The proof of publication certificate is included in the notice fee. It is what attorneys currently pay newspapers R2,000+ for. Umkhandlu provides it at R100–R200 as part of the structured notice fee because the evidence is already in the system.

### Retention Rules

| Notice Type | Minimum Retention | Archive |
|---|---|---|
| PTO / Land Transfer | Permanent | Never delete |
| Estate (Form J187) | 3 months minimum | Archive after closure |
| Liquidation | 3 months minimum | Archive after closure |
| SPLUMA / Rezoning | 30 days minimum | Archive after decision |
| EIA | Full project duration | Archive after ROD issued |
| Mining | Full project duration | Archive after decision |

Notices are never deleted from the system. After the retention period, status changes to `closed` but the record remains permanently accessible and searchable.

## 15. Trust Model — Institutional vs Cryptographic

Umkhandlu is built on institutional trust, not cryptographic trust. These are two different models that solve two different problems.

**Cryptographic trust** assumes there is no trusted authority. Mathematics becomes the authority. Consensus produces a hash. The hash produces a ledger. The ledger produces truth. This is the blockchain model.

**Institutional trust** assumes recognised authority exists. The community recognises the Inkosi. The Inkosi convenes the council. The council deliberates. The decision is recorded. Witnesses are present. The record is preserved. Truth comes from governance process and evidence, not from consensus algorithms.

```
Cryptographic trust          Institutional trust

No trusted authority    vs   Recognised authority
Consensus               vs   Deliberation
Hash                    vs   Record
Ledger                  vs   Archive
Mathematical truth      vs   Governance truth
```

Umkhandlu digitises institutional trust mechanisms that traditional governance has always relied on:

- Recognised authority (Inkosi, Induna, Engineer, Municipality)
- Witnesses (public participation, comment capture)
- Minutes (structured record of what was decided)
- Resolutions (formal governance output)
- Customary procedure (the SOP and operator certification)
- Public participation (comment forms, objection capture, notice publication)

The database is secondary. The governance model is the innovation.

---

## 16. Federated Governance Architecture

Umkhandlu is not a centralised platform. It is a federated governance network.

Each traditional council operates as its own governance node:

```
Council A                Council B                Council C
─────────────────        ─────────────────        ─────────────────
Own records              Own records              Own records
Own notices              Own notices              Own notices
Own authority            Own authority            Own authority
Own institutional        Own institutional        Own institutional
memory                   memory                   memory
Own governance           Own governance           Own governance
lineage                  lineage                  lineage

─────────────────────────────────────────────────────────────────
                  Common operating platform
                  Shared SOP and operator discipline
                  Shared evidence layer architecture
```

Unami does not govern those councils. It provides the infrastructure. Governance remains local. The software is shared.

This is closer to a federated governance network than to a single central database. The architecture resembles email more than blockchain — each node is sovereign, the protocol is shared.

**What this means in practice:**

| Property | Description |
|---|---|
| Data sovereignty | Each council's data lives in its own Sanity project |
| Governance authority | Each council's Inkosi and Izinduna retain full authority |
| Operator neutrality | Unami documents — it does not govern |
| Portability | Each node can export its full dataset independently |
| Isolation | A dispute at one node does not affect other nodes |
| Shared discipline | SOP, TCRS, and operator certification apply across all nodes |

The correct description of the architecture:

> **Institutionally distributed. Technically federated.**

Not: "institutionally rigorous but technically centralised."

---

## 17. Layer 5 — Governance Evidence (Specification)

Layer 5 outputs are derived evidence. They are produced automatically from Layers 1–4. They are never edited directly. They are regenerated from the underlying records.

### What Makes Layer 5 Different

| Layer 1–4 | Layer 5 |
|---|---|
| Primary records | Derived output |
| Created by operators | Generated by the system |
| Editable | Read-only |
| Inputs | Outputs |
| Documents | Evidence packages |

### Current Layer 5 Outputs

| Output | Route | Source Records |
|---|---|---|
| Governance Record Lineage Certificate | `/notices/lineage/[slug]` | Notice + all produced records + follow-up notices |
| Proof of Publication Certificate | `/development-notices/certificate/[slug]` | Development notice fields |

### Integrity Mechanism

Layer 5 outputs do not have their own integrity — they inherit it from the records they are derived from. If the underlying records change, the output changes on next generation. This is the correct behaviour.

To make this verifiable, each Layer 5 output should expose the Sanity document revision identifier (`_rev`) of its source records. `_rev` is a system-generated hash assigned to every document mutation. It cannot be edited through the Studio or API. It changes whenever the document changes.

A recipient of a certificate can verify it against the live record by checking whether the `_rev` on the certificate matches the current `_rev` returned by the Sanity API for that document. If they match, the certificate reflects the current state of the record. If they differ, the record has been updated since the certificate was generated.

### Planned Layer 5 Outputs

| Output | Description | Status |
|---|---|---|
| Governance Evidence Package | Complete lineage bundle for a governance process — notice, records, evidence files, verification notes — captured at a point in time with a bundle hash | Planned |
| Community Governance Report | Periodic summary of governance activity for an area — notices issued, records produced, decisions made, infrastructure tracked | Planned |
| Infrastructure History | Complete project record from notice through implementation to verification | Planned |
| Decision Provenance Report | Full chain of authority for a specific decision — who called the meeting, who attended, what was resolved, who approved | Planned |

### Governance Evidence Package (Specification)

A Governance Evidence Package captures the complete lineage of a governance process at a specific point in time.

**Contents:**

```
Package metadata
  generatedAt         timestamp
  generatedBy         platform identifier
  sourceNotice        _id + _rev of originating notice
  bundleHash          SHA-256 of all included record _rev values

Originating notice
  title, type, date, area, excerpt
  _rev (document revision at time of generation)

Produced records (all depths)
  title, type, date, status, summary
  verificationNote
  evidence file references
  _rev per record

Follow-up notices
  title, type, date
  _rev
  produced records (same structure)

Conflict logs (if any)
  field, variance type, claims, displayTruth, resolutionState
  _rev
```

**Integrity:**
The `bundleHash` is a SHA-256 of all included `_rev` values concatenated in document order. Any change to any underlying record changes its `_rev`, which changes the `bundleHash`. The package is self-verifying.

**Generation trigger:**
Packages are generated on demand (operator or applicant requests). They are not stored — they are regenerated from live records each time. The `bundleHash` at generation time can be recorded externally (e.g. emailed to the applicant, logged to a webhook) to provide an independent reference point.

---

## 18. Verifiability Roadmap

In order of implementation priority:

### 1. Expose `_rev` on existing certificates (immediate)

Add the Sanity document revision identifier to:
- Governance Record Lineage Certificate (`/notices/lineage/[slug]`)
- Proof of Publication Certificate (development notices)

Cost: one additional field in each GROQ query, two lines of UI per certificate.

Effect: any recipient can verify the certificate against the live record by checking `_rev`.

### 2. Governance Evidence Package (next)

Implement the package specification in §17. Generate on demand. Produce a `bundleHash`. Deliver via webhook or download.

### 3. External timestamp anchoring (future)

When a governance record is published, POST a hash of its content to an external timestamping service (OpenTimestamps or similar). Store the anchor reference on the record. This provides an independent, tamper-evident timestamp that does not depend on Sanity's internal revision history.

### 4. IPFS for evidence files (future)

Store `evidence[]` files on IPFS. Record the content-addressed CID alongside the Sanity asset URL. The CID is permanent and content-addressed — the file at that CID is permanently that file, regardless of what happens to the Sanity project.

This is the most meaningful decentralisation step because evidence files are the most legally significant layer.
