# Umkhandlu — Project Playbook

## Community Digital Platform for Traditional Councils

**Version:** 1.0
**Status:** Production-Ready
**Repository:** github.com/prooftv/Umkhandlu

---

## 1. Executive Summary

Umkhandlu is a digital platform that gives traditional councils (izinduna, amakhosi) a structured online presence. It digitises governance, community infrastructure, economic activity, and youth development — creating the first structured digital record of rural communities under traditional authority.

This is not a website. It is a **digital governance and community intelligence layer** that sits on top of existing traditional authority structures without replacing them.

### The Problem

- Traditional councils operate offline, paper-based, word-of-mouth
- No structured digital visibility for communities under Ingonyama Trust land
- No central information system for residents, NGOs, or government departments
- Youth have no digital pipeline for opportunities, content, or engagement
- Local economy (spaza shops, services, trades) is completely invisible digitally

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

#### 9 Document Types

| Type | Purpose | Key Fields |
|---|---|---|
| `page` | Generic CMS pages | Name, slug, page builder sections, SEO |
| `post` | Blog posts, stories, learner content | Title, author, categories, content, image, SEO |
| `person` | Leadership, council, sponsors, community | Name, role, type (inkosi/induna/council/youth/sponsor/community), skills, organization |
| `category` | Content categories | Title, slug, description |
| `notice` | Community notices | Title, type (meeting/announcement/resolution/alert/opportunity), date, pinned, relatedArea |
| `listing` | Directory (schools, clinics, businesses, areas) | Name, type, location, contact, image, featured, induna reference, relatedListings |
| `opportunity` | Jobs, training, bursaries, funding | Title, type, description, organization, deadline, apply link, relatedArea, featured |
| `program` | Youth events, skills programs, school collabs | Title, type, status (upcoming/active/completed), date, relatedArea |
| `record` | Governance documents | Title, type (minutes/resolution/policy/report), date, summary, content, PDF file, relatedArea |

#### 3 Singletons

| Singleton | Purpose |
|---|---|
| `homePage` | Homepage content + page builder |
| `blogPage` | Blog listing page SEO |
| `settings` | Site title, description, menu, social links (Facebook, Twitter, Instagram, YouTube, WhatsApp), contact info (email, phone, address), GTM ID, default OG image |

#### 19 Page Builder Sections

Any page can be composed from these sections in any order:

| Section | Purpose |
|---|---|
| `hero` | Page hero with heading, rich text, image, CTA buttons |
| `mediaText` | Image + text side-by-side (configurable left/right) |
| `cta` | Call to action with gradient background |
| `cardGrid` | Grid of content cards with headings and rich text |
| `postList` | Latest blog posts from CMS |
| `teamGrid` | Leadership/council member profiles with photos and roles |
| `noticeList` | Community notices (filterable by type, pinnable) |
| `opportunityList` | Jobs, training, bursaries (deadline-aware, auto-hides expired) |
| `programList` | Programs & events (filterable by status) |
| `listingGrid` | Community directory (filterable by type: school/clinic/business/church/area) |
| `recordList` | Governance documents (filterable by type) |
| `process` | Step-by-step visual timeline (for land allocation, governance processes) |
| `gallery` | Photo gallery with captions and hover reveal |
| `contactForm` | Contact form with server action + optional Google Maps embed |
| `subscribe` | Newsletter signup with server action |
| `logoGrid` | Sponsors/partners logo display (grayscale → color on hover) |
| `adBanner` | Sponsor banners with date scheduling and size options |
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
Umkhandlu
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
├── ─────────
└── Site Settings ⚙️
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

Umkhandlu is designed as a **reusable template** for any traditional council. The same codebase can serve multiple communities:

### Template Model

```
Umkhandlu (Base Template)
├── Council A (Mndozo) — customised content via Sanity
├── Council B (Another area) — same code, different Sanity dataset
├── Council C — same code, different Sanity dataset
└── ...
```

### What Changes Per Deployment

- Sanity dataset (content)
- Environment variables
- Domain name
- Logo and branding (via CMS settings)

### What Stays the Same

- All code, components, sections, schemas
- SEO infrastructure
- Analytics integration
- i18n system

### Future Integrations (Phase 2+)

| Integration | Purpose |
|---|---|
| **n8n / Make** | Workflow automation (WhatsApp notifications, opportunity scraping) |
| **Supabase** | Database for form submissions, user accounts |
| **Interactive Map** | Mapbox/Google Maps with pins for schools, clinics, businesses |
| **UNCIP** | Child safety alerts integration |
| **Unami Schools** | Linked school platforms |
| **Unami Drones** | Skills program content pipeline |
| **WhatsApp Business API** | Community notifications via Moments |

---

## 8. Content Population Guide

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

## 9. Competitive Positioning

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

## 10. Technical Summary

| Metric | Count |
|---|---|
| Document types | 9 |
| Page builder sections | 19 |
| Singletons | 3 |
| Frontend routes | 10 |
| Server actions | 3 |
| UI components | 7 |
| Module components | 13 |
| Section components | 19 |
| i18n translation keys | 50+ |
| Tests | 13 (all passing) |
| TypeScript errors | 0 (new) |
| Biome lint errors | 0 |

---

*Built by Unami Digital. Private project.*
