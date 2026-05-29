# Umkhandlu — Project Playbook

> **Umkhandlu is participation infrastructure for underrepresented communities — enabling them to represent, coordinate, and develop themselves on their own terms.**

## Community Self-Determination Architecture

**Version:** 3.0
**Status:** Production-Ready
**Repository:** github.com/prooftv/Umkhandlu

---

## 0. Philosophical Framework

Umkhandlu is not a website, a CMS, or a digital transformation project.

It is **participation infrastructure for community self-determination**.

Digital invisibility is a form of dependency. If communities cannot publish themselves, document themselves, coordinate themselves, or represent themselves digitally — then outsiders become the primary narrators of their governance, their economy, their development, and their identity.

Umkhandlu reverses that.

### What Self-Determination Means Here

Not separatism. Not anti-state. Not anti-development.

> Communities gaining structured capacity to represent, coordinate, and develop themselves on their own terms.

This explains why the system emphasises:
- **Ownership** — council controls all content and data
- **Governance alignment** — mirrors existing authority structures
- **Council legitimacy** — the platform operates under council authority
- **Youth participation** — next generation as active contributors
- **Local operational control** — Council Operating Partner model

### The Ecosystem

| Initiative | Self-determination function |
|---|---|
| **Umkhandlu** | Governance & participation self-determination |
| **Unami Schools** | Educational self-determination |
| **Unami Drones** | Skills & technological self-determination |
| **Unami Timber** | Economic self-determination |
| **UNCIP** | Community safety self-determination |
| **Media/Documentation** | Narrative self-determination |
| **CSR Coordination** | Development self-determination |
| **Market Access** | Economic participation |

### The Participation Shift

Most development models fail because communities are treated as beneficiaries, not participants.

This model changes that. The community becomes:
- Contributor
- Coordinator
- Participant
- Knowledge holder
- Development stakeholder

**Before:** "How do we bring solutions into communities?"
**Now:** "How do communities organise participation around their own development?"

### What Umkhandlu Actually Builds

Not content. Not media. Not apps.

- **Memory** — governance records, decisions, resolutions
- **Visibility** — infrastructure mapping, directory, map
- **Coordination** — notices, campaigns, programs
- **Opportunity** — jobs, training, bursaries, development
- **Accountability** — project tracking, impact reporting, public participation

Philosophy becomes systems. Systems survive.

### The Operating Model

```
Traditional Council = governs
Community = participates
Unami = builds enabling infrastructure around self-determined development
```

Unami does not claim authority over the council. The council governs. The community participates. Unami provides the coordination infrastructure that makes both visible and effective.

This is fundamentally different from the NGO model where external actors define priorities and communities become beneficiaries.

### What to Protect

Do not let Umkhandlu drift into:
- ❌ Media branding
- ❌ Generic NGO language
- ❌ Startup terminology
- ❌ "Community content platform" framing

Always frame as:
- ✅ Participation infrastructure
- ✅ Governance-support systems
- ✅ Community coordination architecture
- ✅ Self-determination enablement

---

## 1. Executive Summary

Umkhandlu is a governance state engine for traditional councils. It structures how decisions, communication, and opportunities flow within a traditional authority — without altering authority structures.

This is not a website. It is not a CMS. It is the missing operating system between traditional authority and modern coordination.

Three layers:

| Layer | What it does | Components |
|---|---|---|
| **Authority** | Mirrors real governance hierarchy | Inkosi → Izinduna → Council → Community |
| **System** | Structures how information moves | Notices (awareness), Records (memory), Listings (visibility), Opportunities (flow), Programs (activity), Campaigns (development) |
| **Output** | Interfaces people actually use | Website, Maps, WhatsApp, Reports, Data Export |

The system layer is the core. Document types are not content — they are state containers. The page builder is not a layout tool — it is a view renderer. The CMS is not a publishing platform — it is a control panel for governance operations.

Umkhandlu ensures that traditional councils own, control, and structure their own community data — rather than relying on external platforms or fragmented systems. All data is controlled and published by the council. The platform does not store personal applicant data or replace official council records.

The system is designed for low-frequency, practical use — even a small number of updates (notices, records, listings) maintains its value.

### Why Now

- Increasing pressure for land transparency under the Ingonyama Trust Board
- Growing need for rural digital inclusion aligned with national ICT strategies
- Youth unemployment requiring localised opportunity pipelines
- Lack of structured rural data blocking investment and service delivery
- Traditional governance operating offline while the world moves digital

### The Problem

- Traditional councils operate offline, paper-based, word-of-mouth
- No structured digital visibility for communities under Ingonyama Trust land
- No central information system for residents, NGOs, or government departments
- Youth have no digital pipeline for opportunities, content, or engagement
- Local economy (spaza shops, services, trades) is largely invisible in structured digital systems

### The Solution

A modular, CMS-driven platform that any traditional council can use to:

- Publish community notices (meetings, resolutions, alerts)
- Display leadership structures (Inkosi → Izinduna → Council)
- Document governance processes (land allocation, applications)
- Maintain public records (minutes, policies, reports)
- Map community infrastructure (schools, clinics, businesses, churches)
- Broadcast opportunities (jobs, training, bursaries, funding)
- Run youth programs and events
- Tell community stories through blogs and photo galleries
- Accept newsletter subscriptions and contact form submissions
- Display sponsors and partners

### Who This Serves

| Stakeholder | Value |
|---|---|
| **Community residents** | Access to notices, opportunities, services, leadership info |
| **Traditional council** | Digital visibility, structured communication, governance records |
| **Youth** | Opportunities pipeline, content platform, skills programs |
| **NGOs & donors** | Structured community data for planning and investment |
| **Government departments** | Digitised local governance layer |
| **Ingonyama Trust** | Structured insight into communities on Trust land |

---

## 2. Governance Alignment

