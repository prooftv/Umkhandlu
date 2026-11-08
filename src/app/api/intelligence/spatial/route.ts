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
  }
}`;

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
    }>(spatialQuery);

    return NextResponse.json({
      municipalities: data.municipalities ?? [],
      wards: data.wards ?? [],
      generatedAt: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to fetch spatial summary', detail: String(e) },
      { status: 500 }
    );
  }
}
