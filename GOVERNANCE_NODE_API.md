# Governance Node API — Contract v1.0

Umkhandlu exposes a read-only intelligence API that allows an external Control Centre / admin dashboard to query live governance data without direct Sanity access. Each deployed council is a sovereign node. The Control Centre aggregates across nodes.

---

## Architecture Overview

```
Sanity CMS (content store)
        │
        ▼
Umkhandlu Node (Next.js)
        │
        ├── /api/intelligence/*   ← Intelligence API (bearer token)
        ├── /api/campaigns/export ← Data export (READ_TOKEN)
        └── Print routes          ← HTML → PDF (browser Ctrl+P)
        │
        ▼
Admin Dashboard / Control Centre
```

Node identity is configured in `src/lib/siteConfig.ts`:

```ts
export const NODE_ID = 'umkhandlu-khathide-001';
export const NODE_NAME = 'Umkhandlu — KwaGudlucingo Traditional Council';
export const NODE_PROVINCE = 'KwaZulu-Natal';
export const NODE_MUNICIPALITY = 'Nquthu';
```

Change these 4 lines per council deployment. Everything else is data-driven.

---

## Intelligence API

### Authentication

Every `/api/intelligence/*` request must include:

```
Authorization: Bearer <INTELLIGENCE_API_KEY>
```

Set `INTELLIGENCE_API_KEY` in Vercel environment variables.  
Generate: `openssl rand -hex 32`  
Exchange out-of-band with the Control Centre operator.

**Error responses:**
- `503` — key not configured on this node
- `401` — wrong key

### Base URL

```
https://<vercel-domain>/api/intelligence
```

---

### `GET /node`

Node identity. No Sanity query. Static response from `siteConfig.ts`.

```json
{
  "id": "umkhandlu-khathide-001",
  "name": "Umkhandlu — KwaGudlucingo Traditional Council",
  "authority": "Traditional Council",
  "location": { "province": "KwaZulu-Natal", "municipality": "Nquthu" },
  "contractVersion": "1.0",
  "capabilities": [
    "records", "notices", "participation",
    "evidence", "commercial", "tcrs", "lineage", "operators"
  ],
  "timestamp": "<ISO>"
}
```

Control Centre polls this first to confirm identity and `contractVersion` before consuming capability endpoints.

---

### `GET /health`

Live Sanity connectivity check.

```json
{
  "status": "healthy",
  "recordCount": 42,
  "noticeCount": 18,
  "timestamp": "<ISO>"
}
```

`status` is `"degraded"` (HTTP 500) if the Sanity query fails. Poll on a schedule to monitor node availability.

---

### `GET /records/summary`

Governance records aggregated by status and type.

```json
{
  "total": 42,
  "byStatus": {
    "pending": 5,
    "adopted": 20,
    "approved": 10,
    "resolved": 5,
    "rejected": 2
  },
  "byType": {
    "minutes": 8,
    "resolution": 12,
    "agenda": 1,
    "land-allocation": 4,
    "dispute-resolution": 3,
    "community-decision": 2,
    "policy": 5,
    "report": 6,
    "infrastructure-concern": 1,
    "project-outcome": 1,
    "public-notice": 1,
    "external-resource": 4
  },
  "recent": [
    { "id": "<_id>", "title": "...", "type": "<recordType>", "status": "...", "createdAt": "<ISO>" }
  ],
  "timestamp": "<ISO>"
}
```

`recent` = 10 most recently updated records ordered by `_updatedAt desc`.

---

### `GET /notices/summary`

Community notices (`notice`) + statutory development notices (`developmentNotice`) combined.

```json
{
  "total": 25,
  "byStatus": {
    "draft": 2,
    "published": 16,
    "open": 4,
    "closed": 2,
    "approved": 1,
    "rejected": 0,
    "withdrawn": 0
  },
  "byType": {
    "meeting": 4, "announcement": 6, "resolution": 2, "alert": 1,
    "opportunity": 2, "employment": 1, "smme": 1, "project-update": 1,
    "eia": 2, "rezoning": 1, "land-use": 1, "township": 0,
    "building": 0, "mining": 1, "liquor": 0, "telecom": 1,
    "estate": 1, "liquidation": 0, "pto": 1, "other": 0
  },
  "statutory": {
    "total": 7,
    "open": 3,
    "pendingProof": 2
  },
  "recentActivity": [
    {
      "id": "<_id>", "title": "...", "type": "<noticeType>",
      "status": "...", "isStatutory": false,
      "commentDeadline": null, "createdAt": "<ISO>"
    }
  ],
  "timestamp": "<ISO>"
}
```

