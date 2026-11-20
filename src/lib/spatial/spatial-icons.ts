/**
 * Centralised spatial icon catalogue.
 * All SVG marker definitions live here. Map components import from this module.
 * No React. No Leaflet import — accepts Leaf as a parameter to stay tree-shakeable.
 */

import type L from 'leaflet';

// ─── Category detection ───────────────────────────────────────────────────────

export type SpatialCategory =
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

// Ordered — first match wins. More specific patterns before general ones.
const CATEGORY_PATTERNS: [string, SpatialCategory][] = [
  ['ward', 'boundary-ward'],
  ['district', 'boundary-district'],
  ['municipalit', 'boundary-municipality'],
  ['boundary', 'boundary-district'],
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

export function detectSpatialCategory(label: string): SpatialCategory {
  const l = label.toLowerCase();
  for (const [pattern, cat] of CATEGORY_PATTERNS) {
    if (l.includes(pattern)) return cat;
  }
  return 'default';
}

export function isBoundaryCategory(cat: SpatialCategory): boolean {
  return cat.startsWith('boundary-');
}

// ─── Boundary polygon styles ──────────────────────────────────────────────────
// Match the LAYER_STYLE values used in NoticeStatutoryMap so all three
// map experiences show the same boundary colours and opacities.
// Ward=yellow, Municipality=orange, District=green.

export const BOUNDARY_STYLES: Record<
  'boundary-ward' | 'boundary-municipality' | 'boundary-district',
  L.PathOptions
> = {
  'boundary-ward': {
    color: '#facc15',
    weight: 3,
    opacity: 1,
    fillColor: '#facc15',
    fillOpacity: 0.2,
  },
  'boundary-municipality': {
    color: '#f97316',
    weight: 2.5,
    opacity: 1,
    fillColor: '#f97316',
    fillOpacity: 0.15,
  },
  'boundary-district': {
    color: '#22c55e',
    weight: 2,
    opacity: 0.9,
    fillColor: '#22c55e',
    fillOpacity: 0.08,
  },
};

// ─── Road hierarchy styles ────────────────────────────────────────────────────
// Based on OSM highway tag values present in the HOT export.

const ROAD_HIERARCHY: Record<string, L.PathOptions> = {
  motorway: { color: '#e11d48', weight: 4, opacity: 0.9 },
  trunk: { color: '#f97316', weight: 3.5, opacity: 0.9 },
  primary: { color: '#f59e0b', weight: 3, opacity: 0.9 },
  secondary: { color: '#84cc16', weight: 2.5, opacity: 0.85 },
  tertiary: { color: '#6b7280', weight: 2, opacity: 0.8 },
  residential: { color: '#9ca3af', weight: 1.5, opacity: 0.75 },
  unclassified: { color: '#9ca3af', weight: 1.5, opacity: 0.7 },
  track: { color: '#a16207', weight: 1.5, opacity: 0.65, dashArray: '4 3' },
  path: { color: '#a16207', weight: 1, opacity: 0.6, dashArray: '2 3' },
  service: { color: '#cbd5e1', weight: 1.5, opacity: 0.7 },
};

const ROAD_DEFAULT: L.PathOptions = {
  color: '#9ca3af',
  weight: 1.5,
  opacity: 0.7,
};

export function roadStyle(highway: string | undefined): L.PathOptions {
  return ROAD_HIERARCHY[highway ?? ''] ?? ROAD_DEFAULT;
}

// ─── Railway style ────────────────────────────────────────────────────────────

export const RAILWAY_STYLE: L.PathOptions = {
  color: '#44403c',
  weight: 2.5,
  opacity: 0.85,
  dashArray: '8 4',
};

// ─── Waterway style ───────────────────────────────────────────────────────────

export const WATERWAY_STYLE: L.PathOptions = {
  color: '#0ea5e9',
  weight: 2,
  opacity: 0.8,
  fillColor: '#0ea5e9',
  fillOpacity: 0.15,
};

// ─── SVG icon builders ────────────────────────────────────────────────────────
// Each returns an HTML string. Leaflet DivIcon wraps it.

function svgIcon(svg: string, size: number): string {
  return `<div style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center">${svg}</div>`;
}

export const ICON_SIZE: Record<SpatialCategory, number> = {
  school: 20,
  health: 20,
  education: 18,
  financial: 16,
  cultural: 16,
  'populated-place': 14,
  poi: 14,
  road: 0,
  railway: 0,
  waterway: 0,
  'boundary-ward': 0,
  'boundary-municipality': 0,
  'boundary-district': 0,
  default: 14,
};

function schoolSvg(colour: string): string {
  return svgIcon(
    `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="8" width="16" height="10" rx="1" fill="${colour}" stroke="white" stroke-width="1.5"/>
      <polygon points="10,1 1,8 19,8" fill="${colour}" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
      <rect x="8" y="12" width="4" height="6" fill="white" opacity="0.75"/>
      <rect x="4" y="10" width="3" height="3" fill="white" opacity="0.6"/>
      <rect x="13" y="10" width="3" height="3" fill="white" opacity="0.6"/>
    </svg>`,
    20
  );
}

function healthSvg(colour: string): string {
  return svgIcon(
    `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="9" fill="${colour}" stroke="white" stroke-width="1.5"/>
      <rect x="8.5" y="4.5" width="3" height="11" rx="1" fill="white"/>
      <rect x="4.5" y="8.5" width="11" height="3" rx="1" fill="white"/>
    </svg>`,
    20
  );
}

function educationSvg(colour: string): string {
  return svgIcon(
    `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="7" width="14" height="9" rx="1" fill="${colour}" stroke="white" stroke-width="1.5"/>
      <polygon points="9,1 1,7 17,7" fill="${colour}" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
      <rect x="7" y="11" width="4" height="5" fill="white" opacity="0.7"/>
    </svg>`,
    18
  );
}

function financialSvg(colour: string): string {
  return svgIcon(
    `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="14" height="14" rx="3" fill="${colour}" stroke="white" stroke-width="1.5"/>
      <text x="8" y="12" text-anchor="middle" font-size="9" font-weight="bold" fill="white" font-family="sans-serif">$</text>
    </svg>`,
    16
  );
}

function culturalSvg(colour: string): string {
  return svgIcon(
    `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="8,1 15,15 1,15" fill="${colour}" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
      <rect x="6.5" y="9" width="3" height="4" fill="white" opacity="0.7"/>
    </svg>`,
    16
  );
}

function populatedPlaceSvg(colour: string): string {
  return svgIcon(
    `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7" r="6" fill="${colour}" stroke="white" stroke-width="1.5"/>
      <circle cx="7" cy="7" r="2.5" fill="white" opacity="0.8"/>
    </svg>`,
    14
  );
}

function defaultSvg(colour: string): string {
  return svgIcon(
    `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7" r="6" fill="${colour}" stroke="white" stroke-width="1.5"/>
    </svg>`,
    14
  );
}

const SVG_BUILDERS: Partial<
  Record<SpatialCategory, (colour: string) => string>
> = {
  school: schoolSvg,
  health: healthSvg,
  education: educationSvg,
  financial: financialSvg,
  cultural: culturalSvg,
  'populated-place': populatedPlaceSvg,
  default: defaultSvg,
};

export function buildDivIcon(
  Leaf: typeof L,
  category: SpatialCategory,
  colour: string
): L.DivIcon {
  const size = ICON_SIZE[category] || 14;
  const builder = SVG_BUILDERS[category] ?? defaultSvg;
  return Leaf.divIcon({
    className: '',
    html: builder(colour),
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  });
}

// ─── Property normalisation ───────────────────────────────────────────────────

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

export function resolveFeatureName(
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

// Keys to suppress from public popups
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

// Human-readable labels for known OSM/dataset property keys
export const PROP_LABELS: Record<string, string> = {
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

export function buildFeaturePopup(
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
      if (SUPPRESS_KEYS.has(k) || k.startsWith('_')) return false;
      if (v == null || String(v).trim() === '') return false;
      if (String(v).length > 120) return false;
      if (/^[0-9a-f]{8}-[0-9a-f]{4}/.test(String(v))) return false;
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
