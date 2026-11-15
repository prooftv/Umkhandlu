import { describe, expect, it, vi } from 'vitest';
import {
  buildSpatialMapLayersUrl,
  fetchRemainingSpatialMapFeatures,
  isPublishedSpatialFeature,
  isSpatialMapLayersResponse,
  type SpatialMapLayer,
  toggleSpatialDatasetSelection,
} from './map-layers';

const layerIdentity = {
  id: 'dataset-a',
  datasetId: 'dataset-a',
} satisfies Pick<SpatialMapLayer, 'id' | 'datasetId'>;

function makeLayer(overrides: Partial<SpatialMapLayer> = {}): SpatialMapLayer {
  return {
    id: 'dataset-a',
    datasetId: 'dataset-a',
    status: 'available',
    label: 'Example dataset',
    colour: '#2563eb',
    weight: 2,
    fillOpacity: 0.2,
    featureCount: 1,
    returnedCount: 1,
    loadOnDemand: false,
    truncated: false,
    radiusKm: null,
    features: [
      {
        type: 'Feature',
        id: 'feature-1',
        geometry: { type: 'Point', coordinates: [29.92, -27.74] },
        properties: { name: 'First feature' },
      },
    ],
    attribution: 'Example attribution',
    sourceId: 'source-a',
    sourceName: 'Example source',
    sourceInstitution: 'Example institution',
    publishedAt: '2026-01-02T00:00:00Z',
    datasetDate: '2026-01-01',
    radiusFiltered: false,
    ...overrides,
  };
}

