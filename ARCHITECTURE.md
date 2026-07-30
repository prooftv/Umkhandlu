# ARCHITECTURE.md — Umkhandlu Platform Architecture

## Philosophy

Traditional councils are legitimate governance institutions. They hold meetings, pass resolutions, allocate land, resolve disputes, and publish notices — but almost none of this is digitally recorded in a way that creates a verifiable, auditable trail.

Umkhandlu is built on one core belief: **governance events should produce evidence, not just records.** A meeting minute is not just a document — it is the output of a real event that happened at a real place, on a real day, in real weather, attended by real people. The platform captures all of that.

The second belief: **the same codebase should serve any council.** No council-specific strings exist in component or route code. Switching councils means changing two lines in `siteConfig.ts`, pointing to a different Sanity dataset, and updating brand colors in the CMS.

The third belief: **editors compose, developers don't deploy content.** All content — pages, notices, records, people, programs, campaigns — is managed entirely through Sanity Studio. The 27 page builder sections give editors full compositional control without touching code.

---

## System Overview

```
Browser
  └── Next.js 15 (App Router)
        ├── (frontend) route group — public site
        ├── /studio — Sanity Studio (embedded)
        └── /api — server-side API routes

Sanity v3 (Headless CMS)
  ├── Content Lake (documents, assets)
  └── GROQ queries via next-sanity

Open-Meteo (weather)
  ├── Forecast API — future dates
  └── Historical Archive API — past dates

Webhook endpoint (n8n / Make / Zapier)
  └── Receives form submissions (contact, subscribe, public comment)
```

---

## Directory Structure

```
src/
├── actions/          Server actions (contact, subscribe, search, webhook)
├── app/
│   ├── (frontend)/   Public site routes
│   ├── api/          API route handlers
│   └── studio/       Embedded Sanity Studio
├── components/
│   ├── icons/        SVG icons
│   ├── layout/       Header, Footer, NavBar, Alert, Main
│   ├── modules/      Reusable UI modules (non-section)
│   ├── sections/     Page builder section components
│   ├── templates/    Page-level layout templates
│   └── ui/           Primitive UI components (Badge, Button, Date, etc.)
├── env/              Environment variable validation (client + server)
├── lib/
│   ├── i18n/         Locale context + translations
│   ├── sanity/       Sanity client, queries, fragments, types
│   ├── constants.ts
│   ├── links.ts      URL builder helpers
│   ├── pagination.ts
│   ├── siteConfig.ts Site identity defaults
│   ├── utils.ts
│   └── weather.ts    Open-Meteo fetch utility
├── studio/
│   ├── components/   Studio UI overrides
│   ├── schema/       All document, object, singleton schemas
│   └── structure/    Studio desk structure
└── utils/            Low-level utilities (assertValue, createEnv, schema, strings)
```

---

## Routing

All public routes live under `src/app/(frontend)/`. The route group has no URL segment.

| Route | Rendering | Notes |
|---|---|---|
| `/` | Static (ISR) | Homepage via `homePage` singleton |
| `/[slug]` | Static (ISR) | Generic CMS pages |
| `/blog` | Static (ISR) | Blog listing via `blogPage` singleton |
| `/blog/[slug]` | Static (ISR) | Post detail |
| `/blog/page/[page]` | Static (ISR) | Paginated blog |
| `/category/[categorySlug]` | Static (ISR) | Posts by category |
| `/people/[personSlug]` | Static (ISR) | Person profile + their posts |
| `/areas` | Static (ISR) | Area listing |
| `/areas/[slug]` | Static (ISR) | Area detail — auto-assembled from references |
| `/directory/[slug]` | Static (ISR) | Listing detail (school, clinic, business, etc.) |
| `/notices` | Static (ISR) | Notices archive (paginated) |
| `/notices/[slug]` | **force-dynamic** | Notice detail + weather fetch |
| `/notices/certificate/[id]` | Dynamic | Printable proof of publication |
| `/notices/lineage/[slug]` | Dynamic | Printable governance lineage (A4) |
| `/notices/journey/[slug]` | Dynamic | Printable governance journey map (A4 landscape) |
| `/notices/page/[page]` | Static (ISR) | Paginated notices |
| `/records` | Static (ISR) | Records archive (paginated) |
| `/records/[slug]` | **force-dynamic** | Record detail + weather fetch |
| `/records/page/[page]` | Static (ISR) | Paginated records |
| `/opportunities/[slug]` | Static (ISR) | Opportunity detail |
| `/programs/[slug]` | Static (ISR) | Program detail |
| `/campaigns/[slug]` | Static (ISR) | Campaign detail |
| `/development-notices` | Static (ISR) | Dev notices archive |
| `/development-notices/[slug]` | Static (ISR) | Dev notice detail + public comment form |
| `/development-notices/page/[page]` | Static (ISR) | Paginated dev notices |
| `/operator` | Dynamic | Infrastructure operator dashboard |
| `/presentation/*` | Static | Stakeholder presentation pages (COGTA, Khathide, Mining) |