- `byStatus.draft/published` — community notices (`notice`). Draft = no date set, published = date defined.
- `byStatus.open/closed/approved/rejected/withdrawn` — development notices (`developmentNotice`).
- `statutory.open` = development notices with `status == "open"` and `commentDeadline > now()`.
- `statutory.pendingProof` = closed development notices where `proofIssued != true`.
- `recentActivity` = 10 most recent across both types, merged and sorted by `_createdAt desc`.

---

### `GET /participation/summary`

Public participation aggregated from campaign `participationLog[]` entries.

> **Note:** Webhook-sourced public comment form submissions are not stored in Sanity — only manually-entered log entries are counted here.

```json
{
  "total": 34,
  "byType": {
    "comment": 15, "objection": 8, "support": 9, "question": 2
  },
  "byRelationship": {
    "resident": 20, "landowner": 6, "business": 4,
    "community": 2, "organisation": 1, "other": 1
  },
  "activeNotices": 3,
  "timestamp": "<ISO>"
}
```

`activeNotices` = development notices currently open for comment (`status == "open"` and `commentDeadline > now()`).

---

### `GET /evidence/summary`

File attachments and weather context across records and notices.

```json
{
  "total": 42,
  "byType": {
    "document": 42, "image": 0, "video": 0, "audio": 0, "other": 0
  },
  "withWeatherContext": 17,
  "timestamp": "<ISO>"
}
```

- `total` = `record.evidence[]` files + `developmentNotice.documents[]` files.
- `withWeatherContext` = records + notices (both `notice` and `developmentNotice`) that have a stored `weatherContext.fetchedAt`.
- File type breakdown is not stored in schema — all attachments counted as `document`.

---

### `GET /commercial/summary`

Campaigns, sponsors, budget, and beneficiary totals.

```json
{
  "projects": {
    "total": 9,
    "byStatus": {
      "draft": 1, "approved": 1, "active": 3, "completed": 4, "reported": 0
    },
    "byHealth": { "green": 3, "amber": 1, "red": 1 },
    "byPhase": {
      "planning": 2, "procurement": 1, "construction": 3,
      "commissioning": 1, "operational": 2
    },
    "totalBudget": 450000,
    "totalBeneficiaries": 1200
  },
  "sponsors": {
    "total": 11,
    "active": 7
  },
  "recent": [
    { "id": "<_id>", "title": "...", "type": "<campaignType>", "status": "...", "health": "...", "updatedAt": "<ISO>" }
  ],
  "timestamp": "<ISO>"
}
```

- `totalBudget` and `totalBeneficiaries` summed from active campaigns only.
- `sponsors.active` = sponsors linked to at least one active campaign.
- `recent` = 10 most recently updated campaigns.
- Campaign types: `ad` (Sponsorship) · `activation` (Activation) · `csr` (Initiative / infrastructure project).
- Health values: `green` (On Track) · `amber` (At Risk) · `red` (Critical).

---

### `GET /tcrs/summary`

Truth Conflict Resolution System — conflict log aggregation.

```json
{
  "total": 6,
  "byResolutionState": {
    "pending": 2,
    "partial": 1,
    "resolved": 2,
    "escalated": 1
  },
  "escalated": 1,
  "averageResolutionDays": 14,
  "timestamp": "<ISO>"
}
```

- `averageResolutionDays` is omitted (not `null`) when no resolved pairs exist.
- Calculated from `detectedAt` → `resolvedAt` on `conflictLog` documents with `resolutionState == "resolved"`.
- Resolution lifecycle: `pending` → `partial` → `resolved` or `escalated`.

---

### `GET /lineage/summary`

Governance lineage — root records, linked chains, Layer 5 print outputs.

