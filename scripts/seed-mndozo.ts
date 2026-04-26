/**
 * Mndozo Council Seed Script
 *
 * Seeds the minimum viable "credible council" into Sanity.
 * Run once after deployment to make the site look alive.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<token> npx tsx scripts/seed-mndozo.ts
 *
 * Requires a Sanity write token (not the read token).
 * Generate one at: sanity.io/manage → project → API → Tokens → Add token (Editor)
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

// ─── SETTINGS ────────────────────────────────────────────────

const settings = {
  _id: 'siteSettings',
  _type: 'settings',
  title: 'Umkhandlu waseMndozo',
  description:
    'Official digital platform of the Mndozo Traditional Council. Serving the community through leadership, development, and transparency.',
  contactEmail: 'info@mndozo.umkhandlu.org',
  contactPhone: '+27 XX XXX XXXX',
  address: 'Mndozo, Amajuba District, KwaZulu-Natal, South Africa',
  primaryColor: '#16a34a',
  secondaryColor: '#f59e0b',
  menu: [
    {
      _key: 'menu-home',
      _type: 'menuItem',
      text: 'Home',
      type: 'link',
      link: {
        _type: 'link',
        type: 'internal',
        internal: { _type: 'reference', _ref: 'homePage' },
      },
    },
    {
      _key: 'menu-council',
      _type: 'menuItem',
      text: 'Council',
      type: 'child-menu',
      childMenu: [
        {
          _key: 'menu-about',
          _type: 'menuItem',
          text: 'About',
          type: 'link',
          link: {
            _type: 'link',
            type: 'internal',
            internal: { _type: 'reference', _ref: 'page-about' },
          },
        },
        {
          _key: 'menu-leadership',
          _type: 'menuItem',
          text: 'Leadership',
          type: 'link',
          link: {
            _type: 'link',
            type: 'internal',
            internal: { _type: 'reference', _ref: 'page-leadership' },
          },
        },
        {
          _key: 'menu-land',
          _type: 'menuItem',
          text: 'Land & Governance',
          type: 'link',
          link: {
            _type: 'link',
            type: 'internal',
            internal: { _type: 'reference', _ref: 'page-land' },
          },
        },
      ],
    },
    {
      _key: 'menu-community',
      _type: 'menuItem',
      text: 'Community',
      type: 'child-menu',
      childMenu: [
        {
          _key: 'menu-notices',
          _type: 'menuItem',
          text: 'Notices',
          type: 'link',
          link: {
            _type: 'link',
            type: 'internal',
            internal: { _type: 'reference', _ref: 'page-notices' },
          },
        },
        {
          _key: 'menu-directory',
          _type: 'menuItem',
          text: 'Directory',
          type: 'link',
          link: {
            _type: 'link',
            type: 'internal',
            internal: { _type: 'reference', _ref: 'page-directory' },
          },
        },
      ],
    },
    {
      _key: 'menu-contact',
      _type: 'menuItem',
      text: 'Contact',
      type: 'link',
      link: {
        _type: 'link',
        type: 'internal',
        internal: { _type: 'reference', _ref: 'page-contact' },
      },
    },
  ],
};

// ─── PEOPLE ──────────────────────────────────────────────────

const inkosi = {
  _id: 'person-inkosi',
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
  _id: 'listing-area-mndozo',
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
    _id: 'listing-school-1',
    _type: 'listing',
    name: 'Duck Ponds High School',
    slug: { _type: 'slug', current: 'duck-ponds-high-school' },
    listingType: 'school',
    description: 'Public secondary school serving the Mndozo catchment area.',
    location: 'Mndozo, KwaZulu-Natal',
    contactInfo: '+27 XX XXX XXXX',
    operatingHours: 'Mon–Fri 07:30–14:30',
    servicesOffered: ['Grades 8-12', 'NSC Matric', 'Sports & Culture'],
    verifiedByInduna: 'induna',
  },
  {
    _id: 'listing-school-2',
    _type: 'listing',
    name: 'Umlandomusha High School',
    slug: { _type: 'slug', current: 'umlandomusha-high-school' },
    listingType: 'school',
    description: 'Rural secondary school supporting surrounding villages.',
    location: 'Utrecht region, KwaZulu-Natal',
    contactInfo: '+27 XX XXX XXXX',
    operatingHours: 'Mon–Fri 07:30–14:30',
    servicesOffered: ['Grades 8-12', 'Matric Rewrite Support'],
    verifiedByInduna: 'induna',
  },
  {
    _id: 'listing-clinic-1',
    _type: 'listing',
    name: 'Mndozo Community Clinic',
    slug: { _type: 'slug', current: 'mndozo-community-clinic' },
    listingType: 'clinic',
    description:
      'Primary healthcare facility under provincial Department of Health.',
    location: 'Mndozo, KwaZulu-Natal',
    contactInfo: '+27 XX XXX XXXX',
    operatingHours: 'Mon–Fri 07:30–16:00',
    servicesOffered: [
      'Primary healthcare',
      'HIV/TB treatment',
      'Maternal care',
      'Immunisation',
    ],
    verifiedByInduna: 'council',
  },
  {
    _id: 'listing-business-1',
    _type: 'listing',
    name: 'KwaNdlovu General Store',
    slug: { _type: 'slug', current: 'kwandlovu-general-store' },
    listingType: 'business',
    description:
      'Community spaza shop providing daily essentials and groceries.',
    location: 'KwaNdlovu area, Mndozo',
    contactInfo: '+27 XX XXX XXXX',
    whatsappContact: '+27XXXXXXXXX',
    operatingHours: 'Mon–Sat 06:00–19:00, Sun 07:00–13:00',
    verifiedByInduna: 'community',
  },
];

// ─── NOTICES ─────────────────────────────────────────────────

const notices = [
  {
    _id: 'notice-meeting-1',
    _type: 'notice',
    title: 'Monthly Traditional Council Meeting',
    slug: {
      _type: 'slug',
      current: 'monthly-traditional-council-meeting',
    },
    noticeType: 'meeting',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    excerpt:
      'All community members are invited to attend the monthly traditional council meeting. Agenda includes land allocation updates, infrastructure planning, and youth development initiatives.',
    pinned: true,
    relatedArea: { _type: 'reference', _ref: 'listing-area-mndozo' },
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
    relatedArea: { _type: 'reference', _ref: 'listing-area-mndozo' },
  },
  {
    _id: 'notice-resolution-1',
    _type: 'notice',
    title: 'Resolution: Community Hall Construction Approved',
    slug: {
      _type: 'slug',
      current: 'community-hall-construction-approved',
    },
    noticeType: 'resolution',
    date: new Date().toISOString(),
    excerpt:
      'The council has approved the development of a new multipurpose community hall in KwaNtuli isigodi. Construction planning to commence in the next quarter.',
    pinned: false,
    relatedArea: { _type: 'reference', _ref: 'listing-area-mndozo' },
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
        {
          _key: 'block-1',
          _type: 'block',
          children: [
            {
              _key: 'span-1',
              _type: 'span',
              marks: [],
              text: 'Serving the community through leadership, development, and transparency. The official digital platform of the Mndozo Traditional Council.',
            },
          ],
          markDefs: [],
          style: 'normal',
        },
      ],
    },
    {
      _key: 'stats-1',
      _type: 'stats',
      heading: 'Our Community',
      items: [
        { _key: 'stat-1', value: '3', label: 'Izigodi' },
        { _key: 'stat-2', value: '2', label: 'Schools' },
        { _key: 'stat-3', value: '1', label: 'Clinic' },
        { _key: 'stat-4', value: '4+', label: 'Businesses' },
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
      members: [
        { _key: 'ref-1', _type: 'reference', _ref: 'person-inkosi' },
        { _key: 'ref-2', _type: 'reference', _ref: 'person-induna-1' },
        { _key: 'ref-3', _type: 'reference', _ref: 'person-induna-2' },
        { _key: 'ref-4', _type: 'reference', _ref: 'person-induna-3' },
      ],
    },
    {
      _key: 'quote-1',
      _type: 'quote',
      text: 'We serve our community with integrity, transparency, and a commitment to development that benefits all residents of Mndozo.',
      author: { _type: 'reference', _ref: 'person-inkosi' },
    },
    {
      _key: 'directory-1',
      _type: 'listingGrid',
      heading: 'Community Directory',
      description: 'Schools, clinics, and businesses in the Mndozo area.',
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
        {
          _key: 'sub-block-1',
          _type: 'block',
          children: [
            {
              _key: 'sub-span-1',
              _type: 'span',
              marks: [],
              text: 'Subscribe to receive community notices, opportunities, and updates from the Mndozo Traditional Council.',
            },
          ],
          markDefs: [],
          style: 'normal',
        },
      ],
      buttonText: 'Subscribe',
    },
  ],
};

// ─── SEED ────────────────────────────────────────────────────

async function seed() {
  const transaction = client.transaction();

  transaction.createOrReplace(settings);
  transaction.createOrReplace(inkosi);

  for (const induna of izinduna) {
    transaction.createOrReplace(induna);
  }

  transaction.createOrReplace(area);

  for (const listing of listings) {
    transaction.createOrReplace(listing);
  }

  // Link listings to area
  transaction.patch('listing-area-mndozo', (patch) =>
    patch.set({
      relatedListings: listings.map((l) => ({
        _key: l._id,
        _type: 'reference',
        _ref: l._id,
      })),
    })
  );

  for (const notice of notices) {
    transaction.createOrReplace(notice);
  }

  transaction.createOrReplace(homePage);

  console.log('Seeding Mndozo council data...');
  const result = await transaction.commit();
  console.log(`Done. ${result.results.length} documents created/updated.`);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