`/notices/[slug]` and `/records/[slug]` are `force-dynamic` because weather must be fetched live on every visit — forecast data changes hourly, and the patch to Sanity must happen on the server during the page render.

---

## API Routes

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/campaigns/export` | GET | `?token=<READ_TOKEN>` | Campaign data export (JSON) with deliverables, progress, sponsor info, area/program refs, related notice/opportunity counts. Supports `?status=` and `?type=` filters |
| `/api/governance/export` | GET | `?token=<READ_TOKEN>` | Governance records export |
| `/api/weather-patch` | POST | Server-side write token | Fetch weather from Open-Meteo and patch `weatherContext` onto a Sanity document |
| `/api/draft-mode/enable` | GET | Sanity preview secret | Enable Next.js draft mode for Sanity preview |

---

## Content Architecture

### 13 Document Types

| Type | Key Fields | Notes |
|---|---|---|
| `page` | title, slug, sections[], seo | Generic CMS pages |
| `post` | title, slug, content, author, categories | Blog posts, stories, learner content |
| `person` | firstName, lastName, role, personType, image, bio | Leadership, council members, community profiles |
| `category` | title, slug | Content categories |
| `notice` | title, slug, noticeType, date, content, pinned, originNotice, location, attendance, weatherContext | Community notices — 8 types |
| `listing` | name, slug, listingType, geopoint, content, images | Directory — 7 types including `area` |
| `opportunity` | title, slug, opportunityType, deadline, organization, link | Jobs, training, bursaries, funding |
| `program` | title, slug, programType, date, status, content | Youth events, skills programs |
| `record` | title, slug, recordType, date, status, summary, content, evidence, originNotice, parentRecord, approvedBy, location, attendance, weatherContext | Governance documents — 8 types |
| `sponsor` | name, slug, sponsorType, logo, url | Sponsors and partners — 5 types |
| `campaign` | title, slug, campaignType, status, deliverables, progressLog, gallery, documents | Campaigns & activations — 3 types |
| `developmentNotice` | title, slug, noticeType, status, applicant, commentDeadline, geopoint, legalMandate, proofOfPublication | Statutory notices — 7 types |
| `conflictLog` | title, sourceReport, authorityClassification, verificationStatus, escalation | Verification records for TCRS |

### 3 Singletons

| Type | Purpose |
|---|---|
| `homePage` | Homepage content + page builder sections |
| `blogPage` | Blog listing page + page builder + SEO |
| `settings` | Site title, description, menu, branding, social links, contact info, GTM, webhook URL |

### Notice Types

`meeting` · `announcement` · `resolution` · `alert` · `opportunity` · `employment` · `smme` · `project-update`

### Record Types

`minutes` · `resolution` · `land-allocation` · `dispute-resolution` · `policy` · `report` · `external-resource` · `status-update`

### Listing Types

`school` · `clinic` · `business` · `accommodation` · `church` · `facility` · `area`

---

## Page Builder

Pages are composed from sections stored in `sections[]` on `page`, `homePage`, and `blogPage` documents. The `PageSections` component maps each section `_type` to its React component.

### 27 Section Types

| Section | Component | Notes |
|---|---|---|
| `hero` | `Hero.tsx` | Heading, rich text, image, CTA buttons |
| `richText` | `RichText.tsx` | Heading + portable text body |
| `mediaText` | `MediaText.tsx` | Image + text side-by-side with buttons |
| `cta` | `CTA.tsx` | Call to action with gradient background |
| `quote` | `Quote.tsx` | Testimonial / chief's message with author photo |
| `faq` | `FAQ.tsx` | Collapsible Q&A accordion |
| `stats` | `Stats.tsx` | Bold numbers + labels grid |
| `embed` | `Embed.tsx` | YouTube, iframes, embedded content |
| `cardGrid` | `CardGrid.tsx` | Grid of content cards |
| `postList` | `PostList.tsx` | Latest blog posts |
| `teamGrid` | `TeamGrid.tsx` | Leadership profiles (manual pick) |
| `peopleGrid` | `PeopleGrid.tsx` | Community people grid (auto-query, filterable by type) |
| `noticeList` | `NoticeList.tsx` | Community notices (filterable, pinnable) |
| `opportunityList` | `OpportunityList.tsx` | Jobs, training, bursaries (deadline-aware) |
| `programList` | `ProgramList.tsx` | Programs & events (filterable by status) |
| `listingGrid` | `ListingGrid.tsx` | Community directory (filterable by type) |
| `recordList` | `RecordList.tsx` | Governance documents (filterable by type) |
| `process` | `Process.tsx` | Step-by-step visual timeline |
| `gallery` | `Gallery.tsx` | Photo gallery with captions |
| `contactForm` | `ContactForm.tsx` | Contact form with server action + optional map |
| `subscribe` | `Subscribe/index.tsx` | Newsletter signup with server action |
| `logoGrid` | `LogoGrid.tsx` | Sponsors/partners logos (manual pick) |
| `sponsorGrid` | `SponsorGrid.tsx` | Sponsors/partners cards (auto-query, filterable by type) |
| `adBanner` | `AdBanner.tsx` | Sponsor banners with date scheduling |
| `communityMap` | `CommunityMap.tsx` | Interactive Leaflet/OpenStreetMap map (filterable by listing type) |
| `campaignList` | `CampaignList.tsx` | Campaigns & activations (filterable by type and status) |
| `divider` | `Divider.tsx` | Visual separator |

---

## Data Layer

### Sanity Client

`src/lib/sanity/client/client.ts` — configured with project ID, dataset, and API version from environment variables. Used for all GROQ queries.

`src/lib/sanity/client/live.ts` — Sanity Live Content API for real-time updates in draft mode.

### Query Pattern

All GROQ queries are defined in `src/lib/sanity/queries/queries.ts` using `defineQuery` from `next-sanity`. Fragments for repeated field sets live in `src/lib/sanity/queries/fragments/fragments.ts`.

TypeScript types are auto-generated from the Sanity schema into `src/lib/sanity/client/sanity.types.ts` via `npm run dev` (runs `sanity typegen generate` in watch mode).

### Fragment System

Reusable GROQ projections are defined as string constants:

- `postFragment` — full post fields
- `personFragment` — person fields
- `noticeFragment` — notice list fields
- `recordFragment` — record list fields
- `campaignFragment` — campaign fields
- `listingFragment` — listing fields
- `seoFragment` — SEO object fields
- `linkFragment` — custom link resolution
- `menuFragment` — navigation menu with resolved links

---

## Weather System

### Philosophy

A governance meeting is a real event. The weather on that day is part of the historical record — it contextualises attendance, explains delays, and forms part of the evidence trail. A future meeting notice shows a forecast so attendees can prepare.

### Implementation

`src/lib/weather.ts` exports `fetchWeather(date, lat, lng): Promise<WeatherSnapshot | null>`.

- If `date >= today`: routes to `https://api.open-meteo.com/v1/forecast` (1-hour cache)
- If `date < today`: routes to `https://archive-api.open-meteo.com/v1/archive` (no revalidate)

