/**
 * Mndozo Council Seed Script
 *
 * Seeds ALL Mndozo-specific content into Sanity.
 * Idempotent — safe to run multiple times.
 *
 * Creates:  people, area, listings, notices, homepage
 * Replaces: about, leadership, land pages (with Mndozo content)
 * Patches:  siteSettings (identity + colors), menu (areas link),
 *           land notice (relatedArea)
 *
 * Run AFTER: seed-pages, seed-menu, seed-trust-resources
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<token> npx tsx scripts/seed-mndozo.ts
 */

import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    'Missing env vars. Run with:\n  SANITY_WRITE_TOKEN=<token> npx tsx scripts/seed-mndozo.ts'
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-08-22',
  useCdn: false,
});

// ─── HELPER ──────────────────────────────────────────────────

function textBlock(key: string, text: string) {
  return {
    _key: key,
    _type: 'block',
    children: [{ _key: `${key}-span`, _type: 'span', marks: [], text }],
    markDefs: [],
    style: 'normal',
  };
}

// ─── IDS ─────────────────────────────────────────────────────

const INKOSI_ID = 'person-inkosi';
const INDUNA_IDS = ['person-induna-1', 'person-induna-2', 'person-induna-3'];
const AREA_ID = 'listing-area-mndozo';

const memberRefs = [INKOSI_ID, ...INDUNA_IDS].map((id, i) => ({
  _key: `ref-${i + 1}`,
  _type: 'reference',
  _ref: id,
}));

// ─── PEOPLE ──────────────────────────────────────────────────

const inkosi = {
  _id: INKOSI_ID,
  _type: 'person',
  firstName: 'Inkosi',
  lastName: 'Kubheka',
  slug: { _type: 'slug', current: 'inkosi-kubheka' },
  role: 'Inkosi',
  personType: 'inkosi',
  organization: 'Mndozo Traditional Council',
};

const izinduna = [
  {
    _id: 'person-induna-1',
    _type: 'person',
    firstName: 'Induna',
    lastName: 'Dlamini',
    slug: { _type: 'slug', current: 'induna-dlamini' },
    role: 'Induna — Isigodi KwaNtuli',
    personType: 'induna',
  },
  {
    _id: 'person-induna-2',
    _type: 'person',
    firstName: 'Induna',
    lastName: 'KwaMthembu',
    slug: { _type: 'slug', current: 'induna-kwamthembu' },
    role: 'Induna — Isigodi KwaMthembu',
    personType: 'induna',
  },
  {
    _id: 'person-induna-3',
    _type: 'person',
    firstName: 'Induna',
    lastName: 'KwaNdlovu',
    slug: { _type: 'slug', current: 'induna-kwandlovu' },
    role: 'Induna — Isigodi KwaNdlovu',
    personType: 'induna',
  },
];

// ─── AREA ────────────────────────────────────────────────────

const area = {
  _id: AREA_ID,
  _type: 'listing',
  name: 'Mndozo Traditional Area',
  slug: { _type: 'slug', current: 'mndozo' },
  listingType: 'area',
  description:
    'A rural traditional authority area under the Mndozo Traditional Council, comprising multiple isigodi, schools, clinics, and community infrastructure.',
  location: 'Amajuba District, KwaZulu-Natal',
  featured: true,
  induna: { _type: 'reference', _ref: 'person-induna-1' },
};

// ─── LISTINGS ────────────────────────────────────────────────

