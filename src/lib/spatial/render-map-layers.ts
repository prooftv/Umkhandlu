import type L from 'leaflet';
import type { SpatialMapLayer } from './map-layers';

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

export function renderSpatialMapLayers({
  Leaf,
  map,
  layers,
  visibility,
  renderedLayers,
  prefix,
}: {
  Leaf: typeof L;
  map: L.Map;
  layers: SpatialMapLayer[];
  visibility: Record<string, boolean>;
  renderedLayers: Map<string, L.Layer>;
  prefix: string;
}) {
  clearRenderedSpatialLayers(map, renderedLayers, prefix);

  for (const layer of layers) {
    if (visibility[layer.id] === false || !layer.features.length) continue;

    const collection: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: layer.features as GeoJSON.Feature[],
    };
    const geoJsonLayer = Leaf.geoJSON(collection, {
      style: {
        color: layer.colour,
        weight: layer.weight,
        fillColor: layer.colour,
        fillOpacity: layer.fillOpacity,
      },
      pointToLayer: (_feature, latLng) =>
        Leaf.circleMarker(latLng, {
          radius: 6,
          color: '#ffffff',
          weight: 1.5,
          fillColor: layer.colour,
          fillOpacity: 0.95,
        }),
      onEachFeature: (feature, featureLayer) => {
        const content = document.createElement('div');
        const title = document.createElement('strong');
        title.textContent = layer.label;
        const featureId = document.createElement('p');
        featureId.className = 'text-[10px] text-gray-500';
        featureId.textContent = `Feature ID: ${feature.id ?? 'unknown'}`;
        const properties = document.createElement('pre');
        properties.className =
          'mt-1 max-h-48 overflow-auto whitespace-pre-wrap text-xs';
        properties.textContent = JSON.stringify(
          feature.properties ?? {},
          null,
          2
        );
        const attribution = document.createElement('p');
        attribution.className = 'mt-1 text-[10px] text-gray-500';
        attribution.textContent = layer.attribution ?? layer.sourceName ?? '';
        content.append(title, featureId, properties);
        if (attribution.textContent) content.append(attribution);
        featureLayer.bindPopup(content);
      },
    });

    geoJsonLayer.addTo(map);
    renderedLayers.set(`${prefix}${layer.id}`, geoJsonLayer);
  }
}
