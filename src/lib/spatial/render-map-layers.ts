import type L from 'leaflet';
import type { SpatialMapLayer } from './map-layers';
import {
  BOUNDARY_STYLES,
  buildDivIcon,
  buildFeaturePopup,
  detectSpatialCategory,
  isBoundaryCategory,
  RAILWAY_STYLE,
  resolveFeatureName,
  roadStyle,
  WATERWAY_STYLE,
} from './spatial-icons';

export function clearRenderedSpatialLayers(
  map: L.Map,
  renderedLayers: Map<string, L.Layer>,
  prefix: string
) {
  for (const [key, layer] of renderedLayers) {
    if (!key.startsWith(prefix)) continue;
    map.removeLayer(layer);
    renderedLayers.delete(key);
  }
}

// ─── Boundary deduplication ───────────────────────────────────────────────────
// The catalogue publishes both DARD and MDB versions of district/municipality
// boundaries. Rendering all of them stacks fills and produces a solid overlay.
// Keep only the highest-priority dataset per boundary level.
// Priority: MDB 2026 > KZN DARD > DPME > others.

const BOUNDARY_PRIORITY = ['MDB', 'DARD', 'DPME'];

function boundaryPriority(label: string): number {
  const l = label.toUpperCase();
  for (let i = 0; i < BOUNDARY_PRIORITY.length; i++) {
    if (l.includes(BOUNDARY_PRIORITY[i])) return i;
  }
  return BOUNDARY_PRIORITY.length;
}

export function deduplicateBoundaryLayers(
  layers: SpatialMapLayer[]
): SpatialMapLayer[] {
  // Group boundary layers by their sub-category (ward/municipality/district)
  const bySubcat = new Map<string, SpatialMapLayer[]>();
  const nonBoundary: SpatialMapLayer[] = [];

  for (const layer of layers) {
    const cat = detectSpatialCategory(layer.label);
    if (isBoundaryCategory(cat)) {
      const existing = bySubcat.get(cat) ?? [];
      existing.push(layer);
      bySubcat.set(cat, existing);
    } else {
      nonBoundary.push(layer);
    }
  }

  const deduplicated: SpatialMapLayer[] = [];
  for (const [, group] of bySubcat) {
    // Sort by priority, keep only the best one
    const sorted = [...group].sort(
      (a, b) => boundaryPriority(a.label) - boundaryPriority(b.label)
    );
    if (sorted[0]) deduplicated.push(sorted[0]);
  }

  return [...deduplicated, ...nonBoundary];
}

// ─── Per-feature road style ───────────────────────────────────────────────────

function featureRoadStyle(feature: GeoJSON.Feature | undefined): L.PathOptions {
  const highway = feature?.properties?.highway as string | undefined;
  return roadStyle(highway);
}

// ─── Main render function ─────────────────────────────────────────────────────

export function renderSpatialMapLayers({
  Leaf,
  map,
  layers,
  visibility,
  renderedLayers,
  prefix,
  skipWardBoundaries = false,
}: {
  Leaf: typeof L;
  map: L.Map;
  layers: SpatialMapLayer[];
  visibility: Record<string, boolean>;
  renderedLayers: Map<string, L.Layer>;
  prefix: string;
  // Pass true when the caller already renders ward boundaries via addBoundaries()
  // to avoid double-rendering the MDB Wards layer from the spatial API.
  skipWardBoundaries?: boolean;
}) {
  clearRenderedSpatialLayers(map, renderedLayers, prefix);

  // Deduplicate boundary layers before rendering
  const deduplicated = deduplicateBoundaryLayers(layers);

  for (const layer of deduplicated) {
    if (visibility[layer.id] === false || !layer.features.length) continue;

    const category = detectSpatialCategory(layer.label);

    // Skip ward boundaries when the caller already renders them via addBoundaries()
    if (skipWardBoundaries && category === 'boundary-ward') continue;

    const isBoundary = isBoundaryCategory(category);
    const isRoad = category === 'road';
    const isRailway = category === 'railway';
    const isWaterway = category === 'waterway';

    const collection: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: layer.features as GeoJSON.Feature[],
    };

    const geoJsonLayer = Leaf.geoJSON(collection, {
      style: (feature) => {
        if (isBoundary) {
          return (
            BOUNDARY_STYLES[category as keyof typeof BOUNDARY_STYLES] ?? {
              color: layer.colour,
              weight: 1.5,
              fillOpacity: 0.04,
            }
          );
        }
        if (isRoad) return featureRoadStyle(feature);
        if (isRailway) return RAILWAY_STYLE;
        if (isWaterway) return WATERWAY_STYLE;
        return {
          color: layer.colour,
          weight: layer.weight,
          fillColor: layer.colour,
          fillOpacity: layer.fillOpacity,
        };
      },
      pointToLayer: (_feature, latLng) => {
        if (isBoundary)
          return Leaf.circleMarker(latLng, { radius: 4, color: layer.colour });
        return Leaf.marker(latLng, {
          icon: buildDivIcon(Leaf, category, layer.colour),
        });
      },
      onEachFeature: (feature, featureLayer) => {
        const props = (feature.properties ?? {}) as Record<string, unknown>;
        const featureName = resolveFeatureName(props, layer.label);
        const popup = buildFeaturePopup(
          props,
          featureName,
          layer.label,
          layer.attribution
        );
        featureLayer.bindPopup(popup, { maxWidth: 300 });
      },
    });

    geoJsonLayer.addTo(map);
    renderedLayers.set(`${prefix}${layer.id}`, geoJsonLayer);
  }
}
