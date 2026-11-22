# GIS Integration — Governance Node

**Last updated:** Phase 1 audit — 2026-11-22
**Canonical programme document:** `gis-umkhandlu/GIS_CONTROL_CENTRE_IMPLEMENTATION_PLAN.md`
**Status:** Reflects actual implementation at commit `8ee1a5e` (trunk). Supersedes all earlier versions.

---

## Architecture Summary

The Governance Node (GN) is authoritative for governance records, notices, statutory workflows and public presentation. It does not operate a spatial database. Spatial intelligence, dataset management and risk/compliance are the responsibility of the Control Centre (CC).

```
Sanity CMS (content store)
    │  coordinate fields on documents
    ▼
Governance Node (Next.js)
    ├── /api/intelligence/spatial   ← GeoRef API (bearer token)
    ├── /api/intelligence/commercial/summary ← campaign geoRefs (bearer token)
    ├── /api/weather-patch          ← weather capture (server-side write token)
    ├── /development-notices/[slug] ← fetches ward boundary + site boundary from CC
    └── /map                        ← fetches 16 spatial layers from CC
            │
            ▼
    Control Centre spatial APIs
    ├── /api/spatial/map-layers     ← 16-layer catalogue
    ├── /api/spatial/wards          ← 55 MDB 2026 ward boundaries
    ├── /api/spatial/notice-context ← admin boundaries + proximity layers
    └── /api/spatial/features/[id]  ← individual published feature
```

---

## Coordinate-Bearing Record Inventory

All coordinates are stored in Sanity. The GN does not hold a spatial database.

### 1. `listing` (type: `area`)

| Field | Type | Role | Origin | Precision |
|---|---|---|---|---|
| `geopoint` | Sanity `geopoint` (`{lat, lng}`) | Area centroid | Operator-entered | None declared — legacy field |
| `boundary` | `text` (GeoJSON polygon string) | Area polygon | CC approved import only | `boundaryPermission` field |
| `spatialFeatureId` | `string` (UUID) | Link to CC published feature | Operator-entered after CC verification | Validated UUID format |
| `mdbWardId` | `string` | MDB ward identifier | Set from MDB dataset | Do not edit manually |
| `wardNumber` | `number` | Ward number | Operator-entered | — |

`listing.geopoint` is described in the schema as a "legacy operator-entered coordinate" — it is not shown as an authoritative map pin. The `spatialFeatureId` is the preferred reference for verified geometry.

`listing.boundary` is populated only from CC approved imports. `boundarySource` and `boundaryDate` are required when set. `boundaryPermission` defaults to `reference`.

### 2. `developmentNotice`

| Field | Type | Role | Origin | Precision |
|---|---|---|---|---|
| `geopoint` | Sanity `geopoint` | Site location | Operator-entered | `locationPrecision` field |
| `locationPrecision` | `string` | Declared precision | Operator-entered | `verified` / `operator-provided` / `approximate` / `locality-only` |
| `siteFeatureId` | `string` (UUID) | Link to CC staged site boundary | Operator-entered after CC assessment | — |
| `ccNoticeRef` | `string` (UUID) | Link to CC notice record | Auto-patched by `registerNoticeWithCC` server action | — |
| `relatedArea` | reference → `listing` | Area association | Operator-entered | Inherits area geopoint |

`locationPrecision` is declared content metadata — it is not independent verification. The `siteFeatureId` field is populated only after the site geometry has been assessed, staged, validated and published through the CC. `ccNoticeRef` is patched back by the `registerNoticeWithCC` server action when a CC notice is created.

### 3. `campaign`

| Field | Type | Role | Origin | Precision |
|---|---|---|---|---|
| `siteGeopoint` | Sanity `geopoint` | Exact project site | Operator-entered | None declared |
| `geographicAssociations[].area` | reference → `listing` | Area associations (multiple levels) | Operator-entered | Inherits area geopoint |
| `relatedAreas[]` | reference → `listing` | Target areas | Operator-entered | Inherits area geopoint |

`siteGeopoint` is only present on `campaignType == 'csr'` campaigns. `geographicAssociations` supports multiple areas at different levels (ward, municipality, TA, isigodi).

### 4. `notice`

| Field | Type | Role | Origin | Precision |
|---|---|---|---|---|
| `relatedArea` | reference → `listing` | Area association | Operator-entered | Inherits area geopoint |
| `weatherContext` | `environmentalContext` object | Weather at event date | Auto-captured via `/api/weather-patch` | — |

