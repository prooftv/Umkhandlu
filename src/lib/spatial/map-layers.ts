export type SpatialMapBounds = {
  west: number;
  south: number;
  east: number;
  north: number;
};

export type SpatialMapFeature = {
  type: 'Feature';
  id: string;
  geometry: {
    type: string;
    coordinates?: unknown;
    geometries?: unknown;
  };
  properties: Record<string, unknown>;
};

export type SpatialLayerRequestStatus =
  | 'not-requested'
  | 'loading'
  | 'error'
  | 'permission-required';

export type SpatialMapLayer = {
  id: string;
  datasetId: string;
  status: 'available' | 'empty';
  requestStatus?: SpatialLayerRequestStatus;
  label: string;
  colour: string;
  weight: number;
  fillOpacity: number;
  featureCount: number;
  returnedCount: number;
  loadOnDemand: boolean;
  truncated: boolean;
  radiusKm: number | null;
  features: SpatialMapFeature[];
  attribution: string | null;
  sourceId: string | null;
  sourceName: string | null;
  sourceInstitution: string | null;
  publishedAt: string | null;
  datasetDate: string | null;
  radiusFiltered: boolean;
};

export type SpatialMapLayersResponse = {
  layers: SpatialMapLayer[];
  filterLat: number | null;
  filterLng: number | null;
  filterBounds: SpatialMapBounds | null;
  permissionFiltered: boolean;
  permissionRequiredDatasetIds?: string[];
  generatedAt: string;
};

export type SpatialFeaturesResponse = {
  type: 'FeatureCollection';
  features: SpatialMapFeature[];
  meta: {
    datasetId: string;
    datasetName: string;
    attribution: string | null;
    sourceId: string | null;
    sourceName: string | null;
    sourceInstitution: string | null;
    datasetDate: string | null;
    publishedAt: string | null;
    total: number | null;
    offset: number;
    limit: number;
    returned: number;
    complete: boolean;
    hasMore: boolean;
    nextOffset: number | null;
    filtered: boolean;
  };
};