const listings = [
  {
    _id: 'listing-school-khethokuhle',
    _type: 'listing',
    name: 'Khethokuhle Primary School',
    slug: { _type: 'slug', current: 'khethokuhle-primary-school' },
    listingType: 'school',
    description: 'Primary school serving the Mndozo rural community.',
    location: 'Mndozo, KwaZulu-Natal',
    contactInfo: '036 004 0015',
    servicesOffered: ['Primary Education'],
    verifiedByInduna: 'community',
  },
  {
    _id: 'listing-school-izazi',
    _type: 'listing',
    name: 'Izazi Secondary School',
    slug: { _type: 'slug', current: 'izazi-secondary-school' },
    listingType: 'school',
    description: 'Secondary school serving learners in the Mndozo area.',
    location: 'Mndozo, KwaZulu-Natal',
    contactInfo: '034 183 9920',
    servicesOffered: ['Secondary Education'],
    verifiedByInduna: 'community',
  },
  {
    _id: 'listing-school-buhle',
    _type: 'listing',
    name: 'Buhle-Bomzinyathi Secondary School',
    slug: { _type: 'slug', current: 'buhle-bomzinyathi-secondary-school' },
    listingType: 'school',
    description: 'Secondary school located near Dicks Holt Farm.',
    location: 'Dicks Holt Farm, KwaZulu-Natal',
    contactInfo: '034 366 7485',
    servicesOffered: ['Secondary Education'],
    verifiedByInduna: 'community',
  },
  {
    _id: 'listing-school-sgodiphola',
    _type: 'listing',
    name: 'Sgodiphola Primary School',
    slug: { _type: 'slug', current: 'sgodiphola-primary-school' },
    listingType: 'school',
    description: 'Primary school serving the surrounding rural community.',
    location: 'Mndozo, KwaZulu-Natal',
    servicesOffered: ['Primary Education'],
    verifiedByInduna: 'community',
  },
];

// ─── NOTICES ─────────────────────────────────────────────────

const notices = [
  {
    _id: 'notice-meeting-1',
    _type: 'notice',
    title: 'Monthly Traditional Council Meeting',
    slug: { _type: 'slug', current: 'monthly-traditional-council-meeting' },
    noticeType: 'meeting',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    excerpt:
      'All community members are invited to attend the monthly traditional council meeting. Agenda includes land allocation updates, infrastructure planning, and youth development initiatives.',
    pinned: true,
    relatedArea: { _type: 'reference', _ref: AREA_ID },
  },
  {
    _id: 'notice-water-1',
    _type: 'notice',
    title: 'Water Supply Interruption Notice',
    slug: { _type: 'slug', current: 'water-supply-interruption' },
    noticeType: 'announcement',
    date: new Date().toISOString(),
    excerpt:
      'Temporary interruption of water supply due to maintenance of community infrastructure. Residents are advised to store sufficient water.',
    pinned: false,
    relatedArea: { _type: 'reference', _ref: AREA_ID },
  },
  {
    _id: 'notice-resolution-1',
    _type: 'notice',
    title: 'Resolution: Community Hall Construction Approved',
    slug: { _type: 'slug', current: 'community-hall-construction-approved' },
    noticeType: 'resolution',
    date: new Date().toISOString(),
    excerpt:
      'The council has approved the development of a new multipurpose community hall in KwaNtuli isigodi. Construction planning to commence in the next quarter.',
    pinned: false,
    relatedArea: { _type: 'reference', _ref: AREA_ID },
  },
];

// ─── OPPORTUNITIES (DUMMY) ───────────────────────────────────

const opportunities = [
  {
    _id: 'opportunity-job-1',
    _type: 'opportunity',
    title: 'General Worker — Amajuba District Municipality',
    slug: { _type: 'slug', current: 'general-worker-amajuba' },
    opportunityType: 'job',
    description:
      'The Amajuba District Municipality invites applications for general worker positions in community infrastructure maintenance. No formal qualifications required. Valid ID and willingness to work outdoors essential.',
    organization: 'Amajuba District Municipality',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    relatedArea: { _type: 'reference', _ref: AREA_ID },
  },
  {
    _id: 'opportunity-training-1',
    _type: 'opportunity',
    title: 'Basic Computer Skills Training — Free',
    slug: { _type: 'slug', current: 'basic-computer-skills-training' },
    opportunityType: 'training',
    description:
      'Free computer literacy training for youth aged 18-35. Covers basic computer use, email, internet, and Microsoft Office. Certificate issued on completion. Held at the community hall.',
    organization: 'KZN Department of Economic Development',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    relatedArea: { _type: 'reference', _ref: AREA_ID },
  },
  {
    _id: 'opportunity-bursary-1',
    _type: 'opportunity',
    title: 'NSFAS Bursary Applications Open',
    slug: { _type: 'slug', current: 'nsfas-bursary-applications' },
    opportunityType: 'bursary',
    description:
      'The National Student Financial Aid Scheme is accepting applications for the upcoming academic year. Covers tuition, accommodation, and living allowance at public universities and TVET colleges.',
    organization: 'NSFAS',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://www.nsfas.org.za',
    featured: true,
  },
];