The platform mirrors the real-world traditional authority hierarchy:

```
Ingonyama Trust Board (Legal custodian of land)
    │
    ▼
Traditional Authority — Inkosi (Chief)
    │
    ▼
Umkhandlu — Traditional Council ← THIS IS THE PLATFORM
    │
    ├── Izinduna (Headmen) — one per area/isigodi
    ├── Council Members
    └── Youth Representatives
    │
    ▼
Izakhamuzi — Community (Households, families, stakeholders)
```

### How the Platform Maps to This Structure

| Governance Layer | Platform Feature |
|---|---|
| Inkosi | Person profile (type: inkosi) on Leadership page |
| Izinduna | Person profiles (type: induna), linked to Area pages |
| Council Members | Person profiles (type: council) in Team Grid sections |
| Community Meetings | Notice documents (type: meeting) |
| Resolutions | Notice documents (type: resolution) + Record documents |
| Land Allocation | Process section (step-by-step visual timeline) |
| Public Records | Record documents (minutes, policies, reports) with PDF attachments |
| Jurisdiction | Area pages with auto-linked listings, notices, programs, opportunities |

### Positioning Statement

> "We are supporting traditional councils with a digital platform that improves community communication, visibility of land-related information, and youth development initiatives."

This is NOT "a website for the council." This is a **digital layer around existing governance structures** that the council owns and controls.

---

## 3. Platform Architecture

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router, React 19, Turbopack) |
| CMS | Sanity v3 (Headless CMS + embedded Studio) |
| Styling | Tailwind CSS v4 + shadcn/ui components |
| Language | TypeScript (strict) |
| Validation | Valibot |
| Testing | Vitest |
| Linting | Biome |
| Analytics | Google Tag Manager (CMS-configurable) |
| Deployment | Vercel (recommended) |

### Content Architecture

#### 12 Document Types

| Type | Purpose | Key Fields |
|---|---|---|
| `page` | Generic CMS pages | Name, slug, page builder sections, SEO |
| `post` | Blog posts, stories, learner content | Title, author, categories, content, image, SEO |
| `person` | Leadership, council, community profiles | Name, role, type (inkosi/induna/council/youth/community/author), skills, organization |
| `category` | Content categories | Title, slug, description |
| `notice` | Community notices | Title, type (meeting/announcement/resolution/alert/opportunity), date, pinned, relatedArea |
| `listing` | Directory (schools, clinics, businesses, areas) | Name, type, location, geopoint (map coordinates), contact, WhatsApp, services, hours, verification level, image, rich content, featured, induna, relatedListings |
| `opportunity` | Jobs, training, bursaries, funding | Title, type, description, organization, deadline, apply link, relatedArea, featured |
| `program` | Youth events, skills programs, school collabs | Title, type, status (upcoming/active/completed), date, relatedArea |
| `record` | Governance documents | Title, type (minutes/resolution/land-allocation/dispute-resolution/policy/report/external-resource), date, summary, status, approvedBy, content, PDF file, externalUrl, source, relatedArea |
| `sponsor` | Sponsors and partners | Name, type (NGO/business/government/community/individual), logo, website, description |
| `campaign` | Campaigns & activations | Title, type (sponsorship/activation/initiative), status (draft/approved/active/completed/reported), sponsor, contactPerson, dates, targetAudience, tags, budget, beneficiaries, impact summary, deliverables, video, audio, documents, gallery, SEO |
| `developmentNotice` | Public participation notices | Title, type (EIA/rezoning/land-use/building/mining/liquor/telecom), status (open/closed/approved/rejected), applicant, reference number, description, location, geopoint, comment deadline, comment contact, documents, related area |

#### 3 Singletons

| Singleton | Purpose |
|---|---|
| `homePage` | Homepage content + page builder |
| `blogPage` | Blog listing page SEO |
| `settings` | Site title, description, menu, branding (primary/secondary colors), social links (Facebook, Twitter, Instagram, YouTube, WhatsApp), contact info (email, phone, address), GTM ID, webhook URL, default OG image |

#### 27 Page Builder Sections

Any page can be composed from these sections in any order:

| Section | Purpose |
|---|---|
| `hero` | Page hero with heading, rich text, image, CTA buttons |
| `richText` | Heading + rich text body content |
| `mediaText` | Image + text side-by-side (configurable left/right) with buttons |
| `cta` | Call to action with gradient background |
| `quote` | Testimonial / chief's message with author photo and role |
| `faq` | Collapsible Q&A accordion |
| `stats` | Bold numbers + labels grid |
| `embed` | YouTube videos, iframes, embedded content (configurable aspect ratio) |
| `cardGrid` | Grid of content cards with headings and rich text |
| `postList` | Latest blog posts from CMS |
| `teamGrid` | Leadership/council member profiles with photos and roles (manual pick) |
| `peopleGrid` | Community people grid (auto-query, filterable by person type, shows skills) |
| `noticeList` | Community notices (filterable by type, pinnable) |
| `opportunityList` | Jobs, training, bursaries (deadline-aware, auto-hides expired) |
| `programList` | Programs & events (filterable by status) |
| `listingGrid` | Community directory (filterable by type: school/clinic/business/accommodation/church/area) |
| `recordList` | Governance documents (filterable by type) |
| `process` | Step-by-step visual timeline (for land allocation, governance processes) |
| `gallery` | Photo gallery with captions and hover reveal |
| `contactForm` | Contact form with server action + optional Google Maps embed |
| `subscribe` | Newsletter signup with server action |
| `logoGrid` | Sponsors/partners logo display (grayscale → color on hover, manual pick) |
| `sponsorGrid` | Sponsors/partners card grid (auto-query, filterable by type, shows description) |
| `adBanner` | Sponsor banners with date scheduling, size options, sponsor reference |
| `communityMap` | Interactive map of all listings (Leaflet/OpenStreetMap, color-coded by type, filterable) |
| `campaignList` | Campaigns & activations grid (filterable by type and status) |
| `divider` | Visual separator |