No direct geopoint on `notice`. Coordinates are always inherited from `relatedArea.geopoint`.

### 5. `record`

| Field | Type | Role | Origin | Precision |
|---|---|---|---|---|
| `relatedArea` | reference → `listing` | Area association | Operator-entered | Inherits area geopoint |
| `weatherContext` | `environmentalContext` object | Weather at record date | Auto-captured via `/api/weather-patch` | — |

No direct geopoint on `record`. Coordinates are always inherited from `relatedArea.geopoint`.

### 6. `campaign.communityNote[]`

| Field | Type | Role | Origin | Precision |
|---|---|---|---|---|
| `weatherContext` | `environmentalContext` object | Weather at community event date | Auto-captured via `/api/weather-patch` | — |

Community notices within campaigns have their own `weatherContext` per entry. Weather is captured on page visit. No direct geopoint on community note entries — weather coordinates are resolved from the campaign's area associations (see Weather section below).

### 7. `listing` (non-area types: school, clinic, business, etc.)

| Field | Type | Role | Origin | Precision |
|---|---|---|---|---|
| `geopoint` | Sanity `geopoint` | Facility location | Operator-entered | None declared |
| `spatialFeatureId` | `string` (UUID) | Link to CC published feature | Operator-entered after CC verification | — |

The `communityMapSectionFragment` GROQ query filters listings to only those with a defined `spatialFeatureId`. The `CommunityMapLeaflet` component uses `spatialFeatureId` to fetch the verified geometry from the CC. The `geopoint` field is present but not used as an authoritative map pin.

---

## `/api/intelligence/spatial` — GeoRef Contract

**Route:** `GET /api/intelligence/spatial`
**Auth:** Bearer token (`INTELLIGENCE_API_KEY`)
**Source:** [`src/app/api/intelligence/spatial/route.ts`](src/app/api/intelligence/spatial/route.ts)

### What it returns

```json
{
  "municipalities": [...],
  "wards": [...],
  "geoRefs": [
    {
      "recordId": "<Sanity _id>",
      "recordType": "record" | "notice" | "project",
      "label": "<title>",
      "timestamp": "<ISO>",
      "latitude": 0.0,
      "longitude": 0.0,
      "coordinateSource": "Sanity developmentNotice.geopoint",
      "coordinateRole": "site" | "area-reference",
      "locationPrecision": "approximate" | null,
      "district": "Amajuba",
      "municipality": "<string>",
      "ward": "Ward N"
    }
  ],
  "generatedAt": "<ISO>"
}
```

### Resolution rules (implemented and verified)

| Record type | Priority 1 | Priority 2 | `coordinateRole` |
|---|---|---|---|
| `record` | `relatedArea.geopoint` | — | `area-reference` |
| `developmentNotice` | `geopoint` (own site) | `relatedArea.geopoint` | `site` / `area-reference` |
| `campaign` | `siteGeopoint` | `geographicAssociations[0].area.geopoint` | `site` / `area-reference` |

**GROQ implementation:** Uses `coalesce()` for coordinate selection and `select()` for `coordinateSource` and `coordinateRole`. `locationPrecision` is preserved from the notice's own field when using site coordinates; set to `null` when falling back to area reference.

**Zero-coordinate handling:** `toGeoRef()` checks `Number.isFinite(row.lat) && Number.isFinite(row.lng)`. Valid zero coordinates (`lat: 0, lng: 0`) are preserved — they pass `isFinite`. Null coordinates are filtered out. This is verified by the test in `route.test.ts`.

**Missing coordinates:** Records with no coordinates in either field are excluded from `geoRefs` entirely. There is no fallback to ward or district centroids.

**Pagination:** Returns up to 20 records per type (60 total). No pagination beyond 20 per type. This is a known gap — Phase 2 requirement.

### Test coverage

`src/app/api/intelligence/spatial/route.test.ts` verifies:
- `coordinateSource`, `coordinateRole`, `locationPrecision` are preserved in output
- Valid zero coordinates (`lat: 0, lng: 0`) are not discarded
- `coordinateSource` and `coordinateRole` GROQ projections are present in the query

---

## `/api/intelligence/commercial/summary` — Campaign GeoRef Gap

**Route:** `GET /api/intelligence/commercial/summary`
**Source:** `src/app/api/intelligence/commercial/summary/route.ts`

