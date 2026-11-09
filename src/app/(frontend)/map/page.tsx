import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import GovernanceMapClient from '@/components/modules/GovernanceMapClient';
import type {
  MapBoundary,
  MapRecord,
} from '@/components/modules/GovernanceMapLeaflet';
import { client } from '@/lib/sanity/client/client';

// Control Centre public ward boundaries — authoritative MDB 2026 geometry.
// Falls back to Sanity-managed boundaries if unavailable.
const CONTROL_CENTRE_WARDS_URL = process.env.CONTROL_CENTRE_URL
  ? `${process.env.CONTROL_CENTRE_URL}/api/spatial/wards`
  : null;

async function fetchControlCentreWards(): Promise<MapBoundary[]> {
  if (!CONTROL_CENTRE_WARDS_URL) return [];
  try {
    const res = await fetch(CONTROL_CENTRE_WARDS_URL, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as {
      type: string;
      features: Array<{
        type: string;
        geometry: { type: string; coordinates: unknown };
        properties: Record<string, unknown>;
      }>;
      meta?: { dataset?: string; datasetDate?: string; attribution?: string };
    };
    return (json.features ?? []).map((f) => {
      const p = f.properties;
      const wardNum = p.WARDNO ?? p.WardNo ?? p.ward_number ?? null;
      const munic = (p.MUNICNAME ??
        p.MunicName ??
        p.municipality ??
        '') as string;
      const name =
        wardNum != null ? `Ward ${wardNum} — ${munic}` : munic || 'Ward';
      return {
        slug: `ward-${wardNum ?? name}`,
        name,
        areaLevel: 'ward',
        municipality: munic || null,
        wardNumber: wardNum != null ? Number(wardNum) : null,
        indunaName: null,
        indunaSlug: null,
        recordCount: 0,
        noticeCount: 0,
        campaignCount: 0,
        boundary: f.geometry,
        boundarySource: json.meta?.dataset ?? 'MDB 2026',
        boundaryDate: json.meta?.datasetDate ?? '2026',
        boundaryPermission: 'public-domain',
        geopoint: null,
      } satisfies MapBoundary;
    });
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: 'Geographic View — Umkhandlu',
  description:
    'Governance records, notices and projects in their geographic context across Amajuba District.',
};

export const revalidate = 0;

const mapQuery = `{
  "records": *[_type == "record" && defined(relatedArea->geopoint)] | order(_updatedAt desc) [0...100] {
    "id": _id,
    "slug": slug.current,
    "label": title,
    "subtype": recordType,
    "date": date,
    "status": status,
    "lat": relatedArea->geopoint.lat,
    "lng": relatedArea->geopoint.lng,
    "municipality": relatedArea->municipality,
    "ward": relatedArea->wardNumber
  },
  "devNotices": *[_type == "developmentNotice" && (defined(geopoint) || defined(relatedArea->geopoint))] | order(_updatedAt desc) [0...100] {
    "id": _id,
    "slug": slug.current,
    "label": title,
    "subtype": noticeType,
    "date": commentDeadline,
    "status": status,
    "lat": coalesce(geopoint.lat, relatedArea->geopoint.lat),
    "lng": coalesce(geopoint.lng, relatedArea->geopoint.lng),
    "municipality": relatedArea->municipality,
    "ward": relatedArea->wardNumber
  },
  "campaigns": *[_type == "campaign" && (defined(siteGeopoint) || defined(geographicAssociations[0].area->geopoint))] | order(_updatedAt desc) [0...100] {
    "id": _id,
    "slug": slug.current,
    "label": title,
    "subtype": campaignType,
    "date": startDate,
    "status": status,
    "lat": coalesce(siteGeopoint.lat, geographicAssociations[0].area->geopoint.lat),
    "lng": coalesce(siteGeopoint.lng, geographicAssociations[0].area->geopoint.lng),
    "municipality": geographicAssociations[0].area->municipality,
    "ward": null
  },
  "boundaries": *[_type == "listing" && listingType == "area" && defined(boundary)] {
    "slug": slug.current,
    "name": name,
    "areaLevel": areaLevel,
    "municipality": municipality,
    "wardNumber": wardNumber,
    "indunaName": induna->firstName + " " + induna->lastName,
    "indunaSlug": induna->slug.current,
    "recordCount": count(*[_type == "record" && references(^._id)]),
    "noticeCount": count(*[_type == "developmentNotice" && references(^._id)]),
    "campaignCount": count(*[_type == "campaign" && references(^._id)]),
    "boundary": boundary,
    "boundarySource": boundarySource,
    "boundaryDate": boundaryDate,
    "boundaryPermission": boundaryPermission,
    "geopoint": geopoint
  }
}`;

type RawItem = {
  id: string;
  slug: string | null;
  label: string | null;
  subtype: string | null;
  date: string | null;
  status: string | null;
  lat: number | null;
  lng: number | null;
  municipality: string | null;
  ward: number | null;
};

export default async function MapPage() {
  // Fetch ward boundaries from Control Centre (authoritative) and Sanity (governance context) in parallel
  const [controlCentreWards, data] = await Promise.all([
    fetchControlCentreWards(),
    client.fetch<{
      records: RawItem[];
      devNotices: RawItem[];
      campaigns: RawItem[];
      boundaries: {
        slug: string;
        name: string;
        areaLevel: string | null;
        municipality: string | null;
        wardNumber: number | null;
        indunaName: string | null;
        indunaSlug: string | null;
        recordCount: number;
        noticeCount: number;
        campaignCount: number;
        boundary: { type: string; coordinates: unknown };
        boundarySource: string | null;
        boundaryDate: string | null;
        boundaryPermission: string | null;
        geopoint: { lat: number; lng: number } | null;
      }[];
    }>(mapQuery),
  ]);

  function toMapRecord(
    item: RawItem,
    type: MapRecord['type']
  ): MapRecord | null {
    if (!item.lat || !item.lng || !item.slug) return null;
    return {
      id: item.id,
      slug: item.slug,
      label: item.label ?? item.id,
      type,
      subtype: item.subtype ?? type,
      lat: item.lat,
      lng: item.lng,
      date: item.date,
      status: item.status,
      municipality: item.municipality,
      ward: item.ward,
    };
  }

  const records: MapRecord[] = [
    ...(data.records ?? []).map((r) => toMapRecord(r, 'record')),
    ...(data.devNotices ?? []).map((r) => toMapRecord(r, 'notice')),
    ...(data.campaigns ?? []).map((r) => toMapRecord(r, 'project')),
  ].filter((r): r is MapRecord => r !== null);

  // Prefer Control Centre MDB boundaries (authoritative, 55 wards).
  // Merge with Sanity boundaries: Sanity entries enrich with induna/governance counts
  // for any ward that matches by wardNumber + municipality.
  const sanityBoundaries: MapBoundary[] = (data.boundaries ?? []).filter(
    (b) => b.boundary && b.slug
  );

  let boundaries: MapBoundary[];
  if (controlCentreWards.length > 0) {
    // Enrich Control Centre wards with Sanity governance data where available
    boundaries = controlCentreWards.map((ccWard) => {
      const match = sanityBoundaries.find(
        (s) =>
          s.wardNumber != null &&
          s.wardNumber === ccWard.wardNumber &&
          s.municipality === ccWard.municipality
      );
      if (!match) return ccWard;
      return {
        ...ccWard,
        slug: match.slug,
        indunaName: match.indunaName,
        indunaSlug: match.indunaSlug,
        recordCount: match.recordCount,
        noticeCount: match.noticeCount,
        campaignCount: match.campaignCount,
      };
    });
  } else {
    // Fallback: use Sanity boundaries only
    boundaries = sanityBoundaries;
  }

  // Centre on Amajuba District; if boundaries exist, map will fit to them
  const AMAJUBA_CENTRE: [number, number] = [-28.05, 29.0];

  return (
    <div className="container mx-auto py-12">
      <Breadcrumbs items={[{ label: 'Geographic View' }]} />

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Geographic View</h1>
        <p className="text-gray-600 max-w-2xl text-sm md:text-base">
          Governance records, development notices and campaigns in their
          geographic context. Select a marker to view the underlying record.
        </p>
        <div className="flex gap-4 mt-3 text-sm text-gray-500">
          <Link href="/records" className="hover:text-primary hover:underline">
            Records
          </Link>
          <Link
            href="/development-notices"
            className="hover:text-primary hover:underline"
          >
            Development notices
          </Link>
          <Link href="/areas" className="hover:text-primary hover:underline">
            Areas
          </Link>
        </div>
      </header>

      {records.length === 0 && boundaries.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-8 text-center space-y-2">
          <p className="font-medium text-gray-700">
            No georeferenced content available
          </p>
          <p className="text-sm text-gray-500">
            Records, notices and campaigns appear here when they have geographic
            coordinates or are associated with an area that has a geopoint.
          </p>
        </div>
      ) : (
        <GovernanceMapClient
          records={records}
          boundaries={boundaries}
          centre={AMAJUBA_CENTRE}
          zoom={9}
        />
      )}
    </div>
  );
}
