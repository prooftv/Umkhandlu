import { type NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client/client';
import { authenticate } from '../../_auth';

export const dynamic = 'force-dynamic';

const q = `{
  "total": count(*[_type == "conflictLog"]),
  "pending":   count(*[_type == "conflictLog" && resolutionState == "pending"]),
  "partial":   count(*[_type == "conflictLog" && resolutionState == "partial"]),
  "resolved":  count(*[_type == "conflictLog" && resolutionState == "resolved"]),
  "escalated": count(*[_type == "conflictLog" && resolutionState == "escalated"]),
  "resolvedPairs": *[_type == "conflictLog" && resolutionState == "resolved" && defined(detectedAt) && defined(resolvedAt)] {
    "days": round((dateTime(resolvedAt) - dateTime(detectedAt)) / 86400)
  }
}`;

export async function GET(request: NextRequest) {
  const denied = authenticate(request);
  if (denied) return denied;

  try {
    const data = await client.fetch<{
      total: number;
      pending: number;
      partial: number;
      resolved: number;
      escalated: number;
      resolvedPairs: { days: number }[];
    }>(q);

    const pairs = data.resolvedPairs ?? [];
    const averageResolutionDays =
      pairs.length > 0
        ? Math.round(
            pairs.reduce((s, p) => s + (p.days ?? 0), 0) / pairs.length
          )
        : undefined;

    return NextResponse.json({
      total: data.total ?? 0,
      byResolutionState: {
        pending: data.pending ?? 0,
        partial: data.partial ?? 0,
        resolved: data.resolved ?? 0,
        escalated: data.escalated ?? 0,
      },
      escalated: data.escalated ?? 0,
      ...(averageResolutionDays !== undefined && { averageResolutionDays }),
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Query failed.' }, { status: 500 });
  }
}