Both endpoints use identical parameters: `weather_code`, `temperature_2m_max`, `temperature_2m_min`, `precipitation_sum`, `wind_speed_10m_max`, `uv_index_max` (daily) + `relative_humidity_2m` (hourly, averaged).

WMO weather interpretation codes are mapped to human labels via a static lookup table.

### Coordinate Chain

Coordinates come from `record.relatedArea → listing.geopoint → { lat, lng }`. No manual coordinate input is required on notices or records.

### Patch Logic

`/api/weather-patch` (POST) accepts `{ _id, date, lat, lng }`, fetches weather, and patches `weatherContext` onto the Sanity document using `SANITY_API_WRITE_TOKEN`.

Page-level patch logic:

- **Notices (future date)**: always re-patch on every visit — forecast updates hourly
- **Notices (past date)**: patch once, then locked (`!weatherContext` guard)
- **Records**: always past dates — patch once and lock permanently

This means historical weather is immutable once captured. It becomes part of the evidence trail.

### WeatherSnapshot Type

```ts
type WeatherSnapshot = {
  type: 'forecast' | 'historical';
  condition: string;           // WMO label e.g. "Partly cloudy"
  temperatureCelsius: number;  // daily average
  tempMinCelsius: number;
  tempMaxCelsius: number;
  rainfallMm: number;
  windKmh: number;
  humidityPercent: number;     // hourly average
  uvIndex: number;
  fetchedAt: string;           // ISO timestamp
};
```

