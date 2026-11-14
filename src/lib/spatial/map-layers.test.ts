import { describe, expect, it } from 'vitest';
import {
  buildSpatialMapLayersUrl,
  isPublishedSpatialFeature,
  isSpatialMapLayersResponse,
  type SpatialMapLayer,
  toggleSpatialDatasetSelection,
} from './map-layers';

const layer = {
  id: 'dataset-a',
  datasetId: 'dataset-a',
} satisfies Pick<SpatialMapLayer, 'id' | 'datasetId'>;

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
    expect(toggleSpatialDatasetSelection([], [layer], layer.id)).toEqual([
      layer.datasetId,
    ]);
  });

  it('removes a deactivated layer from the request selection', () => {
    expect(toggleSpatialDatasetSelection(undefined, [layer], layer.id)).toEqual(
      []
    );
  });
});
