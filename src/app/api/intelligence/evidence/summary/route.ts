import { type NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client/client';
import { authenticate } from '../../_auth';

export const dynamic = 'force-dynamic';

// Evidence lives as file arrays on record documents and developmentNotice documents.
// Weather context is an object on both record and notice documents.
const q = `{
  "recordEvidence": *[_type == "record" && defined(evidence)] {
    "count": count(evidence)
  },
  "devNoticeDocuments": *[_type == "developmentNotice" && defined(documents)] {
    "count": count(documents)
  },
  "recordsWithWeather": count(*[_type == "record" && defined(weatherContext.fetchedAt)]),
  "noticesWithWeather": count(*[_type == "notice" && defined(weatherContext.fetchedAt)])
}`;

export async function GET(request: NextRequest) {
  const denied = authenticate(request);
  if (denied) return denied;

  try {
    const data = await client.fetch<{
      recordEvidence: { count: number }[];
      devNoticeDocuments: { count: number }[];
      recordsWithWeather: number;
      noticesWithWeather: number;
    }>(q);

    const recordFiles = data.recordEvidence.reduce(
      (s, r) => s + (r.count ?? 0),
      0
    );
    const noticeFiles = data.devNoticeDocuments.reduce(
      (s, r) => s + (r.count ?? 0),
      0
    );
    const total = recordFiles + noticeFiles;

    return NextResponse.json({
      total,
      // File type breakdown is not stored in schema — all are document/image files
      byType: {
        document: total,
        image: 0,
        video: 0,
        audio: 0,
        other: 0,
      },
      withWeatherContext:
        (data.recordsWithWeather ?? 0) + (data.noticesWithWeather ?? 0),
      generatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Query failed.' }, { status: 500 });
  }
}
