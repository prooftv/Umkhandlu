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
  "recent": *[_type == "record"] | order(_updatedAt desc) [0...10] {
    "id": _id,
    title,
    "type": recordType,
    status,
    "createdAt": _createdAt,
    "geoRefLat": relatedArea->geopoint.lat,
    "geoRefLng": relatedArea->geopoint.lng,
    "geoRefWard": relatedArea->wardNumber,
    "geoRefMunicipality": relatedArea->municipality
  }
}`;

type RawRecord = {
  id: string;
  title: string;
  type: string;
  status: string | null;
  createdAt: string;
  geoRefLat?: number | null;
  geoRefLng?: number | null;
  geoRefWard?: number | null;
  geoRefMunicipality?: string | null;
};

export async function GET(request: NextRequest) {
  const denied = authenticate(request);
  if (denied) return denied;

  try {
    const data = await client.fetch(q);
    const recent = (data.recent ?? []).map((r: RawRecord) => {
      const item: Record<string, unknown> = {
        id: r.id,
        title: r.title,
        type: r.type,
        status: r.status,
        createdAt: r.createdAt,
      };
      if (r.geoRefLat != null && r.geoRefLng != null) {
        item.geoRef = {
          latitude: r.geoRefLat,
          longitude: r.geoRefLng,
          district: 'Amajuba',
          municipality: r.geoRefMunicipality ?? undefined,
          ward: r.geoRefWard != null ? `Ward ${r.geoRefWard}` : undefined,
        };
      }
      return item;
    });
    return NextResponse.json({
      ...data,
      recent,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Query failed.' }, { status: 500 });
  }
}
