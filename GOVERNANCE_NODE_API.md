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
  "location": { "province": "KwaZulu-Natal", "municipality": "Buffalo City" },
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
  "status": "healthy",          // or "degraded"
  "recordCount": 42,
  "noticeCount": 18,
  "timestamp": "<ISO>"
}
```

---

### `GET /records/summary`

Governance records aggregated by status and type.

```json
{
  "total": 42,
  "byStatus": {
    "pending": 5, "adopted": 20, "approved": 10,
    "resolved": 5, "rejected": 2
  },
  "byType": {
    "minutes": 8, "resolution": 12, "land-allocation": 4,
    "dispute-resolution": 3, "policy": 5, "report": 6,
    "external-resource": 4
  },
  "recent": [ /* 10 most recent: _id, title, recordType, status, date */ ],
  "timestamp": "<ISO>"
}
```

---

### `GET /notices/summary`

Community notices + statutory development notices.

```json
{
  "community": {
    "total": 18,
    "byType": { "meeting": 4, "announcement": 6, "resolution": 2, "alert": 1, "opportunity": 2, "employment": 1, "smme": 1, "project-update": 1 }
  },
  "statutory": {
    "total": 7,
    "open": 3,
    "pendingProof": 2,
    "byType": { "eia": 2, "spluma": 1, "estate": 1, "liquidation": 0, "pto": 1, "mining": 1, "cell-tower": 1 }
  },
  "recentActivity": [ /* 10 combined: _id, _type, title, noticeType/developmentType, publishedAt */ ],
  "timestamp": "<ISO>"
}
```

---

### `GET /participation/summary`

Public participation aggregated from campaign `participationLog[]` entries.

> **Note:** Webhook-sourced public comment form submissions are not stored in Sanity — only manually-entered log entries are counted here. `commentsReceived` on `developmentNotice` is not auto-incremented.

```json
{
  "total": 34,
  "byCommentType": { "comment": 15, "objection": 8, "support": 9, "question": 2 },
  "byRelationship": { "resident": 20, "landowner": 6, "business": 4, "ngo": 2, "other": 2 },
  "timestamp": "<ISO>"
}
```

---

### `GET /evidence/summary`

File attachments and weather context across records and notices.

```json
{
  "attachments": {
    "recordEvidence": 28,
    "developmentNoticeDocuments": 14,
    "total": 42
  },
  "weatherContext": {
    "records": 12,
    "notices": 5,
    "total": 17
  },
  "timestamp": "<ISO>"
}
```

---

### `GET /commercial/summary`

Campaigns, sponsors, budget, and beneficiary totals.

```json
{
  "campaigns": {
    "total": 9,
    "byStatus": { "active": 3, "completed": 4, "planned": 2 },
    "byHealth": { "on-track": 3, "at-risk": 1, "delayed": 1 },
    "byPhase": { "planning": 2, "execution": 3, "closeout": 2, "completed": 2 }
  },
  "activeTotals": {
    "budget": 450000,
    "beneficiaries": 1200
  },
  "sponsors": {
    "total": 11,
    "active": 7
  },
  "recent": [ /* 10: _id, title, campaignType, status, health */ ],
  "timestamp": "<ISO>"
}
```

---

### `GET /tcrs/summary`

Truth Conflict Resolution System — conflict log aggregation.

```json
{
  "total": 6,
  "byResolutionState": {
    "unverified": 2, "verified": 1, "disputed": 1,
    "escalated": 1, "resolved": 1
  },
  "averageResolutionDays": 14,   // null if no resolved pairs
  "timestamp": "<ISO>"
}
```

---

### `GET /lineage/summary`

Governance lineage — root records, linked chains, Layer 5 outputs.

```json
{
  "rootRecords": 18,
  "linkedRecords": 24,
  "lineageCertificates": 5,   // notices with produced records
  "journeyMaps": 5,           // same count — one per notice with records
  "proofOfPublicationIssued": 3,
  "timestamp": "<ISO>"
}
```

---

## Adding This Node to the Control Centre

1. Add `INTELLIGENCE_API_KEY` to Vercel environment variables
2. Redeploy (or the key takes effect on next cold start)
3. Provide the key + base URL to the Control Centre operator out-of-band
4. Control Centre polls `/node` first to confirm identity + contractVersion
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
