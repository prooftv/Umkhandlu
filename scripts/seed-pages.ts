/**
 * Template Pages Seed
 *
 * Seeds the core pages every council needs — fully composed with
 * page builder sections. These form the reusable template structure.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<token> npx tsx scripts/seed-pages.ts
 */

import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '60v9eb0r';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-08-22',
  useCdn: false,
});

// ─── HELPER: Portable Text block ─────────────────────────────

function textBlock(key: string, text: string) {
  return {
    _key: key,
    _type: 'block',
    children: [{ _key: `${key}-span`, _type: 'span', marks: [], text }],
    markDefs: [],
    style: 'normal',
  };
}

// ─── LAND & GOVERNANCE PAGE ──────────────────────────────────

const landPage = {
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
          'Understanding land allocation, governance processes, and your rights under the Mndozo Traditional Council and Ingonyama Trust Board.'
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
          'Land in the Mndozo area falls under the custodianship of the Ingonyama Trust Board and is administered through the traditional authority structure. The Inkosi, supported by Izinduna and the council, oversees land allocation, dispute resolution, and development planning.'
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
        'The step-by-step process for applying for land in the Mndozo area.',
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
};

// ─── ABOUT PAGE ──────────────────────────────────────────────

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
        { _key: 'stat-2', value: '2', label: 'Schools' },
        { _key: 'stat-3', value: '1', label: 'Community Clinic' },
        { _key: 'stat-4', value: '4+', label: 'Local Businesses' },
      ],
    },
    {
      _key: 'about-team',
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
      _key: 'about-quote',
      _type: 'quote',
      text: 'We serve our community with integrity, transparency, and a commitment to development that benefits all residents of Mndozo.',
      author: { _type: 'reference', _ref: 'person-inkosi' },
    },
  ],
};

// ─── LEADERSHIP PAGE ─────────────────────────────────────────

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
      members: [
        { _key: 'ref-1', _type: 'reference', _ref: 'person-inkosi' },
        { _key: 'ref-2', _type: 'reference', _ref: 'person-induna-1' },
        { _key: 'ref-3', _type: 'reference', _ref: 'person-induna-2' },
        { _key: 'ref-4', _type: 'reference', _ref: 'person-induna-3' },
      ],
    },
  ],
};

// ─── DIRECTORY PAGE ──────────────────────────────────────────

const directoryPage = {
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
          'Schools, clinics, businesses, and community facilities in the Mndozo area. Verified by local leadership.'
        ),
      ],
    },
    {
      _key: 'dir-listings',
      _type: 'listingGrid',
      heading: 'Explore Our Community',
      description:
        'Find schools, healthcare, businesses, and services in the Mndozo area.',
      filterType: 'all',
      limit: 20,
    },
  ],
};

// ─── CONTACT PAGE ────────────────────────────────────────────

const contactPage = {
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
          'Get in touch with the Mndozo Traditional Council. We are here to assist with land applications, community matters, and governance enquiries.'
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
};

// ─── NOTICES PAGE ────────────────────────────────────────────

const noticesPage = {
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
          'Meetings, announcements, resolutions, and alerts from the Mndozo Traditional Council.'
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
};

// ─── SEED ────────────────────────────────────────────────────

const pages = [
  landPage,
  aboutPage,
  leadershipPage,
  directoryPage,
  contactPage,
  noticesPage,
];

async function seed() {
  const transaction = client.transaction();

  for (const page of pages) {
    transaction.createOrReplace(page);
  }

  console.log('Seeding template pages...');
  const result = await transaction.commit();
  console.log(`Done. ${result.results.length} pages created/updated.`);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
