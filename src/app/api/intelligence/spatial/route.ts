import { type NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client/client';
import { authenticate } from '../_auth';

export const dynamic = 'force-dynamic';

const spatialQuery = `{
  "municipalities": *[_type == "listing" && listingType == "area" && areaLevel == "municipality"] {
    "name": name,
    "slug": slug.current,
    "municipality": municipality,
    "boundaryAvailable": defined(boundary),
    "recordCount": count(*[_type == "record" && references(^._id)]),
    "noticeCount": count(*[_type == "notice" && references(^._id)]),
    "activeProjects": count(*[_type == "campaign" && references(^._id) && status == "active"]),
    "activeDevNotices": count(*[_type == "developmentNotice" && references(^._id) && status == "open"])
  },
  "wards": *[_type == "listing" && listingType == "area" && areaLevel == "ward"] {
    "wardNumber": wardNumber,
    "municipality": municipality,
    "slug": slug.current,
    "boundaryAvailable": defined(boundary),
    "recordCount": count(*[_type == "record" && references(^._id)]),
    "activeProjects": count(*[_type == "campaign" && references(^._id) && status == "active"])
  },
  "recentRecords": *[_type == "record" && defined(relatedArea->geopoint)] | order(_updatedAt desc) [0...20] {
    "id": _id,
    "label": title,
    "recordType": recordType,
    "timestamp": _createdAt,
    "lat": relatedArea->geopoint.lat,
    "lng": relatedArea->geopoint.lng,
    "ward": relatedArea->wardNumber,
    "municipality": relatedArea->municipality
  },
  "recentDevNotices": *[_type == "developmentNotice" && (defined(geopoint) || defined(relatedArea->geopoint))] | order(_updatedAt desc) [0...20] {
    "id": _id,
    "label": title,
    "timestamp": _createdAt,
    "lat": coalesce(geopoint.lat, relatedArea->geopoint.lat),
    "lng": coalesce(geopoint.lng, relatedArea->geopoint.lng),
    "ward": relatedArea->wardNumber,
    "municipality": relatedArea->municipality
  },
  "recentCampaigns": *[_type == "campaign" && (defined(siteGeopoint) || defined(geographicAssociations[0].area->geopoint))] | order(_updatedAt desc) [0...20] {
    "id": _id,
    "label": title,
    "timestamp": _updatedAt,
    "lat": coalesce(siteGeopoint.lat, geographicAssociations[0].area->geopoint.lat),
    "lng": coalesce(siteGeopoint.lng, geographicAssociations[0].area->geopoint.lng),
    "municipality": geographicAssociations[0].area->municipality
  }
}`;

type SpatialRow = {
  id: string;
  label: string;
  recordType?: string;
  timestamp: string;
  lat: number | null;
  lng: number | null;
  ward?: number | null;
  municipality?: string | null;
};

function toGeoRef(
  row: SpatialRow,
  recordType: 'record' | 'notice' | 'project'
) {
  if (!row.lat || !row.lng) return null;
  return {
    recordId: row.id,
    recordType,
    label: row.label,
    timestamp: row.timestamp,
    latitude: row.lat,
    longitude: row.lng,
    district: 'Amajuba',
    municipality: row.municipality ?? undefined,
    ward: row.ward != null ? `Ward ${row.ward}` : undefined,
  };
}

export async function GET(request: NextRequest) {
  const denied = authenticate(request);
  if (denied) return denied;

  try {
    const data = await client.fetch<{
      municipalities: {
        name: string;
        slug: string;
        municipality: string | null;
        boundaryAvailable: boolean;
        recordCount: number;
        noticeCount: number;
        activeProjects: number;
        activeDevNotices: number;
      }[];
      wards: {
        wardNumber: number | null;
        municipality: string | null;
        slug: string;
        boundaryAvailable: boolean;
        recordCount: number;
        activeProjects: number;
      }[];
      recentRecords: SpatialRow[];
      recentDevNotices: SpatialRow[];
      recentCampaigns: SpatialRow[];
    }>(spatialQuery);

    const geoRefs = [
      ...(data.recentRecords ?? []).map((r) => toGeoRef(r, 'record')),
      ...(data.recentDevNotices ?? []).map((r) => toGeoRef(r, 'notice')),
      ...(data.recentCampaigns ?? []).map((r) => toGeoRef(r, 'project')),
    ].filter((r): r is NonNullable<typeof r> => r !== null);

    return NextResponse.json({
      municipalities: data.municipalities ?? [],
      wards: data.wards ?? [],
      geoRefs,
      generatedAt: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to fetch spatial summary', detail: String(e) },
      { status: 500 }
    );
  }
}
