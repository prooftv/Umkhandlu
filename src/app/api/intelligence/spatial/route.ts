import { type NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client/client';
import { authenticate } from '../_auth';

export const dynamic = 'force-dynamic';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function parsePaginationParam(
  value: string | null,
  defaultValue: number,
  max?: number
): number | null {
  if (value === null) return defaultValue;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) return null;
  if (max !== undefined && n > max) return null;
  return n;
}

function buildSpatialQuery(
  recordsOffset: number,
  recordsLimit: number,
  noticesOffset: number,
  noticesLimit: number,
  campaignsOffset: number,
  campaignsLimit: number
) {
  return `{
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
  "recordsTotal": count(*[_type == "record" && defined(relatedArea->geopoint)]),
  "recentRecords": *[_type == "record" && defined(relatedArea->geopoint)] | order(_updatedAt desc) [${recordsOffset}...${recordsOffset + recordsLimit}] {
    "id": _id,
    "label": title,
    "recordType": recordType,
    "timestamp": _createdAt,
    "lat": relatedArea->geopoint.lat,
    "lng": relatedArea->geopoint.lng,
    "coordinateSource": "Sanity record.relatedArea.geopoint",
    "coordinateRole": "area-reference",
    "locationPrecision": null,
    "ward": relatedArea->wardNumber,
    "municipality": relatedArea->municipality
  },
  "noticesTotal": count(*[_type == "developmentNotice" && (defined(geopoint) || defined(relatedArea->geopoint))]),
  "recentDevNotices": *[_type == "developmentNotice" && (defined(geopoint) || defined(relatedArea->geopoint))] | order(_updatedAt desc) [${noticesOffset}...${noticesOffset + noticesLimit}] {
    "id": _id,
    "label": title,
    "timestamp": _createdAt,
    "lat": coalesce(geopoint.lat, relatedArea->geopoint.lat),
    "lng": coalesce(geopoint.lng, relatedArea->geopoint.lng),
    "coordinateSource": select(
      defined(geopoint) => "Sanity developmentNotice.geopoint",
      defined(relatedArea->geopoint) => "Sanity relatedArea.geopoint"
    ),
    "coordinateRole": select(
      defined(geopoint) => "site",
      defined(relatedArea->geopoint) => "area-reference"
    ),
    "locationPrecision": select(
      defined(geopoint) => locationPrecision,
      defined(relatedArea->geopoint) => null
    ),
    "ward": relatedArea->wardNumber,
    "municipality": relatedArea->municipality
  },
  "campaignsTotal": count(*[_type == "campaign" && (defined(siteGeopoint) || defined(geographicAssociations[0].area->geopoint))]),
  "recentCampaigns": *[_type == "campaign" && (defined(siteGeopoint) || defined(geographicAssociations[0].area->geopoint))] | order(_updatedAt desc) [${campaignsOffset}...${campaignsOffset + campaignsLimit}] {
    "id": _id,
    "label": title,
    "timestamp": _updatedAt,
    "lat": coalesce(siteGeopoint.lat, geographicAssociations[0].area->geopoint.lat),
    "lng": coalesce(siteGeopoint.lng, geographicAssociations[0].area->geopoint.lng),
    "coordinateSource": select(
      defined(siteGeopoint) => "Sanity campaign.siteGeopoint",
      defined(geographicAssociations[0].area->geopoint) => "Sanity campaign.geographicAssociations[0].area.geopoint"
    ),
    "coordinateRole": select(
      defined(siteGeopoint) => "site",
      defined(geographicAssociations[0].area->geopoint) => "area-reference"
    ),
    "locationPrecision": null,
    "municipality": geographicAssociations[0].area->municipality
  }
}`;
}

type SpatialRow = {
  id: string;
  label: string;
  recordType?: string;
  timestamp: string;
  lat: number | null;
  lng: number | null;
  coordinateSource: string;
  coordinateRole: 'site' | 'area-reference';
  locationPrecision: string | null;
  ward?: number | null;
  municipality?: string | null;
};