### Area Pages (Community Digital Twins)

Each area/isigodi gets its own page at `/areas/[slug]` that automatically assembles:

1. **Area info** — name, description, location
2. **Induna** — the headman responsible (from person reference)
3. **Related listings** — schools, clinics, businesses within the area
4. **Area notices** — meetings, announcements, resolutions for this area
5. **Area programs** — events and initiatives in this area
6. **Area opportunities** — jobs, training, bursaries available here

All content is linked via `relatedArea` references — when editors create a notice and select an area, it automatically appears on that area's page.

---

## 4. Website Structure

### Recommended Page Map

| Page | URL | Sections Used |
|---|---|---|
| **Home** | `/` | hero, noticeList, postList, teamGrid, opportunityList, cta, subscribe |
| **About the Council** | `/about` | hero, mediaText, cardGrid, teamGrid |
| **Leadership** | `/leadership` | hero, teamGrid (Inkosi + Izinduna + Council) |
| **Community Notices** | `/notices` | hero, noticeList (all types) |
| **Land & Development** | `/land` | hero, process (land allocation steps), recordList, noticeList, cta |
| **Youth & Programs** | `/youth` | hero, programList, postList, opportunityList, cta |
| **Opportunities** | `/opportunities` | hero, opportunityList (all types) |
| **Directory** | `/directory` | hero, listingGrid (all types) |
| **Schools** | `/schools` | hero, listingGrid (filter: school), postList |
| **Health** | `/health` | hero, listingGrid (filter: clinic), cardGrid |
| **Local Economy** | `/economy` | hero, listingGrid (filter: business), adBanner |
| **Media & Stories** | `/media` | hero, gallery, postList |
| **Projects** | `/projects` | hero, programList, teamGrid (sponsors), logoGrid |
| **Contact** | `/contact` | hero, contactForm (with map), cta |
| **Area Pages** | `/areas/[slug]` | Auto-generated: induna, listings, notices, programs, opportunities |
| **Blog** | `/blog` | Blog listing with pagination |
| **Blog Post** | `/blog/[slug]` | Full article with JSON-LD |

### Sanity Studio Navigation

```
[Site Name]
├── Home
├── Blog Page
├── Pages
├── ─────────
├── Community Notices 📢
├── Documents & Records 📁
├── ─────────
├── Leadership & People 👥
├── Programs & Events 🚀
├── Opportunities ⭐
├── ─────────
├── Posts & Stories
├── Categories
├── ─────────
├── Directory Listings 📍
├── Sponsors & Partners ⭐
├── Campaigns & Activations 💡
├── ─────────
└── Site Settings ⚙️
    ├── General (title, description, menu, OG image)
    ├── Branding (primary color, secondary color)
    ├── Social & Contact (email, phone, address, social URLs, WhatsApp)
    └── Analytics (GTM ID, webhook URL)
```

---

## 5. Features

### SEO & Performance

- `metadataBase` for fully-qualified OG/canonical URLs
- Canonical URLs on every page type
- JSON-LD structured data (Article on posts, WebSite on homepage)
- Dynamic sitemap with differentiated priorities (homepage 1.0, pages 0.7, posts 0.6, archives 0.4)
- robots.txt blocks `/studio` and `/api` from indexing
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- Responsive image `sizes` attributes throughout
- Font optimization with `next/font` and `display: swap`
- Dynamic imports for non-critical components
- ISR with `generateStaticParams` on all dynamic routes
- Loading skeleton for perceived performance
- PWA manifest for basic offline support

### Internationalisation (Zulu / English)

- Language toggle in header (EN / ZU)
- Cookie-persisted preference
- `<html lang>` updates dynamically
- 50+ translation keys covering all UI strings
- CMS content remains in Sanity (requires Sanity i18n plugin for full bilingual CMS content)

### Analytics & Compliance

- Google Tag Manager (configurable via CMS Settings → Analytics, or `NEXT_PUBLIC_GTM_ID` env var)
- Cookie consent banner (POPIA-compliant)
- No-ops when GTM ID is empty (zero performance cost)

### Forms & Actions

- Contact form with Valibot validation (server action)
- Newsletter subscription (server action, used in both Subscribe section and Footer)
- All forms use React 19 `useActionState` for progressive enhancement

### Monetisation Layer

- Ad banner section with sponsor name, image, link, date range scheduling
- Full/half width options
- Auto-hides outside scheduled date range
- `rel="sponsored"` on links
- Sponsors/partners logo grid (grayscale → color on hover)

### Campaign Management

- Full `campaign` document type with three campaign types:
  - **Sponsorship** — banner creatives, sponsor links, date scheduling
  - **Activation** — on-ground events, community activations with photo gallery, video, audio
  - **Initiative (Infrastructure Projects)** — full municipal/government project tracking with construction phases, funding sources, contractors, progress logs, SMME tracking, and compliance reporting
- 5-stage status workflow: Draft → Approved → Active → Completed → Reported
- Contact person, target audience, freeform tags
- Video embed (YouTube/Vimeo), audio file upload, document attachments (PDF/DOC)
- Budget tracking (ZAR, internal only — not shown on frontend), beneficiary counts, impact summaries, deliverables list
- Links to sponsors, target areas, related programs, contact person
- `campaignList` page builder section (filterable by type and status)
- Campaign detail pages at `/campaigns/[slug]` with JSON-LD structured data and project info board
- Full SEO fields (metaTitle, metaDescription, OG, Twitter)
- Data export API: `GET /api/campaigns/export?token=<READ_TOKEN>`

#### Infrastructure Project Fields (Initiative type only)

