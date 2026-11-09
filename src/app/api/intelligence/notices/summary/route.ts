import { type NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client/client';
import { authenticate } from '../../_auth';

export const dynamic = 'force-dynamic';

const q = `{
  "communityTotal": count(*[_type == "notice"]),
  "communityByStatus": {
    "draft":     count(*[_type == "notice" && !defined(date)]),
    "published": count(*[_type == "notice" && defined(date)])
  },
  "communityByType": {
    "meeting":       count(*[_type == "notice" && noticeType == "meeting"]),
    "announcement":  count(*[_type == "notice" && noticeType == "announcement"]),
    "resolution":    count(*[_type == "notice" && noticeType == "resolution"]),
    "alert":         count(*[_type == "notice" && noticeType == "alert"]),
    "opportunity":   count(*[_type == "notice" && noticeType == "opportunity"]),
    "employment":    count(*[_type == "notice" && noticeType == "employment"]),
    "smme":          count(*[_type == "notice" && noticeType == "smme"]),
    "project-update": count(*[_type == "notice" && noticeType == "project-update"])
  },
  "statutoryTotal": count(*[_type == "developmentNotice"]),
  "statutoryOpen":  count(*[_type == "developmentNotice" && status == "open" && commentDeadline > now()]),
  "statutoryPendingProof": count(*[_type == "developmentNotice" && status == "closed" && proofIssued != true]),
  "statutoryByStatus": {
    "open":      count(*[_type == "developmentNotice" && status == "open"]),
    "closed":    count(*[_type == "developmentNotice" && status == "closed"]),
    "approved":  count(*[_type == "developmentNotice" && status == "approved"]),
    "rejected":  count(*[_type == "developmentNotice" && status == "rejected"]),
    "withdrawn": count(*[_type == "developmentNotice" && status == "withdrawn"])
  },
  "statutoryByType": {
    "eia":         count(*[_type == "developmentNotice" && noticeType == "eia"]),
    "rezoning":    count(*[_type == "developmentNotice" && noticeType == "rezoning"]),
    "land-use":    count(*[_type == "developmentNotice" && noticeType == "land-use"]),
    "township":    count(*[_type == "developmentNotice" && noticeType == "township"]),
    "building":    count(*[_type == "developmentNotice" && noticeType == "building"]),
    "mining":      count(*[_type == "developmentNotice" && noticeType == "mining"]),
    "liquor":      count(*[_type == "developmentNotice" && noticeType == "liquor"]),
    "telecom":     count(*[_type == "developmentNotice" && noticeType == "telecom"]),
    "estate":      count(*[_type == "developmentNotice" && noticeType == "estate"]),
    "liquidation": count(*[_type == "developmentNotice" && noticeType == "liquidation"]),
    "pto":         count(*[_type == "developmentNotice" && noticeType == "pto"]),
    "other":       count(*[_type == "developmentNotice" && noticeType == "other"])
  },
  "recentCommunity": *[_type == "notice"] | order(_updatedAt desc) [0...5] {
    "id": _id, title, "type": noticeType, "status": select(defined(date) => "published", "draft"),
    "isStatutory": false, "commentDeadline": null, "createdAt": _createdAt,
    "geoRefLat": relatedArea->geopoint.lat,
    "geoRefLng": relatedArea->geopoint.lng,
    "geoRefWard": relatedArea->wardNumber,
    "geoRefMunicipality": relatedArea->municipality
  },
  "recentStatutory": *[_type == "developmentNotice"] | order(_updatedAt desc) [0...5] {
    "id": _id, title, "type": noticeType, status,
    "isStatutory": true, "commentDeadline": commentDeadline, "createdAt": _createdAt,
    "geoRefLat": coalesce(geopoint.lat, relatedArea->geopoint.lat),
    "geoRefLng": coalesce(geopoint.lng, relatedArea->geopoint.lng),
    "geoRefWard": relatedArea->wardNumber,
    "geoRefMunicipality": relatedArea->municipality
  }
}`;

type RawItem = {
  id: string;
  title: string;
  type: string;
  status: string;
  isStatutory: boolean;
  commentDeadline: string | null;
  createdAt: string;
  geoRefLat?: number | null;
  geoRefLng?: number | null;
  geoRefWard?: number | null;
  geoRefMunicipality?: string | null;
};

function mapItem(r: RawItem) {
  const item: Record<string, unknown> = {
    id: r.id,
    title: r.title,
    type: r.type,
    status: r.status,
    isStatutory: r.isStatutory,
    commentDeadline: r.commentDeadline,
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
}

export async function GET(request: NextRequest) {
  const denied = authenticate(request);
  if (denied) return denied;

  try {
    const data = await client.fetch(q);
    const total = (data.communityTotal ?? 0) + (data.statutoryTotal ?? 0);

    const recentActivity = [
      ...(data.recentCommunity ?? []).map(mapItem),
      ...(data.recentStatutory ?? []).map(mapItem),
    ]
      .sort((a, b) =>
        (a.createdAt as string) < (b.createdAt as string) ? 1 : -1
      )
      .slice(0, 10);

    return NextResponse.json({
      total,
      byStatus: {
        ...data.communityByStatus,
        ...data.statutoryByStatus,
      },
      byType: {
        ...data.communityByType,
        ...data.statutoryByType,
      },
      statutory: {
        total: data.statutoryTotal ?? 0,
        open: data.statutoryOpen ?? 0,
        pendingProof: data.statutoryPendingProof ?? 0,
      },
      recentActivity,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Query failed.' }, { status: 500 });
  }
}