type PaginatedEnvelope<T> = {
  items: T[];
  total: number | null;
  offset: number;
  limit: number;
  hasMore: boolean;
  error?: string;
};

function toGeoRef(
  row: SpatialRow,
  recordType: 'record' | 'notice' | 'project'
) {
  if (
    row.lat === null ||
    row.lng === null ||
    !Number.isFinite(row.lat) ||
    !Number.isFinite(row.lng)
  ) {
    return null;
  }
  return {
    recordId: row.id,
    recordType,
    label: row.label,
    timestamp: row.timestamp,
    latitude: row.lat,
    longitude: row.lng,
    coordinateSource: row.coordinateSource,
    coordinateRole: row.coordinateRole,
    locationPrecision: row.locationPrecision,
    district: 'Amajuba',
    municipality: row.municipality ?? undefined,
    ward: row.ward != null ? `Ward ${row.ward}` : undefined,
  };
}

function makeEnvelope<T>(
  items: T[],
  total: number | null,
  offset: number,
  limit: number
): PaginatedEnvelope<T> {
  const hasMore =
    total !== null ? offset + limit < total : items.length === limit;
  return { items, total, offset, limit, hasMore };
}

export async function GET(request: NextRequest) {
  const denied = authenticate(request);
  if (denied) return denied;

  const sp = request.nextUrl.searchParams;

  const recordsOffset = parsePaginationParam(sp.get('recordsOffset'), 0);
  const recordsLimit = parsePaginationParam(
    sp.get('recordsLimit'),
    DEFAULT_LIMIT,
    MAX_LIMIT
  );
  const noticesOffset = parsePaginationParam(sp.get('devNoticesOffset'), 0);
  const noticesLimit = parsePaginationParam(
    sp.get('devNoticesLimit'),
    DEFAULT_LIMIT,
    MAX_LIMIT
  );
  const campaignsOffset = parsePaginationParam(sp.get('campaignsOffset'), 0);
  const campaignsLimit = parsePaginationParam(
    sp.get('campaignsLimit'),
    DEFAULT_LIMIT,
    MAX_LIMIT
  );

  if (
    recordsOffset === null ||
    recordsLimit === null ||
    noticesOffset === null ||
    noticesLimit === null ||
    campaignsOffset === null ||
    campaignsLimit === null
  ) {
    return NextResponse.json(
      {
        error:
          'Invalid pagination parameters. offset must be ≥ 0; limit must be 1–100.',
      },
      { status: 400 }
    );
  }

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
      recordsTotal: number | null;
      recentRecords: SpatialRow[];
      noticesTotal: number | null;
      recentDevNotices: SpatialRow[];
      campaignsTotal: number | null;
      recentCampaigns: SpatialRow[];
    }>(
      buildSpatialQuery(
        recordsOffset,
        recordsLimit,
        noticesOffset,
        noticesLimit,
        campaignsOffset,
        campaignsLimit
      )
    );

    const recordItems = data.recentRecords ?? [];
    const noticeItems = data.recentDevNotices ?? [];
    const campaignItems = data.recentCampaigns ?? [];

    const geoRefs = [
      ...recordItems.map((r) => toGeoRef(r, 'record')),
      ...noticeItems.map((r) => toGeoRef(r, 'notice')),
      ...campaignItems.map((r) => toGeoRef(r, 'project')),
    ].filter((r): r is NonNullable<typeof r> => r !== null);

    return NextResponse.json({
      municipalities: data.municipalities ?? [],
      wards: data.wards ?? [],
      records: makeEnvelope(
        recordItems,
        data.recordsTotal ?? null,
        recordsOffset,
        recordsLimit
      ),
      devNotices: makeEnvelope(
        noticeItems,
        data.noticesTotal ?? null,
        noticesOffset,
        noticesLimit
      ),
      campaigns: makeEnvelope(
        campaignItems,
        data.campaignsTotal ?? null,
        campaignsOffset,
        campaignsLimit
      ),
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