export type PublishedSpatialFeature = SpatialMapFeature & {
  meta: {
    dataset: string;
    attribution: string | null;
    datasetDate: string | null;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string';
}

function isNullableNumber(value: unknown): value is number | null {
  return (
    value === null || (typeof value === 'number' && Number.isFinite(value))
  );
}

function isSpatialMapBounds(value: unknown): value is SpatialMapBounds | null {
  return (
    value === null ||
    (isRecord(value) &&
      ['west', 'south', 'east', 'north'].every(
        (key) => typeof value[key] === 'number' && Number.isFinite(value[key])
      ))
  );
}

function isSpatialMapFeature(value: unknown): value is SpatialMapFeature {
  return (
    isRecord(value) &&
    value.type === 'Feature' &&
    typeof value.id === 'string' &&
    isRecord(value.geometry) &&
    typeof value.geometry.type === 'string' &&
    isRecord(value.properties)
  );
}

function isSpatialMapLayer(value: unknown): value is SpatialMapLayer {
  if (!isRecord(value) || !Array.isArray(value.features)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.datasetId === 'string' &&
    (value.status === 'available' || value.status === 'empty') &&
    typeof value.label === 'string' &&
    typeof value.colour === 'string' &&
    typeof value.weight === 'number' &&
    Number.isFinite(value.weight) &&
    typeof value.fillOpacity === 'number' &&
    Number.isFinite(value.fillOpacity) &&
    typeof value.featureCount === 'number' &&
    Number.isFinite(value.featureCount) &&
    typeof value.returnedCount === 'number' &&
    Number.isFinite(value.returnedCount) &&
    typeof value.loadOnDemand === 'boolean' &&
    typeof value.truncated === 'boolean' &&
    (value.radiusKm === null ||
      (typeof value.radiusKm === 'number' &&
        Number.isFinite(value.radiusKm))) &&
    isNullableString(value.attribution) &&
    isNullableString(value.sourceId) &&
    isNullableString(value.sourceName) &&
    isNullableString(value.sourceInstitution) &&
    isNullableString(value.publishedAt) &&
    isNullableString(value.datasetDate) &&
    typeof value.radiusFiltered === 'boolean' &&
    value.features.every(isSpatialMapFeature)
  );
}

export function isSpatialMapLayersResponse(
  value: unknown
): value is SpatialMapLayersResponse {
  if (!isRecord(value) || !Array.isArray(value.layers)) return false;
  if (
    typeof value.permissionFiltered !== 'boolean' ||
    typeof value.generatedAt !== 'string' ||
    (value.permissionRequiredDatasetIds !== undefined &&
      (!Array.isArray(value.permissionRequiredDatasetIds) ||
        !value.permissionRequiredDatasetIds.every(
          (id) => typeof id === 'string'
        )))
  ) {
    return false;
  }
  return (
    isNullableNumber(value.filterLat) &&
    isNullableNumber(value.filterLng) &&
    isSpatialMapBounds(value.filterBounds) &&
    value.layers.every(isSpatialMapLayer)
  );
}

export function isSpatialFeaturesResponse(
  value: unknown
): value is SpatialFeaturesResponse {
  if (!isRecord(value) || value.type !== 'FeatureCollection') return false;
  const meta = value.meta;
  if (!isRecord(meta) || !Array.isArray(value.features)) return false;
  return (
    typeof meta.datasetId === 'string' &&
    typeof meta.datasetName === 'string' &&
    isNullableString(meta.attribution) &&
    isNullableString(meta.sourceId) &&
    isNullableString(meta.sourceName) &&
    isNullableString(meta.sourceInstitution) &&
    isNullableString(meta.datasetDate) &&
    isNullableString(meta.publishedAt) &&
    isNullableNumber(meta.total) &&
    typeof meta.offset === 'number' &&
    Number.isInteger(meta.offset) &&
    typeof meta.limit === 'number' &&
    Number.isInteger(meta.limit) &&
    typeof meta.returned === 'number' &&
    Number.isInteger(meta.returned) &&
    typeof meta.complete === 'boolean' &&
    typeof meta.hasMore === 'boolean' &&
    (meta.nextOffset === null ||
      (typeof meta.nextOffset === 'number' &&
        Number.isInteger(meta.nextOffset))) &&
    typeof meta.filtered === 'boolean' &&
    value.features.every(isSpatialMapFeature)
  );
}

export function isPublishedSpatialFeature(
  value: unknown
): value is PublishedSpatialFeature {
  if (!isRecord(value)) return false;
  const meta = value.meta;
  return (
    isSpatialMapFeature(value) &&
    isRecord(meta) &&
    typeof meta.dataset === 'string' &&
    isNullableString(meta.attribution) &&
    isNullableString(meta.datasetDate)
  );
}

export function buildSpatialMapLayersUrl({
  controlCentreUrl,
  bounds,
  datasetIds,
}: {
  controlCentreUrl: string;
  bounds: SpatialMapBounds;
  datasetIds?: string[];
}): string {
  const query = new URLSearchParams({
    bbox: [bounds.west, bounds.south, bounds.east, bounds.north].join(','),
  });
  if (datasetIds !== undefined) query.set('datasetIds', datasetIds.join(','));
  return `${controlCentreUrl.replace(/\/$/, '')}/api/spatial/map-layers?${query}`;
}

export function buildSpatialFeaturesUrl({
  controlCentreUrl,
  datasetId,
  bounds,
  limit,
  offset,
}: {
  controlCentreUrl: string;
  datasetId: string;
  bounds: SpatialMapBounds;
  limit: number;
  offset: number;
}): string {
  const query = new URLSearchParams({
    id: datasetId,
    bbox: [bounds.west, bounds.south, bounds.east, bounds.north].join(','),
    limit: String(limit),
    offset: String(offset),
  });
  return `${controlCentreUrl.replace(/\/$/, '')}/api/spatial/features?${query}`;
}

async function fetchSpatialFeaturePage({
  url,
  datasetId,
  offset,
  signal,
  fetcher,
}: {
  url: string;
  datasetId: string;
  offset: number;
  signal: AbortSignal;
  fetcher: typeof fetch;
}): Promise<SpatialFeaturesResponse> {
  const response = await fetcher(url, { cache: 'no-store', signal });
  const body: unknown = await response.json();
  if (!response.ok) {
    const message =
      isRecord(body) && typeof body.error === 'string'
        ? body.error
        : `Feature page request failed (${response.status})`;
    throw new Error(message);
  }
  if (!isSpatialFeaturesResponse(body)) {
    throw new Error('Spatial feature page response has an invalid format.');
  }
  if (
    body.meta.datasetId !== datasetId ||
    body.meta.offset !== offset ||
    !body.meta.filtered ||
    body.meta.returned !== body.features.length
  ) {
    throw new Error(
      `Spatial feature page identity or pagination mismatch for ${datasetId}.`
    );
  }
  return body;
}

function appendSpatialFeaturePage(
  features: SpatialMapFeature[],
  seenFeatureIds: Set<string>,
  page: SpatialFeaturesResponse,
  datasetId: string
): void {
  for (const feature of page.features) {
    if (seenFeatureIds.has(feature.id)) {
      throw new Error(
        `Duplicate feature ${feature.id} returned while paging dataset ${datasetId}.`
      );
    }
    seenFeatureIds.add(feature.id);
    features.push(feature);
  }
}

export async function fetchRemainingSpatialMapFeatures({
  controlCentreUrl,
  bounds,
  layer,
  signal,
  fetcher = fetch,
}: {
  controlCentreUrl: string;
  bounds: SpatialMapBounds;
  layer: SpatialMapLayer;
  signal: AbortSignal;
  fetcher?: typeof fetch;
}): Promise<SpatialMapLayer> {
  if (!layer.truncated) return layer;
  if (layer.features.length !== layer.returnedCount) {
    throw new Error(
      `Spatial layer ${layer.datasetId} has an inconsistent initial feature count.`
    );
  }

  const features = [...layer.features];
  const seenFeatureIds = new Set(features.map((feature) => feature.id));
  let offset = layer.returnedCount;
  let complete = false;

  while (offset <= 20_000) {
    const url = buildSpatialFeaturesUrl({
      controlCentreUrl,
      datasetId: layer.datasetId,
      bounds,
      limit: 500,
      offset,
    });
    const page = await fetchSpatialFeaturePage({
      url,
      datasetId: layer.datasetId,
      offset,
      signal,
      fetcher,
    });
    appendSpatialFeaturePage(features, seenFeatureIds, page, layer.datasetId);
    if (!page.meta.hasMore) {
      complete = page.meta.complete;
      break;
    }
    if (page.meta.nextOffset === null || page.meta.nextOffset <= offset) {
      throw new Error(
        `Spatial feature pagination did not advance for ${layer.datasetId}.`
      );
    }
    if (page.meta.nextOffset > 20_000) break;
    offset = page.meta.nextOffset;
  }

  return {
    ...layer,
    features,
    returnedCount: features.length,
    loadOnDemand: false,
    truncated: !complete,
  };
}

export function toggleSpatialDatasetSelection(
  currentIds: string[] | undefined,
  layers: Pick<SpatialMapLayer, 'id' | 'datasetId'>[],
  layerId: string
): string[] {
  const datasetId =
    layers.find((layer) => layer.id === layerId)?.datasetId ?? layerId;
  const selectedIds = currentIds ?? layers.map((layer) => layer.datasetId);
  return selectedIds.includes(datasetId)
    ? selectedIds.filter((id) => id !== datasetId)
    : [...selectedIds, datasetId];
}
