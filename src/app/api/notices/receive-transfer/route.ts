import { type NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/app/api/intelligence/_auth';

export const dynamic = 'force-dynamic';

// POST /api/notices/receive-transfer
// Authenticated with INTELLIGENCE_API_KEY.
// Receives an approved notice from CC and creates a developmentNotice in Sanity.
// Idempotent: if a document with ccNoticeRef already exists, returns the existing ID.

interface TransferPayload {
  ccNoticeId: string;
  noticeType: string;
  title: string;
  description?: string;
  commentDeadline?: string | null;
  wardRef?: string | null;
  lat?: number | null;
  lng?: number | null;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validatePayload(body: TransferPayload): NextResponse | null {
  if (!body.ccNoticeId || !body.noticeType || !body.title) {
    return NextResponse.json(
      { error: 'Required: ccNoticeId, noticeType, title' },
      { status: 400 }
    );
  }
  if (!UUID_RE.test(body.ccNoticeId)) {
    return NextResponse.json(
      { error: 'Invalid ccNoticeId format' },
      { status: 400 }
    );
  }
  return null;
}

function buildDoc(body: TransferPayload): Record<string, unknown> {
  const slug = body.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96);

  const doc: Record<string, unknown> = {
    _type: 'developmentNotice',
    title: body.title,
    slug: { _type: 'slug', current: `${slug}-${body.ccNoticeId.slice(0, 8)}` },
    noticeType: body.noticeType,
    status: 'open',
    ccNoticeRef: body.ccNoticeId,
    description: body.description ?? '',
    location: body.wardRef ?? 'Amajuba District',
    applicant: 'Transferred from Control Centre',
    commentDeadline:
      body.commentDeadline ??
      new Date(Date.now() + 30 * 86_400_000).toISOString().split('T')[0],
    commentContact: 'Contact the Umkhandlu GIS Control Centre for details.',
    publishDate: new Date().toISOString().split('T')[0],
    proofIssued: false,
    feeStatus: 'free',
  };

  if (body.lat != null && body.lng != null) {
    doc.geopoint = { _type: 'geopoint', lat: body.lat, lng: body.lng };
    doc.locationPrecision = 'operator-provided';
  }

  return doc;
}

async function createSanityDoc(
  sanityBase: string,
  dataset: string,
  writeToken: string,
  doc: Record<string, unknown>
): Promise<{ gnNoticeRef: string } | { error: string }> {
  const res = await fetch(`${sanityBase}/mutate/${dataset}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${writeToken}`,
    },
    body: JSON.stringify({ mutations: [{ create: doc }] }),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as {
      error?: { description?: string };
    };
    return {
      error: `Sanity mutation failed: ${err.error?.description ?? res.status}`,
    };
  }

  const body = (await res.json()) as { results?: Array<{ id: string }> };
  const id = body.results?.[0]?.id;
  if (!id) return { error: 'Sanity did not return document ID' };
  return { gnNoticeRef: id };
}

async function findExistingByRef(
  sanityBase: string,
  dataset: string,
  token: string,
  ccNoticeId: string
): Promise<string | null> {
  try {
    const query = encodeURIComponent(
      `*[_type == "developmentNotice" && ccNoticeRef == "${ccNoticeId}"][0]._id`
    );
    const res = await fetch(`${sanityBase}/query/${dataset}?query=${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { result?: string | null };
    return body.result ?? null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const denied = authenticate(request);
  if (denied) return denied;

  let body: TransferPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const invalid = validatePayload(body);
  if (invalid) return invalid;

  const writeToken = process.env.SANITY_API_WRITE_TOKEN;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-08-22';

  if (!writeToken || !dataset || !projectId) {
    return NextResponse.json(
      { error: 'Sanity write credentials not configured' },
      { status: 503 }
    );
  }

  const sanityBase = `https://${projectId}.api.sanity.io/v${apiVersion}/data`;

  const existing = await findExistingByRef(
    sanityBase,
    dataset,
    writeToken,
    body.ccNoticeId
  );
  if (existing) {
    return NextResponse.json({
      gnNoticeRef: existing,
      idempotent: true,
      status: 'already-exists',
    });
  }

  const result = await createSanityDoc(
    sanityBase,
    dataset,
    writeToken,
    buildDoc(body)
  );

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({
    gnNoticeRef: result.gnNoticeRef,
    idempotent: false,
    status: 'created',
  });
}
