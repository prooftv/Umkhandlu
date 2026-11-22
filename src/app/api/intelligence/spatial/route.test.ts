import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  fetch: vi.fn(),
  authenticate: vi.fn(() => null),
}));

vi.mock('server-only', () => ({}));
vi.mock('@/lib/sanity/client/client', () => ({
  client: { fetch: mocks.fetch },
}));
vi.mock('../_auth', () => ({
  authenticate: mocks.authenticate,
}));

import { GET } from './route';

const BASE_DATA = {
  municipalities: [],
  wards: [],
  recordsTotal: 2,
  recentRecords: [
    {
      id: 'record-1',
      label: 'Record 1',
      timestamp: '2026-01-01T00:00:00Z',
      lat: -27.7,
      lng: 29.9,
      coordinateSource: 'Sanity record.relatedArea.geopoint',
      coordinateRole: 'area-reference',
      locationPrecision: null,
    },
  ],
  noticesTotal: 3,
  recentDevNotices: [
    {
      id: 'notice-site',
      label: 'Notice with site coordinate',
      timestamp: '2026-01-01T00:00:00Z',
      lat: 0,
      lng: 0,
      coordinateSource: 'Sanity developmentNotice.geopoint',
      coordinateRole: 'site',
      locationPrecision: 'operator-provided',
    },
    {
      id: 'notice-area',
      label: 'Notice with area reference',
      timestamp: '2026-01-02T00:00:00Z',
      lat: -27.8,
      lng: 30,
      coordinateSource: 'Sanity relatedArea.geopoint',
      coordinateRole: 'area-reference',
      locationPrecision: null,
    },
  ],
  campaignsTotal: 0,
  recentCampaigns: [],
};

function makeRequest(params: Record<string, string> = {}) {
  const url = new URL('https://node.example/api/intelligence/spatial');
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return new NextRequest(url);
}

