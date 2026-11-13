'use client';

import type L from 'leaflet';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  addFeatureCollection,
  addGeoJSON,
  addProximityCircle,
  addSiteMarker,
  createMap,
  fitToLayer,
  type GeoJSONGeometry,
  loadLeafletCss,
  syncLayerVisibility,
} from '@/lib/map/leaflet-utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type SpatialFeature = {
  type: 'Feature';
  geometry: GeoJSONGeometry;
  properties: Record<string, unknown>;
};

type MapLayer = {
  id: string;
  datasetId: string;
  label: string;
  colour: string;
  weight: number;
  fillOpacity: number;
  featureCount: number;
  returnedCount: number;
  loadOnDemand: boolean;
  features: SpatialFeature[];
  attribution: string | null;
  publishedAt: string | null;
  datasetDate: string | null;
  radiusFiltered: boolean;
};

type MapLayersResponse = {
  layers: MapLayer[];
  filterLat: number | null;
  filterLng: number | null;
  generatedAt: string;
};

type DatasetResult = {
  status:
    | 'found'
    | 'not-found'
    | 'unavailable'
    | 'pending-permission'
    | 'not-applicable';
  datasetName: string | null;
  attribution: string | null;
  datasetDate: string | null;
  featureCount: number;
  features: SpatialFeature[];
  note: string | null;
};

type WardDemographics = {
  WardID: string;
  WardNo: number;
  Ward_Label: string;
  CAT_B: string;
  Municipality: string;
  Total_Pop: number;
  Pop_Density: number;
  Employed: number;
  Unemployed: number;
  Discouraged_Work_Seeker: number;
  Not_Economically_Active: number;
  Not_Applicable_Emp: number;
  Unspecified_Emp: number;
  Grade_12_Std10: number;
  Higher: number;
  No_schooling: number;
  Not_Applicable_Edu: number;
  Flush_Toilet_SewerSystem: number;
  Flush_Toilet_SepticTank: number;
  Chemical_Toilet: number;
  Pit_Toilet_VIP: number;
  Pit_Toilet_NoVentilation: number;
  Bucket_Toilet: number;
  None_Toilet: number;
  Unspecified_Toilet: number;
  Tap_In_Dwelling: number;
  tap_in_Yard: number;
  No_access_to_piped_water: number;
  Unspecified_Water: number;
  Removed_Weekly: number;
  Removed_Seldom: number;
  Own_dump: number;
  No_Disposal: number;
  Unspecified_Refuse: number;
  Reg_Voters: number;
  Area_SqKm: number;
};

type NoticeContextResponse = {
  noticeType: string;
  wardNumber: number | null;
  catB: string | null;
  administrative: {
    ward: DatasetResult;
    municipality: DatasetResult;
    district: DatasetResult;
  };
  wardDemographics: WardDemographics | null;
  proximity: {
    traditionalAreas: DatasetResult;
    licensedPremises: DatasetResult;
    schools: DatasetResult;
    religiousInstitutions: DatasetResult;
    recreationFacilities: DatasetResult;
  };
  siteContext: {
    landUse: DatasetResult;
    cadastre: DatasetResult;
  };
  proximityRadiusMetres: number | null;
  proximityRadiusNote: string | null;
  generatedAt: string;
  disclaimer: string;
};