describe('buildSpatialMapLayersUrl', () => {
  const bounds = {
    west: 29.91,
    south: -27.76,
    east: 29.95,
    north: -27.72,
  };

  it('uses the Control Centre bbox contract', () => {
    const url = new URL(
      buildSpatialMapLayersUrl({
        controlCentreUrl: 'https://control.example/',
        bounds,
      })
    );

    expect(url.pathname).toBe('/api/spatial/map-layers');
    expect(url.searchParams.get('bbox')).toBe('29.91,-27.76,29.95,-27.72');
    expect(url.searchParams.has('west')).toBe(false);
  });

  describe('spatial response adapters', () => {
    it('accepts a published feature only when identity, geometry and provenance are present', () => {
      expect(
        isPublishedSpatialFeature({
          type: 'Feature',
          id: 'feature-id',
          geometry: { type: 'Point', coordinates: [29.93, -27.75] },
          properties: {},
          meta: {
            dataset: 'Schools',
            attribution: 'Source attribution',
            datasetDate: '2026-01-01',
          },
        })
      ).toBe(true);
      expect(
        isPublishedSpatialFeature({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [29.93, -27.75] },
          properties: {},
          meta: { dataset: 'Schools', attribution: null, datasetDate: null },
        })
      ).toBe(false);
    });

    it('rejects malformed layer response records', () => {
      expect(
        isSpatialMapLayersResponse({
          layers: [],
          permissionFiltered: false,
          generatedAt: '2026-01-01T00:00:00Z',
          filterLat: null,
          filterLng: null,
          filterBounds: null,
        })
      ).toBe(true);
      expect(
        isSpatialMapLayersResponse({
          layers: [{ id: 'not-a-layer' }],
          permissionFiltered: false,
          generatedAt: '2026-01-01T00:00:00Z',
          filterLat: null,
          filterLng: null,
          filterBounds: null,
        })
      ).toBe(false);
    });

    it('accepts verified source metadata and an upstream feature ID', () => {
      const layer = makeLayer({
        provenance: 'Authoritative dataset metadata',
        sourcePermission: 'redistribute',
        datasetPermission: 'redistribute',
        sourceLicenseTerms: 'Source attribution terms',
        datasetLicenseTerms: 'Dataset attribution terms',
        features: [
          {
            type: 'Feature',
            id: 'control-centre-feature-id',
            sourceFeatureId: 'original-ogc-feature-id',
            geometry: { type: 'Point', coordinates: [29.92, -27.74] },
            properties: {},
          },
        ],
      });

      expect(
        isSpatialMapLayersResponse({
          layers: [layer],
          permissionFiltered: false,
          generatedAt: '2026-01-01T00:00:00Z',
          filterLat: null,
          filterLng: null,
          filterBounds: null,
        })
      ).toBe(true);
      expect(
        isSpatialMapLayersResponse({
          layers: [
            {
              ...layer,
              features: [{ ...layer.features[0], sourceFeatureId: 12 }],
            },
          ],
          permissionFiltered: false,
          generatedAt: '2026-01-01T00:00:00Z',
          filterLat: null,
          filterLng: null,
          filterBounds: null,
        })
      ).toBe(false);
    });
  });

  it('requests only the activated dataset IDs when provided', () => {
    const url = new URL(
      buildSpatialMapLayersUrl({
        controlCentreUrl: 'https://control.example',
        bounds,
        datasetIds: ['dataset-a', 'dataset-b'],
      })
    );

    expect(url.searchParams.get('datasetIds')).toBe('dataset-a,dataset-b');
    expect(url.searchParams.get('bbox')).toBe('29.91,-27.76,29.95,-27.72');
  });

  it('preserves an explicitly empty selection', () => {
    const url = new URL(
      buildSpatialMapLayersUrl({
        controlCentreUrl: 'https://control.example',
        bounds,
        datasetIds: [],
      })
    );

    expect(url.searchParams.has('datasetIds')).toBe(true);
    expect(url.searchParams.get('datasetIds')).toBe('');
  });

  it('activates a layer by its stable dataset ID', () => {
    expect(
      toggleSpatialDatasetSelection([], [layerIdentity], layerIdentity.id)
    ).toEqual([layerIdentity.datasetId]);
  });

  it('removes a deactivated layer from the request selection', () => {
    expect(
      toggleSpatialDatasetSelection(
        undefined,
        [layerIdentity],
        layerIdentity.id
      )
    ).toEqual([]);
  });

  it('retrieves additional feature pages when the map-layer response is truncated', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              id: 'feature-3',
              geometry: { type: 'Point', coordinates: [29.94, -27.74] },
              properties: { name: 'Third feature' },
            },
          ],
          meta: {
            datasetId: 'dataset-a',
            datasetName: 'Example dataset',
            attribution: 'Example attribution',
            sourceId: 'source-a',
            sourceName: 'Example source',
            sourceInstitution: 'Example institution',
            datasetDate: '2026-01-01',
            publishedAt: '2026-01-02T00:00:00Z',
            total: 3,
            offset: 2,
            limit: 500,
            returned: 1,
            radiusMeters: null,
            bounds,
            filtered: true,
            complete: true,
            hasMore: false,
            nextOffset: null,
          },
        }),
        { status: 200 }
      )
    );
    const truncated = makeLayer({
      featureCount: 3,
      returnedCount: 2,
      truncated: true,
      features: [
        {
          type: 'Feature',
          id: 'feature-1',
          geometry: { type: 'Point', coordinates: [29.92, -27.74] },
          properties: { name: 'First feature' },
        },
        {
          type: 'Feature',
          id: 'feature-2',
          geometry: { type: 'Point', coordinates: [29.93, -27.74] },
          properties: { name: 'Second feature' },
        },
      ],
    });

    const result = await fetchRemainingSpatialMapFeatures({
      controlCentreUrl: 'https://control.example/',
      bounds,
      layer: truncated,
      signal: new AbortController().signal,
      fetcher,
    });

    expect(new URL(String(fetcher.mock.calls[0][0])).pathname).toBe(
      '/api/spatial/features'
    );
    expect(
      new URL(String(fetcher.mock.calls[0][0])).searchParams.get('offset')
    ).toBe('2');
    expect(result.features.map((feature) => feature.id)).toEqual([
      'feature-1',
      'feature-2',
      'feature-3',
    ]);
    expect(result.returnedCount).toBe(3);
    expect(result.truncated).toBe(false);
  });

  it('surfaces a denied feature page rather than treating the partial layer as complete', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: 'Dataset is not cleared for public redistribution',
        }),
        {
          status: 403,
        }
      )
    );

    await expect(
      fetchRemainingSpatialMapFeatures({
        controlCentreUrl: 'https://control.example',
        bounds,
        layer: makeLayer({ truncated: true }),
        signal: new AbortController().signal,
        fetcher,
      })
    ).rejects.toThrow('Dataset is not cleared for public redistribution');
  });
});
