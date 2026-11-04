# GIS and Spatial Intelligence Integration

Constitutional reference — Umkhandlu Governance Node
See full architecture: `unami-platform-core/docs/context/GIS_INTEGRATION.md`
Last updated: 2026-11-04

---

## What This Node Owns

The governance node owns all geographic content:
- Area listings with point coordinates (`listing.geopoint`)
- Geographic hierarchy (district → municipality → ward → TA → isigodi)
- Project-to-geography relationships (`campaign.relatedAreas`)
- Public map rendering (Leaflet — already implemented)
- Boundary polygons for areas (to be added — Step 4)

The Platform Core Governance Intelligence Centre connects to institutional
spatial sources, prepares data via QGIS, and delivers clean GeoJSON to this node.

---

## QGIS Data Flow Into This Node

```
QGIS (operator tool) → clean GeoJSON (WGS84) → import script → Sanity boundary field
```

QGIS reprojects, clips, validates and simplifies institutional boundary data
before it enters this node. The node never receives raw institutional data directly.

---

## Schema Changes Required

### listing (type: area) — add boundary fields

```ts
defineField({
  name: 'boundary',
  title: 'Area Boundary (GeoJSON)',
  type: 'text',
  description: 'GeoJSON polygon. Prepared via QGIS from authorised institutional source. Do not edit manually.',
  readOnly: false,
  hidden: ({ parent }) => parent?.listingType !== 'area',
}),
defineField({
  name: 'boundarySource',
  title: 'Boundary Source',
  type: 'string',
  description: 'Institution and dataset this boundary came from. e.g. "KZN COGTA Ward Boundaries 2022"',
  hidden: ({ parent }) => parent?.listingType !== 'area',
}),
defineField({
  name: 'boundaryDate',
  title: 'Boundary Dataset Date',
  type: 'date',
  description: 'Date of the source dataset (not import date).',
  hidden: ({ parent }) => parent?.listingType !== 'area',
}),
defineField({
  name: 'boundaryPermission',
  title: 'Redistribution Permission',
  type: 'string',
  options: {
    list: [
      { title: 'Reference only (display, no redistribution)', value: 'reference' },
      { title: 'Display permitted', value: 'display' },
      { title: 'Redistribution confirmed', value: 'redistribute' },
    ],
  },
  initialValue: 'reference',
  hidden: ({ parent }) => parent?.listingType !== 'area',
}),
```

### campaign (type: csr) — add site location fields

```ts
defineField({
  name: 'siteGeopoint',
  title: 'Project Site Location',
  type: 'geopoint',
  description: 'Exact project site coordinate. Distinct from the area geopoint.',
  hidden: ({ parent }) => parent?.campaignType !== 'csr',
}),
defineField({
  name: 'geographicAssociations',
  title: 'Geographic Associations',
  type: 'array',
  description: 'All geographic areas this project relates to. A project can relate to multiple areas at different levels.',
  hidden: ({ parent }) => parent?.campaignType !== 'csr',
  of: [{
    type: 'object',
    fields: [
      defineField({
        name: 'area',
        title: 'Area',
        type: 'reference',
        to: [{ type: 'listing' }],
        options: { filter: 'listingType == "area"' },
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'associationType',
        title: 'Association Type',
        type: 'string',
        options: {
          list: [
            { title: 'Primary site', value: 'primary-site' },
            { title: 'Service area', value: 'service-area' },
            { title: 'Ward', value: 'ward' },
            { title: 'Municipality', value: 'municipality' },
            { title: 'Traditional Authority area', value: 'traditional-authority' },
          ],
        },
        validation: (rule) => rule.required(),
      }),
    ],
    preview: {
      select: { title: 'area.name', subtitle: 'associationType' },
    },
  }],
}),
```

---

## Leaflet Map — Boundary Rendering

The existing `CommunityMapLeaflet.tsx` renders point markers.
When `listing.boundary` is populated, the map renders the polygon boundary
behind the point marker using `L.geoJSON()`.

The boundary is displayed as a semi-transparent fill with a coloured stroke
matching the listing type colour. Clicking the boundary opens the same popup
as clicking the point marker.

---

## Intelligence API — Spatial Endpoint

When boundary data is populated, this node exposes:

```
GET /api/intelligence/spatial/summary
Authorization: Bearer <api-key>
```

Returns record/notice/project counts grouped by municipality and ward.
No personal data. Aggregated counts only.

This is contract version 1.2 — declared in `capabilities: ['spatial']` on the
node identity endpoint when the endpoint is implemented.

---

## Data Integrity Rules

1. `boundary` field is populated only from QGIS-prepared, source-attributed GeoJSON.
2. `boundarySource` and `boundaryDate` are required when `boundary` is set.
3. `boundaryPermission` defaults to `reference` — never assume redistribution is permitted.
4. Project site coordinates (`siteGeopoint`) are distinct from area coordinates.
5. `geographicAssociations` supports multiple areas at multiple levels — no single-parent constraint.
6. Buffalo River Abstraction Works is a demonstration record — not confirmed PMU data.
7. Water and sanitation infrastructure data from Amajuba District is restricted.

---

## Amajuba District — Geographic Hierarchy

```
Amajuba District Municipality
├── Newcastle Local Municipality
│   ├── Ward 1 … Ward N
│   └── Traditional Authority areas within Newcastle
├── Dannhauser Local Municipality
│   ├── Ward 1 … Ward N
│   └── Traditional Authority areas within Dannhauser
└── eMadlangeni Local Municipality
    ├── Ward 1 … Ward N
    └── Traditional Authority areas within eMadlangeni

Khathide Traditional Council (within Newcastle)
├── Mndozo Traditional Area (umbrella)
│   ├── KwaGudlucingo (isigodi — recognition pending)
│   └── Umndozo Omdala (isigodi — Induna Dlamini)
```

The district-wide platform is not owned by KwaGudlucingo Traditional Council.
The pilot content is preserved. Amajuba's wider geography is additive.