This route includes `geoRefLat`/`geoRefLng` for recent campaigns using the same `coalesce(siteGeopoint, geographicAssociations[0].area.geopoint)` pattern. However, it does **not** include `coordinateSource` or `coordinateRole` in its output. The CC consumer of this endpoint cannot distinguish site coordinates from area-reference coordinates.

**Finding:** This is a GeoRef contract inconsistency. The commercial summary endpoint omits provenance fields that `/api/intelligence/spatial` preserves. Documented for Phase 2 remediation.

---

## Weather Context

### `environmentalContext` schema

```ts
{
  type: 'forecast' | 'historical';
  condition: string;
  temperatureCelsius: number;
  tempMinCelsius: number;
  tempMaxCelsius: number;
  rainfallMm: number;
  windKmh: number;
  humidityPercent: number;
  uvIndex: number;
  fetchedAt: string; // ISO timestamp
}
```

Stored on: `notice.weatherContext`, `record.weatherContext`, `campaign.communityNote[].weatherContext`.

### Coordinate resolution per record type

| Record type | Coordinate source | Fallback | `coordinateRole` used |
|---|---|---|---|
| `notice` | `relatedArea.geopoint` | `NODE_GEOPOINT` (Newcastle) | `area-reference` |
| `record` | `relatedArea.geopoint` | `NODE_GEOPOINT` (Newcastle) | `area-reference` |
| `developmentNotice` | **None — no weather captured** | — | — |
| `campaign.communityNote[]` | **Not resolved at page render** | — | — |

### Confirmed weather gap: `developmentNotice`

The development notice detail page (`/development-notices/[slug]/page.tsx`) does **not** call `fetchWeather` or `/api/weather-patch`. It does not display weather context. The `developmentNotice` schema has a `weatherContext` field (via `environmentalContext`) but it is never populated.

**Code evidence:** `devNoticeQuery` in the page does not fetch `weatherContext`. `resolveNoticeSpatial()` does not call `fetchWeather`. No `EventContext` component is rendered on the dev notice page.

**Architectural note:** Whether a development notice should have weather context is a Phase 2 decision. A development notice is a statutory application, not a meeting event. Weather context may be appropriate for the site (e.g. for EIA seasonal context) but the current design intentionally omits it. This gap must be explicitly decided in Phase 2 before implementation.

### Confirmed weather gap: `campaign.communityNote[]`

Community notes within campaigns have `weatherContext` stored per entry. However, the campaign detail page (`/campaigns/[slug]/page.tsx`) does **not** call `fetchWeather` or `/api/weather-patch` for community notes. The `weatherContext` on community notes is displayed if already stored in Sanity, but it is never freshly fetched on page visit.

**Code evidence:** `campaignDetailQuery` fetches `communityNote[].weatherContext` but the page component has no `resolveWeather` call. The `NoticeCardMeta` component renders stored `weatherContext` only.

**How community note weather gets populated:** The campaign print route (`/api/campaigns/export/print`) and export route (`/api/campaigns/export`) also only read stored `weatherContext` — they do not trigger fresh fetches. There is no mechanism to auto-capture weather for community notes. This is a gap.

### `notice` and `record` weather resolution (verified)

Both `/notices/[slug]/page.tsx` and `/records/[slug]/page.tsx` use an identical `resolveWeather()` helper:

```ts
const lat = typeof geo?.lat === 'number' && Number.isFinite(geo.lat)
  ? geo.lat : NODE_GEOPOINT.lat;
const lng = typeof geo?.lng === 'number' && Number.isFinite(geo.lng)
  ? geo.lng : NODE_GEOPOINT.lng;
```

Where `geo = record.relatedArea?.geopoint`. If `relatedArea` is not set or has no geopoint, the fallback is `NODE_GEOPOINT = { lat: -27.7569, lng: 29.9318 }` (Newcastle).

**Notices (future date):** Always re-patch on every visit — forecast updates hourly.
**Notices (past date):** Patch once, then locked (`!hasStoredContext` guard).
**Records:** Always past dates — patch once and lock permanently.

The lineage and journey print pages (`/notices/lineage/[slug]` and `/notices/journey/[slug]`) use the same `relatedArea.geopoint` → `NODE_GEOPOINT` fallback pattern. They do not use `NODE_GEOPOINT` if `geo?.lat` is falsy (zero would be treated as falsy — see finding below).

### Finding: falsy zero-coordinate guard in weather resolution

