/**
 * One-off: Update Buffalo River campaign with projectUpdates and notices
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<token> npx tsx scripts/update-buffalo-project-updates.ts
 *
 * This will patch the existing campaign document (id: "campaign-buffalo-river").
 */

import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    'Missing env vars. Run with:\n  SANITY_WRITE_TOKEN=<token> npx tsx scripts/update-buffalo-project-updates.ts'
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

const CAMPAIGN_ID = 'campaign-buffalo-river';

async function run() {
  console.log('Patching campaign:', CAMPAIGN_ID);

  const patch = {
    startDate: '2026-05-21',
    endDate: '2027-05-21',
    totalDeliverables: 6,
    deliverables: [],
    communityNote: [
      {
        _type: 'communityNote',
        date: '2026-06-01',
        issuedBy: 'Khathide Traditional Council',
        message:
          'Phase 1 hiring is underway — 30 positions confirmed at commencement.\n70 positions remain for construction, pipe-laying, and treatment works phases.\nWard 7 residents (Mndozo, Manzana, Dicks, Jobstown, Johnstone) register interest with the Induna at Mndozo Traditional Area. Priority given to verified community members.\nLocal SMMEs seeking sub-contracting opportunities: contact the Khathide Traditional Council.',
      },
    ],
    projectUpdates: [
      {
        _type: 'projectUpdate',
        date: '2026-05-21',
        title: 'Sod Turning Ceremony — Project Launch',
        content: [
          {
            _type: 'block',
            _key: 'pu-1',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'pu-1-span',
                text: 'The Newcastle Local Municipality has commenced the Buffalo River Abstraction Works project, a multi-million infrastructure investment aimed at securing a reliable and sustainable potable water supply for the communities of Mndozo, Manzana, Dicks, Jobstown, and Johnstone in Ward 7.',
              },
            ],
            markDefs: [],
          },
        ],
        gallery: [],
      },
      {
        _type: 'projectUpdate',
        date: '2026-06-01',
        title: 'CLO Assessment Testing — Status Update',
        content: [
          {
            _type: 'block',
            _key: 'pu-3',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'pu-3-span',
                text: '🚨 PROJECT STATUS UPDATE – 01 JUNE 2026: CLO assessment testing was conducted on-site today. Candidates are currently awaiting official evaluations and final recruitment callbacks.',
              },
            ],
            markDefs: [],
          },
          {
            _type: 'block',
            _key: 'pu-4',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'pu-4-span',
                text: "SMME & LOCAL BUSINESS NOTICE: Procurement packages for local Ward 7 subcontractors have not yet been presented by the main engineering contractor. Local business owners and specialized laborers are urged to log their compliance profiles with the Mndozo Traditional Council desk immediately to protect local procurement quotas. Contact the Induna's office or WhatsApp [number] to register on the community database.",
              },
            ],
            markDefs: [],
          },
        ],
        gallery: [],
      },
    ],
  };

  try {
    const res = await client.patch(CAMPAIGN_ID).set(patch).commit({
      returnDocuments: true,
    });
    console.log('Patched document:', res._id);
    process.exit(0);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Patch failed:', err.message);
    } else {
      console.error('Patch failed:', err);
    }
    process.exit(1);
  }
}

run();
