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

// ─── DATA ────────────────────────────────────────────────────

const settings = {
  _id: 'siteSettings',
  _type: 'settings',
  title: 'Umkhandlu waseMndozo',
  description:
    'Official digital platform of the Mndozo Traditional Council. Serving the community through leadership, development, and transparency.',
  contactEmail: 'info@mndozo.umkhandlu.org',
  contactPhone: '+27 XX XXX XXXX',
  address: 'Mndozo, KwaZulu-Natal, South Africa',
  primaryColor: '#16a34a',
  secondaryColor: '#f59e0b',
};

const inkosi = {
  _id: 'person-inkosi',
  _type: 'person',
  firstName: 'Inkosi',
  lastName: 'Mndozo',
  slug: { _type: 'slug', current: 'inkosi-mndozo' },
  role: 'Inkosi',
  personType: 'inkosi',
  organization: 'Mndozo Traditional Authority',
};

const izinduna = [
  {
    _id: 'person-induna-1',
    _type: 'person',
    firstName: 'Induna',
    lastName: 'Sigodi A',
    slug: { _type: 'slug', current: 'induna-sigodi-a' },
    role: 'Induna - Isigodi A',
    personType: 'induna',
  },
  {
    _id: 'person-induna-2',
    _type: 'person',
    firstName: 'Induna',
    lastName: 'Sigodi B',
    slug: { _type: 'slug', current: 'induna-sigodi-b' },
    role: 'Induna - Isigodi B',
    personType: 'induna',
  },
  {
    _id: 'person-induna-3',
    _type: 'person',
    firstName: 'Induna',
    lastName: 'Sigodi C',
    slug: { _type: 'slug', current: 'induna-sigodi-c' },
    role: 'Induna - Isigodi C',
    personType: 'induna',
  },
];

const area = {
  _id: 'listing-area-mndozo',
  _type: 'listing',
  name: 'Mndozo',
  slug: { _type: 'slug', current: 'mndozo' },
  listingType: 'area',
  description:
    'The central area of the Mndozo Traditional Council jurisdiction, home to schools, clinics, and community facilities.',
  location: 'Mndozo, KwaZulu-Natal',
  featured: true,
  induna: { _type: 'reference', _ref: 'person-induna-1' },
};

const listings = [
  {
    _id: 'listing-school-1',
    _type: 'listing',
    name: 'Duck Ponds High School',
    slug: { _type: 'slug', current: 'duck-ponds-high' },
    listingType: 'school',
    description: 'Secondary school serving the Mndozo community.',
    location: 'Mndozo, KwaZulu-Natal',
    servicesOffered: ['Grades 8-12', 'Matric'],
    verifiedByInduna: 'induna',
  },
  {
    _id: 'listing-school-2',
    _type: 'listing',
    name: 'Umlandomusha High School',
    slug: { _type: 'slug', current: 'umlandomusha-high' },
    listingType: 'school',
    description: 'Secondary school in the greater Mndozo area.',
    location: 'Mndozo, KwaZulu-Natal',
    servicesOffered: ['Grades 8-12', 'Matric'],
    verifiedByInduna: 'induna',
  },
  {
    _id: 'listing-clinic-1',
    _type: 'listing',
    name: 'Mndozo Clinic',
    slug: { _type: 'slug', current: 'mndozo-clinic' },
    listingType: 'clinic',
    description: 'Primary healthcare facility serving the Mndozo community.',
    location: 'Mndozo, KwaZulu-Natal',
    servicesOffered: ['Primary care', 'Maternal health', 'HIV/TB services'],
    operatingHours: 'Mon-Fri 7:30-16:00',
    verifiedByInduna: 'council',
  },
  {
    _id: 'listing-business-1',
    _type: 'listing',
    name: 'Mndozo General Store',
    slug: { _type: 'slug', current: 'mndozo-general-store' },
    listingType: 'business',
    description: 'Local spaza shop and general supplies.',
    location: 'Mndozo Main Road',
    verifiedByInduna: 'community',
  },
];

const notices = [
  {
    _id: 'notice-meeting-1',
    _type: 'notice',
    title: 'Community Meeting — Monthly Council Session',
    slug: { _type: 'slug', current: 'monthly-council-meeting' },
    noticeType: 'meeting',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    excerpt:
      'All community members are invited to attend the monthly council meeting. Agenda includes land allocation updates and community development projects.',
    pinned: true,
    relatedArea: { _type: 'reference', _ref: 'listing-area-mndozo' },
  },
  {
    _id: 'notice-announcement-1',
    _type: 'notice',
    title: 'Water Supply Maintenance Notice',
    slug: { _type: 'slug', current: 'water-supply-maintenance' },
    noticeType: 'announcement',
    date: new Date().toISOString(),
    excerpt:
      'Scheduled maintenance on the community water supply. Please store water in advance. Expected duration: 2 days.',
    pinned: false,
    relatedArea: { _type: 'reference', _ref: 'listing-area-mndozo' },
  },
  {
    _id: 'notice-resolution-1',
    _type: 'notice',
    title: 'Resolution: New Community Hall Development',
    slug: { _type: 'slug', current: 'community-hall-resolution' },
    noticeType: 'resolution',
    date: new Date().toISOString(),
    excerpt:
      'The council has resolved to proceed with the construction of a new community hall in Isigodi A. Construction to begin next quarter.',
    pinned: false,
    relatedArea: { _type: 'reference', _ref: 'listing-area-mndozo' },
  },
];

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
              text: 'Serving the community through leadership, development, and transparency.',
            },
          ],
          markDefs: [],
          style: 'normal',
        },
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
      _key: 'cta-1',
      _type: 'cta',
      heading: 'Get Involved',
      text: 'Join us in building a stronger Mndozo. Attend meetings, share opportunities, and stay informed.',
    },
  ],
};

// ─── SEED ────────────────────────────────────────────────────

async function seed() {
  const transaction = client.transaction();

  // Settings
  transaction.createOrReplace(settings);

  // People
  transaction.createOrReplace(inkosi);
  for (const induna of izinduna) {
    transaction.createOrReplace(induna);
  }

  // Area
  transaction.createOrReplace(area);

  // Listings
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

  // Notices
  for (const notice of notices) {
    transaction.createOrReplace(notice);
  }

  // Home Page
  transaction.createOrReplace(homePage);

  console.log('Seeding Mndozo council data...');
  const result = await transaction.commit();
  console.log(`Done. ${result.results.length} documents created/updated.`);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