// ─── PROGRAMS (DUMMY) ────────────────────────────────────────

const programs = [
  {
    _id: 'program-youth-1',
    _type: 'program',
    title: 'Youth Career Guidance Day',
    slug: { _type: 'slug', current: 'youth-career-guidance-day' },
    programType: 'youth-event',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    description:
      'Career guidance event for Grade 11 and 12 learners. Speakers from local businesses, government departments, and universities.',
    status: 'upcoming',
    relatedArea: { _type: 'reference', _ref: AREA_ID },
  },
  {
    _id: 'program-skills-1',
    _type: 'program',
    title: 'Sewing and Textile Skills Programme',
    slug: { _type: 'slug', current: 'sewing-textile-skills-programme' },
    programType: 'skills',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    description:
      'Practical sewing and textile skills training for women and youth. Materials provided. Runs every Saturday for 8 weeks.',
    status: 'active',
    relatedArea: { _type: 'reference', _ref: AREA_ID },
  },
  {
    _id: 'program-school-1',
    _type: 'program',
    title: 'Matric Revision Bootcamp',
    slug: { _type: 'slug', current: 'matric-revision-bootcamp' },
    programType: 'school',
    date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    description:
      'Intensive revision sessions for matric learners in Mathematics, Physical Science, and English. Free of charge.',
    status: 'upcoming',
    relatedArea: { _type: 'reference', _ref: AREA_ID },
  },
];

// ─── SPONSORS (DUMMY) ────────────────────────────────────────

const sponsors = [
  {
    _id: 'sponsor-unami-foundation',
    _type: 'sponsor',
    name: 'Unami Foundation',
    slug: { _type: 'slug', current: 'unami-foundation' },
    sponsorType: 'ngo',
    description:
      'Supporting digital governance infrastructure and community development projects for traditional councils.',
    website: 'https://www.unamifoundation.org',
    contactEmail: 'info@unamifoundation.org',
    contactPhone: '072 700 2502',
  },
];

// ─── HOMEPAGE ────────────────────────────────────────────────

const homePage = {
  _id: 'homePage',
  _type: 'homePage',
  name: 'Home Page',
  pageSections: [
    {
      _key: 'hero-1',
      _type: 'hero',
      heading: 'Umkhandlu waseMndozo',
      text: [
        textBlock(
          'block-1',
          'Serving the community through leadership, development, and transparency. The official digital platform of the Mndozo Traditional Council.'
        ),
      ],
    },
    {
      _key: 'stats-1',
      _type: 'stats',
      heading: 'Our Community',
      items: [
        { _key: 'stat-1', value: '3', label: 'Izigodi' },
        { _key: 'stat-2', value: '4', label: 'Schools' },
      ],
    },
    {
      _key: 'notices-1',
      _type: 'noticeList',
      heading: 'Community Notices',
      numberOfNotices: 5,
      filterType: 'all',
    },
    {
      _key: 'team-1',
      _type: 'teamGrid',
      heading: 'Our Leadership',
      description: 'The traditional authority serving the Mndozo community.',
      members: memberRefs,
    },
    {
      _key: 'quote-1',
      _type: 'quote',
      text: 'We serve our community with integrity, transparency, and a commitment to development that benefits all residents of Mndozo.',
      author: { _type: 'reference', _ref: INKOSI_ID },
    },
    {
      _key: 'directory-1',
      _type: 'listingGrid',
      heading: 'Community Directory',
      description: 'Schools and community facilities in the Mndozo area.',
      filterType: 'all',
      limit: 6,
    },
    {
      _key: 'opportunities-1',
      _type: 'opportunityList',
      heading: 'Opportunities',
      description: 'Jobs, training, and bursaries for the community.',
      filterType: 'all',
      limit: 5,
    },
    {
      _key: 'cta-1',
      _type: 'cta',
      heading: 'Community Participation',
      text: 'Stay informed and engaged with council activities. Attend meetings, share opportunities, and help build a stronger Mndozo.',
    },
    {
      _key: 'subscribe-1',
      _type: 'subscribe',
      heading: 'Stay Updated',
      content: [
        textBlock(
          'sub-block-1',
          'Subscribe to receive community notices, opportunities, and updates from the Mndozo Traditional Council.'
        ),
      ],
      buttonText: 'Subscribe',
    },
  ],
};

