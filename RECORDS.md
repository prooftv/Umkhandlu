# Records — Institutional Memory Architecture

> A record is not a document. It is a unit of institutional memory.

---

## The Core Question

Not: *"What fields does a record have?"*

But: *"What role does this record play in the institutional journey?"*

The KwaGudlucingo case study proved this. A single community meeting on 27 June 2026 produced a notice, minutes, two resolutions, an infrastructure concern, a follow-up meeting, nomination records, and a customary criteria document. None of those are "documents" in the filing-cabinet sense. Each one is a node in a governance network — with a role, a position in a chain, and a relationship to what came before and what comes after.

---

## The Six Record Roles

### 1. Origin Record

Where something begins. Creates the starting point of an institutional journey.

**Answers:** What happened? Where? When? Who participated? Why?

**Becomes:** The root of a lineage chain. All subsequent records trace back to it.

**Example:** `Minutes — KwaGudlucingo Community Meeting (27 June 2026)`

```
Origin Record
  ↓
Everything else in the chain
```

### 2. Decision Record

Captures what the institution decided. The important thing is not the PDF — it is the decision itself, its origin, and what it leads to.

**Answers:** What was decided? By whom? On what basis? What does it produce?

**Example:** `Resolution — Petition for Recognition of KwaGudlucingo as a Separate Isigodi`

```
Decision Record
  ├── Originated from: Community Meeting (Origin Record)
  ├── Adopted on: 27 June 2026
  └── Leads to: Petition submission → COGTA process → Recognition
```

### 3. Evidence Record

Proves something happened. Does not create action — it supports the record that does.

**Answers:** How do we know? What proof exists?

**Examples:** Attendance registers, photographs, signed petitions, correspondence, certificates.

**Note:** Evidence records are often attachments on other records (`evidence[]` field) rather than standalone documents. When the evidence is itself a governance artefact (a signed petition, a formal certificate), it warrants its own record.

### 4. Matter Record

An ongoing concern with a life. Not one event — a persistent institutional issue that accumulates records over time.

**Answers:** What is the current state of this matter? What has happened so far? What is still unresolved?

**Example:** `Infrastructure Record — Absence of Apollo Street Lighting, KwaGudlucingo`

This is not one event. It has a life:

```
Concern Raised (27 June 2026)
  ↓
Community Discussion → Infrastructure Record created (status: open)
  ↓
Municipality Engagement → Record updated / new child record
  ↓
Assessment Completed → Status updated
  ↓
Resolution → Status: resolved
  ↓
Completion Evidence → Evidence Record attached
```

The status history itself becomes valuable institutional memory.

### 5. Reference Record

Provides institutional context. Does not create action but provides understanding.

**Answers:** What is the background? What does this mean? What is the applicable framework?

**Example:** `Community Explanation of Customary Appointment Process for Traditional Leadership`

This record may not produce anything. But it explains the institutional context within which other records make sense. A future person reading the nomination records in 2036 needs this reference to understand why the process unfolded as it did.

### 6. Status Record

Change over time is the value. The record's history is the institutional memory.

**Example:** An infrastructure concern that moves through:

```
27 June 2026    → Open
15 July 2026    → Municipality notified
30 July 2026    → Assessment completed
Future          → Resolved
```

Each status change is a governance event. The progression is the record.

---

## The Record Network

A normal CMS stores records as isolated documents. Umkhandlu stores them as a network.

```
Record
  ├── originNotice      → the notice that produced this record
  ├── parentRecord      → the record this was produced from
  ├── childRecords[]    → records this record produced
  ├── evidence[]        → attachments proving this record
  ├── relatedArea       → the geographic jurisdiction
  ├── relatedCampaign   → the infrastructure project (if applicable)
  └── approvedBy        → the authority who approved this decision
```

**The record relationship is the real asset.** Not any single record — the network.

### KwaGudlucingo Record Network

```
Community Meeting Notice (27 June 2026)
  │
  └── Minutes (Origin Record)
        │
        ├── Resolution — Petition for Recognition (Decision Record)
        │
        ├── Resolution — Whistle Alert System (Decision Record)
        │
        └── Infrastructure Record — Apollo Street Lighting (Matter Record)

Follow-up Meeting Notice (26 July 2026)
  │
  └── Minutes — Petition Progress & Induna Nomination (Origin Record)
        │
        ├── Nomination Record — Induna Candidates (Report)
        │
        ├── Customary Criteria Record (Reference Record)
        │
        └── Resolution — Nomination Process (Decision Record)
              │
              └── Community Explanation of Customary Process (Reference Record)
```

The power is not any single record. The power is the record network.

---

## Record Identity Model

Every record has a complete identity:

