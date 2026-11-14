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

describe('GET /api/intelligence/spatial', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.fetch.mockResolvedValue({
      municipalities: [],
      wards: [],
      recentRecords: [],
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
      recentCampaigns: [],
    });
  });

  it('preserves coordinate provenance and does not drop valid zero coordinates', async () => {
    const request = new NextRequest(
      'https://node.example/api/intelligence/spatial'
    );
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.geoRefs).toEqual([
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
});
