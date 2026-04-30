/**
 * Template Pages Seed
 *
 * Seeds the core structure every council needs:
 * - 9 generic template pages (no council names, no people refs)
 * - blogPage singleton
 * - bare siteSettings singleton (so seed-menu can patch it)
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<token> npx tsx scripts/seed-pages.ts
 */

import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    'Missing env vars. Run with:\n  SANITY_WRITE_TOKEN=<token> npx tsx scripts/seed-pages.ts'
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

// ─── SINGLETONS ──────────────────────────────────────────────

const siteSettings = {
  _id: 'siteSettings',
  _type: 'settings',
  title: 'Umkhandlu',
  description:
    'Community digital platform for traditional councils, youth programs, and local governance.',
};

const blogPage = {
  _id: 'blogPage',
  _type: 'blogPage',
  name: 'Blog Page',
};

// ─── PAGES ───────────────────────────────────────────────────

const pages = [
  {
    _id: 'page-land',
    _type: 'page',
    name: 'Land & Governance',
    slug: { _type: 'slug', current: 'land' },
    pageSections: [
      {
        _key: 'land-hero',
        _type: 'hero',
        heading: 'Land & Governance',
        text: [
          textBlock(
            'land-hero-text',
            'Understanding land allocation, governance processes, and your rights under the traditional council and Ingonyama Trust Board.'
          ),
        ],
      },
      {
        _key: 'land-richtext',
        _type: 'richText',
        heading: 'Land Under Traditional Authority',
        content: [
          textBlock(
            'land-rt-1',
            'Land in this area falls under the custodianship of the Ingonyama Trust Board and is administered through the traditional authority structure. The Inkosi, supported by Izinduna and the council, oversees land allocation, dispute resolution, and development planning.'
          ),
          textBlock(
            'land-rt-2',
            'All land applications begin at the local level through your Induna and follow a structured process through the council to the Inkosi for final approval.'
          ),
        ],
      },
      {
        _key: 'land-process',
        _type: 'process',
        heading: 'How Land Allocation Works',
        description:
          'The step-by-step process for applying for land in this area.',
        steps: [
          {
            _key: 'step-1',
            title: 'Approach Your Induna',
            description:
              'Visit the Induna responsible for your isigodi to discuss your land needs. The Induna knows local land availability and will guide your application.',
          },
          {
            _key: 'step-2',
            title: 'Complete Application Forms',
            description:
              'Obtain and complete the Tenure Option Application Form (ITB 1) and Traditional Consent Form (ITB 2) from the Ingonyama Trust Board Resource Centre.',
          },
          {
            _key: 'step-3',
            title: 'Council Review',
            description:
              'Your application is presented at the next Umkhandlu meeting. The council reviews the request, considers community input, and discusses the proposed site.',
          },
          {
            _key: 'step-4',
            title: 'Site Inspection',
            description:
              'Council members and the Induna inspect the proposed site to verify availability, boundaries, and suitability.',
          },
          {
            _key: 'step-5',
            title: 'Inkosi Approval',
            description:
              'The Inkosi reviews the council recommendation and gives final approval. A Permission to Occupy (PTO) or similar letter is issued.',
          },
          {
            _key: 'step-6',
            title: 'Ingonyama Trust Registration',
            description:
              'The approved application is submitted to the Ingonyama Trust Board for formal registration and lease processing.',
          },
        ],
        footnote:
          'Contact your local Induna or the council office for assistance with land applications.',
      },
      {
        _key: 'land-faq',
        _type: 'faq',
        heading: 'Frequently Asked Questions',
        items: [
          {
            _key: 'faq-1',
            question: 'How do I apply for land?',
            answer: [
              textBlock(
                'faq-1-a',
                'Start by approaching your local Induna. They will guide you through the application process, including the required forms (ITB 1 and ITB 2) and the council review procedure.'
              ),
            ],
          },
          {
            _key: 'faq-2',
            question: 'What documents do I need?',
            answer: [
              textBlock(
                'faq-2-a',
                'You will need the Tenure Option Application Form (ITB 1), Traditional Consent Form (ITB 2), and a copy of your ID. These forms are available from the Ingonyama Trust Board Resource Centre.'
              ),
            ],
          },
          {
            _key: 'faq-3',
            question: 'How long does the process take?',
            answer: [
              textBlock(
                'faq-3-a',
                'The timeline varies depending on council meeting schedules and Trust processing. Typically, the local council process takes 1-3 months. Trust registration may take additional time.'
              ),
            ],
          },
          {
            _key: 'faq-4',
            question: 'Who approves land allocation?',
            answer: [
              textBlock(
                'faq-4-a',
                'The Inkosi gives final approval on land allocation decisions, based on the recommendation of the Umkhandlu (council) and the local Induna. The Ingonyama Trust Board handles formal registration.'
              ),
            ],
          },
        ],
      },
      {
        _key: 'land-records',
        _type: 'recordList',
        heading: 'Land & Governance Resources',
        filterType: 'external-resource',
        limit: 10,
      },
      {
        _key: 'land-notices',
        _type: 'noticeList',
        heading: 'Related Notices',
        numberOfNotices: 5,
        filterType: 'all',
      },
      {
        _key: 'land-cta',
        _type: 'cta',
        heading: 'Need Assistance?',
        text: 'Contact your local Induna or visit the council office for help with land applications, disputes, or governance questions.',
      },
    ],
  },
  {
    _id: 'page-about',
    _type: 'page',
    name: 'About the Council',
    slug: { _type: 'slug', current: 'about' },
    pageSections: [
      {
        _key: 'about-hero',
        _type: 'hero',
        heading: 'About the Council',
        text: [
          textBlock(
            'about-hero-text',
            'Serving the community through governance, development, and the preservation of cultural heritage under traditional leadership.'
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
            'The traditional council is responsible for governance, land administration, community development, and dispute resolution within the traditional authority area.'
          ),
          textBlock(
            'about-rt-2',
            'The council operates under the authority of the Inkosi and comprises Izinduna (headmen) representing each isigodi, council members, and youth representatives. Together, they ensure that community needs are addressed, governance is transparent, and development is inclusive.'
          ),
          textBlock(
            'about-rt-3',
            'Land within this area falls under the custodianship of the Ingonyama Trust Board. The council works within this framework to administer land allocation, resolve disputes, and coordinate development initiatives.'
          ),
        ],
      },
    ],
  },
  {
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
            'The traditional council is led by the Inkosi, supported by Izinduna and council members who serve each isigodi.'
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
    ],
  },
  {
    _id: 'page-directory',
    _type: 'page',
    name: 'Community Directory',
    slug: { _type: 'slug', current: 'directory' },
    pageSections: [
      {
        _key: 'dir-hero',
        _type: 'hero',
        heading: 'Community Directory',
        text: [
          textBlock(
            'dir-hero-text',
            'Schools, clinics, businesses, and community facilities in the area. Verified by local leadership.'
          ),
        ],
      },
      {
        _key: 'dir-listings',
        _type: 'listingGrid',
        heading: 'Explore Our Community',
        description:
          'Find schools, healthcare, businesses, and services in the area.',
        filterType: 'all',
        limit: 20,
      },
      {
        _key: 'dir-map',
        _type: 'communityMap',
        heading: 'Community Map',
        description: 'Find facilities and services on the map.',
        centerLat: -27.822,
        centerLng: 30.05,
        zoom: 13,
        filterType: 'all',
      },
    ],
  },
  {
    _id: 'page-contact',
    _type: 'page',
    name: 'Contact',
    slug: { _type: 'slug', current: 'contact' },
    pageSections: [
      {
        _key: 'contact-hero',
        _type: 'hero',
        heading: 'Contact Us',
        text: [
          textBlock(
            'contact-hero-text',
            'Get in touch with the traditional council. We are here to assist with land applications, community matters, and governance enquiries.'
          ),
        ],
      },
      {
        _key: 'contact-form',
        _type: 'contactForm',
        heading: 'Send a Message',
        description:
          'Fill in the form below and we will respond as soon as possible.',
        showMap: false,
      },
      {
        _key: 'contact-richtext',
        _type: 'richText',
        heading: 'Other Ways to Reach Us',
        content: [
          textBlock(
            'contact-rt-1',
            'Visit your local Induna for community matters, land applications, or to report issues. For council-level enquiries, contact the council office directly.'
          ),
          textBlock(
            'contact-rt-2',
            'Council meetings are held monthly and are open to all community members. Check the Notices section for upcoming meeting dates.'
          ),
        ],
      },
    ],
  },
  {
    _id: 'page-notices',
    _type: 'page',
    name: 'Community Notices',
    slug: { _type: 'slug', current: 'notices' },
    pageSections: [
      {
        _key: 'notices-hero',
        _type: 'hero',
        heading: 'Community Notices',
        text: [
          textBlock(
            'notices-hero-text',
            'Meetings, announcements, resolutions, and alerts from the traditional council.'
          ),
        ],
      },
      {
        _key: 'notices-list',
        _type: 'noticeList',
        heading: 'All Notices',
        numberOfNotices: 20,
        filterType: 'all',
      },
    ],
  },
  {
    _id: 'page-opportunities',
    _type: 'page',
    name: 'Opportunities',
    slug: { _type: 'slug', current: 'opportunities' },
    pageSections: [
      {
        _key: 'opp-hero',
        _type: 'hero',
        heading: 'Opportunities',
        text: [
          textBlock(
            'opp-hero-text',
            'Jobs, training, bursaries, and funding opportunities for the community. Updated regularly.'
          ),
        ],
      },
      {
        _key: 'opp-list',
        _type: 'opportunityList',
        heading: 'Current Opportunities',
        description:
          'Browse available opportunities. Expired listings are automatically removed.',
        filterType: 'all',
        limit: 20,
      },
      {
        _key: 'opp-cta',
        _type: 'cta',
        heading: 'Have an Opportunity to Share?',
        text: 'If you know of a job, training programme, bursary, or funding opportunity relevant to the community, contact the council office.',
      },
    ],
  },
  {
    _id: 'page-programs',
    _type: 'page',
    name: 'Programs & Events',
    slug: { _type: 'slug', current: 'programs' },
    pageSections: [
      {
        _key: 'prog-hero',
        _type: 'hero',
        heading: 'Programs & Events',
        text: [
          textBlock(
            'prog-hero-text',
            'Youth events, skills programs, school collaborations, and community projects.'
          ),
        ],
      },
      {
        _key: 'prog-list',
        _type: 'programList',
        heading: 'Upcoming & Active Programs',
        description:
          'Community programs and events organised by the council and partners.',
        filterStatus: 'all',
        limit: 20,
      },
      {
        _key: 'prog-subscribe',
        _type: 'subscribe',
        heading: 'Stay Updated',
        content: [
          textBlock(
            'prog-sub-text',
            'Subscribe to receive updates about new programs and events.'
          ),
        ],
        buttonText: 'Subscribe',
      },
    ],
  },
  {
    _id: 'page-media',
    _type: 'page',
    name: 'Media & Stories',
    slug: { _type: 'slug', current: 'media' },
    pageSections: [
      {
        _key: 'media-hero',
        _type: 'hero',
        heading: 'Media & Stories',
        text: [
          textBlock(
            'media-hero-text',
            'Community stories, event coverage, and photo galleries.'
          ),
        ],
      },
      {
        _key: 'media-posts',
        _type: 'postList',
        heading: 'Latest Stories',
        numberOfPosts: 6,
      },
    ],
  },
  {
    _id: 'page-youth',
    _type: 'page',
    name: 'Youth & Development',
    slug: { _type: 'slug', current: 'youth' },
    pageSections: [
      {
        _key: 'youth-hero',
        _type: 'hero',
        heading: 'Youth & Development',
        text: [
          textBlock(
            'youth-hero-text',
            'Programs, opportunities, and stories for young people in the community.'
          ),
        ],
      },
      {
        _key: 'youth-programs',
        _type: 'programList',
        heading: 'Programs & Events',
        description:
          'Skills training, youth events, and school collaborations.',
        filterStatus: 'all',
        limit: 10,
      },
      {
        _key: 'youth-opportunities',
        _type: 'opportunityList',
        heading: 'Opportunities',
        description: 'Jobs, training, bursaries, and funding for young people.',
        filterType: 'all',
        limit: 10,
      },
      {
        _key: 'youth-posts',
        _type: 'postList',
        heading: 'Stories & Updates',
        numberOfPosts: 6,
      },
      {
        _key: 'youth-cta',
        _type: 'cta',
        heading: 'Get Involved',
        text: 'Contact the council office or your local Induna to learn about youth programs, volunteer opportunities, and community projects.',
      },
    ],
  },
  {
    _id: 'page-schools',
    _type: 'page',
    name: 'Schools',
    slug: { _type: 'slug', current: 'schools' },
    pageSections: [
      {
        _key: 'schools-hero',
        _type: 'hero',
        heading: 'Schools',
        text: [
          textBlock(
            'schools-hero-text',
            'Primary and secondary schools serving the community.'
          ),
        ],
      },
      {
        _key: 'schools-listings',
        _type: 'listingGrid',
        heading: 'Our Schools',
        description: 'Schools in the area, verified by local leadership.',
        filterType: 'school',
        limit: 20,
      },
      {
        _key: 'schools-posts',
        _type: 'postList',
        heading: 'School Stories',
        numberOfPosts: 3,
      },
    ],
  },
  {
    _id: 'page-health',
    _type: 'page',
    name: 'Health',
    slug: { _type: 'slug', current: 'health' },
    pageSections: [
      {
        _key: 'health-hero',
        _type: 'hero',
        heading: 'Health & Clinics',
        text: [
          textBlock(
            'health-hero-text',
            'Healthcare facilities and services available in the community.'
          ),
        ],
      },
      {
        _key: 'health-listings',
        _type: 'listingGrid',
        heading: 'Clinics & Health Facilities',
        filterType: 'clinic',
        limit: 20,
      },
    ],
  },
  {
    _id: 'page-economy',
    _type: 'page',
    name: 'Local Economy',
    slug: { _type: 'slug', current: 'economy' },
    pageSections: [
      {
        _key: 'economy-hero',
        _type: 'hero',
        heading: 'Local Economy',
        text: [
          textBlock(
            'economy-hero-text',
            'Businesses, services, and economic activity in the community.'
          ),
        ],
      },
      {
        _key: 'economy-listings',
        _type: 'listingGrid',
        heading: 'Local Businesses',
        description: 'Shops, services, and trades operating in the area.',
        filterType: 'business',
        limit: 20,
      },
    ],
  },
  {
    _id: 'page-projects',
    _type: 'page',
    name: 'Projects',
    slug: { _type: 'slug', current: 'projects' },
    pageSections: [
      {
        _key: 'projects-hero',
        _type: 'hero',
        heading: 'Projects & Partners',
        text: [
          textBlock(
            'projects-hero-text',
            'Community development projects and the organisations supporting them.'
          ),
        ],
      },
      {
        _key: 'projects-programs',
        _type: 'programList',
        heading: 'Active Projects',
        filterStatus: 'all',
        limit: 10,
      },
      {
        _key: 'projects-campaigns',
        _type: 'campaignList',
        heading: 'Campaigns & Initiatives',
        description:
          'Sponsorships, activations, and development initiatives in the community.',
        filterType: 'all',
        filterStatus: 'all',
        limit: 10,
      },
      {
        _key: 'projects-logos',
        _type: 'logoGrid',
        heading: 'Our Partners',
      },
    ],
  },
];

// ─── SEED ────────────────────────────────────────────────────

async function seed() {
  const transaction = client.transaction();

  // Singletons — createIfNotExists so council scripts can safely override
  transaction.createIfNotExists(siteSettings);
  transaction.createIfNotExists(blogPage);

  for (const page of pages) {
    transaction.createOrReplace(page);
  }

  console.log('Seeding template pages...');
  const result = await transaction.commit();
  console.log(`Done. ${result.results.length} documents created/updated.`);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
