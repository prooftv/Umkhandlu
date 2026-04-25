# Council Deployment Runbook

Operational checklist for deploying Umkhandlu for a new council. Follow in order.

---

## 1. Sanity Project

- [ ] Create project at [sanity.io/manage](https://www.sanity.io/manage)
- [ ] Create `production` dataset
- [ ] Generate API read token (Settings → API → Tokens)
- [ ] Note: Project ID, dataset name, token

## 2. Code

- [ ] Clone repo: `git clone https://github.com/prooftv/Umkhandlu.git`
- [ ] Edit `src/lib/siteConfig.ts`:
  ```ts
  export const SITE_NAME = 'Council Name Here';
  export const SITE_DESCRIPTION = 'Description here.';
  ```
- [ ] Commit and push to a new branch or fork

## 3. Vercel Project

- [ ] Create new project at [vercel.com/new](https://vercel.com/new)
- [ ] Import the repo (or fork)
- [ ] Set environment variables:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | From step 1 |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-08-22` |
| `NEXT_PUBLIC_SITE_URL` | `https://councilname.umkhandlu.org` |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | `https://councilname.umkhandlu.org/studio` |
| `SANITY_API_READ_TOKEN` | From step 1 |
| `MAX_STATIC_PARAMS` | `50` |
| `NEXT_PUBLIC_GTM_ID` | (optional) |

- [ ] Deploy

## 4. Domain

- [ ] In Vercel project → Settings → Domains → Add `councilname.umkhandlu.org`
- [ ] DNS: Ensure wildcard CNAME exists (`*.umkhandlu.org` → `cname.vercel-dns.com`)
- [ ] Or add specific CNAME: `councilname` → `cname.vercel-dns.com`
- [ ] Wait for SSL certificate (automatic, ~2 minutes)

## 5. Sanity CORS

- [ ] In Sanity project → Settings → API → CORS Origins
- [ ] Add: `https://councilname.umkhandlu.org`
- [ ] Add: `http://localhost:3000` (for local dev)

## 6. First Content (CMS)

Open `https://councilname.umkhandlu.org/studio` and create:

- [ ] **Site Settings** (document ID: `siteSettings`)
  - Title, description, contact email, phone
  - Branding: primary + secondary hex colors
  - Menu items
- [ ] **Home Page** (document ID: `homePage`)
  - Hero section (council name, tagline, image)
  - At least 1 more section (noticeList, teamGrid, or CTA)
- [ ] **3 Person profiles** (Inkosi + 2 Izinduna minimum)
- [ ] **1 Notice** (upcoming meeting or announcement)

## 7. Verify

- [ ] Homepage loads with content
- [ ] Studio accessible at `/studio`
- [ ] Brand colors applied
- [ ] Header shows council name + menu
- [ ] At least one notice visible

## 8. Handover

- [ ] Train Council Admin on CMS (2 hours)
- [ ] Share ROLES.md with council
- [ ] Set up webhook URL if using n8n/Make (Settings → Analytics)
- [ ] Document weekly content cadence

---

## DNS Setup (One-Time for umkhandlu.org)

If this is the first deployment on the domain:

```
Type: A     Name: @    Value: 76.76.21.21
Type: CNAME Name: *    Value: cname.vercel-dns.com
```

This enables all subdomains to route to Vercel automatically.

---

## Estimated Time

| Step | Time |
|---|---|
| Sanity project | 5 min |
| Code config | 2 min |
| Vercel project + env vars | 10 min |
| Domain + DNS | 5 min |
| CORS | 2 min |
| First content | 30-60 min |
| Verify | 5 min |
| **Total** | **~1.5 hours** |
