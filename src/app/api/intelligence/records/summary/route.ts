import { type NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client/client';
import { authenticate } from '../../_auth';

export const dynamic = 'force-dynamic';

const q = `{
  "total": count(*[_type == "record"]),
  "byStatus": {
    "pending":  count(*[_type == "record" && status == "pending"]),
    "adopted":  count(*[_type == "record" && status == "adopted"]),
    "approved": count(*[_type == "record" && status == "approved"]),
    "resolved": count(*[_type == "record" && status == "resolved"]),
    "rejected": count(*[_type == "record" && status == "rejected"])
  },
  "byType": {
    "minutes":              count(*[_type == "record" && recordType == "minutes"]),
    "resolution":           count(*[_type == "record" && recordType == "resolution"]),
    "agenda":               count(*[_type == "record" && recordType == "agenda"]),
    "land-allocation":      count(*[_type == "record" && recordType == "land-allocation"]),
    "dispute-resolution":   count(*[_type == "record" && recordType == "dispute-resolution"]),
    "community-decision":   count(*[_type == "record" && recordType == "community-decision"]),
    "policy":               count(*[_type == "record" && recordType == "policy"]),
    "report":               count(*[_type == "record" && recordType == "report"]),
    "infrastructure-concern": count(*[_type == "record" && recordType == "infrastructure-concern"]),
    "project-outcome":      count(*[_type == "record" && recordType == "project-outcome"]),
    "public-notice":        count(*[_type == "record" && recordType == "public-notice"]),
    "external-resource":    count(*[_type == "record" && recordType == "external-resource"])
  },
  "recentActivity": *[_type == "record"] | order(_updatedAt desc) [0...10] {
    "id": _id,
    title,
    "type": recordType,
    status,
    "createdAt": _createdAt
  }
}`;

export async function GET(request: NextRequest) {
  const denied = authenticate(request);
  if (denied) return denied;

  try {
    const data = await client.fetch(q);
    return NextResponse.json({
      ...data,
      generatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Query failed.' }, { status: 500 });
  }
}
