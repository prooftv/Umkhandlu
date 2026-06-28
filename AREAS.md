# Area Hierarchy — Traditional Council Structure

## Pattern

Every Traditional Council area follows the same structure:

```
Traditional Council Area (umbrella)
├── Isigodi A (headman assigned)
├── Isigodi B (headman assigned)
├── Isigodi C (vacant / acting / pending recognition)
└── Isigodi D (headman assigned)
```

The umbrella area represents the entire Traditional Council jurisdiction. Each Isigodi is a sub-area with its own leadership assignment (or vacancy).

---

## How This Maps to Umkhandlu

Each level is a **listing** of type `Village / Area` in the CMS. No code changes. No parent/child schema needed. The hierarchy is expressed through:

- **Naming convention** — umbrella uses "Traditional Area", sub-areas use isigodi names
- **Content referencing** — records/notices reference the appropriate level
- **Menu structure** — site menu groups areas logically

```
Directory Listings (type: area)
├── Mndozo Traditional Area          ← umbrella (ward/council-level content)
├── KwaGudlucingo                    ← isigodi (no Induna — recognition pending)
└── Umndozo Omdala                   ← isigodi (Induna Dlamini)
```

Each gets its own page at `/areas/[slug]`.

---

## Current: Mndozo (Khathide Traditional Council)

### Area Listings to Create

| Name | Slug | Induna | Purpose |
|---|---|---|---|
| Mndozo Traditional Area | `mndozo` | None (council-level) | Umbrella area — ward-level documents, IDP records, council-wide notices |
| KwaGudlucingo | `kwagudlucingo` | Vacant (recognition pending) | Isigodi — meeting records from 27 June 2026, petition process |
| Umndozo Omdala | `umndozo-omdala` | Induna Dlamini | Isigodi — Dlamini's area, existing community structures |

### What References What

| Document | Related Area |
|---|---|
| Newcastle LM IDP 2025/26 – Ward 7 Priorities | Mndozo Traditional Area |
| Buffalo River Abstraction Works campaign | Mndozo Traditional Area |
| Community Meeting — KwaGudlucingo (27 June 2026) | KwaGudlucingo |
| Minutes — KwaGudlucingo Community Meeting | KwaGudlucingo |
| Resolution — Petition for Recognition | KwaGudlucingo |
| Resolution — Community Safety Whistle Alert | KwaGudlucingo |
| Infrastructure Record — Apollo Street Lighting | KwaGudlucingo |
| Izazi Secondary School | KwaGudlucingo |
| Content specific to Dlamini's area | Umndozo Omdala |

### Menu Structure

```
Areas ▾
├── Mndozo Traditional Area
├── KwaGudlucingo
└── Umndozo Omdala
```

---

## CMS Actions (Current Deployment)

### Step 1: Rename existing area

| Field | Current | Change to |
|---|---|---|
| Name | Mndozo (Kwagudlucingo) | KwaGudlucingo |
| Slug | `mndozo` | `kwagudlucingo` |
| Description | Kwagudlucingo is part of Mndozo area farm (Isigodi) | Isigodi under Khathide Traditional Council. Recognition of headmanship pending COGTA review. |
| Induna | None | None (keep vacant — shows "No recognised Induna" on frontend) |

### Step 2: Create umbrella area

| Field | Value |
|---|---|
| Name | Mndozo Traditional Area |
| Slug | `mndozo` |
| Type | Village / Area |
| Description | Traditional area under the Khathide Traditional Council, Newcastle, KwaZulu-Natal. Encompasses multiple Izigodi including KwaGudlucingo and Umndozo Omdala. |
| Induna | None (council-level — not a single headman's area) |
| Related Listings | Izazi Secondary School (if it serves the broader area) |

### Step 3: Create Umndozo Omdala

| Field | Value |
|---|---|
| Name | Umndozo Omdala |
| Slug | `umndozo-omdala` |
| Type | Village / Area |
| Description | Isigodi under Induna Dlamini, part of Mndozo Traditional Area. |
| Induna | → Induna Dlamini (create person if not exists) |

### Step 4: Reassign content

- Move IDP record's `relatedArea` → Mndozo Traditional Area
- Move Buffalo River campaign's `relatedArea` → Mndozo Traditional Area
- KwaGudlucingo meeting content stays on KwaGudlucingo
- Move Izazi Secondary School to the correct area's `relatedListings`

### Step 5: Fix notice slug

Edit the community meeting notice → slug field → remove backticks or regenerate.

Correct: `community-meeting-kwagudlucingo-governance-community-safety-27-june-2026`

### Step 6: Update menu

Studio → Site Settings → Menu → add all three area links.

---

## Pattern for Any New Traditional Council

When deploying Umkhandlu for a new Traditional Council:

### 1. Create the umbrella area

| Field | Example |
|---|---|
| Name | [Council Name] Traditional Area |
| Slug | `[council-slug]` |
| Induna | None (council-level) |
| Description | Traditional area under [Inkosi Name], [District], KwaZulu-Natal. |

### 2. Create each Isigodi

For each headmanship area:

| Field | Value |
|---|---|
| Name | [Isigodi Name] |
| Slug | `[isigodi-slug]` |
| Induna | → Person reference (or leave vacant) |
| Description | Isigodi under [Induna Name / "recognition pending" / "acting headman"]. |

### 3. Reference correctly

- **Ward/council-level content** (IDP, municipal plans, council-wide notices) → umbrella area
- **Isigodi-specific content** (local meetings, area disputes, local listings) → specific isigodi
- **Cross-area content** (infrastructure projects spanning multiple areas) → umbrella area

### 4. Frontend result

Each area gets:
- Its own page at `/areas/[slug]`
- Auto-assembled notices, records, programs, opportunities, listings
- Induna profile or "No recognised Induna" state
- Map pin at the area's geopoint

---

## Why No Parent/Child Schema

The hierarchy is implied through content organisation, not enforced through schema relationships. This is intentional:

1. **Simplicity** — editors don't need to understand schema relationships
2. **Flexibility** — areas can be restructured without migrations
3. **Flat queries** — no recursive lookups needed
4. **Real-world alignment** — COGTA doesn't always have clean hierarchies (disputed boundaries, overlapping jurisdictions, pending recognitions)

If a content item is relevant to the whole council area, it references the umbrella. If it's specific to an isigodi, it references that isigodi. The area pages auto-assemble based on these references.

---

## Future: When More Izigodi Are Added

As the Khathide TC engagement grows:

```
Mndozo Traditional Area
├── KwaGudlucingo (recognition pending)
├── Umndozo Omdala (Induna Dlamini)
├── [Isigodi 3] (Induna X)
├── [Isigodi 4] (Induna Y)
└── [Isigodi 5] (acting headman)
```

Each is just another area listing. The platform scales through content, not code.