describe('GET /api/intelligence/spatial', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.fetch.mockResolvedValue(BASE_DATA);
  });

  it('preserves coordinate provenance and does not drop valid zero coordinates', async () => {
    const response = await GET(makeRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.geoRefs).toEqual([
      expect.objectContaining({
        recordId: 'record-1',
        coordinateRole: 'area-reference',
      }),
      expect.objectContaining({
        recordId: 'notice-site',
        latitude: 0,
        longitude: 0,
        coordinateSource: 'Sanity developmentNotice.geopoint',
        coordinateRole: 'site',
        locationPrecision: 'operator-provided',
      }),
      expect.objectContaining({
        recordId: 'notice-area',
        coordinateSource: 'Sanity relatedArea.geopoint',
        coordinateRole: 'area-reference',
        locationPrecision: null,
      }),
    ]);

    const spatialQuery = mocks.fetch.mock.calls[0]?.[0];
    expect(spatialQuery).toContain('"coordinateSource": select(');
    expect(spatialQuery).toContain('"coordinateRole": select(');
    expect(spatialQuery).toContain('"locationPrecision": select(');
  });

  it('returns typed envelopes with total, offset, limit, hasMore', async () => {
    const response = await GET(makeRequest());
    const body = await response.json();

    expect(body.records).toEqual({
      items: BASE_DATA.recentRecords,
      total: 2,
      offset: 0,
      limit: 20,
      hasMore: false, // 0 + 20 >= 2
    });
    expect(body.devNotices).toEqual({
      items: BASE_DATA.recentDevNotices,
      total: 3,
      offset: 0,
      limit: 20,
      hasMore: false, // 2 items returned, total=3 but offset+limit=20 >= 3
    });
    expect(body.campaigns).toEqual({
      items: [],
      total: 0,
      offset: 0,
      limit: 20,
      hasMore: false,
    });
  });

  it('hasMore is true when offset + limit < total', async () => {
    mocks.fetch.mockResolvedValue({
      ...BASE_DATA,
      recordsTotal: 50,
      recentRecords: Array.from({ length: 20 }, (_, i) => ({
        id: `r-${i}`,
        label: `Record ${i}`,
        timestamp: '2026-01-01T00:00:00Z',
        lat: -27.7,
        lng: 29.9,
        coordinateSource: 'Sanity record.relatedArea.geopoint',
        coordinateRole: 'area-reference',
        locationPrecision: null,
      })),
    });
    const response = await GET(
      makeRequest({ recordsLimit: '20', recordsOffset: '0' })
    );
    const body = await response.json();
    expect(body.records.hasMore).toBe(true);
    expect(body.records.total).toBe(50);
  });

  it('respects custom offset and limit', async () => {
    const response = await GET(
      makeRequest({ recordsOffset: '5', recordsLimit: '10' })
    );
    const body = await response.json();
    expect(body.records.offset).toBe(5);
    expect(body.records.limit).toBe(10);

    const query = mocks.fetch.mock.calls[0]?.[0] as string;
    expect(query).toContain('[5...15]');
  });

  it('defaults to offset=0 limit=20 when no params supplied', async () => {
    const response = await GET(makeRequest());
    const body = await response.json();
    expect(body.records.offset).toBe(0);
    expect(body.records.limit).toBe(20);

    const query = mocks.fetch.mock.calls[0]?.[0] as string;
    expect(query).toContain('[0...20]');
  });

  it('rejects limit above maximum (100)', async () => {
    const response = await GET(makeRequest({ recordsLimit: '101' }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toMatch(/Invalid pagination/);
  });

  it('rejects negative offset', async () => {
    const response = await GET(makeRequest({ recordsOffset: '-1' }));
    expect(response.status).toBe(400);
  });

  it('rejects non-integer offset', async () => {
    const response = await GET(makeRequest({ recordsOffset: '1.5' }));
    expect(response.status).toBe(400);
  });

  it('accepts limit=100 (maximum)', async () => {
    const response = await GET(makeRequest({ recordsLimit: '100' }));
    expect(response.status).toBe(200);
    const query = mocks.fetch.mock.calls[0]?.[0] as string;
    expect(query).toContain('[0...100]');
  });

  it('returns empty items array when page is beyond total', async () => {
    mocks.fetch.mockResolvedValue({
      ...BASE_DATA,
      recordsTotal: 5,
      recentRecords: [],
    });
    const response = await GET(makeRequest({ recordsOffset: '20' }));
    const body = await response.json();
    expect(body.records.items).toEqual([]);
    expect(body.records.hasMore).toBe(false);
    expect(body.records.total).toBe(5);
  });

  it('hasMore is conservative (items.length === limit) when total is null', async () => {
    mocks.fetch.mockResolvedValue({
      ...BASE_DATA,
      recordsTotal: null,
      recentRecords: Array.from({ length: 20 }, (_, i) => ({
        id: `r-${i}`,
        label: `Record ${i}`,
        timestamp: '2026-01-01T00:00:00Z',
        lat: -27.7,
        lng: 29.9,
        coordinateSource: 'Sanity record.relatedArea.geopoint',
        coordinateRole: 'area-reference',
        locationPrecision: null,
      })),
    });
    const response = await GET(makeRequest());
    const body = await response.json();
    expect(body.records.total).toBeNull();
    expect(body.records.hasMore).toBe(true); // 20 items === limit of 20
  });

  it('preserves geoRefs flat array for backward compatibility', async () => {
    const response = await GET(makeRequest());
    const body = await response.json();
    expect(Array.isArray(body.geoRefs)).toBe(true);
    expect(body.geoRefs.length).toBeGreaterThan(0);
  });

  it('pagination is independent per record type', async () => {
    const response = await GET(
      makeRequest({
        recordsOffset: '5',
        recordsLimit: '10',
        devNoticesOffset: '2',
        devNoticesLimit: '5',
        campaignsOffset: '0',
        campaignsLimit: '3',
      })
    );
    expect(response.status).toBe(200);
    const query = mocks.fetch.mock.calls[0]?.[0] as string;
    expect(query).toContain('[5...15]'); // records
    expect(query).toContain('[2...7]'); // devNotices
    expect(query).toContain('[0...3]'); // campaigns
  });

  it('returns 500 on GROQ failure', async () => {
    mocks.fetch.mockRejectedValue(new Error('GROQ timeout'));
    const response = await GET(makeRequest());
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toMatch(/Failed to fetch/);
  });

  it('returns generatedAt timestamp', async () => {
    const response = await GET(makeRequest());
    const body = await response.json();
    expect(typeof body.generatedAt).toBe('string');
    expect(new Date(body.generatedAt).getTime()).not.toBeNaN();
  });
});
