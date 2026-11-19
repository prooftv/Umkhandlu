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

// ─── Category detection ───────────────────────────────────────────────────────

type LayerCategory =
  | 'boundary-ward'
  | 'boundary-municipality'
  | 'boundary-district'
  | 'school'
  | 'health'
  | 'education'
  | 'road'
  | 'railway'
  | 'waterway'
  | 'financial'
  | 'cultural'
  | 'populated-place'
  | 'poi'
  | 'default';

// Ordered pairs of [substring, category] — first match wins.
const CATEGORY_PATTERNS: [string, LayerCategory][] = [
  ['ward', 'boundary-ward'],
  ['district', 'boundary-district'],
  ['municipalit', 'boundary-municipality'],
  ['giga', 'school'],
  ['health', 'health'],
  ['education', 'education'],
  ['school', 'school'],
  ['road', 'road'],
  ['rail', 'railway'],
  ['waterway', 'waterway'],
  ['water', 'waterway'],
  ['financial', 'financial'],
  ['bank', 'financial'],
  ['cultural', 'cultural'],
  ['heritage', 'cultural'],
  ['populated', 'populated-place'],
  ['settlement', 'populated-place'],
  ['place', 'populated-place'],
  ['poi', 'poi'],
];

function detectCategory(label: string): LayerCategory {
  const l = label.toLowerCase();
  for (const [pattern, cat] of CATEGORY_PATTERNS) {
    if (l.includes(pattern)) return cat;
  }
  return 'default';
}

// ─── Boundary polygon styles (low fill so they don't dominate) ───────────────

const BOUNDARY_STYLE: Record<
  'boundary-ward' | 'boundary-municipality' | 'boundary-district',
  L.PathOptions
> = {
  'boundary-ward': {
    color: '#facc15',
    weight: 1.5,
    opacity: 0.9,
    fillColor: '#facc15',
    fillOpacity: 0.04,
  },
  'boundary-municipality': {
    color: '#f97316',
    weight: 2,
    opacity: 0.9,
    fillColor: '#f97316',
    fillOpacity: 0.06,
  },
  'boundary-district': {
    color: '#22c55e',
    weight: 2.5,
    opacity: 0.9,
    fillColor: '#22c55e',
    fillOpacity: 0.04,
  },
};

// ─── Point marker SVG icons ───────────────────────────────────────────────────