```
RECORD IDENTITY

Title:        Minutes — KwaGudlucingo Community Meeting
Type:         Meeting Minutes
Date:         27 June 2026
Status:       Adopted
Approved By:  → person reference

EVENT CONTEXT

📍 Venue:     Soccer ground opposite Izazi High School
👥 Attendance: 47
🌦 Weather:   Clear sky, 22°C (min 16°C / max 26°C)
              Rainfall: 0mm · Wind: 12 km/h · Humidity: 45%
              ✓ Recorded conditions — Open-Meteo historical archive

LINEAGE

Origin Notice: → Community Meeting notice
Produced:      3 linked records

EVIDENCE

📎 Attendance Register
📎 Signed Petition
📎 Meeting Photographs
```

A future person opening this record in 2036 does not only see "a meeting happened." They see: this meeting happened at this place, under these circumstances, involving these people, producing these decisions. That is institutional memory.

---

## Event Context

Event Context is a snapshot of the circumstances surrounding an institutional event. It is supporting context — it does not form part of the official record and does not modify governance decisions.

### Why It Belongs on the Record

The record is a time capsule. Weather, location, and attendance are part of the event's circumstances. They help future readers understand the context in which decisions were made.

### Weather

Weather data is fetched automatically from [Open-Meteo](https://open-meteo.com) (free, no API key, covers South Africa) on every page visit.

**Two modes:**

| Mode | When | Label | Source |
|---|---|---|---|
| Forecast | Notice date is in the future | 🔮 Predicted | Open-Meteo forecast API |
| Historical | Record date is in the past | ✓ Recorded | Open-Meteo historical archive |

**Locking logic:**

- Notices with future dates: forecast re-fetched on every visit (forecast updates as the date approaches)
- Notices whose date has passed: historical snapshot fetched once, patched to Sanity, locked
- Records (always past dates): historical snapshot fetched once, patched to Sanity, locked

**Storage:** `weatherContext` object field on both `notice` and `record` documents. Stored once, preserved permanently. Appears in lineage certificates, evidence packages, and all Layer 5 outputs.

**Fields stored:**

| Field | Example |
|---|---|
| `type` | `historical` or `forecast` |
| `condition` | `Clear sky` |
| `temperatureCelsius` | `22` (daily average) |
| `tempMinCelsius` | `16` |
| `tempMaxCelsius` | `26` |
| `rainfallMm` | `0` |
| `windKmh` | `12` |
| `humidityPercent` | `45` |
| `uvIndex` | `6` |
| `fetchedAt` | ISO timestamp of when data was captured |

**Coordinates:** Derived from `relatedArea → geopoint`. No manual input required. If no area or no geopoint, weather is silently skipped.

**Classification:** Supporting context. Source always attributed. Does not modify the official record.

### Location

`location` — free text field. Where the event physically took place.

Example: `Soccer ground opposite Izazi High School, KwaGudlucingo`

This is distinct from `relatedArea` (the governance jurisdiction). A meeting in KwaGudlucingo might be held at a specific venue within that area.

### Attendance

`attendance` — number field.

- On notices: expected attendance
- On records: actual attendance (operator updates after the event)

---

## Schema Reference

### `record` document fields

| Field | Type | Purpose |
|---|---|---|
| `title` | string | Required |
| `slug` | slug | Required, auto-generated from title |
| `recordType` | string (enum) | See record types below |
| `date` | date | Required |
| `summary` | text | 300 char max, shown in lists |
| `status` | string (enum) | adopted / approved / pending / open / rejected / resolved |
| `approvedBy` | reference → person | Inkosi or authority who approved |
| `content` | blockContent | Full rich text body |
| `originNotice` | reference → notice | The notice that produced this record |
| `parentRecord` | reference → record | The record this was produced from |
| `evidence[]` | file array | Attachments — PDF, DOC, images |
| `externalUrl` | url | External resource link |
| `source` | string | Source organisation (external resources) |
| `relatedArea` | reference → listing (area) | Geographic jurisdiction |
| `relatedCampaign` | reference → campaign | Infrastructure project link |
| `verificationNote` | text | How this record was verified |
| `location` | string | Venue / physical location of event |
| `attendance` | number | Number of people present |
| `weatherContext` | object | Auto-captured environmental snapshot (read-only) |

### Record Types

| Value | Label | Role |
|---|---|---|
| `minutes` | Meeting Minutes | Origin Record |
| `resolution` | Resolution | Decision Record |
| `community-decision` | Community Decision | Decision Record |
| `land-allocation` | Land Allocation | Decision Record |
| `dispute-resolution` | Dispute Resolution | Decision Record |
| `report` | Report | Origin / Reference / Status Record |
| `infrastructure-concern` | Infrastructure Concern | Matter Record |
| `project-outcome` | Project Outcome | Status / Evidence Record |
| `policy` | Policy | Reference Record |
| `agenda` | Agenda | Reference Record |
| `public-notice` | Public Notice | Reference Record |
| `external-resource` | External Resource | Reference Record |

### `notice` document — added fields

| Field | Type | Purpose |
|---|---|---|
| `location` | string | Venue / meeting place |
| `attendance` | number | Expected attendance |
| `weatherContext` | object | Auto-captured forecast snapshot (read-only) |

---

## Frontend Architecture

### Routes

| Route | Purpose | Rendering |
|---|---|---|
| `/records/[slug]` | Record detail page | Dynamic (force-dynamic) |
| `/notices/[slug]` | Notice detail page | Dynamic (force-dynamic) |
| `/notices/lineage/[slug]` | Printable lineage certificate (A4) | Dynamic |
| `/notices/journey/[slug]` | Printable journey map (A4 landscape) | Dynamic |

Both `/records/[slug]` and `/notices/[slug]` are `force-dynamic` — rendered on every request so weather is always live.

### Record Page Structure

```
RecordHeader
  Title, Type badge, Status badge, Date

RecordMeta
  Approved By, Related Area, Related Project, Source

RecordEvidence
  Evidence attachments, External URL

Record content (rich text)

EventContext
  Weather snapshot, Venue, Attendance

─── Tabs ───────────────────────────────
  Record  |  Governance Lineage [n]
────────────────────────────────────────

Governance Lineage tab:
  LineageChain (ancestors → current → children)
  Print Lineage Certificate →
  View Journey Map → (opens JourneyDrawer)

JourneyDrawer (full-viewport overlay):
  GovernanceJourney tree
  Print → (opens /notices/journey/[slug])
```

### Notice Page Structure

```
Badge (type), Date, Area link, Pinned indicator
Title (h1)

─── Tabs ───────────────────────────────
  Notice  |  Governance Lineage [n]
────────────────────────────────────────

Notice tab:
  Excerpt
  Full content (rich text)
  EventContext (weather forecast/historical, venue, attendance)
  NoticeSeriesLinks (origin notice, related campaign)
  ShareWhatsApp

Governance Lineage tab:
  LineageChain
  Follow-up Notices
  Print Lineage Certificate →
  View Journey Map → (opens JourneyDrawer)
```

### Components

| Component | File | Purpose |
|---|---|---|
| `EventContext` | `components/modules/EventContext.tsx` | Weather, venue, attendance display |
| `LineageChain` | `components/modules/LineageNode.tsx` | Ancestor → current → children rail |
| `LineageList` | `components/modules/LineageNode.tsx` | Numbered flat list of records |
| `LineageAncestor` | `components/modules/LineageNode.tsx` | Standalone ancestor display |
| `GovernanceJourney` | `components/modules/GovernanceJourney.tsx` | Full branching tree (NoticeJourney, RecordJourney) |
| `JourneyDrawer` | `components/modules/JourneyDrawer.tsx` | Full-viewport overlay for journey tree |
| `LineageTabs` | `components/modules/LineageTabs.tsx` | Two-tab wrapper (Notice / Governance Lineage) |

---

## Layer 5 Integration

Weather context is stored on the Sanity document (`weatherContext` field). This means it is available to all Layer 5 derived outputs:

| Output | Weather included |
|---|---|
| Lineage Certificate (`/notices/lineage/[slug]`) | ✓ via `noticeLineageQuery` |
| Journey Map (`/notices/journey/[slug]`) | ✓ via `noticeLineageQuery` |
| Governance Evidence Package (planned) | ✓ stored on document |
| Campaign Export API | — (not applicable) |

The `weatherContext.fetchedAt` timestamp and `type` field allow certificate recipients to understand when the snapshot was captured and whether it was a forecast or a verified historical reading.

---

## API

### Weather Capture

```
POST /api/weather-patch
Body: { _id, date, lat, lng }
Auth: SANITY_API_WRITE_TOKEN (server-side only)
```

Called fire-and-forget from the server component on page render. Patches `weatherContext` onto the Sanity document. For records (past dates): only patches if `weatherContext` is not yet stored. For notices (future dates): always re-patches so the forecast stays current.

### Weather Source

[Open-Meteo](https://open-meteo.com) — free, no API key, covers South Africa.

- Forecast: `https://api.open-meteo.com/v1/forecast`
- Historical: `https://archive-api.open-meteo.com/v1/archive`

Both use the same parameters. The utility (`src/lib/weather.ts`) routes automatically based on whether the date is in the future or past.

---

## What Records Are Not

- Not PDFs. A record may have a PDF attachment. The record is not the PDF.
- Not content. Records are not blog posts or marketing copy.
- Not documents in the filing-cabinet sense. A document is inert. A record has a role, a position in a chain, and relationships.
- Not isolated. A record without lineage is incomplete institutional memory.

---

## The Principle

> Notice → Record → Lineage → Context → Evidence → Output

The record is the centre. Everything else helps explain the record.

The shift this enables: instead of asking *"Where is the document?"*, Umkhandlu enables people to ask *"What is the complete history of this decision?"*

That is what transforms a document repository into genuine institutional memory.
