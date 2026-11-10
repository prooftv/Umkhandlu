# Spatial Intelligence Audit — Phase 1
# Umkhandlu Governance Node + Control Centre
# Produced: 2025

---

## 1. Repository and Deployment Summary

| Repo | Branch | Vercel domain | Supabase project |
|---|---|---|---|
| `prooftv/Umkhandlu` | `trunk` | `umkhandlu.unamifoundation.org` | `60v9eb0r` (Sanity) |
| `prooftv/unami-platform-core` | `main` | `unami-platform-core-umkhandlu.vercel.app` | `ufsmpqxniswdnsywjzje` (spatial) |

Control Centre URL consumed by Node: `process.env.CONTROL_CENTRE_URL`
Must point to `https://unami-platform-core-umkhandlu.vercel.app` — NOT the Node's own domain.

---

## 2. Map Component Inventory

### 2.1 GovernanceMapLeaflet / GovernanceMapClient
- **Route**: `/map`
- **File**: `src/components/modules/GovernanceMapLeaflet.tsx` (server wrapper: `GovernanceMapClient.tsx`)
- **Data sources**:
  - Control Centre `/api/spatial/wards` → authoritative MDB 2026 ward boundaries (55 features)
  - Sanity GROQ → records, devNotices, campaigns with geopoints; Sanity area boundaries as fallback
- **Capabilities**: Ward boundaries, record/notice/campaign markers, type filters, municipality filter, search, area panel, record detail panel
- **Mobile**: Bottom drawer (60vh, fixed), floating toggle button when closed. Map remains visible above drawer. ✅ Functional but drawer height is fixed — no drag handle state machine.
- **Desktop**: Right overlay panel (w-72). Map fills remaining space. ✅
- **CC geometry**: ✅ Uses CC wards as primary, Sanity as fallback
- **Spatial layers**: Ward boundaries only. No municipality/district polygons, no facility layers.
- **Deep links**: Links to `/records/[slug]`, `/development-notices/[slug]`, `/campaigns/[slug]`, `/areas/[slug]`
- **Action needed**: Phase 3 — add MDB ward enrichment (induna, governance counts), improve mobile drawer, add layer controls, add municipality/district boundaries

### 2.2 AreaBoundaryLeaflet
- **Routes**: `/areas/[slug]`
- **File**: `src/components/modules/AreaBoundaryLeaflet.tsx`
- **Data sources**: MDB 2026 geometry from CC (ward areas), Sanity boundary field (other area types)
- **Capabilities**: Single boundary polygon + optional geopoint marker, source attribution
- **Mobile**: Fixed 320px height. Scrollable. ✅
- **CC geometry**: ✅ Ward areas use CC geometry; other area types use Sanity boundary
- **Action needed**: Preserve as-is. Consider adding "View on full map →" deep link.

### 2.3 LocationPin / LocationPinLeaflet
- **Routes**: `/development-notices/[slug]`, `/directory/[slug]`, `/areas/[slug]` (area map section)
- **File**: `src/components/modules/LocationPin.tsx` + `LocationPinLeaflet.tsx`
- **Data sources**: Sanity `geopoint` field (lat/lng)
- **Capabilities**: Single point marker, popup with name/verification/directions link
- **Mobile**: Fixed 250px height, dragging disabled, no zoom controls. ✅ Appropriate for embedded use.
- **CC geometry**: ❌ No spatial layers, no ward context, no proximity
- **Action needed**: Phase 4 — replace on dev notice pages with `SiteContextMap` (new component) that shows point + ward boundary + "View on full map" link

### 2.4 CommunityMapLeaflet / CommunityMap (section)
- **Routes**: Home page sections (via `PageSections`), any page using `communityMap` section type
- **File**: `src/components/sections/CommunityMapLeaflet.tsx`, `src/components/sections/CommunityMap.tsx`
- **Data sources**: Sanity listings with geopoints (schools, clinics, businesses, facilities, areas)
- **Capabilities**: Multi-marker directory map, featured pulse animation, popup with image/contact/directions, label tooltips
- **Mobile**: 500px height (600px md+). Scroll wheel enabled. ✅
- **CC geometry**: ❌ Directory purpose only — correct, no spatial layers needed
- **Action needed**: Preserve distinct directory purpose. No changes required.

### 2.5 SpatialMap (Control Centre)
- **Route**: `/spatial/map` (Control Centre only)
- **File**: `apps/umkhandlu/src/app/(umkhandlu)/spatial/map/_components/SpatialMap.tsx`
- **Data sources**: Control Centre Supabase — published datasets, notice markers, node GeoRefs
- **Capabilities**: Multi-layer dataset display, notice markers, node GeoRef markers, area info panel
- **Purpose**: Spatial data administration and intelligence — NOT a governance record browser
- **Action needed**: Preserve as-is. This is the spatial authority map.

---

## 3. Hardcoded Coordinates and Fallback Centroids

