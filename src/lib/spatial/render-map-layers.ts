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

const NAME_KEYS = [
  'name',
  'NAME',
  'Name',
  'NAMECODE',
  'MUNICNAME',
  'WardLink',
  'Ward_Label',
  'title',
  'TITLE',
  'label',
  'LABEL',
  'description',
];

function resolveFeatureName(
  props: Record<string, unknown>,
  fallback: string
): string {
  for (const k of NAME_KEYS) {
    if (props[k] && typeof props[k] === 'string') return props[k] as string;
  }
  const entries = Object.entries(props).filter(
    ([k, v]) =>
      !k.startsWith('_') && typeof v === 'string' && (v as string).length < 80
  );
  return (
    entries
      .slice(0, 2)
      .map(([k, v]) => `${k}: ${v}`)
      .join(' · ') || fallback
  );
}

function buildFeaturePopup(
  props: Record<string, unknown>,
  featureName: string,
  layerLabel: string,
  attribution: string | null
): HTMLElement {
  const content = document.createElement('div');
  content.style.cssText =
    'min-width:180px;max-width:280px;font-size:12px;line-height:1.5';

  const title = document.createElement('strong');
  title.style.cssText = 'display:block;margin-bottom:4px;font-size:13px';
  title.textContent = featureName;
  content.append(title);

  const badge = document.createElement('span');
  badge.style.cssText =
    'display:inline-block;background:#f3f4f6;color:#374151;padding:1px 6px;border-radius:4px;font-size:10px;margin-bottom:6px';
  badge.textContent = layerLabel;
  content.append(badge);

  const usefulProps = Object.entries(props)
    .filter(
      ([k, v]) =>
        !k.startsWith('_') &&
        v != null &&
        String(v).length < 100 &&
        !/^[0-9a-f]{8}-[0-9a-f]{4}/.test(String(v))
    )
    .slice(0, 8);

  if (usefulProps.length > 0) {
    const table = document.createElement('table');
    table.style.cssText = 'width:100%;border-collapse:collapse;margin-top:4px';
    for (const [k, v] of usefulProps) {
      const row = table.insertRow();
      const kCell = row.insertCell();
      kCell.style.cssText =
        'color:#6b7280;padding:1px 4px 1px 0;white-space:nowrap;font-size:10px;vertical-align:top';
      kCell.textContent = k;
      const vCell = row.insertCell();
      vCell.style.cssText = 'color:#111827;padding:1px 0;font-size:11px';
      vCell.textContent = String(v);
    }
    content.append(table);
  }

  if (attribution) {
    const attr = document.createElement('p');
    attr.style.cssText =
      'margin-top:6px;color:#9ca3af;font-size:10px;border-top:1px solid #f3f4f6;padding-top:4px';
    attr.textContent = attribution;
    content.append(attr);
  }

  return content;
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