export type Props = {
  lat: number;
  lng: number;
  name: string;
  noticeType: string;
  locationPrecision?: string | null;
  wardBoundary?: {
    geometry: GeoJSONGeometry;
    source: string | null;
    date: string | null;
  } | null;
  siteBoundary?: {
    geometry: GeoJSONGeometry;
    source: string | null;
    date: string | null;
  } | null;
  wardName?: string | null;
  municipality?: string | null;
  mapDeepLink?: string | null;
  controlCentreUrl: string;
  wardNumber?: number | null;
  catB?: string | null;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const PRECISION_META: Record<string, { label: string; colour: string }> = {
  verified: { label: 'Verified coordinates', colour: '#16a34a' },
  'operator-provided': {
    label: 'Operator-provided location',
    colour: '#d97706',
  },
  approximate: { label: 'Approximate location', colour: '#dc2626' },
  'locality-only': { label: 'Locality association only', colour: '#6b7280' },
};

const LAYER_STYLE = {
  ward: {
    color: '#facc15',
    fillColor: '#facc15',
    weight: 3,
    fillOpacity: 0.2,
    opacity: 1,
  },
  municipality: {
    color: '#f97316',
    fillColor: '#f97316',
    weight: 2.5,
    fillOpacity: 0.15,
    opacity: 1,
  },
  district: {
    color: '#22c55e',
    fillColor: '#22c55e',
    weight: 2,
    fillOpacity: 0.08,
    opacity: 0.9,
  },
  site: {
    color: '#06b6d4',
    fillColor: '#06b6d4',
    weight: 3.5,
    fillOpacity: 0.28,
    opacity: 1,
  },
};

const STATUS_COLOUR: Record<string, string> = {
  found: 'bg-green-50 text-green-700 border-green-200',
  'not-found': 'bg-amber-50 text-amber-700 border-amber-200',
  unavailable: 'bg-gray-50 text-gray-500 border-gray-200',
  'pending-permission': 'bg-amber-50 text-amber-700 border-amber-200',
  'not-applicable': 'bg-gray-50 text-gray-400 border-gray-100',
};

const STATUS_LABEL: Record<string, string> = {
  found: 'Available',
  'not-found': 'Not matched',
  unavailable: 'Unavailable',
  'pending-permission': 'Pending permission',
  'not-applicable': 'Not applicable',
};

type LayerKey = 'ward' | 'municipality' | 'district' | 'proximity';

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: DatasetResult['status'] }) {
  return (
    <span
      className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded border ${STATUS_COLOUR[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function FindingRow({
  label,
  result,
  onFocus,
}: {
  label: string;
  result: DatasetResult;
  onFocus?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-800">{label}</span>
          <StatusBadge status={result.status} />
        </div>
        {result.status === 'found' && result.datasetName && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {result.datasetName}
          </p>
        )}
        {result.note && result.status !== 'found' && (
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
            {result.note}
          </p>
        )}
        {result.status === 'found' &&
          (result.attribution || result.datasetDate) && (
            <p className="text-[10px] text-gray-400 mt-0.5">
              {[result.attribution, result.datasetDate]
                .filter(Boolean)
                .join(' · ')}
            </p>
          )}
      </div>
      {result.status === 'found' && result.featureCount > 0 && onFocus && (
        <button
          type="button"
          onClick={onFocus}
          className="shrink-0 text-xs text-primary hover:underline font-medium"
        >
          View →
        </button>
      )}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide pt-4 pb-1 first:pt-0">
      {children}
    </p>
  );
}

function LayerToggleBar({
  visibility,
  onToggle,
  items,
}: {
  visibility: Record<LayerKey, boolean>;
  onToggle: (key: LayerKey) => void;
  items: Array<{ key: LayerKey; label: string; colour: string; show: boolean }>;
}) {
  return (
    <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-1">
      {items
        .filter((i) => i.show)
        .map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onToggle(item.key)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium bg-white/95 border shadow-sm transition-opacity ${
              visibility[item.key]
                ? 'border-gray-200 opacity-100'
                : 'border-gray-100 opacity-50'
            }`}
          >
            <span
              className="shrink-0 w-2.5 h-2.5 rounded-sm border"
              style={{
                background: visibility[item.key] ? item.colour : 'transparent',
                borderColor: item.colour,
              }}
            />
            {item.label}
          </button>
        ))}
    </div>
  );
}

// ─── Map helpers (module-level, no React, uses shared utils) ─────────────────

function buildSitePopup(
  name: string,
  precision: { label: string; colour: string } | null
) {
  return `<strong>${name}</strong>${precision ? `<br/><small style="color:${precision.colour}">${precision.label}</small>` : ''}`;
}

function addAdminLayers(
  Leaf: typeof L,
  map: L.Map,
  context: NoticeContextResponse,
  refs: Map<string, L.Layer>
) {
  const { municipality, district } = context.administrative;
  if (municipality.features.length && !refs.has('municipality')) {
    const l = addFeatureCollection(
      Leaf,
      map,
      municipality.features,
      LAYER_STYLE.municipality,
      (f, fl) => {
        const p = (f.properties ?? {}) as Record<string, unknown>;
        fl.bindTooltip(
          (p.NAMECODE as string) ?? (p.MUNICNAME as string) ?? 'Municipality',
          { sticky: true }
        );
      }
    );
    if (l) refs.set('municipality', l);
  }
  if (district.features.length && !refs.has('district')) {
    const l = addFeatureCollection(
      Leaf,
      map,
      district.features,
      LAYER_STYLE.district
    );
    if (l) {
      l.bindTooltip('Amajuba District Municipality (DC25)', { sticky: true });
      refs.set('district', l);
    }
  }
}

// ─── POI layer rendering (module-level to reduce component complexity) ──────

function renderPoiLayers(
  Leaf: typeof L,
  map: L.Map,
  mapLayers: MapLayer[],
  refs: Map<string, L.Layer>
) {
  for (const layer of mapLayers) {
    if (layer.loadOnDemand || !layer.features.length) continue;
    if (refs.has(`poi-${layer.id}`)) continue;
    const style: L.PathOptions = {
      color: layer.colour,
      fillColor: layer.colour,
      weight: layer.weight,
      fillOpacity: layer.fillOpacity,
      opacity: 0.9,
    };
    const l = addFeatureCollection(
      Leaf,
      map,
      layer.features,
      style,
      (f, fl) => {
        const p = (f.properties ?? {}) as Record<string, unknown>;
        const name =
          (p.name as string) ??
          (p.NAME as string) ??
          (p.amenity as string) ??
          layer.label;
        fl.bindTooltip(name, { sticky: true });
      }
    );
    if (l) refs.set(`poi-${layer.id}`, l);
  }
}

// ─── Map init (module-level to reduce component complexity) ─────────────────

type InitMapArgs = {
  Leaf: typeof L;
  container: HTMLDivElement;
  lat: number;
  lng: number;
  wardBoundary: Props['wardBoundary'];
  siteBoundary: Props['siteBoundary'];
  wardName: string | null | undefined;
  name: string;
  precision: { label: string; colour: string } | null;
  refs: Map<string, L.Layer>;
};

function initNoticeMap({
  Leaf,
  container,
  lat,
  lng,
  wardBoundary,
  siteBoundary,
  wardName,
  name,
  precision,
  refs,
}: InitMapArgs): L.Map {
  const map = createMap(Leaf, container, [lat, lng], 13);
  if (wardBoundary) {
    const l = addGeoJSON(
      Leaf,
      map,
      wardBoundary.geometry,
      LAYER_STYLE.ward,
      wardName ?? 'Ward'
    );
    if (l) {
      refs.set('ward', l);
      fitToLayer(map, l);
    }
  }
  if (siteBoundary) {
    const l = addGeoJSON(
      Leaf,
      map,
      siteBoundary.geometry,
      LAYER_STYLE.site,
      'Verified site boundary'
    );
    if (l) refs.set('site-boundary', l);
  }
  addSiteMarker(
    Leaf,
    map,
    lat,
    lng,
    buildSitePopup(name, precision),
    precision?.colour
  );
  return map;
}

// ─── Findings panel (extracted to reduce component complexity) ───────────────

function fmt(n: number | undefined): string {
  if (n == null) return '—';
  return n.toLocaleString('en-ZA');
}

function pct(part: number | undefined, total: number | undefined): string {
  if (part == null || total == null || total === 0) return '';
  return ` (${Math.round((part / total) * 100)}%)`;
}

function WardDemographicsPanel({
  d,
  datasetName,
  attribution,
}: {
  d: WardDemographics;
  datasetName: string;
  attribution: string;
}) {
  // Employment denominator: active labour force only (excludes children/elderly)
  const activeLF = d.Employed + d.Unemployed + d.Discouraged_Work_Seeker;
  const formalToilet =
    d.Flush_Toilet_SewerSystem +
    d.Flush_Toilet_SepticTank +
    d.Chemical_Toilet +
    d.Pit_Toilet_VIP;
  const pipedWater = d.Tap_In_Dwelling + d.tap_in_Yard;
  // Unspecified counts — non-zero means data quality caveat applies
  const hasUnspecified =
    d.Unspecified_Toilet > 0 ||
    d.Unspecified_Water > 0 ||
    d.Unspecified_Refuse > 0 ||
    d.Unspecified_Emp > 0;
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50/40 p-3 space-y-3 text-xs">
      <div className="flex items-start justify-between gap-2">
        <span className="font-semibold text-gray-700">
          {d.Ward_Label} — {d.Municipality}
        </span>
        <span className="shrink-0 text-[10px] text-blue-600 font-medium bg-blue-100 px-1.5 py-0.5 rounded">
          Census 2021
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-600">
        <div>
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">
            Population
          </p>
          <p>{fmt(d.Total_Pop)} residents</p>
          <p className="text-gray-400">{fmt(d.Pop_Density)} per km²</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">
            Employment
          </p>
          {/* Denominator: active labour force (Emp + Unemp + Discouraged). Excludes Not_Applicable_Emp (children/elderly). */}
          <p>
            Employed: {fmt(d.Employed)}
            {pct(d.Employed, activeLF)}
          </p>
          <p>
            Unemployed: {fmt(d.Unemployed)}
            {pct(d.Unemployed, activeLF)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5 mt-1">
            Sanitation
          </p>
          {/* Denominator: Total_Pop (household-level, per person) */}
          <p>
            Formal: {fmt(formalToilet)}
            {pct(formalToilet, d.Total_Pop)}
          </p>
          <p>
            None: {fmt(d.None_Toilet)}
            {pct(d.None_Toilet, d.Total_Pop)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5 mt-1">
            Water access
          </p>
          {/* Denominator: Total_Pop */}
          <p>
            Piped: {fmt(pipedWater)}
            {pct(pipedWater, d.Total_Pop)}
          </p>
          <p>
            No access: {fmt(d.No_access_to_piped_water)}
            {pct(d.No_access_to_piped_water, d.Total_Pop)}
          </p>
        </div>
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] text-gray-400">
          Registered voters: {fmt(d.Reg_Voters)} · Area: {fmt(d.Area_SqKm)} km²
        </p>
        {hasUnspecified && (
          <p className="text-[10px] text-amber-600">
            Some responses unspecified in source data — percentages exclude
            unspecified counts.
          </p>
        )}
        <p className="text-[10px] text-gray-400">
          {datasetName} · {attribution}
        </p>
      </div>
    </div>
  );
}

function FindingsPanel({
  loading,
  context,
  noticeType,
  lat,
  lng,
  name,
  precision,
  wardName,
  municipality,
  focusLayer,
}: {
  loading: boolean;
  context: NoticeContextResponse | null;
  noticeType: string;
  lat: number;
  lng: number;
  name: string;
  precision: { label: string; colour: string } | null;
  wardName: string | null | undefined;
  municipality: string | null | undefined;
  focusLayer: (key: string) => void;
}) {
  if (loading) {
    return (
      <div className="px-4 py-6 text-center text-sm text-gray-400">
        Loading spatial context…
      </div>
    );
  }
  if (!context) {
    return (
      <div className="px-4 py-4 text-sm text-gray-400">
        Spatial context unavailable. The notice and its geographic associations
        are shown above.
      </div>
    );
  }
  const pendingCount = Object.values(context.proximity).filter(
    (r) => r.status === 'pending-permission'
  ).length;
  return (
    <div className="divide-y divide-gray-50">
      <div className="px-4 py-4">
        <SectionHeading>Proposed site</SectionHeading>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 space-y-1.5">
          <div className="flex items-center gap-2">
            <span
              className="shrink-0 w-3 h-3 rounded-full border-2 border-white shadow"
              style={{ background: precision?.colour ?? '#dc2626' }}
            />
            <span className="text-sm font-medium text-gray-800 truncate">
              {name}
            </span>
          </div>
          <div className="text-xs text-gray-500 space-y-0.5 pl-5">
            <p>
              {lat.toFixed(5)}, {lng.toFixed(5)}
            </p>
            {precision && (
              <p style={{ color: precision.colour }}>{precision.label}</p>
            )}
            {wardName && <p>{wardName}</p>}
            {municipality && <p>{municipality}</p>}
          </div>
        </div>
      </div>
      <div className="px-4 py-4">
        <SectionHeading>Administrative context</SectionHeading>
        <FindingRow
          label="Ward boundary"
          result={context.administrative.ward}
          onFocus={() => focusLayer('ward')}
        />
        <FindingRow
          label="Local municipality"
          result={context.administrative.municipality}
          onFocus={() => focusLayer('municipality')}
        />
        <FindingRow
          label="District municipality"
          result={context.administrative.district}
          onFocus={() => focusLayer('district')}
        />
        {context.wardDemographics && (
          <div className="mt-3">
            <WardDemographicsPanel
              d={context.wardDemographics}
              datasetName="MDB WardProfile 2021"
              attribution="Municipal Demarcation Board (MDB) — public domain"
            />
          </div>
        )}
      </div>
      {noticeType === 'liquor' && (
        <div className="px-4 py-4">
          <SectionHeading>
            Proximity context (statutory considerations)
          </SectionHeading>
          {context.proximityRadiusNote && (
            <p className="text-[10px] text-amber-600 mb-2 leading-relaxed">
              {context.proximityRadiusNote}
            </p>
          )}
          <FindingRow
            label="Traditional authority / community area"
            result={context.proximity.traditionalAreas}
          />
          <FindingRow
            label="Existing licensed premises"
            result={context.proximity.licensedPremises}
          />
          <FindingRow
            label="Learning institutions"
            result={context.proximity.schools}
          />
          <FindingRow
            label="Religious institutions"
            result={context.proximity.religiousInstitutions}
          />
          <FindingRow
            label="Public recreation facilities"
            result={context.proximity.recreationFacilities}
          />
        </div>
      )}
      <div className="px-4 py-4">
        <SectionHeading>Site context</SectionHeading>
        <FindingRow
          label="Zoning / land-use scheme"
          result={context.siteContext.landUse}
        />
        <FindingRow
          label="Property / cadastral boundary"
          result={context.siteContext.cadastre}
        />
      </div>
      {pendingCount > 0 && (
        <div className="px-4 py-3 bg-amber-50">
          <p className="text-xs text-amber-700 leading-relaxed">
            <span className="font-semibold">
              {pendingCount} statutory layer{pendingCount !== 1 ? 's' : ''}{' '}
              pending.
            </span>{' '}
            Data permission not yet confirmed. Absence of a dataset does not
            imply absence of relevant features.
          </p>
        </div>
      )}
      <div className="px-4 py-3 rounded-b-xl">
        <p className="text-[10px] text-gray-400 leading-relaxed">
          {context.disclaimer}
        </p>
        <p className="text-[10px] text-gray-400 mt-1">
          Generated: {new Date(context.generatedAt).toLocaleString('en-ZA')}
        </p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function NoticeStatutoryMap({
  lat,
  lng,
  name,
  noticeType,
  locationPrecision,
  wardBoundary,
  siteBoundary,
  wardName,
  municipality,
  mapDeepLink,
  controlCentreUrl,
  wardNumber,
  catB,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerRefs = useRef<Map<string, L.Layer>>(new Map());

  const [context, setContext] = useState<NoticeContextResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapLayers, setMapLayers] = useState<MapLayer[]>([]);
  const [visibility, setVisibility] = useState<Record<LayerKey, boolean>>({
    ward: true,
    municipality: true,
    district: true,
    proximity: true,
  });

  const precision = PRECISION_META[locationPrecision ?? ''] ?? null;

  // Fetch POI/infrastructure layers from CC — pass location + notice type for radius filtering
  useEffect(() => {
    const params = new URLSearchParams({ noticeType });
    params.set('lat', String(lat));
    params.set('lng', String(lng));
    fetch(`${controlCentreUrl}/api/spatial/map-layers?${params}`)
      .then((r) => (r.ok ? (r.json() as Promise<MapLayersResponse>) : null))
      .then((data) => {
        if (data) setMapLayers(data.layers);
      })
      .catch(() => {});
  }, [controlCentreUrl, lat, lng, noticeType]);

  // Fetch structured spatial context from CC
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ noticeType });
    if (wardNumber != null) params.set('wardNumber', String(wardNumber));
    if (catB) params.set('catB', catB);
    params.set('lat', String(lat));
    params.set('lng', String(lng));
    if (locationPrecision) params.set('locationPrecision', locationPrecision);
    fetch(`${controlCentreUrl}/api/spatial/notice-context?${params}`)
      .then((r) => (r.ok ? (r.json() as Promise<NoticeContextResponse>) : null))
      .then((data) => {
        if (data) setContext(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [
    noticeType,
    controlCentreUrl,
    wardNumber,
    catB,
    lat,
    lng,
    locationPrecision,
  ]);

  // Focus map on a named layer
  const focusLayer = useCallback((key: string) => {
    const map = mapInstanceRef.current;
    const layer = layerRefs.current.get(key);
    if (!map || !layer || !('getBounds' in layer)) return;
    fitToLayer(map, layer as L.GeoJSON);
  }, []);

  // Init map once
  useEffect(() => {
    if (!mapRef.current) return;
    loadLeafletCss();
    let cancelled = false;
    import('leaflet').then((Leaf) => {
      if (cancelled || !mapRef.current) return;
      mapInstanceRef.current?.remove();
      layerRefs.current.clear();
      mapInstanceRef.current = initNoticeMap({
        Leaf,
        container: mapRef.current,
        lat,
        lng,
        wardBoundary,
        siteBoundary,
        wardName,
        name,
        precision,
        refs: layerRefs.current,
      });
    });
    return () => {
      cancelled = true;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
      layerRefs.current.clear();
    };
  }, [lat, lng, name, wardBoundary, siteBoundary, wardName, precision]);

  // Render POI/infrastructure layers when they arrive
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLayers.length) return;
    import('leaflet').then((Leaf) => {
      renderPoiLayers(Leaf, map, mapLayers, layerRefs.current);
    });
  }, [mapLayers]);

  // Add admin layers and proximity circle when context arrives
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !context) return;
    import('leaflet').then((Leaf) => {
      addAdminLayers(Leaf, map, context, layerRefs.current);
      // Proximity circle: only drawn when the statutory profile specifies a radius.
      // Not drawn unconditionally — absence of a radius means no applicable criterion.
      const radius = context.proximityRadiusMetres;
      if (radius != null && !layerRefs.current.has('proximity')) {
        const precisionNote = precision
          ? ` (${precision.label})`
          : ' (location precision unverified)';
        const label = `${radius}m illustrative context radius${precisionNote}`;
        const circle = addProximityCircle(Leaf, map, lat, lng, radius, label);
        layerRefs.current.set('proximity', circle);
      }
    });
  }, [context, lat, lng, precision]);

  // Sync visibility
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    for (const [key, layer] of layerRefs.current) {
      if (key in visibility)
        syncLayerVisibility(map, layer, visibility[key as LayerKey]);
    }
  }, [visibility]);

  function toggleVisibility(key: LayerKey) {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const hasMunicipality =
    (context?.administrative.municipality.featureCount ?? 0) > 0;
  const hasDistrict = (context?.administrative.district.featureCount ?? 0) > 0;
  const proximityMetres = context?.proximityRadiusMetres ?? null;

  const toggleItems: Array<{
    key: LayerKey;
    label: string;
    colour: string;
    show: boolean;
  }> = [
    {
      key: 'ward',
      label: 'Ward',
      colour: LAYER_STYLE.ward.color,
      show: !!wardBoundary,
    },
    {
      key: 'municipality',
      label: 'Municipality',
      colour: LAYER_STYLE.municipality.color,
      show: hasMunicipality,
    },
    {
      key: 'district',
      label: 'District',
      colour: LAYER_STYLE.district.color,
      show: hasDistrict,
    },
    {
      key: 'proximity',
      label: `${proximityMetres}m context`,
      colour: '#dc2626',
      // Only show toggle when the statutory profile specifies a radius
      show: proximityMetres != null,
    },
  ];

  return (
    <div className="space-y-0">
      {/* Zone A — Map */}
      <div
        className="relative w-full rounded-t-xl overflow-hidden border border-gray-200 border-b-0 shadow-sm"
        style={{ height: 400 }}
      >
        <div ref={mapRef} className="absolute inset-0" />
        <LayerToggleBar
          visibility={visibility}
          onToggle={toggleVisibility}
          items={toggleItems}
        />
        {mapDeepLink && (
          <a
            href={mapDeepLink}
            className="absolute bottom-3 right-3 z-[1000] bg-white/95 border border-gray-200 shadow rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Full map →
          </a>
        )}
        {!siteBoundary && locationPrecision !== 'verified' && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] text-gray-500 shadow whitespace-nowrap">
            Operator-provided location — ward boundary is geographic context
            only
          </div>
        )}
      </div>

      {/* Zone B — Structured spatial findings */}
      <div className="rounded-b-xl border border-gray-200 border-t bg-white shadow-sm">
        <FindingsPanel
          loading={loading}
          context={context}
          noticeType={noticeType}
          lat={lat}
          lng={lng}
          name={name}
          precision={precision}
          wardName={wardName}
          municipality={municipality}
          focusLayer={focusLayer}
        />
      </div>
    </div>
  );
}
