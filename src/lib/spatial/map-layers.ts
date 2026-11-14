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
