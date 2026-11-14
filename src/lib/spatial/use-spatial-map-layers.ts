'use client';

import {
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import type {
  SpatialMapBounds,
  SpatialMapLayer,
  SpatialMapLayersResponse,
} from './map-layers';
import {
  buildSpatialMapLayersUrl,
  isSpatialMapLayersResponse,
} from './map-layers';

function clearLayer(
  layer: SpatialMapLayer,
  requestStatus: 'not-requested' | 'error'
): SpatialMapLayer {
  return {
    ...layer,
    features: [],
    returnedCount: 0,
    truncated: false,
    loadOnDemand: requestStatus === 'not-requested',
    requestStatus,
  };
}

function markLayersLoading(
  layers: SpatialMapLayer[],
  requestedIds: string[] | undefined,
  selectedIds: string[] | undefined
): SpatialMapLayer[] {
  if (requestedIds === undefined) {
    return layers.map((layer) => ({ ...layer, requestStatus: 'loading' }));
  }

  const requestedSet = new Set(requestedIds);
  const activeSet = new Set(selectedIds ?? []);
  return layers.map((layer) => {
    if (requestedSet.has(layer.datasetId)) {
      return {
        ...clearLayer(layer, 'not-requested'),
        loadOnDemand: false,
        requestStatus: 'loading',
      };
    }
    return activeSet.has(layer.datasetId)
      ? layer
      : clearLayer(layer, 'not-requested');
  });
}

function mergeRequestedLayers(
  catalogue: SpatialMapLayer[],
  returnedLayers: SpatialMapLayer[],
  selectedIds: string[] | undefined,
  requestedIds: string[],
  permissionRequiredIds: string[]
): SpatialMapLayer[] {
  const returnedById = new Map(
    returnedLayers.map((layer) => [layer.datasetId, layer])
  );
  const activeSet = new Set(selectedIds ?? []);
  const requestedSet = new Set(requestedIds);
  const permissionRequiredSet = new Set(permissionRequiredIds);

  return catalogue.map((catalogueLayer) => {
    const returned = returnedById.get(catalogueLayer.datasetId);
    if (returned) return returned;
    if (!activeSet.has(catalogueLayer.datasetId)) {
      return clearLayer(catalogueLayer, 'not-requested');
    }
    if (!requestedSet.has(catalogueLayer.datasetId)) return catalogueLayer;
    return {
      ...clearLayer(catalogueLayer, 'error'),
      requestStatus: permissionRequiredSet.has(catalogueLayer.datasetId)
        ? 'permission-required'
        : 'error',
    };
  });
}

function markLayersFailed(
  layers: SpatialMapLayer[],
  requestedIds: string[] | undefined,
  selectedIds: string[] | undefined
): SpatialMapLayer[] {
  if (requestedIds === undefined) {
    return layers.map((layer) => ({ ...layer, requestStatus: 'error' }));
  }

  const requestedSet = new Set(requestedIds);
  const activeSet = new Set(selectedIds ?? []);
  return layers.map((layer) => {
    if (requestedSet.has(layer.datasetId)) {
      return clearLayer(layer, 'error');
    }
    return activeSet.has(layer.datasetId)
      ? layer
      : clearLayer(layer, 'not-requested');
  });
}

async function readLayersResponse(
  response: Response
): Promise<SpatialMapLayersResponse> {
  const body: unknown = await response.json();
  if (!response.ok) {
    throw new Error(
      isRecordError(body)
        ? body.error
        : `Spatial layers request failed (${response.status})`
    );
  }
  if (!isSpatialMapLayersResponse(body)) {
    throw new Error('Spatial layers response has an invalid format');
  }
  return body;
}

function isAbortError(cause: unknown): boolean {
  return cause instanceof DOMException && cause.name === 'AbortError';
}

type SpatialLayerRequestState = {
  setLayers: Dispatch<SetStateAction<SpatialMapLayer[]>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setPermissionFiltered: Dispatch<SetStateAction<boolean>>;
  catalogueRef: MutableRefObject<SpatialMapLayer[]>;
  lastSelectionRef: MutableRefObject<string[] | null>;
};

function applyLayerResponse(
  body: SpatialMapLayersResponse,
  requestedIds: string[] | undefined,
  selectedIds: string[] | undefined,
  state: SpatialLayerRequestState
) {
  if (requestedIds === undefined || state.catalogueRef.current.length === 0) {
    state.catalogueRef.current = body.layers;
  }
  state.setLayers(
    requestedIds === undefined
      ? body.layers
      : mergeRequestedLayers(
          state.catalogueRef.current,
          body.layers,
          selectedIds,
          requestedIds,
          body.permissionRequiredDatasetIds ?? []
        )
  );
  state.lastSelectionRef.current =
    selectedIds ?? body.layers.map((layer) => layer.datasetId);
  state.setPermissionFiltered(body.permissionFiltered);
}

function applyLayerFailure(
  cause: unknown,
  requestedIds: string[] | undefined,
  selectedIds: string[] | undefined,
  state: SpatialLayerRequestState
) {
  state.setLayers((current) =>
    markLayersFailed(current, requestedIds, selectedIds)
  );
  state.lastSelectionRef.current =
    selectedIds ?? state.catalogueRef.current.map((layer) => layer.datasetId);
  state.setError(
    cause instanceof Error ? cause.message : 'Spatial layers are unavailable'
  );
}

function startSpatialLayerRequest(
  requestUrl: URL,
  abortController: AbortController,
  requestedIds: string[] | undefined,
  selectedIds: string[] | undefined,
  state: SpatialLayerRequestState
): () => void {
  let active = true;
  void fetch(requestUrl.toString(), { signal: abortController.signal })
    .then(readLayersResponse)
    .then((body) => {
      if (active) {
        applyLayerResponse(body, requestedIds, selectedIds, state);
      }
    })
    .catch((cause: unknown) => {
      if (!active || isAbortError(cause)) return;
      applyLayerFailure(cause, requestedIds, selectedIds, state);
    })
    .finally(() => {
      if (active) state.setLoading(false);
    });

  return () => {
    active = false;
    abortController.abort();
  };
}

function resetSpatialLayerState(
  state: SpatialLayerRequestState,
  lastContextRef: MutableRefObject<string | null>
) {
  state.setLayers([]);
  state.setLoading(false);
  state.setError(null);
  state.setPermissionFiltered(false);
  state.catalogueRef.current = [];
  lastContextRef.current = null;
  state.lastSelectionRef.current = null;
}

function clearDeselectedLayers(
  selectionOnlyChange: boolean,
  requestedIds: string[] | undefined,
  selectedIds: string[] | undefined,
  setLayers: Dispatch<SetStateAction<SpatialMapLayer[]>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string | null>>,
  lastSelectionRef: MutableRefObject<string[] | null>
): boolean {
  if (!selectionOnlyChange || requestedIds?.length !== 0) return false;

  const activeIds = new Set(selectedIds ?? []);
  setLayers((current) =>
    current.map((layer) =>
      activeIds.has(layer.datasetId)
        ? layer
        : clearLayer(layer, 'not-requested')
    )
  );
  lastSelectionRef.current = selectedIds ?? [];
  setLoading(false);
  setError(null);
  return true;
}

export function useSpatialMapLayers({
  controlCentreUrl,
  bounds,
  datasetIds,
  enabled = true,
}: {
  controlCentreUrl: string;
  bounds: SpatialMapBounds | null;
  datasetIds?: string[];
  enabled?: boolean;
}) {
  const [layers, setLayers] = useState<SpatialMapLayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionFiltered, setPermissionFiltered] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const catalogueRef = useRef<SpatialMapLayer[]>([]);
  const lastContextRef = useRef<string | null>(null);
  const lastSelectionRef = useRef<string[] | null>(null);
  const lastRetryCountRef = useRef(0);
  const datasetIdsKey = datasetIds?.slice().sort().join(',');
  const boundsKey = bounds
    ? [bounds.west, bounds.south, bounds.east, bounds.north].join(',')
    : null;
  const retry = useCallback(() => setRetryCount((current) => current + 1), []);

  useEffect(() => {
    if (!enabled || !boundsKey || !controlCentreUrl) {
      resetSpatialLayerState(
        {
          setLayers,
          setLoading,
          setError,
          setPermissionFiltered,
          catalogueRef,
          lastSelectionRef,
        },
        lastContextRef
      );
      return;
    }

    const contextKey = `${controlCentreUrl}|${boundsKey}`;
    const retryRequested = retryCount !== lastRetryCountRef.current;
    lastRetryCountRef.current = retryCount;
    const selectedIds =
      datasetIdsKey === undefined ? undefined : datasetIdsKey.split(',');

    if (datasetIdsKey === '') {
      setLayers((current) =>
        current.map((layer) => clearLayer(layer, 'not-requested'))
      );
      lastContextRef.current = contextKey;
      lastSelectionRef.current = [];
      setLoading(false);
      setError(null);
      setPermissionFiltered(false);
      return;
    }

    const selectionOnlyChange =
      lastContextRef.current === contextKey &&
      lastSelectionRef.current !== null &&
      !retryRequested;
    const requestedDatasetIds = selectionOnlyChange
      ? (selectedIds ?? []).filter(
          (id) => !lastSelectionRef.current?.includes(id)
        )
      : selectedIds;

    if (
      clearDeselectedLayers(
        selectionOnlyChange,
        requestedDatasetIds,
        selectedIds,
        setLayers,
        setLoading,
        setError,
        lastSelectionRef
      )
    )
      return;

    const abortController = new AbortController();
    const [west, south, east, north] = boundsKey.split(',').map(Number);
    const requestUrl = new URL(
      buildSpatialMapLayersUrl({
        controlCentreUrl,
        bounds: { west, south, east, north },
        datasetIds: requestedDatasetIds,
      })
    );
    if (retryRequested) {
      requestUrl.searchParams.set('_retry', String(retryCount));
    }

    setLayers((current) =>
      markLayersLoading(current, requestedDatasetIds, selectedIds)
    );
    setLoading(true);
    setError(null);
    setPermissionFiltered(false);
    lastContextRef.current = contextKey;

    return startSpatialLayerRequest(
      requestUrl,
      abortController,
      requestedDatasetIds,
      selectedIds,
      {
        setLayers,
        setLoading,
        setError,
        setPermissionFiltered,
        catalogueRef,
        lastSelectionRef,
      }
    );
  }, [boundsKey, controlCentreUrl, datasetIdsKey, enabled, retryCount]);

  return { layers, loading, error, permissionFiltered, retry };
}

function isRecordError(value: unknown): value is { error: string } {
  return (
    value !== null &&
    typeof value === 'object' &&
    'error' in value &&
    typeof value.error === 'string' &&
    value.error.length > 0
  );
}
