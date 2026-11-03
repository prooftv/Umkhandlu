import { type NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client/client';
import { authenticate } from '../../_auth';

export const dynamic = 'force-dynamic';

// Governance Node API v1.1 — authoritative record detail.
// Consumed by the Control Centre /intelligence/records/[id] page.
// Query param: ?id=<sanityId>
const q = `*[_type == "record" && _id == $id][0]{
  _id,
  title,
  "slug": slug.current,
  recordType,
  date,
  summary,
  status,
  verificationNote,
  externalUrl,
  source,
  "approvedBy": approvedBy->{ firstName, lastName, role },
  evidence[]{ _key, title, "url": asset->url },
  "originNotice": originNotice->{ _id, title, "slug": slug.current, noticeType, date },
  "parentRecord": parentRecord->{ _id, title, "slug": slug.current, recordType },
  "relatedArea": relatedArea->{ name, "slug": slug.current },
  "relatedCampaign": relatedCampaign->{ title, "slug": slug.current, status },
  location,
  attendance,
  "childRecords": *[_type == "record" && parentRecord._ref == ^._id] | order(date asc) {
    _id, title, "slug": slug.current, recordType, date, status
  }
}`;

export async function GET(request: NextRequest) {
  const denied = authenticate(request);
  if (denied) return denied;

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json(
      { error: 'Missing required query param: id' },
      { status: 400 }
    );
  }

  try {
    const record = await client.fetch(q, { id });
    if (!record) {
      return NextResponse.json({ error: 'Record not found.' }, { status: 404 });
    }
    return NextResponse.json({ record, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ error: 'Query failed.' }, { status: 500 });
  }
}