| Field | Purpose | Example |
|---|---|---|
| Funding Source | Grant/budget source | WSIG, MIG, RBIG, EPWP |
| Contractor | Implementing company | ABC Construction (Pty) Ltd |
| Project Phase | Current stage | Planning → Procurement → Construction → Commissioning → Operational |
| Progress Log | Timestamped updates | "Month 3: Foundation complete, 45 employed" |
| Local SMMEs | Businesses benefiting | 12 local SMMEs appointed |
| Related Listings | Infrastructure served | Links to schools, clinics, facilities |

#### Project Submission Checklist

Information needed to document a municipal infrastructure project:

| Required | Field | Example |
|---|---|---|
| ✅ | Project name | Buffalo River Abstraction Works |
| ✅ | Implementing municipality/agency | Newcastle Municipality |
| ✅ | Funding source | WSIG (Water Services Infrastructure Grant) |
| ✅ | Project value (budget) | R multi-million |
| ✅ | Ward / traditional authority area | Ward 7 — Mndozo, Manzana, Dicks |
| ✅ | Start date | May 2025 |
| ✅ | Duration / end date | 12 months |
| ✅ | Jobs created | 100 local residents |
| ✅ | Deliverables / scope of work | Weir, boreholes, treatment works |
| Optional | Contractor name | TBD |
| Optional | Local SMMEs involved | Number of local businesses |
| Optional | Project phase | Construction |
| Optional | Cover photo | Launch event / site photo |
| Optional | Council resolution | Reference to endorsement |
| Optional | Media statement / source URL | Municipality Facebook/website |

#### Project Info Board (Frontend)

The campaign detail page renders a digital version of the official DPWI/CIDB construction site information board. This is the same format used by the Department of Public Works and Infrastructure and required by the Construction Industry Development Board for all government-funded projects.

The board displays:
- **Employer** (municipality) — CIDB standard term
- **Funding Programme** (WSIG, MIG, RBIG, EPWP)
- **Contract/Tender Number** — for transparency
- **Main Contractor**
- **Consulting Engineer**
- **Project Phase** (Planning → Procurement → Construction → Commissioning → Operational)
- **Commencement and Target Completion dates**
- **Location** (ward/traditional authority area)
- **Socio-Economic Targets (EPWP)** sub-section: local labour count + SMME allocation
- **Stakeholder logos** in footer (municipality, funder, contractor — clickable with website links)

The board only renders for Initiative type campaigns. All text is uppercase matching the physical board format. The cover image can be hidden via a toggle when poster/flyer images are too tall and obstruct the board.

This positions Umkhandlu as a compliance-ready documentation platform that municipalities can reference for WSIG/MIG reporting.

### Community Map

- Interactive map powered by Leaflet/OpenStreetMap (free, no API key)
- Emoji icon markers (🏫 🏥 💼) with colored backgrounds per listing type
- Featured listings: larger markers with pulse animation
- Hover: tooltip shows listing name, marker scales up
- Click: styled popup card with cover image, area name, verification badge, contact info
- Popup actions: View details → and 🗺️ Directions (Google Maps link)
- Filter bar with type counts, stat summary (total, verified, categories)
- Auto-fit bounds to show all markers
- `communityMap` page builder section with configurable center, zoom, and type filter
- Single-pin maps on listing and area detail pages

### Advertising Packages (Council Revenue Model)

| Tier | What They Get | Suggested Price |
|---|---|---|
| **Basic** | Directory listing (name, contact, location) | Free |
| **Featured** | Basic + featured badge (top of listingGrid) + verified by induna | R100/month |
| **Premium** | Featured + adBanner on relevant pages (date-scheduled) | R300/month |
| **Sponsor** | Premium + logoGrid placement on homepage + all pages | R500/month |

Positioning: *"Supporting local businesses and community development"* — not commercialisation.

All platform revenue flows to Unami Foundation as the system operator. The council receives the platform and its benefits at zero cost. This is the Council Operating Partner (COP) model — Unami operates, the council governs.

### Development Notices (Public Participation Revenue)

A dedicated document type for legally-required public participation notices — EIA, rezoning, land use change, building plans, mining permits, liquor licenses, cell towers.

Every development on Trust land, municipal land, or private land requires public notification. The platform becomes the official digital notice channel for the area.

| Notice Type | Example | Price |
|---|---|---|
| Environmental Impact Assessment | Proposed fuel station | R3,000–R5,000 |
| Rezoning Application | Residential to commercial | R2,000–R3,000 |
| Mining / Excavation Permit | Sand mining at river | R2,000–R3,000 |
| Cell Tower / Mast | Vodacom tower installation | R3,000–R5,000 |
| Liquor License | New tavern application | R1,500–R2,000 |
| Building Plan Approval | Multi-unit housing | R2,000–R3,000 |

Fields: applicant, reference number, description, site location + map pin, comment deadline, contact for objections, supporting documents (EIA reports, site plans), status (open → closed → approved/rejected).

### Full Development Lifecycle Revenue

The platform captures value at every stage of a development:

```
PRE-DEVELOPMENT:
  Development Notice (public participation)
    → Developer pays R2,000–R5,000 for 30–60 day notice

DURING CONSTRUCTION:
  Campaign (Initiative) + Project Info Board
    → Municipality pays R5,000–R15,000 for documentation

POST-CONSTRUCTION:
  Listing (business/facility on map + directory)
    → Business pays R50–R300/month for visibility
```

Three revenue events from a single development. This is the commercial engine.

---

## 6. Deployment

### Environment Variables

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

### Recommended Deployment

1. **Vercel** for the Next.js frontend (automatic deployments from GitHub)
2. **Sanity** hosted CMS (free tier supports this scale)
3. **Custom domain** pointed to Vercel

### Getting Started