In `resolveWeatherLine()` (lineage and journey pages):

```ts
if (!notice.date || !geo?.lat || !geo?.lng) return null;
```

This guard treats `lat: 0` or `lng: 0` as missing. For Amajuba coordinates (approximately -28°S, 30°E) this is not a practical problem — no valid Amajuba coordinate is zero. However, it is a latent inconsistency with the spatial API's `Number.isFinite()` guard which correctly preserves zero. Documented for Phase 2.

The main notice and record pages use `Number.isFinite()` correctly and do not have this issue.

---

## Independent Coordinate Resolution — Consumer Audit

| Consumer | Resolution method | Uses `/api/intelligence/spatial`? | Site/area role preserved? | Finding |
|---|---|---|---|---|
| `/notices/[slug]` | `relatedArea.geopoint` → `NODE_GEOPOINT` | No | Area-reference only | Correct for community notices |
| `/records/[slug]` | `relatedArea.geopoint` → `NODE_GEOPOINT` | No | Area-reference only | Correct for records |
| `/notices/lineage/[slug]` | `relatedArea.geopoint` (no fallback if falsy) | No | Area-reference only | Falsy-zero guard (latent) |
| `/notices/journey/[slug]` | `relatedArea.geopoint` (no falsy fallback) | No | Area-reference only | Falsy-zero guard (latent) |
| `/development-notices/[slug]` | `notice.geopoint` directly (for map) | No | Site — passed directly to `NoticeStatutoryMap` | Correct — uses own geopoint |
| `GovernanceMapLeaflet` (`/map`) | Ward boundary centroid from CC ward GeoJSON | No | Labelled "Ward reference only — not a verified site location" | Correct — explicitly approximate |
| `NoticeStatutoryMap` | `lat`/`lng` props from `notice.geopoint` | No (calls CC `/api/spatial/notice-context`) | Site — passed as props | Correct |
| `ListingSpatialContext` | `spatialFeatureId` → CC `/api/spatial/features/[id]` | No | Feature geometry from CC | Correct |
| `CommunityMapLeaflet` | `spatialFeatureId` → CC `/api/spatial/features/[id]` | No | Feature geometry from CC | Correct |
| `/api/intelligence/spatial` | GROQ `coalesce()` + `select()` | Self | Yes — `coordinateRole` + `coordinateSource` | Correct |
| `/api/intelligence/commercial/summary` | GROQ `coalesce()` | No | No — provenance fields absent | Gap — Phase 2 |
| `registerNoticeWithCC` server action | `notice.geopoint.lat/lng` passed directly | No | Site — passed as `lat`/`lng` to CC | Correct |

**Key finding:** No consumer uses ward or district centroids as site locations. `GovernanceMapLeaflet` uses ward boundary centroids but explicitly labels them as approximate ward references. The `/api/intelligence/spatial` endpoint is the only consumer that formally preserves `coordinateRole` and `coordinateSource` in its output. The commercial summary endpoint is the only consumer that silently drops provenance.

---

## Public Map (`/map`) — Spatial Layer Architecture

The public map (`GovernanceMapLeaflet`) fetches all 16 spatial layers from the CC via `useSpatialMapLayers`. Ward/municipality/district boundary toggles are top-right (`LayerToggleBar`). Record markers are placed at ward boundary centroids (labelled as approximate). No direct geopoint markers are rendered on the public map.

**CC base URL:** Hardcoded fallback `https://unami-platform-core-umkhandlu.vercel.app` in `src/app/(frontend)/map/page.tsx`. Operator must set `CONTROL_CENTRE_URL` env var on GN Vercel project (OA-02).

---

## Development Notice Spatial Map (`NoticeStatutoryMap`)

The dev notice page passes `notice.geopoint.lat/lng` directly to `NoticeStatutoryMapClient`. The map renders:
- Site marker at the notice's own geopoint
- 500m proximity circle (for liquor/mining notice types)
- Ward boundary polygon (fetched from CC `/api/spatial/wards`)
- Site boundary polygon (fetched from CC `/api/spatial/features/[siteFeatureId]` if set)
- Spatial layers from CC `/api/spatial/notice-context`

The `SpatialBlock` component guards against missing/invalid geopoint:
```ts
if (!geopoint || !Number.isFinite(geopoint.lat) || !Number.isFinite(geopoint.lng)) return null;
```
If no valid geopoint, the spatial map section is not rendered.

---