```json
{
  "rootRecords": 18,
  "linkedRecords": 24,
  "layer5Outputs": {
    "lineageCertificates": 5,
    "journeyMaps": 5,
    "proofOfPublication": 3
  },
  "timestamp": "<ISO>"
}
```

- `rootRecords` = records with no `parentRecord` and no `originNotice`.
- `linkedRecords` = records with either reference set.
- `lineageCertificates` and `journeyMaps` share the same count — one per notice that has produced records.
- `proofOfPublication` = development notices where `proofIssued == true`.

---

### `GET /operators`

Operator registry for this node. Email and phone are never returned.

```json
{
  "total": 4,
  "active": 3,
  "inactive": 1,
  "byRole": {
    "council-secretary": 1,
    "youth-rep": 1,
    "operating-partner": 1,
    "platform-operator": 1
  },
  "operators": [
    {
      "id": "<_id>",
      "name": "...",
      "operatorRole": "council-secretary",
      "organisation": "Khathide Traditional Council",
      "sanityUserId": "p_abc123",
      "active": true,
      "assignedSince": "2025-01-01",
      "assignedUntil": null,
      "notes": null
    }
  ],
  "timestamp": "<ISO>"
}
```

**Operator roles:**

| Value | Description |
|---|---|
| `council-secretary` | Designated council secretary — creates notices, records, minutes, resolutions |
| `youth-rep` | Youth coordinator — posts, programs, opportunities |
| `induna-rep` | Area headman — area listings, area-specific notices |
| `operating-partner` | Council operating partner (e.g. Unami Foundation) — campaigns, deliverables, SMME directory, community notices |
| `pmu-rep` | PMU / engineer — certifies deliverables, uploads IPC certificates, updates project health |
| `platform-operator` | Technical operator — settings, webhooks, deployments, data exports |

**Admin dashboard integration:**  
`sanityUserId` cross-references against the Sanity Management API audit log to attribute document edits to named operators:

```
GET https://api.sanity.io/v2021-06-07/projects/{projectId}/datasets/{dataset}/history/documents?authors={sanityUserId}
Authorization: Bearer <SANITY_MANAGEMENT_TOKEN>
```

Workflow: poll `/operators` for the registry → fetch Sanity audit log per `sanityUserId` → join on `id` → full activity feed per operator per node.

**Managing operators:**  
Studio → Operator Profiles. Fields: name, role, organisation, Sanity User ID (from sanity.io/manage → Members), active toggle, assigned dates, internal notes.

---

## Export APIs

These use `SANITY_API_READ_TOKEN` passed as a query parameter, not the bearer token.

### `GET /api/campaigns/export`

Full campaign data export as JSON.

```
GET /api/campaigns/export?token=<SANITY_API_READ_TOKEN>
GET /api/campaigns/export?token=TOKEN&status=active
GET /api/campaigns/export?token=TOKEN&type=csr
```

Response shape:

```json
{
  "exportedAt": "<ISO>",
  "summary": {
    "total": 3,
    "totalBeneficiaries": 1200
  },
  "campaigns": [
    {
      "title": "...",
      "slug": "...",
      "campaignType": "csr",
      "status": "active",
      "projectPhase": "construction",
      "description": "...",
      "fundingSource": "...",
      "contractor": "...",
      "contractNumber": "...",
      "consultingEngineer": "...",
      "beneficiaries": 100,
      "localSMMEs": 12,
      "impactSummary": "...",
      "deliverablesCertified": [
        { "task": "...", "status": "certified", "percentageComplete": 100, "certifiedBy": "...", "certificationDate": "..." }
      ],
      "totalDeliverables": 5,
      "deliverableProgress": 60,
      "smmeDirectory": [
        { "name": "...", "service": "...", "owner": "...", "verified": true }
      ],
      "communityNote": [
        {
          "date": "...", "issuedBy": "...", "message": "...",
          "location": "...", "attendance": 45,
          "weatherContext": { "condition": "Partly Cloudy", "temperatureCelsius": 22, "rainfallMm": 0 }
        }
      ],
      "progressLog": [{ "date": "...", "update": "..." }],
      "sponsor": { "name": "...", "sponsorType": "...", "website": "..." },
      "contactPerson": { "firstName": "...", "lastName": "...", "role": "..." },
      "relatedAreas": [{ "name": "...", "slug": "..." }],
      "relatedProgram": { "title": "...", "slug": "..." },
      "noticeCount": 3,
      "opportunityCount": 2,
      "developmentNoticeCount": 1,
      "verifications": [
        {
          "_id": "...", "field": "...", "displayTruth": "...",
          "resolutionState": "resolved", "detectedAt": "...", "resolvedAt": "...",
          "claims": [{ "source": "...", "value": "...", "date": "...", "evidenceSummary": "..." }]
        }
      ],
      "verificationCount": 1,
      "communityNoteCount": 3,
      "photoCount": 12
    }
  ]
}
```

