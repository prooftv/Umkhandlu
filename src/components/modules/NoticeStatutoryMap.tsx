'use client';

import type L from 'leaflet';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
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
import type { SpatialMapBounds } from '@/lib/spatial/map-layers';
import { toggleSpatialDatasetSelection } from '@/lib/spatial/map-layers';
import { renderSpatialMapLayers } from '@/lib/spatial/render-map-layers';
import { useSpatialMapLayers } from '@/lib/spatial/use-spatial-map-layers';
import SpatialLayerControls from './SpatialLayerControls';

// ─── Types ────────────────────────────────────────────────────────────────────

type SpatialFeature = {
  type: 'Feature';
  id: string;
  geometry: GeoJSONGeometry;
  properties: Record<string, unknown>;
};

type SpatialContextLayer = {
  features: SpatialFeature[];
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
    municipality: SpatialContextLayer;
    district: SpatialContextLayer;
    ward: SpatialContextLayer;
  };
  wardDemographics: WardDemographics | null;
  proximity: {
    traditionalAreas: SpatialContextLayer;
    licensedPremises: SpatialContextLayer;
    schools: SpatialContextLayer;
    religiousInstitutions: SpatialContextLayer;
    recreationFacilities: SpatialContextLayer;
  };
  siteContext: {
    landUse: SpatialContextLayer;
    cadastre: SpatialContextLayer;
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

function useNoticeSpatialContext({
  noticeType,
  controlCentreUrl,
  wardNumber,
  catB,
  lat,
  lng,
  locationPrecision,
}: {
  noticeType: string;
  controlCentreUrl: string;
  wardNumber?: number | null;
  catB?: string | null;
  lat: number;
  lng: number;
  locationPrecision?: string | null;
}) {
  const [context, setContext] = useState<NoticeContextResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [contextError, setContextError] = useState<string | null>(null);
  const [contextRetry, setContextRetry] = useState(0);

  useEffect(() => {
    setLoading(true);
    setContext(null);
    setContextError(null);
    const controller = new AbortController();
    let active = true;
    const params = new URLSearchParams({ noticeType });
    if (wardNumber != null) params.set('wardNumber', String(wardNumber));
    if (catB) params.set('catB', catB);
    params.set('lat', String(lat));
    params.set('lng', String(lng));
    if (locationPrecision) params.set('locationPrecision', locationPrecision);
    if (contextRetry > 0) params.set('_retry', String(contextRetry));
    fetch(`${controlCentreUrl}/api/spatial/notice-context?${params}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const body = (await response.json()) as
          | NoticeContextResponse
          | { error?: string };
        if (!response.ok) {
          throw new Error(
            'error' in body && body.error
              ? body.error
              : `Notice spatial context request failed (${response.status})`
          );
        }
        return body as NoticeContextResponse;
      })
      .then((data) => {
        if (active) setContext(data);
      })
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === 'AbortError')
          return;
        if (active) {
          setContextError(
            cause instanceof Error
              ? cause.message
              : 'Notice spatial context is unavailable'
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [
    noticeType,
    controlCentreUrl,
    wardNumber,
    catB,
    lat,
    lng,
    locationPrecision,
    contextRetry,
  ]);

  return {
    context,
    loading,
    contextError,
    retryContext: () => setContextRetry((current) => current + 1),
  };
}

function useNoticeMapInitialization({
  mapRef,
  mapInstanceRef,
  layerRefs,
  lat,
  lng,
  name,
  wardBoundary,
  siteBoundary,
  wardName,
  precision,
  setMapReady,
  setMapViewport,
}: {
  mapRef: { current: HTMLDivElement | null };
  mapInstanceRef: { current: L.Map | null };
  layerRefs: { current: Map<string, L.Layer> };
  lat: number;
  lng: number;
  name: string;
  wardBoundary: Props['wardBoundary'];
  siteBoundary: Props['siteBoundary'];
  wardName: string | null | undefined;
  precision: { label: string; colour: string } | null;
  setMapReady: Dispatch<SetStateAction<boolean>>;
  setMapViewport: Dispatch<SetStateAction<SpatialMapBounds | null>>;
}) {
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
      const map = mapInstanceRef.current;
      const updateViewport = () => {
        const bounds = map.getBounds();
        setMapViewport({
          west: bounds.getWest(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          north: bounds.getNorth(),
        });
      };
      map.on('moveend', updateViewport);
      updateViewport();
      setMapReady(true);
    });
    return () => {
      cancelled = true;
      setMapReady(false);
      setMapViewport(null);
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
      layerRefs.current.clear();
    };
  }, [
    lat,
    lng,
    name,
    wardBoundary,
    siteBoundary,
    wardName,
    precision,
    mapRef,
    mapInstanceRef,
    layerRefs,
    setMapReady,
    setMapViewport,
  ]);
}

function useNoticeSpatialMapRendering({
  mapInstanceRef,
  layerRefs,
  mapReady,
  mapLayers,
  spatialVisibility,
  context,
  reliableSiteLocation,
  precision,
  lat,
  lng,
  visibility,
}: {
  mapInstanceRef: { current: L.Map | null };
  layerRefs: { current: Map<string, L.Layer> };
  mapReady: boolean;
  mapLayers: ReturnType<typeof useSpatialMapLayers>['layers'];
  spatialVisibility: Record<string, boolean>;
  context: NoticeContextResponse | null;
  reliableSiteLocation: boolean;
  precision: { label: string; colour: string } | null;
  lat: number;
  lng: number;
  visibility: Record<LayerKey, boolean>;
}) {
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!mapReady || !map) return;
    import('leaflet').then((Leaf) => {
      renderSpatialMapLayers({
        Leaf,
        map,
        layers: mapLayers,
        visibility: spatialVisibility,
        renderedLayers: layerRefs.current,
        prefix: 'data:',
      });
    });
  }, [mapLayers, mapReady, spatialVisibility, mapInstanceRef, layerRefs]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!mapReady || !map || !context) return;
    import('leaflet').then((Leaf) => {
      addAdminLayers(Leaf, map, context, layerRefs.current);
      const radius = context.proximityRadiusMetres;
      if (
        radius != null &&
        reliableSiteLocation &&
        !layerRefs.current.has('proximity')
      ) {
        const label = `${radius}m illustrative context radius (${precision?.label})`;
        const circle = addProximityCircle(Leaf, map, lat, lng, radius, label);
        layerRefs.current.set('proximity', circle);
      }
    });
  }, [
    context,
    lat,
    lng,
    mapReady,
    precision,
    reliableSiteLocation,
    mapInstanceRef,
    layerRefs,
  ]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    for (const [key, layer] of layerRefs.current) {
      if (key in visibility) {
        syncLayerVisibility(map, layer, visibility[key as LayerKey]);
      }
    }
  }, [visibility, mapInstanceRef, layerRefs]);
}

function NoticeSpatialStatus({
  mapLayersError,
  mapLayersPermissionNotice,
  mapLayersLoading,
  contextError,
  loading,
  onRetry,
}: {
  mapLayersError: string | null;
  mapLayersPermissionNotice: boolean;
  mapLayersLoading: boolean;
  contextError: string | null;
  loading: boolean;
  onRetry: () => void;
}) {
  if (
    !mapLayersError &&
    !mapLayersPermissionNotice &&
    !mapLayersLoading &&
    !contextError &&
    !loading
  ) {
    return null;
  }

  let message =
    'Some spatial data is withheld pending redistribution permission verification.';
  if (contextError) {
    message = `Notice spatial context unavailable: ${contextError}`;
  } else if (mapLayersError) {
    message = `Spatial layers unavailable: ${mapLayersError}`;
  } else if (loading) {
    message = 'Loading notice spatial context…';
  } else if (mapLayersLoading) {
    message = 'Loading spatial layers for this map view…';
  }

  return (
    <div
      role={contextError || mapLayersError ? 'alert' : 'status'}
      className="absolute bottom-3 left-3 z-[1000] max-w-[55%] rounded bg-white/95 px-2.5 py-1.5 text-[10px] text-amber-800 shadow"
    >
      {message}
      {contextError && (
        <button type="button" onClick={onRetry} className="ml-2 underline">
          Retry notice context
        </button>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: SpatialContextLayer['status'] }) {
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
  result: SpatialContextLayer;
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
    <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1">
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
  const content = document.createElement('div');
  const title = document.createElement('strong');
  title.textContent = name;
  content.append(title);
  if (precision) {
    const label = document.createElement('small');
    label.className = 'block';
    label.style.color = precision.colour;
    label.textContent = precision.label;
    content.append(label);
  }
  return content;
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
  const [mapReady, setMapReady] = useState(false);
  const [mapViewport, setMapViewport] = useState<SpatialMapBounds | null>(null);

  const { context, loading, contextError, retryContext } =
    useNoticeSpatialContext({
      noticeType,
      controlCentreUrl,
      wardNumber,
      catB,
      lat,
      lng,
      locationPrecision,
    });
  const [selectedDatasetIds, setSelectedDatasetIds] = useState<
    string[] | undefined
  >(undefined);
  const {
    layers: mapLayers,
    loading: mapLayersLoading,
    error: mapLayersError,
    permissionFiltered: mapLayersPermissionNotice,
    retry: retryMapLayers,
  } = useSpatialMapLayers({
    controlCentreUrl,
    bounds: mapViewport,
    datasetIds: selectedDatasetIds,
    enabled: mapReady,
  });
  const [spatialVisibility, setSpatialVisibility] = useState<
    Record<string, boolean>
  >({});
  const [visibility, setVisibility] = useState<Record<LayerKey, boolean>>({
    ward: true,
    municipality: true,
    district: true,
    proximity: true,
  });

  const precision = PRECISION_META[locationPrecision ?? ''] ?? null;
  const reliableSiteLocation =
    locationPrecision === 'verified' ||
    locationPrecision === 'operator-provided';

  useNoticeMapInitialization({
    mapRef,
    mapInstanceRef,
    layerRefs,
    lat,
    lng,
    name,
    wardBoundary,
    siteBoundary,
    wardName,
    precision,
    setMapReady,
    setMapViewport,
  });

  useNoticeSpatialMapRendering({
    mapInstanceRef,
    layerRefs,
    mapReady,
    mapLayers,
    spatialVisibility,
    context,
    reliableSiteLocation,
    precision,
    lat,
    lng,
    visibility,
  });

  // Focus map on a named layer
  const focusLayer = useCallback((key: string) => {
    const map = mapInstanceRef.current;
    const layer = layerRefs.current.get(key);
    if (!map || !layer || !('getBounds' in layer)) return;
    fitToLayer(map, layer as L.GeoJSON);
  }, []);

  function toggleVisibility(key: LayerKey) {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleSpatialLayer(layerId: string) {
    setSpatialVisibility((prev) => ({
      ...prev,
      [layerId]: !(prev[layerId] ?? true),
    }));
    setSelectedDatasetIds((current) =>
      toggleSpatialDatasetSelection(current, mapLayers, layerId)
    );
  }

  const hasMunicipality =
    (context?.administrative.municipality.features.length ?? 0) > 0;
  const hasDistrict =
    (context?.administrative.district.features.length ?? 0) > 0;
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
      show: proximityMetres != null && reliableSiteLocation,
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
        <SpatialLayerControls
          layers={mapLayers}
          visibility={spatialVisibility}
          onToggle={toggleSpatialLayer}
          error={mapLayersError}
          onRetry={retryMapLayers}
        />
        <NoticeSpatialStatus
          mapLayersError={mapLayersError}
          mapLayersPermissionNotice={mapLayersPermissionNotice}
          mapLayersLoading={mapLayersLoading}
          contextError={contextError}
          loading={loading}
          onRetry={retryContext}
        />
        {mapDeepLink && (
          <a
            href={mapDeepLink}
            className="absolute bottom-3 right-3 z-[1000] bg-white/95 border border-gray-200 shadow rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Full map →
          </a>
        )}
        {context && (
          <details className="absolute bottom-14 right-3 z-[1000] max-h-[min(70vh,24rem)] w-[min(24rem,90vw)] overflow-y-auto rounded-lg border border-gray-200 bg-white/95 shadow-lg backdrop-blur">
            <summary className="sticky top-0 cursor-pointer bg-white/95 px-3 py-2 text-xs font-semibold shadow-sm">
              Spatial context details
            </summary>
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
          </details>
        )}
      </div>
    </div>
  );
}
