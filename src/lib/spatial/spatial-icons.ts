/**
 * Centralised spatial presentation catalogue.
 * Category resolution uses the authoritative DB category field first,
 * with label-substring matching as a fallback only.
 */

import type L from 'leaflet';

// ─── Category types ───────────────────────────────────────────────────────────

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

// ─── DB category → SpatialCategory mapping ───────────────────────────────────
// Maps the authoritative category values stored in spatial_layer_config.category
// to our internal SpatialCategory. This is the primary resolution path.

const DB_CATEGORY_MAP: Record<string, SpatialCategory> = {
  administrative: 'boundary-district', // refined by label below
  education: 'education',
  health: 'health',
  transport: 'road', // refined by label below
  environment: 'waterway', // refined by label below
  cultural: 'cultural',
  general: 'poi',
};

// Label-substring fallback — ordered, first match wins.
// Only used when DB category is absent or maps to a coarse category.
const LABEL_PATTERNS: [string, SpatialCategory][] = [
  ['ward', 'boundary-ward'],
  ['district', 'boundary-district'],
  ['municipalit', 'boundary-municipality'],
  ['boundary', 'boundary-district'],
  ['giga', 'school'],
  ['school', 'school'],
  ['health', 'health'],
  ['clinic', 'health'],
  ['hospital', 'health'],
  ['education', 'education'],
  ['road', 'road'],
  ['rail', 'railway'],
  ['waterway', 'waterway'],
  ['river', 'waterway'],
  ['water', 'waterway'],
  ['financial', 'financial'],
  ['bank', 'financial'],
  ['atm', 'financial'],
  ['cultural', 'cultural'],
  ['heritage', 'cultural'],
  ['museum', 'cultural'],
  ['populated', 'populated-place'],
  ['settlement', 'populated-place'],
  ['place', 'populated-place'],
  ['poi', 'poi'],
];

function detectByLabel(label: string): SpatialCategory {
  const l = label.toLowerCase();
  for (const [pattern, cat] of LABEL_PATTERNS) {
    if (l.includes(pattern)) return cat;
  }
  return 'default';
}