// ─── MNDOZO PAGE OVERRIDES ───────────────────────────────────
// Full page replacements — idempotent via createOrReplace.

const aboutPage = {
  _id: 'page-about',
  _type: 'page',
  name: 'About the Council',
  slug: { _type: 'slug', current: 'about' },
  pageSections: [
    {
      _key: 'about-hero',
      _type: 'hero',
      heading: 'About Umkhandlu waseMndozo',
      text: [
        textBlock(
          'about-hero-text',
          'The Mndozo Traditional Council serves the community through governance, development, and the preservation of cultural heritage under the leadership of Inkosi Kubheka.'
        ),
      ],
    },
    {
      _key: 'about-richtext',
      _type: 'richText',
      heading: 'Our Role',
      content: [
        textBlock(
          'about-rt-1',
          'The Umkhandlu waseMndozo is the traditional council responsible for governance, land administration, community development, and dispute resolution within the Mndozo Traditional Authority area in the Amajuba District of KwaZulu-Natal.'
        ),
        textBlock(
          'about-rt-2',
          'The council operates under the authority of the Inkosi and comprises Izinduna (headmen) representing each isigodi, council members, and youth representatives. Together, they ensure that community needs are addressed, governance is transparent, and development is inclusive.'
        ),
        textBlock(
          'about-rt-3',
          'Land within the Mndozo area falls under the custodianship of the Ingonyama Trust Board. The council works within this framework to administer land allocation, resolve disputes, and coordinate development initiatives.'
        ),
      ],
    },
    {
      _key: 'about-stats',
      _type: 'stats',
      heading: 'Mndozo at a Glance',
      items: [
        { _key: 'stat-1', value: '3', label: 'Izigodi (Wards)' },
        { _key: 'stat-2', value: '4', label: 'Schools' },
      ],
    },
    {
      _key: 'about-team',
      _type: 'teamGrid',
      heading: 'Our Leadership',
      description: 'The traditional authority serving the Mndozo community.',
      members: memberRefs,
    },
    {
      _key: 'about-quote',
      _type: 'quote',
      text: 'We serve our community with integrity, transparency, and a commitment to development that benefits all residents of Mndozo.',
      author: { _type: 'reference', _ref: INKOSI_ID },
    },
  ],
};

const leadershipPage = {
  _id: 'page-leadership',
  _type: 'page',
  name: 'Leadership',
  slug: { _type: 'slug', current: 'leadership' },
  pageSections: [
    {
      _key: 'lead-hero',
      _type: 'hero',
      heading: 'Our Leadership',
      text: [
        textBlock(
          'lead-hero-text',
          'The Mndozo Traditional Council is led by Inkosi Kubheka, supported by Izinduna and council members who serve each isigodi.'
        ),
      ],
    },
    {
      _key: 'lead-richtext',
      _type: 'richText',
      heading: 'Governance Structure',
      content: [
        textBlock(
          'lead-rt-1',
          'The traditional authority follows the established governance hierarchy: the Inkosi provides overall leadership, Izinduna serve as headmen for each isigodi (ward), and council members represent community interests in governance decisions.'
        ),
        textBlock(
          'lead-rt-2',
          'Youth representatives ensure that the voices of young people are heard in council deliberations, particularly on matters of education, employment, and community development.'
        ),
      ],
    },
    {
      _key: 'lead-team',
      _type: 'teamGrid',
      heading: 'Inkosi & Izinduna',
      members: memberRefs,
    },
  ],
};