### EventContext Component

`src/components/modules/EventContext.tsx` renders the weather block on notice and record detail pages. Props: `weather: WeatherSnapshot | null`, `location?: string`, `attendance?: number`. Labels forecast as "🔮 Forecast (predicted)" and historical as "✓ Recorded conditions".

---

## Record Network Model

Records are not isolated documents. They form a directed graph:

```
notice (meeting)
  └── record (minutes)          ← originNotice
        └── record (resolution) ← parentRecord
              └── record (land-allocation) ← parentRecord
```

Every record can have:
- `originNotice` — the notice that triggered it
- `parentRecord` — the record it derives from
- `childRecords` — records derived from it (reverse-queried)

This creates a full governance lineage from notice → minutes → resolution → implementation.

### Six Record Roles

| Role | Type | Purpose |
|---|---|---|
| Origin | `minutes` | The meeting that started the chain |
| Decision | `resolution` | What was decided |
| Evidence | `report`, `policy` | Supporting documentation |
| Matter | `land-allocation`, `dispute-resolution` | The specific action taken |
| Reference | `external-resource` | External documents referenced |
| Status | `status-update` | Progress updates on open matters |

---

## Governance Frontend

### Notice Detail (`/notices/[slug]`)

Two-tab layout:
1. **Notice tab** — content, event context (weather, location, attendance), follow-up notices, produced records tree
2. **Governance Lineage tab** — full lineage tree with `GovernanceJourney` component + "🗺 View Journey Map →" button that opens `JourneyDrawer`

`JourneyDrawer` is a full-viewport overlay (`'use client'`) with a scrollable tree area, "🖨 Print →" link to `/notices/journey/[slug]`, and ✕ close button.

### Record Detail (`/records/[slug]`)

Single-page layout with:
- Record metadata (type, date, status, approved by)
- Event context block (weather, location, attendance)
- Portable text content
- Evidence attachments
- Parent record + child records lineage
- Origin notice reference

### Printable Outputs

| Route | Format | Purpose |
|---|---|---|
| `/notices/certificate/[id]` | A4 portrait | Proof of Publication certificate |
| `/notices/lineage/[slug]` | A4 portrait | Governance lineage certificate |
| `/notices/journey/[slug]` | A4 portrait | Governance journey map |

---

## Theming

Brand colors are set in CMS → Site Settings → Branding. The page layout reads `settings.primaryColor` and `settings.secondaryColor` and injects them as CSS custom properties on the `<html>` element:

```css
--color-primary: #16a34a;
--color-secondary: #f59e0b;
```

All buttons, links, gradients, and badges reference these variables. Defaults in `src/app/globals.css` are used when CMS colors are not set.

---

## i18n

Language toggle in the header switches between English and isiZulu. `LocaleContext` (`src/lib/i18n/LocaleContext.tsx`) provides a `useLocale()` hook that returns `{ locale, setLocale, t }`. All UI strings are keyed in `src/lib/i18n/translations.ts`.

```tsx
const { t } = useLocale();
return <p>{t('blog.readMore')}</p>;
```

No URL-based routing for locale — it is a client-side preference stored in state.

---

## Forms & Webhooks

Contact, subscribe, and public comment forms use Next.js server actions (`src/actions/`). All forms validate with Valibot before submission. On success, the server action POSTs structured JSON to the webhook URL configured in CMS Settings → Analytics.

The webhook URL works with n8n, Make, Zapier, or any HTTP endpoint. No form data is stored in the database.

The public comment form on `/development-notices/[slug]` captures: name, contact, relationship to site, comment type (comment / objection / support / question), and free-text comment.

---

