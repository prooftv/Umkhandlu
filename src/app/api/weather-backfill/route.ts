import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { clientEnv } from '@/env/clientEnv';
import { serverEnv } from '@/env/serverEnv';
import { fetchWeather } from '@/lib/weather';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// All notices and records that have a geopoint (via relatedArea) but no weatherContext yet.
// Also includes records with their own geopoint field.
const backfillQuery = `{
  "notices": *[_type == "notice" && defined(date) && !defined(weatherContext.fetchedAt)] {
    "_id": _id,
    "date": date,
    "lat": relatedArea->geopoint.lat,
    "lng": relatedArea->geopoint.lng
  }[defined(lat) && defined(lng)],
  "records": *[_type == "record" && defined(date) && !defined(weatherContext.fetchedAt)] {
    "_id": _id,
    "date": date,
    "lat": relatedArea->geopoint.lat,
    "lng": relatedArea->geopoint.lng
  }[defined(lat) && defined(lng)]
}`;

type DocRef = { _id: string; date: string; lat: number; lng: number };

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  if (!token || token !== process.env.SANITY_API_READ_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const writeToken = serverEnv.SANITY_API_WRITE_TOKEN;
  if (!writeToken) {
    return NextResponse.json(
      { error: 'No write token configured' },
      { status: 503 }
    );
  }

  const { client } = await import('@/lib/sanity/client/client');
  const data = await client.fetch<{ notices: DocRef[]; records: DocRef[] }>(
    backfillQuery
  );

  const all = [
    ...data.notices.map((d) => ({ ...d, docType: 'notice' })),
    ...data.records.map((d) => ({ ...d, docType: 'record' })),
  ];

  if (all.length === 0) {
    return NextResponse.json({ message: 'Nothing to backfill.', patched: 0 });
  }

  const writeClient = createClient({
    projectId: clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: clientEnv.NEXT_PUBLIC_SANITY_API_VERSION,
    useCdn: false,
    token: writeToken,
  });

  const results: { _id: string; docType: string; status: string }[] = [];

  for (const doc of all) {
    const weather = await fetchWeather(doc.date, doc.lat, doc.lng);
    if (!weather) {
      results.push({
        _id: doc._id,
        docType: doc.docType,
        status: 'skipped — weather fetch failed',
      });
      continue;
    }
    try {
      await writeClient
        .patch(doc._id)
        .set({ weatherContext: weather })
        .commit({ autoGenerateArrayKeys: true });
      results.push({
        _id: doc._id,
        docType: doc.docType,
        status: `patched — ${weather.type}`,
      });
    } catch {
      results.push({
        _id: doc._id,
        docType: doc.docType,
        status: 'error — patch failed',
      });
    }
  }

  const patched = results.filter((r) => r.status.startsWith('patched')).length;
  const skipped = results.filter((r) => !r.status.startsWith('patched')).length;

  return NextResponse.json({
    total: all.length,
    patched,
    skipped,
    results,
  });
}