// ─── MENU PATCH ──────────────────────────────────────────────

async function patchMenu(tx: ReturnType<typeof client.transaction>) {
  const current = await client.fetch<{
    menu: { _key: string; childMenu?: { _key: string }[] }[];
  }>(`*[_id == "siteSettings"][0]{ menu }`);

  if (!current?.menu) return;

  const communityItem = current.menu.find(
    (item) => item._key === 'menu-community'
  );
  if (!communityItem?.childMenu) return;

  const hasAreas = communityItem.childMenu.some(
    (child) => child._key === 'menu-areas'
  );
  if (hasAreas) return;

  tx.patch('siteSettings', (p) =>
    p.append('menu[_key=="menu-community"].childMenu', [
      {
        _key: 'menu-areas',
        _type: 'menuItem',
        text: 'Areas',
        type: 'link',
        link: {
          _type: 'link',
          type: 'external',
          external: '/areas/mndozo',
        },
      },
    ])
  );
}

// ─── SEED ────────────────────────────────────────────────────

async function seed() {
  const transaction = client.transaction();

  // Patch settings — layer identity on top, preserve menu
  transaction.patch('siteSettings', (p) =>
    p.set({
      title: 'Umkhandlu waseMndozo',
      description:
        'Official digital platform of the Mndozo Traditional Council. Serving the community through leadership, development, and transparency.',
      contactEmail: 'info@mndozo.umkhandlu.org',
      contactPhone: '+27 XX XXX XXXX',
      address: 'Mndozo, Amajuba District, KwaZulu-Natal, South Africa',
      primaryColor: '#16a34a',
      secondaryColor: '#f59e0b',
    })
  );

  // People
  transaction.createOrReplace(inkosi);
  for (const induna of izinduna) {
    transaction.createOrReplace(induna);
  }

  // Area + listings
  transaction.createOrReplace(area);
  for (const listing of listings) {
    transaction.createOrReplace(listing);
  }
  transaction.patch(AREA_ID, (patch) =>
    patch.set({
      relatedListings: listings.map((l) => ({
        _key: l._id,
        _type: 'reference',
        _ref: l._id,
      })),
    })
  );

  // Notices
  for (const notice of notices) {
    transaction.createOrReplace(notice);
  }

  // Opportunities (dummy)
  for (const opportunity of opportunities) {
    transaction.createOrReplace(opportunity);
  }

  // Programs (dummy)
  for (const program of programs) {
    transaction.createOrReplace(program);
  }

  // Sponsors (dummy)
  for (const sponsor of sponsors) {
    transaction.createOrReplace(sponsor);
  }

  // Homepage
  transaction.createOrReplace(homePage);

  // Page overrides — full replace, idempotent
  transaction.createOrReplace(aboutPage);
  transaction.createOrReplace(leadershipPage);

  // Patch land notice with Mndozo area
  transaction.patch('notice-land-application', (p) =>
    p.set({ relatedArea: { _type: 'reference', _ref: AREA_ID } })
  );

  // Patch projects page logoGrid with Mndozo sponsors
  transaction.patch('page-projects', (p) =>
    p.set({
      'pageSections[_key=="projects-logos"].sponsors': sponsors.map((s) => ({
        _key: s._id,
        _type: 'reference',
        _ref: s._id,
      })),
    })
  );

  // Patch menu with Areas link
  await patchMenu(transaction);

  console.log('Seeding Mndozo council data...');
  const result = await transaction.commit();
  console.log(`Done. ${result.results.length} documents created/updated.`);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
