/**
 * Ingonyama Trust Resources Seed
 *
 * Seeds external resource links (legislation, forms, annual report)
 * and a land application notice into the Mndozo council CMS.
 *
 * These are LINKS to Trust resources, not council-created documents.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<token> npx tsx scripts/seed-trust-resources.ts
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

const SOURCE = 'Ingonyama Trust Board';

const resources = [
  // Application Forms
  {
    _id: 'record-itb-form-1',
    _type: 'record',
    title: 'Tenure Option Application Form (ITB 1)',
    slug: { _type: 'slug', current: 'itb-1-tenure-application' },
    recordType: 'external-resource',
    date: '2024-01-01',
    summary:
      'Official application form for land tenure rights under Ingonyama Trust land. Submit through your local Induna.',
    externalUrl: 'https://www.ingonyamatrust.org.za/resource-centre/',
    source: SOURCE,
  },
  {
    _id: 'record-itb-form-2',
    _type: 'record',
    title: 'Traditional Consent Form (ITB 2)',
    slug: { _type: 'slug', current: 'itb-2-traditional-consent' },
    recordType: 'external-resource',
    date: '2024-01-01',
    summary:
      'Consent form required for land applications under traditional authority. Must be signed by the Inkosi.',
    externalUrl: 'https://www.ingonyamatrust.org.za/resource-centre/',
    source: SOURCE,
  },

  // Legislation
  {
    _id: 'record-act-amakhosi-1990',
    _type: 'record',
    title: 'KwaZulu Amakhosi and Iziphakanyiswa Act No. 9 of 1990',
    slug: { _type: 'slug', current: 'kwazulu-amakhosi-act-1990' },
    recordType: 'external-resource',
    date: '1990-01-01',
    summary:
      'Legislation governing the recognition and roles of traditional leaders (Amakhosi) in KwaZulu-Natal.',
    externalUrl: 'https://www.ingonyamatrust.org.za/resource-centre/',
    source: 'KwaZulu-Natal Legislature',
  },
  {
    _id: 'record-act-land-1992',
    _type: 'record',
    title: 'KwaZulu Land Affairs Act No. 11 of 1992',
    slug: { _type: 'slug', current: 'kwazulu-land-affairs-act-1992' },
    recordType: 'external-resource',
    date: '1992-01-01',
    summary:
      'Legislation governing land administration and allocation in KwaZulu-Natal under traditional authority.',
    externalUrl: 'https://www.ingonyamatrust.org.za/resource-centre/',
    source: 'KwaZulu-Natal Legislature',
  },

  // Annual Report (latest only)
  {
    _id: 'record-itb-annual-2024',
    _type: 'record',
    title: 'Ingonyama Trust Board Annual Report 2023/2024',
    slug: { _type: 'slug', current: 'itb-annual-report-2023-2024' },
    recordType: 'external-resource',
    date: '2024-03-31',
    summary:
      'Latest annual report from the Ingonyama Trust Board covering governance, land administration, and financial performance.',
    externalUrl:
      'https://www.ingonyamatrust.org.za/download/ingonyama-trust-board-annual-report-2023-2024/',
    source: SOURCE,
  },
];

// Land application notice
const landNotice = {
  _id: 'notice-land-application',
  _type: 'notice',
  title: 'Land Application Process — How to Apply',
  slug: { _type: 'slug', current: 'land-application-process' },
  noticeType: 'announcement',
  date: new Date().toISOString(),
  excerpt:
    'Information on how to apply for land tenure under the Ingonyama Trust. Start by contacting your local Induna. You will need the Tenure Option Application Form (ITB 1) and Traditional Consent Form (ITB 2), available from the Ingonyama Trust Board Resource Centre.',
  pinned: true,
  relatedArea: { _type: 'reference', _ref: 'listing-area-mndozo' },
};

async function seed() {
  const transaction = client.transaction();

  for (const resource of resources) {
    transaction.createOrReplace(resource);
  }

  transaction.createOrReplace(landNotice);

  console.log('Seeding Ingonyama Trust resources...');
  const result = await transaction.commit();
  console.log(`Done. ${result.results.length} documents created/updated.`);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