`communityNote[].weatherContext` includes `location` and `attendance` — these are real field events with attendant registers, not broadcasts.

### `GET /api/governance/export`

Full governance lineage export as JSON — all notices with their produced records, follow-up notices, and evidence chains.

```
GET /api/governance/export?token=<SANITY_API_READ_TOKEN>
GET /api/governance/export?token=TOKEN&area=mndozo
```

Response shape:

```json
{
  "exported": "<ISO>",
  "total": 5,
  "lineage": [
    {
      "_id": "...",
      "title": "...",
      "slug": "...",
      "noticeType": "meeting",
      "date": "...",
      "relatedArea": { "name": "...", "slug": "..." },
      "originNotice": null,
      "followUpNotices": [
        {
          "_id": "...", "title": "...", "slug": "...", "noticeType": "meeting", "date": "...",
          "producedRecords": [{ "_id": "...", "title": "...", "recordType": "minutes", "status": "adopted", "evidence": [] }]
        }
      ],
      "producedRecords": [
        {
          "_id": "...", "title": "...", "recordType": "resolution", "date": "...",
          "status": "adopted", "summary": "...", "verificationNote": null,
          "evidence": [{ "title": "...", "url": "..." }],
          "childRecords": []
        }
      ]
    }
  ]
}
```

Only notices that have produced records or follow-up notices are included. `?area=<slug>` filters to notices linked to a specific area listing.

---

## Print Routes

All print routes return print-optimised HTML. No authentication required except the campaign print route. Open in browser → `Ctrl+P` → Save as PDF. No headless Chrome or Puppeteer needed.

| Route | Auth | Paper | Purpose |
|---|---|---|---|
| `/notices/certificate/[id]` | Public | A4 portrait | Proof of Publication — court-submittable statutory notice certificate |
| `/notices/lineage/[slug]` | Public | A4 portrait | Governance Record Lineage Certificate — evidence trail with record chain |
| `/notices/journey/[slug]` | Public | A4 landscape | Governance Journey Map — visual institutional decision trail |
| `/api/campaigns/export/print` | `?token=READ_TOKEN` | A4 portrait | Campaign Field Report — info board, deliverables, community notices with weather/attendance/location, progress log |

### Campaign Print Endpoint

```
GET /api/campaigns/export/print?token=<SANITY_API_READ_TOKEN>
GET /api/campaigns/export/print?token=TOKEN&slug=buffalo-river-abstraction-works-ward-7
GET /api/campaigns/export/print?token=TOKEN&status=active
GET /api/campaigns/export/print?token=TOKEN&type=csr
```

Each campaign section includes:
- Project info board (sponsor, funding, contractor, engineer, dates, areas, labour, SMMEs)
- Deliverables table with % certified, certified-by, certification date
- Community notices — each with 📍 location, 👥 attendance, 🌤 weather context
- Progress log (newest first)
- Impact summary
- Health badge colour-coded (green/amber/red)

### Lineage Certificate (`/notices/lineage/[slug]`)

- Originating notice block: type, date, area, weather (live-fetched from Open-Meteo if not yet stored)
- Record chain: all records produced by the notice and its follow-up meetings
- Evidence file counts
- Revision ID (`_rev`) for tamper evidence
- Auto-patches `weatherContext` onto the notice document if not yet stored

### Journey Map (`/notices/journey/[slug]`)

- Same weather resolution as lineage certificate
- Visual horizontal timeline of the governance journey
- A4 landscape for wall display or filing

### Proof of Publication (`/notices/certificate/[id]`)