```bash
git clone https://github.com/prooftv/Umkhandlu.git
cd Umkhandlu
npm install
cp .env.example .env.local
# Fill in Sanity project ID, dataset, and API token
npm run dev
```

- Frontend: http://localhost:3000
- Sanity Studio: http://localhost:3000/studio

---

## 7. Scalability — The Unami Digital Framework

Umkhandlu is designed as a **reusable template** for any traditional council. The same codebase can serve multiple communities.

### Multi-Council Deployment (Verified)

To deploy for a different council, change:

| What | Where | Example |
|---|---|---|
| Site name + description | `src/lib/siteConfig.ts` (2 lines) | `SITE_NAME = 'Umkhandlu waseNquthu'` |
| Sanity project | `.env.local` env vars | Different project ID + dataset |
| Domain | Vercel settings | `nquthu.umkhandlu.org` |
| Brand colors | CMS Settings → Branding | `#16a34a` green |
| All content | CMS documents | Different leadership, notices, listings |

Zero council-specific strings exist in component or route code. Every "Umkhandlu" reference flows from `siteConfig.ts` as a fallback — once CMS settings are populated, the CMS values take over.

### What Changes Per Deployment

- `siteConfig.ts` (2 lines: name + description)
- Environment variables (Sanity project, domain)
- CMS content (all documents)
- Brand colors (from CMS Settings → Branding)
- Logo (via CMS or replace `src/components/icons/Logo.tsx`)

### What Stays the Same

- All 27 page builder sections
- All 11 document types
- All routes and components
- SEO infrastructure
- Analytics integration
- i18n system
- Forms and webhooks

### CMS-Driven Theming

Brand colors are set from Sanity Studio → Settings → Branding:
- Primary Brand Color (hex) — buttons, links, accents, gradients
- Secondary Brand Color (hex) — gradients, secondary elements

The frontend layout injects these as CSS custom properties, overriding the defaults in `globals.css`. No code changes or redeployment needed.

### Future Integrations (Phase 2+)

The platform is built with an integration-ready architecture — webhook endpoints, server actions, and environment-driven configuration that connects to external systems without code changes.

| Integration | Purpose | Connection Point |
|---|---|---|
| **n8n / Make** | Workflow automation (WhatsApp notifications, opportunity scraping) | Webhook URL in Settings |
| **Supabase** | Database for form submissions, user accounts | Server actions |
| **Interactive Map** | Leaflet/OpenStreetMap with pins for schools, clinics, businesses | Listing geopoint field (live) |
| **Campaign Management** | Ad campaigns, brand activations, CSR initiatives with impact tracking | Campaign document type (live) |
| **UNCIP** | Child safety alerts integration | Notice type extension |
| **Unami Schools** | Linked school platforms | Listing references |
| **Unami Drones** | Skills program content pipeline | Program type extension |
| **WhatsApp Business API** | Community notifications via Moments | n8n → WABA → community groups |

---

## 8. Commercial Model

### Unami Foundation Revenue (Platform Operator)

All system revenue flows to Unami Foundation. The council receives the platform free. Unami operates the commercial layer:

| Tier | What They Get | Suggested Price |
|---|---|---|
| Basic | Directory listing | Free |
| Featured | Top of grid + verified badge | R100/month |
| Premium | Featured + ad banner on pages | R300/month |
| Sponsor | Premium + logo on homepage | R500/month |

### Unami Revenue (Service Model)

| Revenue Stream | Description | Pricing |
|---|---|---|
| **Setup fee** | Deployment, Sanity project, initial content, training | Once-off per council |
| **Monthly support** | Hosting, CMS maintenance, content support | Monthly retainer |
| **Directory listings** | Featured/premium business listings | R50–R300/month per listing |
| **Campaign management** | Sponsor activations, CSR documentation | R3,000–R15,000 per campaign |
| **Infrastructure documentation** | Municipal project tracking + compliance reporting | R5,000–R15,000 per project |
| **Development notices** | Public participation notices (EIA, rezoning, etc.) | R2,000–R5,000 per notice |
| **Integration upgrades** | WhatsApp, n8n, map, advanced features | Phase-based |
| **Template licensing** | Additional council deployments from same codebase | Per deployment |
| **Data partnerships** | Council-approved data insights for planning and development partners | Future phase |

This positions Unami Foundation as **participation infrastructure provider** — not a dev shop, not an NGO, not a media company.

The council gets the platform free. Businesses, sponsors, municipalities, and developers pay Unami for visibility, documentation, and compliance services delivered through the platform.

---

## 9. Content Population Guide

### Priority Order for Launch

**Week 1 — Foundation:**
1. Site Settings (title, description, contact info, social links)
2. Leadership profiles (Inkosi, Izinduna, Council Members)
3. 3-5 Community Notices (upcoming meeting, recent announcement)
4. Homepage sections (hero, leadership grid, notices, CTA)

**Week 2 — Structure:**
5. Area listings (villages/izigodi with induna references)
6. Directory listings (schools, clinics, key businesses)
7. Land allocation process page
8. About page with governance structure

**Week 3 — Engagement:**
9. 2-3 Opportunities (jobs, training, bursaries)
10. 1-2 Programs (upcoming youth event, skills program)
11. Blog posts (community stories, event coverage)
12. Photo gallery (community events)

**Week 4 — Polish:**
13. Sponsors/partners logos
14. Contact page with map
15. Newsletter subscription
16. Documents & Records (meeting minutes, policies)

---

## 10. Competitive Positioning

### What Makes This Different

| Typical Council Website | Umkhandlu |
|---|---|
| Static brochure site | Living community platform |
| Developer-dependent updates | CMS-driven, editor-friendly |
| No governance structure | Mirrors real authority hierarchy |
| No community data | Structured directory of infrastructure |
| No engagement | Opportunities, programs, notices |
| Single language | Zulu/English toggle |
| No analytics | GTM + structured data |
| One-off build | Reusable template for any council |

