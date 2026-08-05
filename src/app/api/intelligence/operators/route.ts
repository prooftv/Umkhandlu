import { type NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client/client';
import { authenticate } from '../_auth';

export const dynamic = 'force-dynamic';

// email and phone are intentionally excluded — private fields
const q = `*[_type == "operatorProfile"] | order(operatorRole asc, name asc) {
  "id": _id,
  name,
  operatorRole,
  organisation,
  sanityUserId,
  active,
  assignedSince,
  assignedUntil,
  notes
}`;

export async function GET(request: NextRequest) {
  const denied = authenticate(request);
  if (denied) return denied;

  try {
    const operators = await client.fetch(q);

    const active = operators.filter(
      (o: { active?: boolean }) => o.active !== false
    );
    const inactive = operators.filter(
      (o: { active?: boolean }) => o.active === false
    );

    const byRole = operators.reduce(
      (acc: Record<string, number>, o: { operatorRole?: string }) => {
        const r = o.operatorRole ?? 'unknown';
        acc[r] = (acc[r] ?? 0) + 1;
        return acc;
      },
      {}
    );

    return NextResponse.json({
      total: operators.length,
      active: active.length,
      inactive: inactive.length,
      byRole,
      operators,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Query failed.' }, { status: 500 });
  }
}
