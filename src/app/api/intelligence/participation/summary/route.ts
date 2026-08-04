import { type NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client/client';
import { authenticate } from '../../_auth';

export const dynamic = 'force-dynamic';

// Participation is stored as participationLog[] on campaign documents.
// We aggregate across all campaigns — no personal data is returned.
const q = `{
  "logs": *[_type == "campaign" && defined(participationLog)] {
    "entries": participationLog[] { commentType, relationship }
  },
  "activeNotices": count(*[_type == "developmentNotice" && status == "open" && commentDeadline > now()])
}`;

type Entry = { commentType?: string; relationship?: string };

export async function GET(request: NextRequest) {
  const denied = authenticate(request);
  if (denied) return denied;

  try {
    const data = await client.fetch<{
      logs: { entries: Entry[] }[];
      activeNotices: number;
    }>(q);

    const allEntries: Entry[] = data.logs.flatMap((l) => l.entries ?? []);

    const byType = { comment: 0, objection: 0, support: 0, question: 0 };
    const byRelationship = {
      resident: 0,
      landowner: 0,
      business: 0,
      community: 0,
      organisation: 0,
      other: 0,
    };

    for (const e of allEntries) {
      const t = e.commentType as keyof typeof byType;
      if (t in byType) byType[t]++;
      const r = e.relationship as keyof typeof byRelationship;
      if (r in byRelationship) byRelationship[r]++;
    }

    return NextResponse.json({
      total: allEntries.length,
      byType,
      byRelationship,
      activeNotices: data.activeNotices ?? 0,
      generatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Query failed.' }, { status: 500 });
  }
}
