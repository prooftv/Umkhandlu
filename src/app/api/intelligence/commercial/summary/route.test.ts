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
vi.mock('../../_auth', () => ({ authenticate: mocks.authenticate }));

import { GET } from './route';

const BASE_DATA = {
  total: 1,
  byStatus: { draft: 0, approved: 0, active: 1, completed: 0, reported: 0 },
  byHealth: { green: 1, amber: 0, red: 0 },
  byPhase: {
    planning: 0,
    procurement: 0,
    construction: 1,
    commissioning: 0,
    operational: 0,
  },
  activeBudgets: [{ budget: 500000 }],
  activeBeneficiaries: [{ beneficiaries: 200 }],
  sponsorTotal: 2,
  sponsorsWithActiveCampaigns: 1,
};

describe('GET /api/intelligence/commercial/summary (D-01)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('includes coordinateRole and coordinateSource when campaign has siteGeopoint', async () => {
    mocks.fetch.mockResolvedValue({
      ...BASE_DATA,
      recent: [
        {
          id: 'camp-1',
          title: 'Water Project',
          type: 'csr',
          status: 'active',
          health: 'green',
          updatedAt: '2026-01-01T00:00:00Z',
          geoRefLat: -27.8,
          geoRefLng: 30.1,
          geoRefMunicipality: 'newcastle',
          geoRefCoordinateRole: 'site',
          geoRefCoordinateSource: 'Sanity campaign.siteGeopoint',
        },
      ],
    });

    const res = await GET(
      new NextRequest(
        'https://node.example/api/intelligence/commercial/summary'
      )
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.recent[0].geoRef).toEqual({
      latitude: -27.8,
      longitude: 30.1,
      coordinateRole: 'site',
      coordinateSource: 'Sanity campaign.siteGeopoint',
      district: 'Amajuba',
      municipality: 'newcastle',
    });
  });

  it('includes coordinateRole and coordinateSource when campaign uses area geopoint', async () => {
    mocks.fetch.mockResolvedValue({
      ...BASE_DATA,
      recent: [
        {
          id: 'camp-2',
          title: 'Road Project',
          type: 'csr',
          status: 'active',
          health: 'amber',
          updatedAt: '2026-01-02T00:00:00Z',
          geoRefLat: -27.9,
          geoRefLng: 30.2,
          geoRefMunicipality: 'dannhauser',
          geoRefCoordinateRole: 'area-reference',
          geoRefCoordinateSource:
            'Sanity campaign.geographicAssociations[0].area.geopoint',
        },
      ],
    });

    const res = await GET(
      new NextRequest(
        'https://node.example/api/intelligence/commercial/summary'
      )
    );
    const body = await res.json();

    expect(body.recent[0].geoRef.coordinateRole).toBe('area-reference');
    expect(body.recent[0].geoRef.coordinateSource).toBe(
      'Sanity campaign.geographicAssociations[0].area.geopoint'
    );
  });

  it('omits geoRef entirely when coordinates are null', async () => {
    mocks.fetch.mockResolvedValue({
      ...BASE_DATA,
      recent: [
        {
          id: 'camp-3',
          title: 'No Location',
          type: 'activation',
          status: 'draft',
          health: null,
          updatedAt: '2026-01-03T00:00:00Z',
          geoRefLat: null,
          geoRefLng: null,
          geoRefMunicipality: null,
          geoRefCoordinateRole: null,
          geoRefCoordinateSource: null,
        },
      ],
    });

    const res = await GET(
      new NextRequest(
        'https://node.example/api/intelligence/commercial/summary'
      )
    );
    const body = await res.json();

    expect(body.recent[0].geoRef).toBeUndefined();
  });

  it('preserves existing response fields alongside new provenance fields', async () => {
    mocks.fetch.mockResolvedValue({
      ...BASE_DATA,
      recent: [
        {
          id: 'camp-4',
          title: 'Full Campaign',
          type: 'csr',
          status: 'active',
          health: 'green',
          updatedAt: '2026-01-04T00:00:00Z',
          geoRefLat: -27.75,
          geoRefLng: 29.93,
          geoRefMunicipality: 'newcastle',
          geoRefCoordinateRole: 'site',
          geoRefCoordinateSource: 'Sanity campaign.siteGeopoint',
        },
      ],
    });

    const res = await GET(
      new NextRequest(
        'https://node.example/api/intelligence/commercial/summary'
      )
    );
    const body = await res.json();

    // Existing fields still present
    expect(body.projects.total).toBe(1);
    expect(body.projects.totalBudget).toBe(500000);
    expect(body.projects.totalBeneficiaries).toBe(200);
    expect(body.sponsors.total).toBe(2);
    expect(body.recent[0].id).toBe('camp-4');
    expect(body.recent[0].geoRef.latitude).toBe(-27.75);
    expect(body.recent[0].geoRef.district).toBe('Amajuba');
    // New provenance fields present
    expect(body.recent[0].geoRef.coordinateRole).toBe('site');
    expect(body.recent[0].geoRef.coordinateSource).toBe(
      'Sanity campaign.siteGeopoint'
    );
  });

  it('GROQ query contains coordinateRole and coordinateSource projections', async () => {
    mocks.fetch.mockResolvedValue({ ...BASE_DATA, recent: [] });
    await GET(
      new NextRequest(
        'https://node.example/api/intelligence/commercial/summary'
      )
    );
    const query = mocks.fetch.mock.calls[0]?.[0] as string;
    expect(query).toContain('"geoRefCoordinateRole"');
    expect(query).toContain('"geoRefCoordinateSource"');
    expect(query).toContain('select(');
  });
});
