import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SpatialMapLayer, SpatialMapLayersResponse } from './map-layers';
import { useSpatialMapLayers } from './use-spatial-map-layers';

const datasetId = 'c8532e74-88f4-4f66-9e93-e504347f1123';
const bounds = {
  west: 29.91,
  south: -27.76,
  east: 29.95,
  north: -27.72,
};

function layer(overrides: Partial<SpatialMapLayer> = {}): SpatialMapLayer {
  return {
    id: datasetId,
    datasetId,
    status: 'available',
    label: 'Schools',
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
        geometry: { type: 'Point', coordinates: [29.93, -27.74] },
        properties: { name: 'Example school' },
      },
    ],
    attribution: 'Example source',
    sourceId: 'source-1',
    sourceName: 'Example source',
    sourceInstitution: 'Example institution',
    publishedAt: '2026-01-01T00:00:00Z',
    datasetDate: '2026-01-01',
    radiusFiltered: false,
    ...overrides,
  };
}

function response(
  layers: SpatialMapLayer[],
  overrides: Partial<SpatialMapLayersResponse> = {}
): SpatialMapLayersResponse {
  return {
    layers,
    filterLat: null,
    filterLng: null,
    filterBounds: bounds,
    permissionFiltered: false,
    permissionRequiredDatasetIds: [],
    generatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

describe('useSpatialMapLayers', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('starts loading with the expected bbox and stores successful features', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(jsonResponse(response([layer()])) as Response);

    const { result } = renderHook(() =>
      useSpatialMapLayers({
        controlCentreUrl: 'https://control.example/',
        bounds,
      })
    );

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(
      new URL(String(fetchMock.mock.calls[0][0])).searchParams.get('bbox')
    ).toBe('29.91,-27.76,29.95,-27.72');
    expect(result.current.layers[0].features[0].id).toBe('feature-1');
  });

  it('represents an empty result without converting it into a request error', async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse(
        response([
          layer({
            status: 'empty',
            featureCount: 0,
            returnedCount: 0,
            features: [],
          }),
        ])
      ) as Response
    );

    const { result } = renderHook(() =>
      useSpatialMapLayers({
        controlCentreUrl: 'https://control.example',
        bounds,
      })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.layers[0].status).toBe('empty');
    expect(result.current.error).toBeNull();
  });

  it('accepts a catalogue response with no available datasets', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(response([])) as Response);
    const { result } = renderHook(() =>
      useSpatialMapLayers({
        controlCentreUrl: 'https://control.example',
        bounds,
      })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.layers).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('rejects malformed success payloads as API errors', async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse({ layers: [{ id: 'bad' }] }) as Response
    );
    const { result } = renderHook(() =>
      useSpatialMapLayers({
        controlCentreUrl: 'https://control.example',
        bounds,
      })
    );

    await waitFor(() =>
      expect(result.current.error).toBe(
        'Spatial layers response has an invalid format'
      )
    );
  });

  it('requests selected dataset IDs and distinguishes permission filtering', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(jsonResponse(response([layer()])) as Response)
      .mockResolvedValueOnce(
        jsonResponse(
          response([], {
            permissionFiltered: true,
            permissionRequiredDatasetIds: [datasetId],
          })
        ) as Response
      );

    const { result, rerender } = renderHook(
      ({ datasetIds }: { datasetIds?: string[] }) =>
        useSpatialMapLayers({
          controlCentreUrl: 'https://control.example',
          bounds,
          datasetIds,
        }),
      { initialProps: { datasetIds: undefined as string[] | undefined } }
    );
    await waitFor(() => expect(result.current.loading).toBe(false));

    rerender({ datasetIds: [] });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    rerender({ datasetIds: [datasetId] });
    await waitFor(() =>
      expect(result.current.layers[0]?.requestStatus).toBe(
        'permission-required'
      )
    );
    const selectedRequest = new URL(String(fetchMock.mock.calls[1][0]));
    expect(selectedRequest.searchParams.get('datasetIds')).toBe(datasetId);
  });

  it('marks a selected layer unavailable when it is omitted without permission denial', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse(response([layer()])) as Response)
      .mockResolvedValueOnce(jsonResponse(response([])) as Response);
    const { result, rerender } = renderHook(
      ({ datasetIds }: { datasetIds?: string[] }) =>
        useSpatialMapLayers({
          controlCentreUrl: 'https://control.example',
          bounds,
          datasetIds,
        }),
      { initialProps: { datasetIds: undefined as string[] | undefined } }
    );
    await waitFor(() => expect(result.current.loading).toBe(false));

    rerender({ datasetIds: [] });
    rerender({ datasetIds: [datasetId] });
    await waitFor(() =>
      expect(result.current.layers[0]?.requestStatus).toBe('error')
    );
  });

  it('skips requests when all layers are deactivated and requests only activated layers', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(jsonResponse(response([layer()])) as Response)
      .mockResolvedValueOnce(jsonResponse(response([layer()])) as Response);
    const { result, rerender } = renderHook(
      ({ datasetIds }: { datasetIds?: string[] }) =>
        useSpatialMapLayers({
          controlCentreUrl: 'https://control.example',
          bounds,
          datasetIds,
        }),
      { initialProps: { datasetIds: undefined as string[] | undefined } }
    );
    await waitFor(() => expect(result.current.loading).toBe(false));

    rerender({ datasetIds: [] });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    rerender({ datasetIds: [datasetId] });
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(
      new URL(String(fetchMock.mock.calls[1][0])).searchParams.get('datasetIds')
    ).toBe(datasetId);
  });

  it('surfaces failures and retries the same request', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse({ error: 'service unavailable' }, 503) as Response
      )
      .mockResolvedValueOnce(jsonResponse(response([layer()])) as Response);
    const { result } = renderHook(() =>
      useSpatialMapLayers({
        controlCentreUrl: 'https://control.example',
        bounds,
      })
    );

    await waitFor(() =>
      expect(result.current.error).toBe('service unavailable')
    );
    act(() => result.current.retry());
    await waitFor(() =>
      expect(result.current.layers[0]?.features).toHaveLength(1)
    );
    expect(result.current.error).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not allow a stale request to replace the latest selection', async () => {
    const stale = deferred<ReturnType<typeof jsonResponse>>();
    const latest = deferred<ReturnType<typeof jsonResponse>>();
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockReturnValueOnce(stale.promise as Promise<Response>)
      .mockReturnValueOnce(latest.promise as Promise<Response>);
    const { result, rerender } = renderHook(
      ({ datasetIds }: { datasetIds?: string[] }) =>
        useSpatialMapLayers({
          controlCentreUrl: 'https://control.example',
          bounds,
          datasetIds,
        }),
      { initialProps: { datasetIds: undefined as string[] | undefined } }
    );
    rerender({ datasetIds: [datasetId] });
    await act(async () => {
      latest.resolve(jsonResponse(response([layer()])) as Response);
    });
    await waitFor(() =>
      expect(result.current.layers[0]?.features).toHaveLength(1)
    );

    await act(async () => {
      stale.resolve(jsonResponse(response([])) as Response);
    });
    expect(result.current.layers[0]?.features).toHaveLength(1);
  });

  it('aborts an in-flight request on unmount', () => {
    vi.mocked(fetch).mockImplementation(() => new Promise(() => {}));
    const { unmount } = renderHook(() =>
      useSpatialMapLayers({
        controlCentreUrl: 'https://control.example',
        bounds,
      })
    );
    const signal = vi.mocked(fetch).mock.calls[0][1]?.signal;
    unmount();
    expect(signal?.aborted).toBe(true);
  });
});