### Strategic Value

This platform creates **structured digital data** that currently does not exist for communities on Ingonyama Trust land:

- Which schools are in which area
- Which induna is responsible for which isigodi
- What businesses operate locally
- What opportunities are available
- What governance decisions have been made
- What programs are running

This data is valuable to:
- **Government** for service delivery planning
- **NGOs** for intervention targeting
- **Donors** for impact measurement
- **Ingonyama Trust** for governance oversight
- **Residents** for daily life

---

## 11. Service Packages

Three deployment packages for different council needs and budgets:

### Package 1: Digital Council Starter Kit

**For:** Councils that need basic digital presence and communication.

| Included | Details |
|---|---|
| Website | Homepage, About, Leadership, Contact |
| Notices | Meeting announcements, alerts |
| Leadership | Inkosi + Izinduna + Council profiles |
| Directory | Schools, clinics (basic listings) |
| Newsletter | Subscription form |
| i18n | Zulu/English toggle |
| SEO | Full sitemap, OG tags, JSON-LD |

**Content setup:** 1 week
**Training:** 2 hours (Council Admin)

---

### Package 2: Youth & Opportunities Layer

**For:** Councils focused on youth engagement and economic development.

*Includes everything in Package 1, plus:*

| Included | Details |
|---|---|
| Opportunities | Jobs, training, bursaries, funding (deadline-aware) |
| Programs | Youth events, skills programs, school collaborations |
| Blog | Community stories, learner content |
| Gallery | Event photo coverage |
| Ad Banners | Sponsor placement with scheduling |
| Logo Grid | Partners and sponsors display |

**Content setup:** 2 weeks
**Training:** 4 hours (Council Admin + Youth Rep)

---

### Package 3: Governance & Land Transparency

**For:** Councils aligned with Ingonyama Trust that need full governance visibility.

*Includes everything in Packages 1 and 2, plus:*

| Included | Details |
|---|---|
| Land Process | Step-by-step land allocation visual timeline |
| Documents & Records | Meeting minutes, resolutions, policies (with PDF) |
| Area Pages | Per-isigodi digital twins with auto-linked content |
| Jurisdiction Map | Villages/areas with induna references |
| Full Directory | All listing types with area relationships |
| Analytics | GTM integration, POPIA cookie consent |
| Webhook Integration | Form data delivery to n8n/Make/Zapier |

**Content setup:** 4 weeks
**Training:** 6 hours (Council Admin + Izinduna + Youth Rep)

---

## 12. Mndozo Pilot Execution Plan

Week-by-week operational plan for the first live deployment.

### Pre-Launch (Week 0)

| Task | Owner | Deliverable |
|---|---|---|
| Deploy to Vercel + custom domain | Unami | Live site at umkhandlu.org (or similar) |
| Create Sanity project + dataset | Unami | CMS accessible at /studio |
| Configure settings (title, contact, social) | Unami | Site identity live |
| Train Council Admin on CMS | Unami | Admin can log in and create content |

### Week 1 — Foundation

| Task | Owner | Deliverable |
|---|---|---|
| Create Inkosi profile | Council Admin | Leadership page has chief |
| Create 3-5 Induna profiles | Council Admin | Each with role and area |
| Create 3 Council Member profiles | Council Admin | Team grid populated |
| Publish 2 notices (upcoming meeting + announcement) | Council Admin | Notices section live |
| Build homepage (hero + notices + leadership + CTA) | Unami | Homepage live |
| Build About page | Unami | About page live |

**Milestone:** Site is live with leadership and notices. Shareable link.

### Week 2 — Structure

| Task | Owner | Deliverable |
|---|---|---|
| Create 3 area listings (izigodi) | Council Admin | Area pages auto-generate |
| Link induna to each area | Council Admin | Area pages show headman |
| Add directory listings (verified schools, clinic if confirmed, businesses) | Induna / Admin | Directory populated |
| Link listings to areas | Council Admin | Area pages show local infrastructure |
| Build Land & Development page with process section | Unami | Land allocation process visible |
| Upload 1 meeting minutes document | Council Admin | Records section has content |

**Milestone:** Community can see their area, their induna, their schools and clinics.

### Week 3 — Engagement

| Task | Owner | Deliverable |
|---|---|---|
| Train Youth Rep on CMS | Unami | Youth Rep can create content |
| Publish 2 opportunities (1 job, 1 training) | Youth Rep | Opportunities section live |
| Create 1 program (June 22 youth event) | Youth Rep | Programs section live |
| Publish 1 blog post (community story) | Youth Rep | Blog has content |
| Add 5 photos to gallery | Youth Rep | Media page has content |
| Share site on WhatsApp groups | Council Admin | Community awareness |

**Milestone:** Youth engagement layer active. Opportunities visible.

### Week 4 — Polish & Handover

| Task | Owner | Deliverable |
|---|---|---|
| Add sponsor/partner logos | Council Admin | Credibility visible |
| Configure contact form + map | Unami | Contact page functional |
| Set up webhook (n8n or email) | Unami | Form submissions delivered |
| Review all content for accuracy | Council Admin | Quality check |
| Document weekly content cadence | Unami | ROLES.md handed over |
| Formal handover to council | Unami | Council owns the platform |

**Milestone:** Platform fully operational. Council is self-sufficient for content.

### Ongoing (Post-Launch)

| Cadence | Task | Owner |
|---|---|---|
| Weekly | Publish notices (meetings, announcements) | Council Admin |
| Weekly | 1 blog post or community story | Youth Rep |
| Weekly | Update opportunities (add new, mark expired) | Youth Rep |
| Monthly | Review directory listings for accuracy | Induna |
| Monthly | Upload meeting minutes | Council Admin |
| Quarterly | Review analytics + content performance | Unami |

---

## 13. Content Roles & Ownership

