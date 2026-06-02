/**
 * One-off: Buffalo River Abstraction Works
 *
 * Uses createIfNotExists — safe on live data, won't overwrite images or edits.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<token> npx tsx scripts/populate-buffalo-river.ts
 */

import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    'Missing env vars. Run with:\n  SANITY_WRITE_TOKEN=<token> npx tsx scripts/populate-buffalo-river.ts'
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

function textBlock(key: string, text: string) {
  return {
    _key: key,
    _type: 'block',
    children: [{ _key: `${key}-span`, _type: 'span', marks: [], text }],
    markDefs: [],
    style: 'normal',
  };
}

const AREA_ID = 'listing-area-mndozo';
const SPONSOR_ID = 'sponsor-newcastle-municipality';
const CAMPAIGN_ID = 'campaign-buffalo-river';
const NOTICE_ID = 'notice-buffalo-river-launch';

const sponsor = {
  _id: SPONSOR_ID,
  _type: 'sponsor',
  name: 'Newcastle Municipality',
  slug: { _type: 'slug', current: 'newcastle-municipality' },
  sponsorType: 'government',
  description:
    'Local municipality responsible for service delivery and infrastructure development in the Newcastle area, Amajuba District.',
  website: 'https://www.newcastle.gov.za',
};

const campaign = {
  _id: CAMPAIGN_ID,
  _type: 'campaign',
  title: 'Buffalo River Abstraction Works — Ward 7 Water Infrastructure',
  slug: {
    _type: 'slug',
    current: 'buffalo-river-abstraction-works-ward-7',
  },
  campaignType: 'csr',
  status: 'active',
  sponsor: { _type: 'reference', _ref: SPONSOR_ID },
  description:
    'Multi-million infrastructure project to secure reliable water supply for Mndozo, Manzana, Dicks, Jobstown, and Johnstone. Funded through WSIG. 100 local jobs created.',
  content: [
    textBlock(
      'bf-1',
      'The Newcastle Local Municipality has commenced the Buffalo River Abstraction Works project, a multi-million infrastructure investment aimed at securing a reliable and sustainable potable water supply for the communities of Mndozo, Manzana, Dicks, Jobstown, and Johnstone in Ward 7.'
    ),
    textBlock(
      'bf-2',
      'Funded through the Water Services Infrastructure Grant (WSIG), the project responds to rapid residential growth in the area, which has driven water demand far beyond current supply capacity. Residents have faced prolonged shortages, with some households going days without water, and planned sanitation projects stalled due to scarcity.'
    ),
    textBlock(
      'bf-3',
      'The works include construction of a weir, refurbishment of the abstraction tower, drilling of boreholes, installation of a rising main, construction of a 10 ML Water Treatment Works, and associated electrical works. Treated water will feed into existing and new storage facilities, with future planning for bulk supply and reticulation networks.'
    ),
    textBlock(
      'bf-4',
      'The project is in the implementation phase and will create temporary employment for 100 local residents, while opening opportunities for local SMMEs. Construction is scheduled to run for 12 months from the commencement date.'
    ),
    textBlock(
      'bf-5',
      'Mayor Cllr DX Dube: "This project is the answer to the water challenges that have been facing the community of Ward 7. We have had to introduce water shedding just to make sure people receive water, and at times families went for days without supply."'
    ),
    textBlock(
      'bf-6',
      '"We have more projects in the pipeline to ensure the community does not suffer from water scarcity again. We have projects that go as far as Entendeka that will commence in a few weeks. There are also plans of a new mall for this area in the future, and these water infrastructure projects are laying the groundwork for that development to happen."'
    ),
  ],
  projectUpdates: [
    {
      _type: 'projectUpdate',
      date: '2026-05-21',
      title: 'Sod Turning Ceremony — Project Launch',
      content: [
        textBlock(
          'pu-1',
          'For Immediate Release: The Newcastle Local Municipality has commenced the Buffalo River Abstraction Works project, a multi-million infrastructure investment aimed at securing a reliable and sustainable potable water supply for the communities of Mndozo, Manzana, Dicks, Jobstown, and Johnstone in Ward 7.'
        ),
        textBlock(
          'pu-2',
          'Funded through the Water Services Infrastructure Grant (WSIG), the project responds to rapid residential growth in the area, which has driven water demand far beyond current supply capacity.'
        ),
      ],
      gallery: [],
    },
    {
      _type: 'projectUpdate',
      date: '2026-06-01',
      title: 'CLO Assessment Testing — Status Update',
      content: [
        textBlock(
          'pu-3',
          '🚨 PROJECT STATUS UPDATE – 01 JUNE 2026: CLO assessment testing was conducted on-site today. Candidates are currently awaiting official evaluations and final recruitment callbacks.'
        ),
        textBlock(
          'pu-4',
          "SMME & LOCAL BUSINESS NOTICE: Procurement packages for local Ward 7 subcontractors have not yet been presented by the main engineering contractor. Local business owners and specialized laborers are urged to log their compliance profiles with the Mndozo Traditional Council desk immediately to protect local procurement quotas. Contact the Induna's office or WhatsApp [number] to register on the community database."
        ),
      ],
      gallery: [],
    },
  ],
  targetAudience: 'Ward 7 residents, local SMMEs, job seekers',
  tags: ['water', 'infrastructure', 'WSIG', 'Ward 7', 'employment'],
  startDate: '2026-05-21',
  endDate: '2027-05-21',
  relatedAreas: [{ _key: 'area-1', _type: 'reference', _ref: AREA_ID }],
  link: 'https://web.facebook.com/profile.php?id=61560539701565',
  beneficiaries: 100,
  // Deliverables are planned items; do not mark as completed here.
  deliverables: [],
  totalDeliverables: 6,
  communityNote: [
    {
      _type: 'communityNote',
      date: '2026-06-01',
      issuedBy: 'Khathide Traditional Council',
      message:
        'Phase 1 hiring is underway — 30 positions confirmed at commencement.\n70 positions remain for construction, pipe-laying, and treatment works phases.\nWard 7 residents (Mndozo, Manzana, Dicks, Jobstown, Johnstone) register interest with the Induna at Mndozo Traditional Area. Priority given to verified community members.\nLocal SMMEs seeking sub-contracting opportunities: contact the Khathide Traditional Council.',
    },
  ],
};

const notice = {
  _id: NOTICE_ID,
  _type: 'notice',
  title: 'Buffalo River Water Project Launched — 100 Local Jobs',
  slug: {
    _type: 'slug',
    current: 'buffalo-river-water-project-launched',
  },
  noticeType: 'announcement',
  date: new Date().toISOString(),
  excerpt:
    'Newcastle Municipality has launched the Buffalo River Abstraction Works. The project creates 100 local jobs and will run for 12 months. Umkhandlu waseMndozo was present at the launch.',
  pinned: true,
  relatedArea: { _type: 'reference', _ref: AREA_ID },
  relatedCampaign: { _type: 'reference', _ref: CAMPAIGN_ID },
};

async function populate() {
  const transaction = client.transaction();
  transaction.createIfNotExists(sponsor);
  transaction.createIfNotExists(campaign);
  transaction.createIfNotExists(notice);

  console.log('Populating Buffalo River project...');
  const result = await transaction.commit();
  console.log(`Done. ${result.results.length} documents processed.`);
}

populate().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
