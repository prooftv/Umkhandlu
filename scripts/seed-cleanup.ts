/**
 * Cleanup stale seed data
 *
 * Deletes documents from old seed runs that are no longer
 * part of the current seed scripts.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<token> npx tsx scripts/seed-cleanup.ts
 */

import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    'Missing env vars. Run with:\n  SANITY_WRITE_TOKEN=<token> npx tsx scripts/seed-cleanup.ts'
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

// Old seed IDs that no longer exist in current scripts
const staleIds = [
  'listing-school-1', // was Duck Ponds High School
  'listing-school-2', // was Umlandomusha High School
  'listing-clinic-1', // was Mndozo Community Clinic
  'listing-business-1', // was KwaNdlovu General Store
];

async function cleanup() {
  const transaction = client.transaction();

  for (const id of staleIds) {
    transaction.delete(id);
  }

  console.log(`Deleting ${staleIds.length} stale documents...`);
  const result = await transaction.commit();
  console.log(`Done. ${result.results.length} documents deleted.`);
}

cleanup().catch((err) => {
  console.error('Cleanup failed:', err.message);
  process.exit(1);
});