See [ROLES.md](./ROLES.md) for the full content ownership model, including:

- Role definitions (Council Admin, Induna, Youth Rep, Unami)
- Content permissions per role
- Approval flow for sensitive content
- Weekly content cadence
- Training requirements

---

## 14. Seed Data Architecture

Seed scripts populate a fresh Sanity project with structured content. Data is split into two layers: a generic template (shared across all councils) and council-specific overrides.

Full documentation: [SEEDING.md](./SEEDING.md)

### Two Layers

| Layer | Scripts | What it seeds |
|---|---|---|
| **Template** | `seed:pages`, `seed:menu`, `seed:trust` | 9 pages, blogPage, siteSettings, nav menu, Ingonyama Trust resources |
| **Council** | `seed:<council>` (e.g. `seed:mndozo`) | Identity, people, area, listings, notices, homepage, page overrides |

Run order: template first, then council.

```bash
# Everything at once
SANITY_WRITE_TOKEN=<token> npm run seed:mndozo:full

# Or separately
SANITY_WRITE_TOKEN=<token> npm run seed:template
SANITY_WRITE_TOKEN=<token> npm run seed:mndozo
```

### Seed Data Categories

Seed data falls into three categories based on accuracy requirements:

| Category | Description | Examples |
|---|---|---|
| **Verified data** | Real-world facts confirmed through research. Must be accurate. | School names, phone numbers, locations, Ingonyama Trust resources, legislation |
| **Dummy data** | Realistic placeholder content that demonstrates platform functionality. Clearly not real events. | Sample notices (meetings, announcements, resolutions), sample opportunities, sample programs |
| **Structural data** | Page layouts, section composition, menu structure. No factual claims. | Template pages, homepage sections, nav menu |

### What is NOT seeded

Posts and stories are **never seeded** — not even as dummy data. Blog content is created by the council's Youth Representative after launch. Seeding fake stories would undermine credibility and create content that needs to be deleted before handover.

### Coverage by Document Type

| Document Type | Seeded? | Category | Notes |
|---|---|---|---|
| `page` | ✅ Template + Council | Structural | 9 template pages, council overrides about/leadership/land |
| `homePage` | ✅ Council | Structural + Verified | Council name, stats from verified data |
| `blogPage` | ✅ Template | Structural | Bare singleton |
| `settings` | ✅ Template + Council | Verified | Template creates bare doc, council patches identity/colors |
| `person` | ✅ Council | Verified | Inkosi, Izinduna — must be real names |
| `listing` | ✅ Council | Verified | Schools, clinics, businesses — must be real places |
| `notice` | ✅ Council | Dummy | Sample notices to show the platform works |
| `record` | ✅ Template | Verified | Ingonyama Trust resources — real legislation, real forms |
| `post` | ❌ | — | Never seeded. Created by Youth Rep post-launch |
| `category` | ❌ | — | Created alongside first posts |
| `opportunity` | ❌ | — | Can be seeded as dummy data per council |
| `program` | ❌ | — | Can be seeded as dummy data per council |
| `campaign` | ❓ | — | Can be seeded as dummy data per council (sample CSR/activation) |
| `sponsor` | ❌ | — | Added when real sponsors are confirmed |

### Adding a New Council

1. Copy `scripts/seed-mndozo.ts` → `scripts/seed-<council>.ts`
2. Replace all council-specific data (people, area, listings, identity)
3. Add npm scripts: `seed:<council>` and `seed:<council>:full`
4. Run against the council's Sanity project

Template files must never reference a council name, person, or area. Council files own all council-specific content.

---

## 15. System Dynamics

Umkhandlu is not static content. It is a system with defined flows — information enters, moves through authority structures, and produces outcomes. These flows mirror how traditional governance actually works.

### Governance Flow

```
Notice (Meeting announced)
    → Community attends
        → Record (Minutes captured)
            → Decision made
                → Record (Resolution / Land Allocation)
                    → Visible on Area page + Map
```

The system creates traceability: every decision has a notice that announced it, a record that documents it, and an area that locates it. The Inkosi's approval is recorded with `approvedBy` reference. The community can see the outcome without accessing the council's internal records.

### Economic Flow

```
Listing created (business, service, trade)
    → Verified by Induna (✓)
        → Appears on Map + Directory
            → Can be promoted (Featured / Ad Banner)
                → Generates council revenue
```

Listings are not just directory entries. They are economic nodes — each one represents a real business operating on council land. Verification creates a trust layer. Promotion creates a revenue layer. The map makes the entire local economy visible.

### Campaign Flow

```
Sponsor identified
    → Campaign created (Draft)
        → Approved by council
            → Active — notices published, photos added
                → Completed — beneficiaries counted, deliverables logged
                    → Reported — impact summary written
                        → Data export for sponsor CSR report
```

This is not an advertising system. It is an accountability system. Every campaign has a sponsor, a target area, linked notices (distribution), photos (evidence), and impact metrics (outcomes). The export API produces structured data for CSR reporting.

**Live Example: Buffalo River Abstraction Works**

```
Newcastle Municipality (Sponsor — Government)
    → Buffalo River Works (Campaign — Initiative, Active)
        → Launch Notice (Announcement, Pinned, linked to campaign + area)
            → Visible on: homepage, /areas/mndozo, /campaigns/buffalo-river-...
```

As the project progresses:
- Photos added to gallery (construction milestones)
- Beneficiaries updated (100 employed → community served)
- Deliverables checked off (weir, boreholes, treatment works)
- Status: Active → Completed → Reported
- Impact summary written for municipal reporting

### Opportunity Flow

```
Opportunity created (job, training, bursary)
    → Visible to community (deadline-aware)
        → Action taken offline (apply, attend)
            → Outcome becomes Blog post / Program record
```