- Uses Sanity `_id` (not slug) — get from Studio URL bar after `/developmentNotice;`
- Legal mandate, reference number, applicant, publish date, comment deadline
- Map pin if geopoint is set
- Linked documents list
- QR-equivalent public URL for verification

---

## Weather Context

Weather is auto-captured from Open-Meteo (historical or forecast) and stored on documents. It appears on:

| Document | Where stored | How captured |
|---|---|---|
| `notice` | `weatherContext` object | `POST /api/weather-patch` on page visit |
| `record` | `weatherContext` object | `POST /api/weather-patch` on page visit |
| `campaign.communityNote[]` | `weatherContext` per entry | `POST /api/weather-patch` on page visit |

`weatherContext` fields: `type` (historical/forecast) · `condition` · `temperatureCelsius` · `tempMinCelsius` · `tempMaxCelsius` · `rainfallMm` · `windKmh` · `humidityPercent` · `uvIndex` · `fetchedAt`.

Weather placement semantics:
- **Notices** — strip in page header (primary event metadata)
- **Records** — full card in Lineage tab (provenance of the meeting that produced the record)
- **Campaign community notices** — inline per notice entry (each is a real field event)
- **Print pages** — amber originating notice block

---

## Operator Model

Each node has multiple operators with distinct roles. All share the same Sanity Studio login on the free tier. The `operatorProfile` document type tracks who has access and what their role is.

### Roles

| Role | Who | Responsibilities |
|---|---|---|
| `council-secretary` | Designated council secretary | Notices, records, minutes, resolutions, leadership profiles |
| `youth-rep` | Youth coordinator | Posts, programs, opportunities, gallery |
| `induna-rep` | Area headman | Area listings, area-specific notices |
| `operating-partner` | Council operating partner (e.g. Unami Foundation) | Campaigns, deliverables, SMME directory, community notices, progress logs |
| `pmu-rep` | PMU / consulting engineer | Certifies deliverables, uploads IPC certificates, updates project health |
| `platform-operator` | Technical operator | Settings, webhooks, deployments, data exports |

### Content Authority

- Governance content (notices, resolutions, records) — authority belongs to the **council**, created by `council-secretary`
- Infrastructure project tracking — `operating-partner` and `pmu-rep`
- Technical platform — `platform-operator` (Unami Digital)
- `platform-operator` does NOT create governance content

### Admin Dashboard Activity Attribution

1. Each operator has a `sanityUserId` (from sanity.io/manage → Members, format: `p_abc123`)
2. Admin dashboard polls `GET /api/intelligence/operators` for the registry
3. Admin dashboard calls Sanity Management API with a management token:
   ```
   GET https://api.sanity.io/v2021-06-07/projects/{projectId}/datasets/{dataset}/history/documents?authors={sanityUserId}
   ```
4. Join on `sanityUserId` → full named activity feed per operator per node

---

## Connecting a Node to the Control Centre

1. Add `INTELLIGENCE_API_KEY` to Vercel environment variables
2. Redeploy (key takes effect on next cold start)
3. Provide key + base URL to Control Centre operator out-of-band
4. Control Centre polls `GET /node` to confirm identity + `contractVersion`
5. Polls `GET /health` on schedule
6. Calls capability endpoints on demand

For a new council deployment, update `src/lib/siteConfig.ts` (4 lines: `NODE_ID`, `NODE_NAME`, `NODE_PROVINCE`, `NODE_MUNICIPALITY`) and set a new `INTELLIGENCE_API_KEY` in Vercel.

---

## Versioning

`contractVersion: "1.0"` is returned on every `/node` response.  
Breaking changes increment the major version. The Control Centre checks this field before consuming capability endpoints.

---

## Related Docs

- [README.md](./README.md) — Full platform overview
- [RECORDS.md](./RECORDS.md) — Records architecture: philosophy, six record roles, event context, weather, schema, frontend
- [TCRS.md](./TCRS.md) — Truth Conflict Resolution System
- [ROLES.md](./ROLES.md) — Content ownership model and operational roles
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Council deployment runbook
- [SEEDING.md](./SEEDING.md) — Seed data architecture
- [PLAYBOOK.md](./PLAYBOOK.md) — Strategic project playbook
