# Governance Node API — Contract v1.0

Umkhandlu exposes a read-only intelligence API that allows an external Control Centre platform to query live governance data without direct Sanity access.

All endpoints are under `/api/intelligence/` and require a bearer token.

---

## Authentication

Every request must include:

```
Authorization: Bearer <INTELLIGENCE_API_KEY>
```

The key is set in Vercel environment variables as `INTELLIGENCE_API_KEY`.  
Generate with: `openssl rand -hex 32`  
Exchange out-of-band with the Control Centre operator (Phase 18B).

**Error responses:**
- `503` — key not configured on this node
- `401` — wrong key

---

## Base URL

```
https://<your-vercel-domain>/api/intelligence
```

---

## Endpoints

### `GET /node`

Node identity. No Sanity query. Static response.

```json
{
  "id": "umkhandlu-khathide-001",
  "name": "Umkhandlu — KwaGudlucingo Traditional Council",
  "authority": "Traditional Council",
  "location": { "province": "KwaZulu-Natal", "municipality": "Nquthu" },
  "contractVersion": "1.0",
  "capabilities": [
    "records", "notices", "participation",
    "evidence", "commercial", "tcrs", "lineage"
  ],
  "timestamp": "<ISO>"
}
```

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

`status` is `"degraded"` (HTTP 500) if the Sanity query fails.

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

---

### `GET /notices/summary`

Community notices + statutory development notices.

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

`statutory.open` = development notices with `status == "open"` and `commentDeadline > now()`.  
`statutory.pendingProof` = closed notices where `proofIssued != true`.

---

### `GET /participation/summary`

Public participation aggregated from campaign `participationLog[]` entries.

> **Note:** Webhook-sourced public comment form submissions are not stored in Sanity — only manually-entered log entries are counted here. `commentsReceived` on `developmentNotice` is not auto-incremented.

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

`activeNotices` = development notices currently open for comment.

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

`total` = `record.evidence[]` files + `developmentNotice.documents[]` files.  
`withWeatherContext` = records + notices that have a stored `weatherContext.fetchedAt`.  
Note: file type breakdown is not stored in schema — all attachments are counted as `document`.

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

`totalBudget` and `totalBeneficiaries` are summed from active campaigns only.  
`sponsors.active` = sponsors linked to at least one active campaign.

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

`averageResolutionDays` is omitted (not `null`) when no resolved pairs exist.  
Resolution states match the `conflictLog` schema: `pending` → `partial` → `resolved` or `escalated`.

---

### `GET /lineage/summary`

Governance lineage — root records, linked chains, Layer 5 outputs.

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

`rootRecords` = records with no `parentRecord` and no `originNotice`.  
`linkedRecords` = records with either reference set.  
`lineageCertificates` and `journeyMaps` share the same count — one per notice that has produced records.  
`proofOfPublication` = development notices where `proofIssued == true`.

---

## Adding This Node to the Control Centre

1. Add `INTELLIGENCE_API_KEY` to Vercel environment variables
2. Redeploy (or the key takes effect on next cold start)
3. Provide the key + base URL to the Control Centre operator out-of-band
4. Control Centre polls `/node` first to confirm identity + `contractVersion`
5. Then polls `/health` on a schedule; capability endpoints on demand

---

## Versioning

`contractVersion: "1.0"` is returned on every `/node` response.  
Breaking changes increment the major version. The Control Centre checks this field before consuming capability endpoints.

---

## Related Docs

- [README.md](./README.md) — Full platform overview
- [RECORDS.md](./RECORDS.md) — Records architecture
- [TCRS.md](./TCRS.md) — Truth Conflict Resolution System
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Council deployment runbook