/**
 * Resolve category from DB category field (authoritative) + label (refinement/fallback).
 * Pass dbCategory from layer.category when available.
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: two-stage resolution (DB + label) is inherently branchy
export function detectSpatialCategory(
  label: string,
  dbCategory?: string | null
): SpatialCategory {
  const labelCat = detectByLabel(label);

  // If label gives a specific boundary sub-type, trust it over DB
  if (labelCat.startsWith('boundary-')) return labelCat;
  // If label gives railway (DB says transport), trust label
  if (labelCat === 'railway' || labelCat === 'road') {
    if (dbCategory?.toLowerCase() === 'transport') return labelCat;
  }

  // Use DB category if available and maps to something specific
  if (dbCategory) {
    const mapped = DB_CATEGORY_MAP[dbCategory.toLowerCase()];
    if (mapped) {
      // For transport, refine with label (road vs railway)
      if (mapped === 'road') return labelCat === 'railway' ? 'railway' : 'road';
      // For environment, refine with label
      if (mapped === 'waterway') return 'waterway';
      return mapped;
    }
  }

  return labelCat;
}

export function isBoundaryCategory(cat: SpatialCategory): boolean {
  return cat.startsWith('boundary-');
}

// ─── Boundary polygon styles ──────────────────────────────────────────────────
// These must match NoticeStatutoryMap LAYER_STYLE exactly.
// Ward=yellow, Municipality=orange, District=green.

export const BOUNDARY_STYLES: Record<
  'boundary-ward' | 'boundary-municipality' | 'boundary-district',
  L.PathOptions
> = {
  'boundary-ward': {
    color: '#facc15',
    weight: 2,
    opacity: 1,
    fillColor: '#facc15',
    fillOpacity: 0.12,
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
// Classic railway convention: dark line with tick marks via dashArray

export const RAILWAY_STYLE: L.PathOptions = {
  color: '#292524',
  weight: 3,
  opacity: 0.85,
  dashArray: '12 4',
};

// ─── Waterway style ───────────────────────────────────────────────────────────

export const WATERWAY_STYLE: L.PathOptions = {
  color: '#0ea5e9',
  weight: 2,
  opacity: 0.85,
  fillColor: '#0ea5e9',
  fillOpacity: 0.15,
};

// ─── Category colours ─────────────────────────────────────────────────────────

export const CATEGORY_COLOURS: Record<SpatialCategory, string> = {
  school: '#7c3aed',
  health: '#dc2626',
  education: '#2563eb',
  financial: '#059669',
  cultural: '#d97706',
  'populated-place': '#6b7280',
  poi: '#3b82f6',
  road: '#9ca3af',
  railway: '#292524',
  waterway: '#0ea5e9',
  'boundary-ward': '#facc15',
  'boundary-municipality': '#f97316',
  'boundary-district': '#22c55e',
  default: '#6b7280',
};

// ─── Icon sizes ───────────────────────────────────────────────────────────────

export const ICON_SIZE: Record<SpatialCategory, number> = {
  school: 22,
  health: 22,
  education: 20,
  financial: 18,
  cultural: 18,
  'populated-place': 16,
  poi: 16,
  road: 0,
  railway: 0,
  waterway: 0,
  'boundary-ward': 0,
  'boundary-municipality': 0,
  'boundary-district': 0,
  default: 16,
};

// ─── SVG icon builders ────────────────────────────────────────────────────────
// Lucide-style: 24×24 viewBox, 2px stroke, round caps/joins, no fill on strokes.

function wrap(inner: string, size: number, colour: string): string {
  return `<div style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.35))">
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="${colour}" opacity="0.95"/>
      ${inner}
    </svg>
  </div>`;
}

// School: building with roof peak
function schoolSvg(colour: string): string {
  return wrap(
    `<path d="M4 10L12 4L20 10V20H15V15H9V20H4V10Z" stroke="white" stroke-width="1.8" stroke-linejoin="round" fill="none"/>
     <rect x="10" y="15" width="4" height="5" rx="0.5" fill="white" opacity="0.8"/>
     <rect x="6" y="11" width="3" height="3" rx="0.5" fill="white" opacity="0.7"/>
     <rect x="15" y="11" width="3" height="3" rx="0.5" fill="white" opacity="0.7"/>`,
    22,
    colour
  );
}

// Health: cross in circle
function healthSvg(colour: string): string {
  return wrap(
    `<rect x="10.5" y="6" width="3" height="12" rx="1" fill="white"/>
     <rect x="6" y="10.5" width="12" height="3" rx="1" fill="white"/>`,
    22,
    colour
  );
}

// Education: open book
function educationSvg(colour: string): string {
  return wrap(
    `<path d="M4 6C4 6 8 5 12 7C16 5 20 6 20 6V18C20 18 16 17 12 19C8 17 4 18 4 18V6Z" stroke="white" stroke-width="1.8" stroke-linejoin="round" fill="none"/>
     <line x1="12" y1="7" x2="12" y2="19" stroke="white" stroke-width="1.5"/>`,
    20,
    colour
  );
}

// Financial: currency symbol in rounded square
function financialSvg(colour: string): string {
  return wrap(
    `<rect x="5" y="5" width="14" height="14" rx="3" stroke="white" stroke-width="1.8" fill="none"/>
     <path d="M12 8V9M12 15V16M9.5 10.5C9.5 9.7 10.6 9 12 9C13.4 9 14.5 9.7 14.5 10.5C14.5 11.3 13.4 12 12 12C10.6 12 9.5 12.7 9.5 13.5C9.5 14.3 10.6 15 12 15C13.4 15 14.5 14.3 14.5 13.5" stroke="white" stroke-width="1.6" stroke-linecap="round"/>`,
    18,
    colour
  );
}

// Cultural: classical building / museum columns
function culturalSvg(colour: string): string {
  return wrap(
    `<rect x="4" y="18" width="16" height="2" rx="0.5" fill="white"/>
     <rect x="4" y="8" width="16" height="2" rx="0.5" fill="white"/>
     <polygon points="12,4 4,8 20,8" fill="white"/>
     <rect x="6" y="10" width="2" height="8" rx="0.5" fill="white" opacity="0.8"/>
     <rect x="11" y="10" width="2" height="8" rx="0.5" fill="white" opacity="0.8"/>
     <rect x="16" y="10" width="2" height="8" rx="0.5" fill="white" opacity="0.8"/>`,
    18,
    colour
  );
}

// Populated place: concentric circles (settlement dot)
function populatedPlaceSvg(colour: string): string {
  return wrap(
    `<circle cx="12" cy="12" r="5" fill="white" opacity="0.9"/>
     <circle cx="12" cy="12" r="2.5" fill="${colour}"/>`,
    16,
    colour
  );
}

// Generic POI: location pin
function poiSvg(colour: string): string {
  return wrap(
    `<path d="M12 4C9.24 4 7 6.24 7 9C7 12.75 12 19 12 19C12 19 17 12.75 17 9C17 6.24 14.76 4 12 4Z" stroke="white" stroke-width="1.8" fill="none"/>
     <circle cx="12" cy="9" r="2" fill="white"/>`,
    16,
    colour
  );
}

// Default: simple dot
function defaultSvg(colour: string): string {
  return wrap(
    `<circle cx="12" cy="12" r="4" fill="white" opacity="0.9"/>`,
    16,
    colour
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
  poi: poiSvg,
  default: defaultSvg,
};

export function buildDivIcon(
  Leaf: typeof L,
  category: SpatialCategory,
  colour: string
): L.DivIcon {
  const size = ICON_SIZE[category] || 16;
  const builder = SVG_BUILDERS[category] ?? defaultSvg;
  return Leaf.divIcon({
    className: '',
    html: builder(colour),
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 2)],
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
  'FID',
  'Shape_Area',
  'Shape_Leng',
  'Shape__Area',
  'Shape__Length',
  'DATE',
  'DISTRICTCO',
]);

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
  WardNo: 'Ward number',
  CAT_B: 'Municipality code',
  MUNICNAME: 'Municipality',
  WardLink: 'Ward ID',
  DISTRICT: 'District',
  Province: 'Province',
  WardID: 'Ward ID (national)',
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
  title.style.cssText =
    'display:block;margin-bottom:4px;font-size:13px;color:#111827';
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
        'color:#6b7280;padding:1px 6px 1px 0;white-space:nowrap;font-size:10px;vertical-align:top';
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
