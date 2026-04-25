# Umkhandlu

Community digital platform for traditional councils, youth programs, and local governance. Built with Next.js, Sanity CMS, and Tailwind CSS.

## What This Is

Umkhandlu is the digital hub for traditional councils (izinduna, amakhosi). It provides:

- CMS-driven pages with a modular page builder
- Community notices (meetings, announcements, alerts, opportunities)
- Leadership profiles with roles and organizations
- Blog/stories for youth content and community updates
- Photo galleries for events and media
- Contact forms with optional map embeds
- Newsletter subscriptions
- Zulu/English language toggle
- Google Tag Manager integration (CMS-configurable)
- Full SEO: sitemap, JSON-LD, Open Graph, canonical URLs

## Tech Stack

- **Next.js 15** (App Router, Turbopack)
- **Sanity v3** (Headless CMS + Studio)
- **Tailwind CSS v4** + shadcn/ui
- **TypeScript**
- **Valibot** (validation)
- **Vitest** (testing)
- **Biome** (linting + formatting)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in your Sanity project ID, dataset, and API token.

### 3. Start development

```bash
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Sanity Studio: [http://localhost:3000/studio](http://localhost:3000/studio)

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset name |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version |
| `NEXT_PUBLIC_SITE_URL` | Public site URL |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | Studio URL |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager ID (optional, also configurable in CMS) |
| `SANITY_API_READ_TOKEN` | Server-side Sanity read token |
| `MAX_STATIC_PARAMS` | Max static params for ISR |

## Content Architecture

### Document Types

| Type | Purpose |
|---|---|
| `page` | Generic pages (About, Land, Youth, Schools, Projects, etc.) |
| `post` | Blog posts, stories, learner content |
| `person` | Leadership, council members, sponsors, authors |
| `category` | Content categories |
| `notice` | Community notices (meeting, announcement, alert, opportunity) |

### Page Builder Sections (11)

| Section | Use Case |
|---|---|
| `hero` | Page hero with heading, rich text, image, CTA buttons |
| `mediaText` | Image + text side-by-side (configurable position) |
| `cta` | Call to action with gradient background |
| `cardGrid` | Grid of content cards |
| `postList` | Latest blog posts |
| `teamGrid` | Leadership/council member profiles |
| `noticeList` | Community notices (filterable by type, pinnable) |
| `gallery` | Photo gallery with captions |
| `contactForm` | Contact form with optional Google Maps embed |
| `subscribe` | Newsletter signup |
| `divider` | Visual separator |

### Singletons

| Singleton | Purpose |
|---|---|
| `homePage` | Homepage content + page builder |
| `blogPage` | Blog listing page SEO |
| `settings` | Site title, description, menu, social links, contact info, GTM ID |

## Sanity Studio Structure

```
Umkhandlu
├── Home
├── Blog Page
├── Pages
├── ─────────
├── Posts & Stories
├── Community Notices
├── Categories
├── ─────────
├── Leadership & People
├── ─────────
└── Site Settings
    ├── General (title, description, menu, OG image)
    ├── Social & Contact (email, phone, address, social URLs, WhatsApp)
    └── Analytics (GTM ID)
```

## Folder Structure

```
src/
├── actions/          # Server actions (subscribe, contact, draft mode)
├── app/
│   ├── (frontend)/   # Public routes
│   ├── api/          # API routes
│   └── studio/       # Sanity Studio
├── components/
│   ├── icons/        # SVG icon components
│   ├── layout/       # Header, Footer, NavBar, Main
│   ├── modules/      # Data-aware components (PostCard, Byline, etc.)
│   ├── sections/     # Page builder sections
│   ├── templates/    # Page templates (Post, Page, PostRiver)
│   └── ui/           # Pure UI components (Button, Badge, Pagination)
├── env/              # Environment variable config
├── hooks/            # Custom React hooks
├── lib/
│   ├── i18n/         # Zulu/English translations + locale context
│   └── sanity/       # Client, queries, fragments, SEO, JSON-LD
├── studio/
│   ├── components/   # Custom Sanity Studio components
│   ├── schema/       # All Sanity schemas
│   └── structure/    # Studio navigation structure
└── utils/            # Utility functions
```

## i18n (Zulu / English)

The language toggle in the header switches between English and isiZulu. Translations are in `src/lib/i18n/translations.ts`. Usage in client components:

```tsx
import { useLocale } from '@/lib/i18n/LocaleContext';

function MyComponent() {
  const { t } = useLocale();
  return <p>{t('blog.readMore')}</p>;
}
```

CMS content (headings, body text) is managed in Sanity and is not translated by this system — that requires Sanity's document internationalization plugin for full bilingual CMS content.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server + type generation |
| `npm run next:build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Lint with Biome |
| `npm run test` | Run tests with Vitest |
| `npm run typecheck` | TypeScript type check |
| `ANALYZE=true npm run next:build` | Bundle analysis |

## License

Private project.