function schoolIcon(Leaf: typeof L, colour: string): L.DivIcon {
  return Leaf.divIcon({
    className: '',
    html: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="7" width="14" height="9" rx="1" fill="${colour}" stroke="white" stroke-width="1.5"/>
      <polygon points="9,1 1,7 17,7" fill="${colour}" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
      <rect x="7" y="11" width="4" height="5" fill="white" opacity="0.7"/>
    </svg>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function healthIcon(Leaf: typeof L, colour: string): L.DivIcon {
  return Leaf.divIcon({
    className: '',
    html: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="8" fill="${colour}" stroke="white" stroke-width="1.5"/>
      <rect x="7.5" y="4" width="3" height="10" rx="1" fill="white"/>
      <rect x="4" y="7.5" width="10" height="3" rx="1" fill="white"/>
    </svg>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function educationIcon(Leaf: typeof L, colour: string): L.DivIcon {
  return Leaf.divIcon({
    className: '',
    html: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="6" width="14" height="8" rx="1" fill="${colour}" stroke="white" stroke-width="1.5"/>
      <polygon points="8,1 1,6 15,6" fill="${colour}" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function financialIcon(Leaf: typeof L, colour: string): L.DivIcon {
  return Leaf.divIcon({
    className: '',
    html: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="14" height="14" rx="3" fill="${colour}" stroke="white" stroke-width="1.5"/>
      <text x="8" y="12" text-anchor="middle" font-size="9" font-weight="bold" fill="white">$</text>
    </svg>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function culturalIcon(Leaf: typeof L, colour: string): L.DivIcon {
  return Leaf.divIcon({
    className: '',
    html: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="8,1 15,15 1,15" fill="${colour}" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`,
    iconSize: [16, 16],
    iconAnchor: [8, 10],
  });
}

function populatedPlaceIcon(Leaf: typeof L, colour: string): L.DivIcon {
  return Leaf.divIcon({
    className: '',
    html: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7" r="6" fill="${colour}" stroke="white" stroke-width="1.5"/>
      <circle cx="7" cy="7" r="2.5" fill="white" opacity="0.8"/>
    </svg>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function defaultCircle(
  Leaf: typeof L,
  colour: string,
  radius = 6
): L.CircleMarker {
  return Leaf.circleMarker([0, 0], {
    radius,
    color: '#ffffff',
    weight: 1.5,
    fillColor: colour,
    fillOpacity: 0.9,
  });
}

// ─── Name resolution ──────────────────────────────────────────────────────────

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

// ─── Popup builder ────────────────────────────────────────────────────────────

// Keys to suppress from public popups — internal IDs, raw OSM refs, etc.
const SUPPRESS_KEYS = new Set([
  'id',
  'osm_id',
  'adm0_pcode',
  'adm1_pcode',
  'adm2_pcode',
  'adm3_pcode',
  'adm4_pcode',
  'adm0_name',
  'adm1_name',
  'source',
]);

// Human-readable labels for known property keys
const PROP_LABELS: Record<string, string> = {
  amenity: 'Type',
  healthcare: 'Healthcare type',
  healthcare_speciality: 'Speciality',
  operator_type: 'Operator',
  capacity_persons: 'Capacity',
  highway: 'Road class',
  surface: 'Surface',
  adm2_name: 'District',
  adm3_name: 'Sub-district',
  adm4_name: 'Ward area',
  connectivity: 'Connectivity',
  education_level: 'Level',
  place: 'Place type',
  landuse: 'Land use',
  network: 'Network',
  operator: 'Operator',
  addr_city: 'City',
  addr_full: 'Address',
  water: 'Water type',
  depth: 'Depth',
  width: 'Width',
  tourism: 'Tourism type',
  website: 'Website',
};

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
    .filter(([k, v]) => {
      if (SUPPRESS_KEYS.has(k)) return false;
      if (k.startsWith('_')) return false;
      if (v == null || String(v).trim() === '') return false;
      if (String(v).length > 120) return false;
      // Suppress raw UUID-like values
      if (/^[0-9a-f]{8}-[0-9a-f]{4}/.test(String(v))) return false;
      // Suppress OSM way/node refs
      if (/^(way|node|relation)\/\d+$/.test(String(v))) return false;
      return true;
    })
    .slice(0, 8);

  if (usefulProps.length > 0) {
    const table = document.createElement('table');
    table.style.cssText = 'width:100%;border-collapse:collapse;margin-top:4px';
    for (const [k, v] of usefulProps) {
      const row = table.insertRow();
      const kCell = row.insertCell();
      kCell.style.cssText =
        'color:#6b7280;padding:1px 4px 1px 0;white-space:nowrap;font-size:10px;vertical-align:top';
      kCell.textContent = PROP_LABELS[k] ?? k;
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

// ─── Main render function ─────────────────────────────────────────────────────

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

    const category = detectCategory(layer.label);
    const isBoundary = category.startsWith('boundary-');

    const collection: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: layer.features as GeoJSON.Feature[],
    };

    const geoJsonLayer = Leaf.geoJSON(collection, {
      style: isBoundary
        ? BOUNDARY_STYLE[category as keyof typeof BOUNDARY_STYLE]
        : {
            color: layer.colour,
            weight: layer.weight,
            fillColor: layer.colour,
            fillOpacity: layer.fillOpacity,
          },
      pointToLayer: (_feature, latLng) => {
        switch (category) {
          case 'school':
            return Leaf.marker(latLng, {
              icon: schoolIcon(Leaf, layer.colour),
            });
          case 'health':
            return Leaf.marker(latLng, {
              icon: healthIcon(Leaf, layer.colour),
            });
          case 'education':
            return Leaf.marker(latLng, {
              icon: educationIcon(Leaf, layer.colour),
            });
          case 'financial':
            return Leaf.marker(latLng, {
              icon: financialIcon(Leaf, layer.colour),
            });
          case 'cultural':
            return Leaf.marker(latLng, {
              icon: culturalIcon(Leaf, layer.colour),
            });
          case 'populated-place':
            return Leaf.marker(latLng, {
              icon: populatedPlaceIcon(Leaf, layer.colour),
            });
          default:
            return defaultCircle(Leaf, layer.colour);
        }
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
