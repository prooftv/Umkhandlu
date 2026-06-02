# Umkhandlu

Community digital platform for traditional councils, youth programs, and local governance. Built with Next.js, Sanity CMS, and Tailwind CSS.

## What This Is

A modular, CMS-driven platform that gives traditional councils a structured digital presence. Editors compose pages from 27 section types without touching code. The same codebase serves multiple councils — each with its own content, brand colors, and domain.

## Tech Stack

- **Next.js 15** (App Router, Turbopack)
- **Sanity v3** (Headless CMS + Studio)
- **Tailwind CSS v4** + shadcn/ui
- **TypeScript**
- **Valibot** (validation)
- **Vitest** (testing)
- **Biome** (linting + formatting)

## Getting Started

```bash
npm install
cp .env.example .env.local
# Fill in Sanity project ID, dataset, and API token
npm run dev
```

- Frontend: http://localhost:3000
- Sanity Studio: http://localhost:3000/studio

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset name |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version |
| `NEXT_PUBLIC_SITE_URL` | Public site URL |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | Studio URL |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager ID (optional) |
| `SANITY_API_READ_TOKEN` | Server-side Sanity read token |
| `MAX_STATIC_PARAMS` | Max static params for ISR |

## Content Architecture

### 13 Document Types

| Type | Purpose |
|---|---|
| `page` | Generic CMS pages |
| `post` | Blog posts, stories, learner content |
| `person` | Leadership, council members, community profiles |
| `category` | Content categories |
| `notice` | Community notices (meeting, announcement, resolution, alert, opportunity, employment, smme, project-update) |
| `listing` | Directory (school, clinic, business, accommodation, church, facility, area) with map coordinates and rich content |
| `opportunity` | Jobs, training, bursaries, funding |
| `program` | Youth events, skills programs, school collaborations |
| `record` | Governance documents (minutes, resolutions, land allocations, dispute resolutions, policies, reports, external resources) |
| `sponsor` | Sponsors and partners (NGO, business, government, community, individual) |
| `campaign` | Campaigns & activations (sponsorship, activation, initiative) with video, audio, documents, SEO, impact tracking |
| `developmentNotice` | Statutory & public participation notices (EIA, SPLUMA, estate, liquidation, PTO, mining, cell towers) with comment deadline, applicant, map pin, legal mandate, fee tracking, proof of publication |
| `conflictLog` | Verification records — source reports, authority classification, verification status, escalation tracking |

### 27 Page Builder Sections

| Section | Purpose |
|---|---|
| `hero` | Page hero with heading, rich text, image, CTA buttons |
| `richText` | Heading + rich text body content |
| `mediaText` | Image + text side-by-side with buttons |
| `cta` | Call to action with gradient background |
| `quote` | Testimonial / chief's message with author photo |
| `faq` | Collapsible Q&A accordion |
| `stats` | Bold numbers + labels grid |
| `embed` | YouTube videos, iframes, embedded content |
| `cardGrid` | Grid of content cards |
| `postList` | Latest blog posts |
| `teamGrid` | Leadership/council member profiles (manual pick) |
| `peopleGrid` | Community people grid (auto-query, filterable by type) |
| `noticeList` | Community notices (filterable, pinnable) |
| `opportunityList` | Jobs, training, bursaries (deadline-aware) |
| `programList` | Programs & events (filterable by status) |
| `listingGrid` | Community directory (filterable by type) |
| `recordList` | Governance documents (filterable by type) |
| `process` | Step-by-step visual timeline |
| `gallery` | Photo gallery with captions |
| `contactForm` | Contact form with server action + optional map |
| `subscribe` | Newsletter signup with server action |
| `logoGrid` | Sponsors/partners logos (manual pick) |
| `sponsorGrid` | Sponsors/partners cards (auto-query, filterable by type) |
| `adBanner` | Sponsor banners with date scheduling |
| `communityMap` | Interactive map of listings (Leaflet/OpenStreetMap, filterable by type) |
| `campaignList` | Campaigns & activations (filterable by type and status) |
| `divider` | Visual separator |

### 3 Singletons

| Singleton | Purpose |
|---|---|
| `homePage` | Homepage content + page builder |
| `blogPage` | Blog listing page + page builder + SEO |
| `settings` | Site title, description, menu, branding, social links, contact info, GTM, webhook |

## Sanity Studio Structure

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
    ├── General (title, description, menu, OG image)
    ├── Branding (primary color, secondary color)
    ├── Social & Contact (email, phone, address, social URLs)
    └── Analytics (GTM ID, webhook URL)
```

## Theming

Brand colors are controlled from the CMS:

1. Open Studio → Site Settings → **Branding**
2. Set Primary Brand Color (hex, e.g. `#16a34a`)
3. Set Secondary Brand Color (hex, e.g. `#f59e0b`)
4. The entire site updates — buttons, links, gradients, badges, everything

Defaults in `src/app/globals.css` are used when CMS colors aren't set.

## Multi-Council Deployment

The same codebase serves any traditional council. To deploy for a different council:

| What to change | Where |
|---|---|
| Site name + description | `src/lib/siteConfig.ts` (2 lines) |
| Sanity project | `.env.local` (project ID + dataset) |
| Domain | Vercel settings |
| Brand colors | CMS Settings → Branding |
| All content | CMS documents |

Zero council-specific strings exist in component or route code.

## i18n (Zulu / English)

Language toggle in the header switches between English and isiZulu. Translations in `src/lib/i18n/translations.ts`:

```tsx
import { useLocale } from '@/lib/i18n/LocaleContext';

function MyComponent() {
  const { t } = useLocale();
  return <p>{t('blog.readMore')}</p>;
}
```

## Area Pages

Each area/isigodi gets a page at `/areas/[slug]` that auto-assembles:
- Induna (headman) from person reference
- Related listings (schools, clinics, businesses)
- Area-specific notices, programs, and opportunities

Content links via `relatedArea` references on notices, programs, opportunities, and records.

## Forms & Webhooks

Contact, subscribe, and public comment forms validate with Valibot and POST to a webhook URL configured in CMS Settings → Analytics. Works with n8n, Make, Zapier, or any webhook endpoint.

The public comment form on development notices captures structured objections/comments with name, contact, relationship to site, and comment type (comment/objection/support/question).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server + type generation |
| `npm run next:build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Lint with Biome |
| `npm run test` | Run tests with Vitest |
| `npm run typecheck` | TypeScript type check |

## API Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /api/campaigns/export?token=<READ_TOKEN>` | Campaign data export (JSON), including deliverables, certified progress, sponsor/contact info, area/program references, and related notice/opportunity counts |
| `GET /api/campaigns/export?token=<READ_TOKEN>&status=active` | Filter by status |
| `GET /api/campaigns/export?token=<READ_TOKEN>&type=csr` | Filter by type |
| `/development-notices/[slug]` | Public notice detail + comment form |
| `/records/[slug]` | Governance record detail (institutional memory) |
| `/notices/certificate/[id]` | Proof of Publication certificate (printable) |

## Documentation

- [PLAYBOOK.md](./PLAYBOOK.md) — Strategic project playbook for proposals
- [ROLES.md](./ROLES.md) — Content ownership model and roles
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Council deployment runbook (step-by-step)
- [SEEDING.md](./SEEDING.md) — Seed data architecture and how to add a new council
- [SOP.md](./SOP.md) — Infrastructure documentation operator SOP (project tracking workflow)
- [TCRS.md](./TCRS.md) — Truth Conflict Resolution System (governance audit & evidence preservation)

## License

Private project.
