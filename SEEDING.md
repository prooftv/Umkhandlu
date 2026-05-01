# Seed Data Architecture

How seed data is structured across councils.

---

## Two Layers

### 1. Template (shared across all councils)

| Script | What it creates |
|---|---|
| `seed:pages` | 9 template pages + `blogPage` + bare `siteSettings` |
| `seed:menu` | Standard nav: Home \| Council ▾ \| Community ▾ \| Contact |
| `seed:trust` | Ingonyama Trust resources + generic land notice |

Run all three at once:

```bash
SANITY_WRITE_TOKEN=<token> npm run seed:template
```

These files contain **zero council-specific content** — no names, no people, no areas.

### 2. Council (one file per council)

| Script | Example |
|---|---|
| `seed:mndozo` | Mndozo Traditional Council |

Each council script:
- **Patches** `siteSettings` with identity (title, colors, contact) — preserves menu
- **Creates** people, area, listings, notices
- **Replaces** homepage, about, leadership, land pages with council content
- **Patches** menu with council-specific links (e.g. area pages)
- **Patches** generic notices with `relatedArea`

---

## File Naming

```
scripts/
├── seed-pages.ts              # template
├── seed-menu.ts               # template
├── seed-trust-resources.ts    # template
└── seed-<council>.ts          # council-specific
```

## npm Script Naming

```json
{
  "seed:pages": "tsx scripts/seed-pages.ts",
  "seed:menu": "tsx scripts/seed-menu.ts",
  "seed:trust": "tsx scripts/seed-trust-resources.ts",
  "seed:template": "npm run seed:pages && npm run seed:menu && npm run seed:trust",
  "seed:<council>": "tsx scripts/seed-<council>.ts",
  "seed:<council>:full": "npm run seed:template && npm run seed:<council>"
}
```

---

## Adding a New Council

### 1. Copy the pattern

```bash
cp scripts/seed-mndozo.ts scripts/seed-<council>.ts
```

### 2. Replace all Mndozo-specific data

| Section | What to change |
|---|---|
| IDs | `person-inkosi`, `person-induna-*`, `listing-area-*`, `listing-*`, `notice-*` |
| Settings patch | title, description, email, phone, address, colors |
| People | Inkosi name, induna names, roles, izigodi names |
| Area | name, slug, location, description |
| Listings | schools, clinics, businesses with real data + geopoints |
| Notices | sample notices with `relatedArea` pointing to new area |
| Campaign | activation campaign with sponsor, target areas, deliverables |
| Sponsor | sponsor/partner with contact details and website |
| Homepage | heading, hero text, stats, teamGrid refs, quote, map, campaigns |
| Page overrides | about, leadership, land — council name in copy |
| Menu patch | area link slug |

### 3. Add npm scripts

```json
{
  "seed:<council>": "tsx scripts/seed-<council>.ts",
  "seed:<council>:full": "npm run seed:template && npm run seed:<council>"
}
```

### 4. Run

```bash
# Fresh Sanity project — run everything
SANITY_WRITE_TOKEN=<token> npm run seed:<council>:full

# Existing project — just update council data
SANITY_WRITE_TOKEN=<token> npm run seed:<council>
```

---

## Rules

1. **Template files must never reference a council name, person, or area**
2. **Council files own all council-specific content**
3. **Council files use `patch` on siteSettings** — never `createOrReplace` (preserves menu)
4. **Council files use `createOrReplace` on pages** — idempotent, safe to re-run
5. **Stats are editorial** — update them manually when verified data changes
6. **IDs follow the pattern**: `person-<role>`, `listing-<type>-<name>`, `notice-<type>-<n>`, `campaign-<name>`, `sponsor-<name>`
7. **All scripts require `NEXT_PUBLIC_SANITY_PROJECT_ID` and `SANITY_WRITE_TOKEN`** from env
8. **Campaigns and sponsors are seeded per council** — the Mndozo script creates the activation campaign and Unami Foundation sponsor
