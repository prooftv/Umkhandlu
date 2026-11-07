# GIS, Spatial Intelligence, Risk and Compliance Integration

Constitutional reference — Umkhandlu Governance Node
Full architecture: `unami-platform-core/docs/context/GIS_INTEGRATION.md`
Last updated: 2026-11-07

---

## What This Node Owns

The governance node owns all geographic content and public presentation:
- Area listings with point coordinates (`listing.geopoint`)
- Geographic hierarchy (district → municipality → ward → TA → isigodi → settlement)
- Boundary polygons for areas (`listing.boundary` — populated from approved imports)
- Project-to-geography relationships (`campaign.relatedAreas`, `campaign.geographicAssociations`)
- Public map rendering (Leaflet — point markers implemented, boundary polygons pending)
- Development notice geographic associations (pending)

The Platform Core Governance Intelligence Centre connects to institutional spatial sources,
runs automated ingestion and processing pipelines, manages risk and compliance, and delivers
approved spatial data to this node via the existing API contract.

---

## Data Flow Into This Node

```
Platform Core pipeline (automated fetch → GDAL processing → staging → operator approval)
    │
    ▼
Approved GeoJSON (WGS84, Amajuba extent, source-attributed)
    │
    ▼
Publication pipeline → Sanity Content Lake API → listing.boundary field
    │
    ▼
Leaflet renders boundary polygon on public map
```

QGIS Desktop is retained for manual review of complex datasets and georeferencing
static map products. Routine processing is automated via GDAL/OGR in the Platform Core.

---

## Schema — Implemented

### listing (type: area) — boundary fields ✅

```ts
boundary          // GeoJSON polygon text — from approved institutional source
boundarySource    // e.g. "KZN COGTA Ward Boundaries 2022"
boundaryDate      // date of source dataset
boundaryPermission // 'reference' | 'display' | 'redistribute' — default: 'reference'
```

### campaign (type: csr) — site location fields ✅

```ts
siteGeopoint          // exact project site coordinate
geographicAssociations // array of { area ref, associationType }
                       // associationType: primary-site | service-area | ward |
                       //                  municipality | traditional-authority
```

---

## Schema — Still Required

### developmentNotice — geographic fields

```ts
defineField({
  name: 'affectedArea',
  title: 'Affected Area',
  type: 'reference',
  to: [{ type: 'listing' }],
  options: { filter: 'listingType == "area"' },
  description: 'Primary geographic area affected by this development notice.',
}),
defineField({
  name: 'siteBoundary',
  title: 'Affected Site Boundary (GeoJSON)',
  type: 'text',
  description: 'GeoJSON polygon of the affected site. From approved institutional source.',
}),
```

---

## Leaflet Map — Boundary Rendering (pending)

The existing `CommunityMapLeaflet.tsx` renders point markers only.

When `listing.boundary` is populated, the map must also render the polygon boundary:

```ts
// After existing marker rendering:
if (listing.boundary) {
  try {
    const geojson = JSON.parse(listing.boundary);
    L.geoJSON(geojson, {
      style: {
        color: typeColours[listing.listingType] ?? '#6b7280',
        weight: 2,
        fillOpacity: 0.08,
        fillColor: typeColours[listing.listingType] ?? '#6b7280',
      },
    }).bindPopup(popupContent).addTo(map);
  } catch {
    // invalid GeoJSON — skip silently, point marker still renders
  }
}
```

Clicking the boundary polygon opens the same popup as the point marker.
The boundary is a visual context layer — it does not replace the point marker.

---

## Intelligence API — Spatial Endpoint (pending)

When boundary data is populated, this node exposes contract v1.2:

```
GET /api/intelligence/spatial/summary
Authorization: Bearer <api-key>
```

Returns record/notice/project counts grouped by municipality and ward.
Declares `capabilities: ['spatial']` on the node identity endpoint.

See full contract in `unami-platform-core/docs/context/GIS_INTEGRATION.md`.

---

## Data Integrity Rules

1. `boundary` is populated only from Platform Core approved imports — never manually entered.
2. `boundarySource` and `boundaryDate` are required when `boundary` is set.
3. `boundaryPermission` defaults to `reference` — never assume redistribution is permitted.
4. `siteGeopoint` is distinct from area `geopoint` — a project site is not the same as an area centroid.
5. `geographicAssociations` supports multiple areas at multiple levels — no single-parent constraint.
6. Buffalo River Abstraction Works is a demonstration record — not confirmed PMU data.
7. Water and sanitation infrastructure data from Amajuba District is restricted — absolute.
8. Official source information is visually distinguished from Unami-generated content.

---

## Amajuba District — Geographic Hierarchy

```
Amajuba District Municipality
├── Newcastle Local Municipality
│   ├── Ward 1 … Ward N
│   └── Traditional Authority areas within Newcastle
│       └── Khathide Traditional Council (Mndozo area)
│           ├── Mndozo Traditional Area
│           │   ├── KwaGudlucingo (isigodi — recognition pending)
│           │   └── Umndozo Omdala (isigodi — Induna Dlamini)
│           ├── KwaNtuli (isigodi — Induna Dlamini)
│           └── KwaMthembu (isigodi — Induna KwaMthembu)
├── Dannhauser Local Municipality
│   ├── Ward 1 … Ward N
│   └── Traditional Authority areas within Dannhauser
└── eMadlangeni Local Municipality
    ├── Ward 1 … Ward N
    └── Traditional Authority areas within eMadlangeni
```

The district-wide platform is not owned by Khathide Traditional Council.
The pilot content is preserved. Amajuba's wider geography is additive.

---

## Implementation Status

| Item | Status |
|---|---|
| `listing` boundary fields (schema) | ✅ Implemented |
| `campaign` site fields (schema) | ✅ Implemented |
| Leaflet boundary polygon rendering | ⏳ Pending |
| `developmentNotice` geographic fields | ⏳ Pending |
| `/api/intelligence/spatial/summary` | ⏳ Pending (awaiting boundary data) |
| Ward boundary data (COGTA) | ⏳ Awaiting permission confirmation |
| Amajuba DM boundary data | ⏳ Awaiting form submission response |
| GIS commit pushed to origin/trunk | ⏳ Pending push |