## Listing Spatial Context (`ListingSpatialContext`)

Directory listings with a `spatialFeatureId` render a `ListingSpatialContext` map that fetches the verified geometry from CC `/api/spatial/features/[id]`. The `CommunityMapLeaflet` section component also filters to listings with `spatialFeatureId` only. Listings without a `spatialFeatureId` do not appear on the community map.

---

## CC Notice Registration (`registerNoticeWithCC`)

The `registerNoticeWithCC` server action (`src/actions/registerNoticeWithCC.ts`) registers a development notice with the CC. It passes `lat`/`lng` from `notice.geopoint` directly. On success, it patches `ccNoticeRef` back onto the Sanity document. This action is not automatically triggered — it must be called explicitly (no webhook automation yet — gap G-07).

---

## Coordinate Discrepancy: Khethokuhle Primary School

A coordinate discrepancy was identified between two sources for Khethokuhle Primary School:

| Source | Coordinates | Format |
|---|---|---|
| Giga Schools dataset (CC spatial catalogue) | `[30.1831, -27.7626]` | GeoJSON `[lng, lat]` |
| Sanity operator-entered `listing.geopoint` | `lat: -27.818, lng: 30.047` | Sanity `{lat, lng}` |

Approximate separation: ~14.7 km.

**Current system capability:**
- The system cannot identify multiple source locations for the same feature
- It cannot compare spatial separation between sources
- It cannot preserve source identifiers for the same real-world feature
- It cannot flag a discrepancy for operator review
- The `spatialFeatureId` field on `listing` links to one CC feature — it does not support multiple competing sources

**Representation in codebase:** The discrepancy is not represented in any test, data governance record, or code comment. It exists only in programme documentation.

**Required capability (Phase 2+):** A data integrity mechanism to detect, record and flag coordinate discrepancies between Sanity operator-entered points and CC spatial catalogue features for the same listing.

---

## Known Gaps and Phase Dependencies

| Gap | Severity | Phase |
|---|---|---|
| `developmentNotice` weather context — never captured | Medium | Phase 2 decision, Phase 3 implementation |
| `campaign.communityNote[]` weather — never auto-captured | Medium | Phase 3 |
| `/api/intelligence/commercial/summary` — no `coordinateRole`/`coordinateSource` | Medium | Phase 2 |
| `/api/intelligence/spatial` — no pagination beyond 20 per type | Low | Phase 2 |
| Falsy-zero guard in lineage/journey weather resolution | Low | Phase 2 |
| Khethokuhle coordinate discrepancy — no detection mechanism | Medium | Phase 2+ |
| `registerNoticeWithCC` — not auto-triggered (no webhook) | Medium | Phase 5 |
| `telecom` and `building` notice layer configs missing in CC | Medium | Phase 5 |
| `CONTROL_CENTRE_URL` not set on GN Vercel | High | Operator action OA-02 |

---

## What Is Not Implemented

- MCP GIS server — does not exist (Phase 4)
- GratisGIS — not deployed (Phase 6)
- GeoLibre — not deployed (Phase 6)
- Automatic weather capture for development notices
- Automatic weather capture for campaign community notes
- Coordinate discrepancy detection
- GN→CC notice auto-link via webhook
- Ward demographics dataset (publication status unknown)
- `commentsReceived` auto-increment

---

## CRS and Coordinate Order

All coordinates in the GN are stored in WGS84 (EPSG:4326). Sanity `geopoint` uses `{lat, lng}` (latitude first). GeoJSON uses `[lng, lat]` (longitude first). The `fetchWeather` function signature is `fetchWeather(date, lat, lng)` — latitude first. The CC spatial APIs return GeoJSON `[lng, lat]` order. No coordinate order inconsistencies have been identified in the current implementation.

---

## Related Documentation

| Document | Location |
|---|---|
| Master programme plan | `gis-umkhandlu/GIS_CONTROL_CENTRE_IMPLEMENTATION_PLAN.md` |
| Spatial baseline | `gis-umkhandlu/SPATIAL_BASELINE.md` |
| CC GIS integration | `unami-platform-core/docs/context/GIS_INTEGRATION.md` |
| Spatial context research | `unami-platform-core/docs/context/SPATIAL_CONTEXT_RESEARCH_AUDIT.md` |
| GN API contract | `Umkhandlu/GOVERNANCE_NODE_API.md` |
| GN architecture | `Umkhandlu/ARCHITECTURE.md` |