## Environment Variables

| Variable | Side | Required | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Client + Server | Yes | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Client + Server | Yes | Sanity dataset name |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Client + Server | Yes | Sanity API version |
| `NEXT_PUBLIC_SITE_URL` | Client + Server | Yes | Public site URL |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | Client + Server | Yes | Studio URL |
| `NEXT_PUBLIC_GTM_ID` | Client | No | Google Tag Manager ID |
| `SANITY_API_READ_TOKEN` | Server | Yes | Server-side Sanity read token |
| `SANITY_API_WRITE_TOKEN` | Server | No | Weather patch write token — required for weather capture |
| `MAX_STATIC_PARAMS` | Server | No | Max static params for ISR (default: unlimited) |

Environment variables are validated at startup using `src/utils/createEnv.ts`. Client variables are validated in `src/env/clientEnv.ts`, server variables in `src/env/serverEnv.ts`. Missing required variables throw at build time, not runtime.

---

## Multi-Council Deployment

The same codebase serves any traditional council. Zero council-specific strings exist in component or route code.

| What to change | Where |
|---|---|
| Site name + description | `src/lib/siteConfig.ts` (2 lines) |
| Sanity project | `.env.local` (project ID + dataset) |
| Domain | Vercel settings |
| Brand colors | CMS Settings → Branding |
| All content | CMS documents |

---

## Area Pages

Each area/isigodi gets a page at `/areas/[slug]` that auto-assembles from references:

- Induna (headman) from `listing.induna` person reference
- Related listings (schools, clinics, businesses) from `listing.relatedListings`
- Area-specific notices, programs, opportunities, records, campaigns, and development notices — all reverse-queried via `references(^._id)`

Content links to an area via `relatedArea` reference fields on notices, programs, opportunities, records, and campaigns.

---

## Sanity Studio Structure

The studio desk structure (`src/studio/structure/index.ts`) organises documents into logical groups with dividers:

```
[Site Name]
├── Home
├── Blog Page
├── Pages
├── ─────────
├── Community Notices
├── Documents & Records
├── ─────────
├── Leadership & People
├── Programs & Events
├── Opportunities
├── ─────────
├── Posts & Stories
├── Categories
├── ─────────
├── Directory Listings
├── Sponsors & Partners
├── Campaigns & Activations
├── ─────────
└── Site Settings
    ├── General
    ├── Branding
    ├── Social & Contact
    └── Analytics
```

Singletons (Home, Blog Page, Site Settings) are pinned as single-document views — editors cannot create duplicates.

---

## Build & Tooling

| Tool | Purpose |
|---|---|
| Next.js 15 + Turbopack | Framework + dev bundler |
| Sanity v3 | Headless CMS + embedded Studio |
| Tailwind CSS v4 | Utility-first styling |
| shadcn/ui | Primitive component library |
| TypeScript | Type safety throughout |
| Valibot | Runtime validation for forms and env vars |
| Vitest | Unit testing |
| Biome | Linting + formatting (replaces ESLint + Prettier) |

Biome enforces a cognitive complexity limit of 15 per function. Complex page logic (e.g. weather fetch + patch) is extracted into standalone async helpers above the page component to stay within this limit.

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server + Sanity type generation in watch mode |
| `npm run next:build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Lint with Biome |
| `npm run test` | Run tests with Vitest |
| `npm run typecheck` | TypeScript type check |

---

## Deployment

Deployed on Vercel from the `trunk` branch. Every push to `trunk` triggers a production deployment. No staging branch — changes are tested locally before push.

Live site: `umkhandlu.unamifoundation.org`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full council deployment runbook.

---

## Related Documentation

| File | Purpose |
|---|---|
| [README.md](./README.md) | Quick start, env vars, content overview |
| [RECORDS.md](./RECORDS.md) | Records subsystem — philosophy, six roles, event context, weather, schema, frontend |
| [TCRS.md](./TCRS.md) | Truth Conflict Resolution System — governance audit and evidence preservation |
| [ROLES.md](./ROLES.md) | Content ownership model and editor roles |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Council deployment runbook |
| [PLAYBOOK.md](./PLAYBOOK.md) | Strategic project playbook for proposals |
| [SOP.md](./SOP.md) | Infrastructure documentation operator SOP |
| [AREAS.md](./AREAS.md) | Area pages architecture |