| Location | File | Coordinate | Status |
|---|---|---|---|
| Amajuba District centre | `map/page.tsx` | `-28.05, 29.0` | ✅ Correct district centroid for initial view |
| Amajuba District centre | `areas/[slug]/page.tsx` | `-28.05, 29.0` | ✅ Used only as AreaBoundaryLeaflet fallback when no geopoint |
| Two dev notices | Sanity content | `-27.82, 30.05` | ❌ Generic centroid — must be corrected in Sanity Studio or removed |
| Khathide, Mndozo, KwaGudlucingo | Sanity content | Not set | ⚠️ Missing — do not invent coordinates |

The generic `-27.82, 30.05` centroid was previously removed from `LocationPin` (no longer renders without a real geopoint). The two notices that had this centroid in Sanity still need manual correction in Studio.

---

## 4. Sanity Schema — Spatial Fields Audit

### listing (area type)
- `geopoint` — Sanity geopoint ✅
- `boundary` — GeoJSON geometry object ✅
- `boundarySource`, `boundaryDate`, `boundaryPermission` ✅
- `areaLevel` — district | municipality | ward | traditional-authority | isigodi | settlement ✅
- `wardNumber` — number ✅
- `municipality` — string (lowercase slug: newcastle | emadlangeni | dannhauser | amajuba) ✅
- `parentArea` — reference to parent listing ✅
- **Missing**: `mdbWardId` (stable MDB WardID for authoritative matching), `controlCentreGeoRef` (CC geographic identifier)

### developmentNotice
- `geopoint` — Sanity geopoint ✅
- `siteBoundary` — GeoJSON text field ✅ (exists in schema, not yet used in frontend)
- `relatedArea` — reference to listing (area) ✅
- **Missing**: `locationPrecision` (verified | operator-provided | approximate | locality-only), `mdbWardId`

### campaign
- `siteGeopoint` — distinct from area geopoint ✅
- `geographicAssociations` — array of area references ✅
- **Missing**: `locationPrecision`

### record, notice, program, opportunity
- `relatedArea` — reference to listing (area) ✅
- **Missing**: direct `geopoint` on record/notice (currently inherited via relatedArea)

### listing (areaLevel) — ward vs isigodi distinction
Current values: `ward` (municipal/political) and `isigodi` (traditional/tribal). This is correct.
The directive notes these are "almost interchangeable but ward is more municipal/political and isigodi more tribal/traditional" — the schema already captures this distinction correctly.
**Action**: Add `isigodi` as a display label in `LEVEL_LABELS` maps across the frontend (currently shows raw value in some places).

---

## 5. Public Participation Form — Wiring Investigation

### Current implementation
- `PublicCommentForm` — client component, uses `useActionState` with `submitComment` server action
- `submitComment` — validates with valibot, calls `sendToWebhook('public_comment', ...)`
- `sendToWebhook` — reads `webhookPublicComment` (or fallback `webhookUrl`) from Sanity settings
- Payload maps to Edge Function contract: `node_id`, `sanity_id`, `comment_type`, `comment_text`, `submitter_name`, `submitter_contact`, `relationship_to_area`

### Webhook destination
The webhook URL is stored in Sanity Settings (`webhookPublicComment` field). This points to a Supabase Edge Function or n8n endpoint.

### Relationship to Moments/Platform Core
- The `node_id` in the payload is `NODE_ID` from `src/lib/siteConfig.ts` — this identifies the Umkhandlu governance node
- The Edge Function on Platform Core receives the comment, increments `commentsReceived` on the notice, and can forward to n8n for notification
- The Moments app (`apps/admin`) has a separate public participation system via its own Edge Functions — these are NOT the same system
- The Umkhandlu public comment form is node-specific and routes through the governance node's configured webhook

### Missing / outstanding
- `webhookPublicComment` field in Sanity Settings needs to be populated with the actual Edge Function URL
- No confirmation email or acknowledgement receipt to submitter (by design — POPIA)
- No admin view of submitted comments in the Node frontend (operator sees count only)
- The `commentsReceived` field on `developmentNotice` is updated manually — the webhook should automate this

### Relationship to formal statutory process
The public comment form is a **digital convenience channel only**. It is NOT a substitute for formal statutory submission to the licensing authority. The notice page correctly displays `commentContact` (the formal submission address). The form routes to the traditional council's webhook — not to the licensing authority directly.

For liquor applications specifically: formal objections under the KwaZulu-Natal Liquor Licensing Act must be submitted to the KZN Liquor Authority, not to the traditional council. The platform must make this distinction explicit.

---

## 6. Countdown and Retention — Current Implementation

### Countdown
- **No dedicated countdown component exists** — the deadline is displayed as a formatted date string
- `acceptingComments` boolean: `isOpen && !deadlinePassed` where `deadlinePassed = new Date(commentDeadline) < new Date()`
- This is a simple calendar-day check — no business-day calculation, no timezone handling beyond JS Date
- The `RecordGem` / `ParticipationAction` shows deadline as formatted date string
- **Action needed**: Add a `DeadlineCountdown` client component that shows days remaining, handles expired state, and notes that calendar days are used (not business days)

