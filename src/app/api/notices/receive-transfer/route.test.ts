import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  authenticate: vi.fn(() => null),
  fetch: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('@/app/api/intelligence/_auth', () => ({
  authenticate: mocks.authenticate,
}));

vi.stubGlobal('fetch', mocks.fetch);

vi.stubEnv('SANITY_API_WRITE_TOKEN', 'write-token');
vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', 'production');
vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'testproject');
vi.stubEnv('NEXT_PUBLIC_SANITY_API_VERSION', '2024-08-22');

import { POST } from './route';

const VALID_UUID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

function req(body: unknown) {
  return new NextRequest(
    'https://umkhandlu.unamifoundation.org/api/notices/receive-transfer',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
}

function mockQuery(result: string | null) {
  mocks.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ result }),
  });
}

function mockMutate(id: string) {
  mocks.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ results: [{ id }] }),
  });
}

describe('POST /api/notices/receive-transfer', () => {
  beforeEach(() => vi.clearAllMocks());

  // ── Validation ────────────────────────────────────────────────────────────

  it('returns 400 when ccNoticeId is missing', async () => {
    const res = await POST(req({ noticeType: 'liquor', title: 'Test' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/ccNoticeId/);
  });

  it('returns 400 when noticeType is missing', async () => {
    const res = await POST(req({ ccNoticeId: VALID_UUID, title: 'Test' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when title is missing', async () => {
    const res = await POST(
      req({ ccNoticeId: VALID_UUID, noticeType: 'liquor' })
    );
    expect(res.status).toBe(400);
  });

  it('returns 400 for non-UUID ccNoticeId', async () => {
    const res = await POST(
      req({ ccNoticeId: 'not-a-uuid', noticeType: 'liquor', title: 'Test' })
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/Invalid ccNoticeId/);
  });

  it('returns 400 for invalid JSON body', async () => {
    const res = await POST(
      new NextRequest(
        'https://umkhandlu.unamifoundation.org/api/notices/receive-transfer',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: 'not-json',
        }
      )
    );
    expect(res.status).toBe(400);
  });

  // ── Successful transfer ───────────────────────────────────────────────────

  it('creates a Sanity document and returns gnNoticeRef', async () => {
    mockQuery(null);
    mockMutate('sanity-doc-123');

    const res = await POST(
      req({
        ccNoticeId: VALID_UUID,
        noticeType: 'liquor',
        title: 'Proposed Liquor Outlet — Ward 7',
        wardRef: 'Ward 7 — Newcastle',
        lat: -27.7567,
        lng: 29.9318,
        commentDeadline: '2026-12-31',
      })
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.gnNoticeRef).toBe('sanity-doc-123');
    expect(body.idempotent).toBe(false);
    expect(body.status).toBe('created');
  });

  it('sets geopoint when lat/lng provided', async () => {
    mockQuery(null);
    mockMutate('sanity-doc-456');

    await POST(
      req({
        ccNoticeId: VALID_UUID,
        noticeType: 'eia',
        title: 'EIA Notice',
        lat: -27.7567,
        lng: 29.9318,
      })
    );

    const mutateBody = JSON.parse(mocks.fetch.mock.calls[1][1].body);
    const doc = mutateBody.mutations[0].create;
    expect(doc.geopoint).toEqual({
      _type: 'geopoint',
      lat: -27.7567,
      lng: 29.9318,
    });
    expect(doc.locationPrecision).toBe('operator-provided');
  });

  it('omits geopoint when lat/lng absent', async () => {
    mockQuery(null);
    mockMutate('sanity-doc-789');

    await POST(
      req({ ccNoticeId: VALID_UUID, noticeType: 'rezoning', title: 'Rezoning' })
    );

    const mutateBody = JSON.parse(mocks.fetch.mock.calls[1][1].body);
    const doc = mutateBody.mutations[0].create;
    expect(doc.geopoint).toBeUndefined();
  });

  // ── Idempotency ───────────────────────────────────────────────────────────

  it('returns existing gnNoticeRef without creating a duplicate', async () => {
    mockQuery('existing-sanity-id');

    const res = await POST(
      req({ ccNoticeId: VALID_UUID, noticeType: 'liquor', title: 'Duplicate' })
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.gnNoticeRef).toBe('existing-sanity-id');
    expect(body.idempotent).toBe(true);
    expect(body.status).toBe('already-exists');
    expect(mocks.fetch).toHaveBeenCalledTimes(1); // query only, no mutate
  });

  // ── Failed transfer ───────────────────────────────────────────────────────

  it('returns 502 when Sanity mutate fails', async () => {
    mockQuery(null);
    mocks.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: { description: 'Internal error' } }),
    });

    const res = await POST(
      req({
        ccNoticeId: VALID_UUID,
        noticeType: 'mining',
        title: 'Mining Permit',
      })
    );

    expect(res.status).toBe(502);
    expect((await res.json()).error).toMatch(/Sanity mutation failed/);
  });

  it('returns 502 when Sanity mutate returns no document ID', async () => {
    mockQuery(null);
    mocks.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    });

    const res = await POST(
      req({
        ccNoticeId: VALID_UUID,
        noticeType: 'mining',
        title: 'Mining Permit',
      })
    );

    expect(res.status).toBe(502);
  });

  // ── Document structure ────────────────────────────────────────────────────

  it('sets ccNoticeRef, _type and status on the created document', async () => {
    mockQuery(null);
    mockMutate('new-doc-id');

    await POST(
      req({ ccNoticeId: VALID_UUID, noticeType: 'township', title: 'Township' })
    );

    const mutateBody = JSON.parse(mocks.fetch.mock.calls[1][1].body);
    const doc = mutateBody.mutations[0].create;
    expect(doc.ccNoticeRef).toBe(VALID_UUID);
    expect(doc._type).toBe('developmentNotice');
    expect(doc.status).toBe('open');
  });

  it('slug includes the first 8 chars of ccNoticeId', async () => {
    mockQuery(null);
    mockMutate('slug-test-id');

    await POST(
      req({
        ccNoticeId: VALID_UUID,
        noticeType: 'building',
        title: 'Building Plan',
      })
    );

    const mutateBody = JSON.parse(mocks.fetch.mock.calls[1][1].body);
    const doc = mutateBody.mutations[0].create;
    expect(doc.slug.current).toContain('a1b2c3d4');
  });
});
