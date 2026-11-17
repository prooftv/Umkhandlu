import { type NextRequest, NextResponse } from 'next/server';
import { registerNoticeWithCC } from '@/actions/registerNoticeWithCC';

const STATUTORY_TYPES = new Set([
  'eia',
  'rezoning',
  'land-use',
  'township',
  'building',
  'mining',
  'liquor',
  'telecom',
]);

function validateSecret(req: NextRequest): boolean {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) return true;
  const authHeader =
    req.headers.get('sanity-webhook-signature') ??
    req.headers.get('authorization');
  return !!authHeader && authHeader.includes(secret);
}

function buildWardRef(relatedArea?: {
  wardNumber?: number;
  municipality?: string;
}): string | null {
  if (relatedArea?.wardNumber == null) return null;
  const suffix = relatedArea.municipality
    ? ` — ${relatedArea.municipality}`
    : '';
  return `Ward ${relatedArea.wardNumber}${suffix}`;
}

/**
 * Sanity webhook endpoint — called by Sanity when a developmentNotice is published.
 *
 * Configure in Sanity: Settings > API > Webhooks
 *   URL: https://umkhandlu.unamifoundation.org/api/sanity-webhook
 *   Filter: _type == "developmentNotice" && status == "open"
 *   Projection: { _id, _type, title, noticeType, status, description,
 *                 commentDeadline, geopoint, relatedArea->{ wardNumber, municipality } }
 *   Secret: SANITY_WEBHOOK_SECRET env var
 *
 * Idempotent — safe to call multiple times for the same notice.
 */
export async function POST(req: NextRequest) {
  if (!validateSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const docType = body._type as string | undefined;
  if (docType !== 'developmentNotice') {
    return NextResponse.json({
      skipped: true,
      reason: 'Not a developmentNotice',
    });
  }

  const sanityId = body._id as string | undefined;
  const title = body.title as string | undefined;
  const noticeType = body.noticeType as string | undefined;
  const status = body.status as string | undefined;

  if (!sanityId || !title || !noticeType) {
    return NextResponse.json(
      { error: 'Missing required fields: _id, title, noticeType' },
      { status: 400 }
    );
  }
  if (status !== 'open') {
    return NextResponse.json({
      skipped: true,
      reason: `Status is ${status ?? 'unknown'}, not open`,
    });
  }

  const geopoint = body.geopoint as { lat?: number; lng?: number } | undefined;
  const relatedArea = body.relatedArea as
    | { wardNumber?: number; municipality?: string }
    | undefined;

  const result = await registerNoticeWithCC({
    sanityId,
    type: noticeType,
    title,
    description: (body.description as string) ?? '',
    isStatutory: STATUTORY_TYPES.has(noticeType),
    commentDeadline: (body.commentDeadline as string) ?? null,
    wardRef: buildWardRef(relatedArea),
    lat: geopoint?.lat ?? null,
    lng: geopoint?.lng ?? null,
  });

  if ('error' in result) {
    console.error(
      '[sanity-webhook] registerNoticeWithCC failed:',
      result.error
    );
    return NextResponse.json({ registered: false, error: result.error });
  }

  return NextResponse.json({ registered: true, ccNoticeId: result.ccNoticeId });
}