### Retention
- `retentionPeriod` field on `developmentNotice` — free text string (e.g. "30 days", "Permanent")
- Displayed in `ProofOfPublication` certificate
- **No automated retention enforcement** — this is correct; retention is a policy field, not an automated deletion trigger
- `ProofOfPublication` correctly shows `retentionPeriod` as a record field
- **Action needed**: Document that retention is a display/policy field only; no automated deletion

---

## 7. Control Centre Spatial Catalogue — Published Layers

From inspection of `/api/spatial/wards`:
- **MDB 2026 Amajuba Ward Boundaries** — 55 features, published, public domain ✅
  - Dataset ID: `017eeb0a`, Source: `bc86c5c0`, Pipeline: `62cf0baf`
  - Properties: `WardNo`, `CAT_B`, `WardLink`, `MUNICNAME`, `WardID`

**Not yet published / unavailable**:
- Municipality boundaries (Newcastle, eMadlangeni, Dannhauser) — not in CC catalogue
- District boundary (Amajuba DC25) — not in CC catalogue
- Traditional authority boundaries — not available
- Cadastral parcels — not available (COGTA blocked)
- Schools, clinics, facilities — not in CC spatial catalogue (in Sanity listings)
- Environmental layers — not available
- Roads — not available (OSM available via tile layer)

**Restricted**:
- COGTA Infrastructure 2022 (`c8532e74`) — RESTRICTED, never use

---

## 8. Implementation Plan

### Phase 2 — Spatial integration foundation (immediate)
1. Add `mdbWardId` field to `listing` schema (area type) — stable MDB WardID for authoritative matching
2. Add `locationPrecision` field to `developmentNotice` schema
3. Add `isigodi` label to all `LEVEL_LABELS` maps in frontend
4. Add "View on full map →" deep link to `AreaBoundaryLeaflet`
5. Verify `CONTROL_CENTRE_URL` env var is set correctly on Vercel

### Phase 3 — Governance map upgrade
1. Add municipality/district boundary support (derive from ward aggregation or add static GeoJSON)
2. Improve mobile drawer: three states (map-focused / results-focused / feature-focused), drag handle
3. Add layer controls panel
4. Add MDB ward enrichment display (ward number, municipality, induna)
5. Add "View on full map" deep links from notice/record pages

### Phase 4 — Page-level spatial context
1. Replace `LocationPin` on dev notice pages with `SiteContextMap` — shows point + ward boundary + spatial context panel
2. Add spatial context to liquor-licensing notices specifically
3. Add `DeadlineCountdown` client component

### Phase 5 — Spatial screening
1. Proximity screening panel for liquor applications
2. Source/precision/verification display

### Phase 6 — Mobile audit
1. Test bottom drawer on actual mobile viewport
2. Fix any overflow/clipping issues

---

## 9. Data Ownership Contract — Confirmed

| Information | Owner | Status |
|---|---|---|
| Governance records, notices, applications | Governance Node / Sanity | ✅ Correct |
| MDB ward boundaries | Control Centre | ✅ Correct |
| Source permissions, provenance | Control Centre | ✅ Correct |
| Record-to-place relationships | Node references CC identifiers | ⚠️ Partial — `mdbWardId` not yet in schema |
| User-facing spatial presentation | Node Next.js | ✅ Correct |
| Spatial ingestion/validation/publication | Control Centre | ✅ Correct |
| Directory listings (schools, clinics) | Node / Sanity | ✅ Correct — not a CC concern |

---

## 10. KZN Liquor Licensing — Statutory Process Notes

The KwaZulu-Natal Liquor Licensing Act 6 of 2010 governs liquor applications in KZN.

**Publication requirements** (not Government Gazette for all applications):
- Applications must be advertised in a newspaper circulating in the area
- A notice must be displayed at the proposed premises
- Notice must be served on the municipality, traditional council (where applicable), and SAPS
- The KZN Liquor Authority is the licensing authority — NOT the traditional council
- Objections must be lodged with the KZN Liquor Authority within 30 days of publication

**What Umkhandlu can legitimately record**:
- Digital publication of the notice (timestamp, URL, version)
- Upload of newspaper publication evidence
- Upload of site-display evidence
- Record of service/delivery to traditional council
- Community feedback via the public comment form (NOT a formal objection to the licensing authority)

**What Umkhandlu must NOT claim**:
- That digital publication satisfies statutory publication requirements
- That a comment submitted via the platform constitutes a formal objection to the KZN Liquor Authority
- That proximity screening results establish compliance or non-compliance

**Proximity considerations under KZN Liquor Act**:
- Section 45: licensing authority considers proximity to schools, churches, residential areas
- No fixed statutory buffer distances are prescribed in the Act itself — these are discretionary considerations
- The 100m / 500m figures sometimes cited are from municipal by-laws or policy guidelines, not the Act
- Any proximity display must be labelled as "spatial screening — for information only, not a regulatory determination"

---

*Audit complete. Proceed to Phase 2 implementation.*