Opportunities are time-bound state containers. They auto-hide when deadlines pass. They link to areas so residents see what's available locally. The Youth Representative keeps them current.

### Spatial Flow

```
Listing gets geopoint (pinned on map)
    → Linked to Area (isigodi)
        → Area linked to Induna (authority)
            → Map shows: what exists, where, verified by whom
```

The map is not a feature. It is a community infrastructure register with a governance trust layer. Every pin has an authority chain: listing → area → induna → inkosi.

### What This Means

| Traditional term | System equivalent |
|---|---|
| Council meeting | Notice → Record flow |
| Land decision | Record with status + approvedBy |
| Community infrastructure | Listings with geopoints + verification |
| Development project | Campaign with lifecycle + impact tracking |
| Youth engagement | Opportunities + Programs + Blog |
| Sponsor accountability | Campaign export API |

The system doesn't change how the council governs. It structures the information that governance produces — making it visible, traceable, and exportable.

---

## 16. Operator SOP (Infrastructure Documentation)

The platform operator follows a Standard Operating Procedure for infrastructure project documentation. Full SOP: [SOP.md](./SOP.md)

### Pipeline

```
Raw input (contractor/engineer/PMU)
    → Validate (SOP rules — engineer overrides contractor)
        → Structure (progressLog entry + evidence)
            → Update (Sanity fields — append, never overwrite)
                → Publish (ISR — page live in seconds)
                    → Export (monthly PMU report via API)
```

### Decision Rules

| Rule | Logic |
|---|---|
| No unverified data | Engineer confirms → valid. Contractor alone → not enough. |
| Engineer overrides contractor | If conflict, engineer certification wins. |
| Municipality controls status | Only municipality can mark COMPLETED. |
| Weekly minimum | At least 1 progress log entry per week per active project. |

### Key Principle

> "Nothing enters the system unless it can survive engineer or PMU verification logic."

This turns the operator role into a contractable, auditable, scalable governance documentation function.

---

## 17. Technical Summary

| Metric | Count |
|---|---|
| Document types | 12 |
| Page builder sections | 27 |
| Singletons | 3 |
| Frontend routes | 15 |
| Server actions | 3 (with webhook delivery) |
| UI components | 7 |
| Total components | 66 |
| i18n translation keys | 50+ |
| Tests | 13 (all passing) |
| Biome lint errors | 0 |

---

## 18. Positioning

### For Councils

> "Umkhandlu is your digital council office. It structures how your decisions, notices, and community information are recorded and shared — without changing how you govern."

### For Ingonyama Trust

> "Umkhandlu is a governance state engine that structures how decisions, communication, and land-related information flow within traditional councils — creating the pre-Trust data layer that currently does not exist in digital form."

> "We prepare councils for structured engagement with the Ingonyama Trust Board by digitising governance processes, land allocation decisions, and community infrastructure at council level."

### For NGOs & Donors

> "Umkhandlu provides structured, traceable data on governance decisions, community infrastructure, and development activity across traditional authority areas — enabling targeted intervention and measurable impact through campaign tracking and data export."

### For Government

> "Umkhandlu digitises the local governance layer — structuring how notices, records, and decisions flow within traditional councils, creating transparency without disrupting authority structures."

### Internal (The Truth)

> "We didn't build a website. We built the missing operating system between traditional authority and modern coordination."

---

## 19. Ingonyama Trust Alignment

### The Gap This Platform Fills

The Ingonyama Trust Board typically sees the formalised layer: lease agreements, legal applications, disputes. They do NOT see the community-level governance that precedes formalisation — early land discussions, council approvals, local economic activity, infrastructure mapping.

Umkhandlu captures this **pre-Trust data layer** without overstepping into Trust territory.

### How the Platform Maps to the Real Land Allocation Flow

| Real-World Step | Platform Feature | What Gets Created |
|---|---|---|
| 1. Resident approaches Induna | Area page + induna profile | Local authority is visible |
| 2. Induna consults local knowledge | Listing directory (who/what is where) | Community infrastructure is mapped |
| 3. Matter goes to Umkhandlu meeting | Notice (type: meeting) | Meeting is announced publicly |
| 4. Council discusses and decides | Record (type: minutes) | Decision is documented |
| 5. Site inspection | Process section step | Procedure is transparent |
| 6. Inkosi approves | Record (type: land-allocation, status: approved, approvedBy: Inkosi) | Decision is permanently recorded |
| 7. PTO / letter issued | Record with PDF attachment | Document is archived digitally |
| 8. Trust registration | Final process step | Aligns with formal system |

### Land Allocation Records

The `record` document type supports `land-allocation` records with:
- **Status**: Approved, Pending, Rejected
- **Approved By**: Reference to the Inkosi or authority (person document)
- **Related Area**: Linked to the specific isigodi
- **PDF attachment**: Permission to Occupy or formal letter
- **Summary**: Public-facing description of the decision (no PII)

This creates a **transparency layer** — the public outcome of land decisions — without storing applicant personal information. The actual register stays with the council.

### Dispute Resolution Records

Same pattern: `dispute-resolution` records capture the **resolved outcome** with status (Resolved/Pending) and the authority who resolved it. No party names or sensitive details on the public site.

### Verification Trust Scoring

Every directory listing has a verification level:
- **Community Submitted** — unverified, added by anyone
- **Verified by Induna** — local headman confirms it exists (✓)
- **Council Approved** — full council verification (✓✓)

This creates a trust layer in community data that NGOs, government, and the Trust can rely on.

### What NOT to Say to the Trust

❌ "We integrate with Ingonyama Trust"
❌ "We digitise Trust land"
❌ "We replace the land allocation process"

✅ "We support traditional councils with digital governance tools"
✅ "We prepare councils for structured engagement with the Trust"
✅ "We create community-level data that can feed into provincial systems"

---

*Built by Unami Digital. Private project.*
