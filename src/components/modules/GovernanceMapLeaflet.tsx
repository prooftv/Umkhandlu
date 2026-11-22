'use client';

import type L from 'leaflet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  type BasemapId,
  createMap,
  loadLeafletCss,
  switchBasemap,
  syncLayerVisibility,
} from '@/lib/map/leaflet-utils';
import type { SpatialMapBounds } from '@/lib/spatial/map-layers';
import { toggleSpatialDatasetSelection } from '@/lib/spatial/map-layers';
import {
  deduplicateBoundaryLayers,
  renderSpatialMapLayers,
} from '@/lib/spatial/render-map-layers';
import { detectSpatialCategory } from '@/lib/spatial/spatial-icons';
import { useSpatialMapLayers } from '@/lib/spatial/use-spatial-map-layers';
import SpatialLayerControls from './SpatialLayerControls';

export interface MapRecord {
  id: string;
  slug: string;
  label: string;
  type: 'record' | 'notice' | 'project';
  subtype: string;
  date: string | null;
  status: string | null;
  municipality: string | null;
  ward: number | null;
}

export interface MapBoundary {
  slug: string;
  name: string;
  areaLevel: string | null;
  municipality: string | null;
  wardNumber: number | null;
  indunaName: string | null;
  indunaSlug: string | null;
  recordCount: number;
  noticeCount: number;
  campaignCount: number;
  boundary: { type: string; coordinates: unknown };
  boundarySource: string | null;
  boundaryDate: string | null;
  boundaryPermission: string | null;
}

type BoundaryKey = 'ward' | 'municipality' | 'district';

const BOUNDARY_COLOURS: Record<BoundaryKey, string> = {
  ward: '#facc15',
  municipality: '#f97316',
  district: '#22c55e',
};

// Must be strictly less than both API limits: map-layers (5°) and features (2°).
const MAX_VIEWPORT_SPAN = 1.9;

function clampViewportBounds(map: L.Map): SpatialMapBounds {
  const b = map.getBounds();
  const west = b.getWest();
  const south = b.getSouth();
  const east = b.getEast();
  const north = b.getNorth();
  const midLon = (west + east) / 2;
  const midLat = (south + north) / 2;
  const lonSpan = east - west;
  const latSpan = north - south;
  return {
    west: lonSpan > MAX_VIEWPORT_SPAN ? midLon - MAX_VIEWPORT_SPAN / 2 : west,
    south: latSpan > MAX_VIEWPORT_SPAN ? midLat - MAX_VIEWPORT_SPAN / 2 : south,
    east: lonSpan > MAX_VIEWPORT_SPAN ? midLon + MAX_VIEWPORT_SPAN / 2 : east,
    north: latSpan > MAX_VIEWPORT_SPAN ? midLat + MAX_VIEWPORT_SPAN / 2 : north,
  };
}

interface Props {
  records: MapRecord[];
  boundaries: MapBoundary[];
  zoom: number;
  initialWard?: string | null; // WardLink slug e.g. KZN253_7 — auto-selects on mount
  controlCentreUrl: string;
}

const TYPE_COLOUR: Record<string, string> = {
  record: '#7c3aed',
  notice: '#0891b2',
  project: '#16a34a',
};

const TYPE_LABEL: Record<string, string> = {
  record: 'Records',
  notice: 'Dev Notices',
  project: 'Campaigns',
};

const TYPE_PATH: Record<string, string> = {
  record: '/records',
  notice: '/development-notices',
  project: '/campaigns',
};

function initMapWithCoverage(
  Leaf: typeof L,
  container: HTMLDivElement,
  coverage: L.LatLngBounds,
  zoom: number,
  boundaries: MapBoundary[],
  initialWard?: string | null
): L.Map {
  const centre = coverage.getCenter();
  const map = createMap(Leaf, container, [centre.lat, centre.lng], zoom, {
    scrollWheelZoom: true,
  });
  // Fit to deep-linked ward if present, otherwise fit full coverage
  const wardMatch = initialWard
    ? boundaries.find((b) => b.slug === initialWard)
    : null;
  if (wardMatch) {
    try {
      const wardBounds = Leaf.geoJSON({
        type: 'Feature',
        geometry: wardMatch.boundary,
        properties: {},
      } as GeoJSON.Feature).getBounds();
      if (wardBounds.isValid())
        map.fitBounds(wardBounds, { padding: [60, 60], maxZoom: 13 });
      else map.fitBounds(coverage, { padding: [60, 60], maxZoom: zoom });
    } catch {
      map.fitBounds(coverage, { padding: [60, 60], maxZoom: zoom });
    }
  } else {
    map.fitBounds(coverage, { padding: [60, 60], maxZoom: zoom });
  }
  return map;
}

function getBoundaryCoverage(
  Leaf: typeof L,
  boundaries: MapBoundary[]
): L.LatLngBounds {
  const coverage = Leaf.latLngBounds([]);
  for (const boundary of boundaries) {
    try {
      const geometry = Leaf.geoJSON({
        type: 'Feature',
        geometry: boundary.boundary,
        properties: {},
      } as GeoJSON.Feature);
      const bounds = geometry.getBounds();
      if (bounds.isValid()) coverage.extend(bounds);
    } catch {
      // Invalid boundaries are skipped; valid boundaries still define the map extent.
    }
  }
  return coverage;
}

function TypePill({
  type,
  active,
  count,
  onClick,
}: {
  type: string;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all"
      style={
        active
          ? {
              background: TYPE_COLOUR[type],
              color: '#fff',
              borderColor: TYPE_COLOUR[type],
            }
          : { background: '#fff', color: '#6b7280', borderColor: '#e5e7eb' }
      }
    >
      <span
        className="inline-block shrink-0"
        style={{
          width: 8,
          height: 8,
          borderRadius: type === 'project' ? 1 : '50%',
          background: active ? '#fff' : TYPE_COLOUR[type],
        }}
      />
      {TYPE_LABEL[type]} <span className="opacity-70">{count}</span>
    </button>
  );
}

function RecordDetail({ rec }: { rec: MapRecord }) {
  return (
    <div className="p-3 space-y-2 overflow-y-auto flex-1">
      <span
        className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded"
        style={{
          background: `${TYPE_COLOUR[rec.type]}18`,
          color: TYPE_COLOUR[rec.type],
        }}
      >
        {rec.subtype}
      </span>
      <p className="text-sm font-semibold leading-snug">{rec.label}</p>
      <div className="space-y-0.5 text-xs text-gray-500">
        {rec.municipality && <p>{rec.municipality}</p>}
        {rec.ward != null && <p>Ward {rec.ward}</p>}
        {rec.status && <p className="capitalize">{rec.status}</p>}
        {rec.date && <p>{new Date(rec.date).toLocaleDateString()}</p>}
      </div>
      <a
        href={`${TYPE_PATH[rec.type]}/${rec.slug}`}
        className="inline-block mt-1 text-xs font-medium text-primary hover:underline"
      >
        View full record →
      </a>
    </div>
  );
}

function ItemList({
  boundaries,
  filtered,
  onSelectArea,
  onSelectRecord,
}: {
  boundaries: MapBoundary[];
  filtered: MapRecord[];
  onSelectArea: (b: MapBoundary) => void;
  onSelectRecord: (r: MapRecord) => void;
}) {
  return (
    <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
      {boundaries.length > 0 && (
        <div className="px-3 py-2 bg-gray-50">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Areas — tap boundary to explore
          </p>
          {boundaries.map((b) => (
            <button
              key={b.slug}
              type="button"
              onClick={() => onSelectArea(b)}
              className="w-full text-left flex items-center justify-between py-1.5 hover:text-primary transition-colors"
            >
              <span className="text-xs text-gray-700">{b.name}</span>
              <span className="text-[10px] text-gray-400">
                {b.recordCount + b.noticeCount + b.campaignCount} items →
              </span>
            </button>
          ))}
        </div>
      )}
      {filtered.length === 0 ? (
        <p className="p-4 text-xs text-gray-400 text-center">
          No items match your filters.
        </p>
      ) : (
        filtered.map((rec) => (
          <button
            key={rec.id}
            type="button"
            onClick={() => onSelectRecord(rec)}
            className="w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-2">
              <span
                className="mt-1 shrink-0"
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: rec.type === 'project' ? 1 : '50%',
                  background: TYPE_COLOUR[rec.type],
                }}
              />
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-800 leading-snug truncate">
                  {rec.label}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {rec.subtype}
                  {rec.municipality ? ` · ${rec.municipality}` : ''}
                  {rec.date
                    ? ` · ${new Date(rec.date).toLocaleDateString()}`
                    : ''}
                </p>
              </div>
            </div>
          </button>
        ))
      )}
    </div>
  );
}

const AREA_LEVEL_LABELS: Record<string, string> = {
  district: 'District Municipality',
  municipality: 'Local Municipality',
  ward: 'Ward',
  'traditional-authority': 'Traditional Authority',
  isigodi: 'Isigodi',
  settlement: 'Settlement',
};

function AreaPanel({
  area,
  onClose,
}: {
  area: MapBoundary;
  onClose: () => void;
}) {
  const total = area.recordCount + area.noticeCount + area.campaignCount;
  return (
    <div className="p-3 space-y-3 overflow-y-auto flex-1">
      <div className="flex items-start justify-between gap-2">
        <div>
          {area.areaLevel && (
            <span className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 mb-1">
              {AREA_LEVEL_LABELS[area.areaLevel] ?? area.areaLevel}
            </span>
          )}
          <p className="text-sm font-semibold leading-snug">{area.name}</p>
          {area.municipality && (
            <p className="text-xs text-gray-500 mt-0.5">{area.municipality}</p>
          )}
          {area.wardNumber != null && (
            <p className="text-xs text-gray-400">Ward {area.wardNumber}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xs shrink-0"
        >
          ✕
        </button>
      </div>

      {area.indunaName && (
        <div className="rounded-lg bg-gray-50 px-3 py-2 space-y-0.5">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
            Induna
          </p>
          {area.indunaSlug ? (
            <a
              href={`/people/${area.indunaSlug}`}
              className="text-xs font-medium text-primary hover:underline"
            >
              {area.indunaName}
            </a>
          ) : (
            <p className="text-xs font-medium text-gray-700">
              {area.indunaName}
            </p>
          )}
        </div>
      )}

      {total > 0 ? (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
            Governance activity
          </p>
          {area.recordCount > 0 && (
            <a
              href={`/areas/${area.slug}#records`}
              className="flex items-center justify-between rounded-lg px-3 py-2 bg-purple-50 hover:bg-purple-100 transition-colors"
            >
              <span className="flex items-center gap-2 text-xs font-medium text-purple-700">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: TYPE_COLOUR.record }}
                />
                Records
              </span>
              <span className="text-xs font-semibold text-purple-700">
                {area.recordCount}
              </span>
            </a>
          )}
          {area.noticeCount > 0 && (
            <a
              href={`/areas/${area.slug}#notices`}
              className="flex items-center justify-between rounded-lg px-3 py-2 bg-cyan-50 hover:bg-cyan-100 transition-colors"
            >
              <span className="flex items-center gap-2 text-xs font-medium text-cyan-700">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: TYPE_COLOUR.notice }}
                />
                Dev Notices
              </span>
              <span className="text-xs font-semibold text-cyan-700">
                {area.noticeCount}
              </span>
            </a>
          )}
          {area.campaignCount > 0 && (
            <a
              href={`/areas/${area.slug}#campaigns`}
              className="flex items-center justify-between rounded-lg px-3 py-2 bg-green-50 hover:bg-green-100 transition-colors"
            >
              <span className="flex items-center gap-2 text-xs font-medium text-green-700">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: TYPE_COLOUR.project }}
                />
                Campaigns
              </span>
              <span className="text-xs font-semibold text-green-700">
                {area.campaignCount}
              </span>
            </a>
          )}
        </div>
      ) : (
        <p className="text-xs text-gray-400">
          No governance activity recorded for this area yet.
        </p>
      )}

      <a
        href={`/areas/${area.slug}`}
        className="block text-xs font-medium text-primary hover:underline"
      >
        View area page →
      </a>

      {(area.boundarySource || area.boundaryPermission) && (
        <div className="pt-2 border-t border-gray-100 space-y-0.5">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
            Boundary data
          </p>
          {area.boundarySource && (
            <p className="text-[10px] text-gray-400">{area.boundarySource}</p>
          )}
          {area.boundaryDate && (
            <p className="text-[10px] text-gray-400">{area.boundaryDate}</p>
          )}
          {area.boundaryPermission && (
            <p className="text-[10px] text-amber-600">
              Permission: {area.boundaryPermission}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function fitBoundaryOnMap(
  map: import('leaflet').Map,
  boundary: MapBoundary['boundary']
) {
  import('leaflet').then((Leaf) => {
    const bounds = Leaf.geoJSON({
      type: 'Feature',
      geometry: boundary,
      properties: {},
    } as GeoJSON.Feature).getBounds();
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40] });
  });
}

function matchesFilter(
  r: MapRecord,
  activeTypes: Set<string>,
  activeMuni: string,
  q: string
): boolean {
  return (
    activeTypes.has(r.type) &&
    (!activeMuni || r.municipality === activeMuni) &&
    (!q ||
      r.label.toLowerCase().includes(q) ||
      (r.subtype ?? '').toLowerCase().includes(q))
  );
}

function toggleTypeFilter(prev: Set<string>, type: string): Set<string> {
  const next = new Set(prev);
  if (next.has(type)) {
    if (next.size > 1) next.delete(type);
  } else {
    next.add(type);
  }
  return next;
}

function syncBoundaryLayerVisibility(
  map: import('leaflet').Map,
  renderedLayers: Map<string, import('leaflet').Layer>,
  spatialLayers: { id: string; label: string; category?: string }[],
  boundaryVisibility: Record<BoundaryKey, boolean>
) {
  for (const [key, layer] of renderedLayers) {
    if (!key.startsWith('governance-map:')) continue;
    const matchingLayer = spatialLayers.find(
      (l) => `governance-map:${l.id}` === key
    );
    if (!matchingLayer) continue;
    const cat = detectSpatialCategory(
      matchingLayer.label,
      matchingLayer.category
    );
    let bk: BoundaryKey | null = null;
    if (cat === 'boundary-ward') bk = 'ward';
    else if (cat === 'boundary-municipality') bk = 'municipality';
    else if (cat === 'boundary-district') bk = 'district';
    if (bk) syncLayerVisibility(map, layer, boundaryVisibility[bk]);
  }
}

function buildWardMarkerGroup(
  Leaf: typeof import('leaflet'),
  records: MapRecord[],
  boundaries: MapBoundary[]
): import('leaflet').LayerGroup {
  const group = Leaf.layerGroup();
  for (const rec of records) {
    if (rec.ward == null) continue;
    const boundary = boundaries.find(
      (b) =>
        b.wardNumber === rec.ward &&
        (rec.municipality == null ||
          b.municipality
            ?.toLowerCase()
            .includes(rec.municipality.toLowerCase()) ||
          rec.municipality
            .toLowerCase()
            .includes(b.municipality?.toLowerCase() ?? ''))
    );
    if (!boundary) continue;
    try {
      const centre = Leaf.geoJSON({
        type: 'Feature',
        geometry: boundary.boundary,
        properties: {},
      } as GeoJSON.Feature)
        .getBounds()
        .getCenter();
      const colour = TYPE_COLOUR[rec.type] ?? '#6b7280';
      const icon = Leaf.divIcon({
        className: '',
        html: `<div style="width:10px;height:10px;border-radius:50%;background:${colour};border:2px solid white;opacity:0.7;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });
      const marker = Leaf.marker([centre.lat, centre.lng], { icon });
      marker.bindPopup(
        `<div style="font-size:12px;min-width:160px"><strong>${rec.label}</strong><br/><span style="color:#6b7280;font-size:10px">${rec.subtype}</span><br/><span style="color:#d97706;font-size:10px">⚠ Ward reference only — not a verified site location</span><br/><a href="${TYPE_PATH[rec.type]}/${rec.slug}" style="font-size:11px;color:#7c3aed">View record →</a></div>`
      );
      group.addLayer(marker);
    } catch {
      // skip invalid boundary geometry
    }
  }
  return group;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: large map component — complexity is managed via extracted helpers
export default function GovernanceMapLeaflet({
  records,
  boundaries,
  zoom,
  initialWard,
  controlCentreUrl,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const renderedLayersRef = useRef<Map<string, L.Layer>>(new Map());
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [basemap, setBasemap] = useState<BasemapId>('osm');
  const [viewport, setViewport] = useState<SpatialMapBounds | null>(null);
  const [spatialVisibility, setSpatialVisibility] = useState<
    Record<string, boolean>
  >({});
  const [selectedDatasetIds, setSelectedDatasetIds] = useState<
    string[] | undefined
  >(undefined);
  const [boundaryVisibility, setBoundaryVisibility] = useState<
    Record<BoundaryKey, boolean>
  >({ ward: true, municipality: true, district: true });
  const {
    layers: spatialLayers,
    loading: spatialLayersLoading,
    error: spatialLayersError,
    permissionFiltered: spatialPermissionFiltered,
    retry: retrySpatialLayers,
  } = useSpatialMapLayers({
    controlCentreUrl,
    bounds: viewport,
    datasetIds: selectedDatasetIds,
    enabled: mapReady,
  });

  const [selectedRecord, setSelectedRecord] = useState<MapRecord | null>(null);
  const [selectedArea, setSelectedArea] = useState<MapBoundary | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTypes, setActiveTypes] = useState<Set<string>>(
    new Set(['record', 'notice', 'project'])
  );
  const [activeMuni, setActiveMuni] = useState<string>('');

  const municipalities = useMemo(
    () =>
      [
        ...new Set(records.map((r) => r.municipality).filter(Boolean)),
      ].sort() as string[],
    [records]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return records.filter((r) => matchesFilter(r, activeTypes, activeMuni, q));
  }, [records, activeTypes, activeMuni, search]);

  const counts = useMemo(
    () => ({
      record: records.filter((r) => r.type === 'record').length,
      notice: records.filter((r) => r.type === 'notice').length,
      project: records.filter((r) => r.type === 'project').length,
    }),
    [records]
  );

  function toggleType(type: string) {
    setActiveTypes((prev) => toggleTypeFilter(prev, type));
  }

  const selectRecord = useCallback((rec: MapRecord) => {
    setSelectedRecord(rec);
    setSelectedArea(null);
    setPanelOpen(true);
  }, []);

  const selectArea = useCallback((area: MapBoundary) => {
    setSelectedArea(area);
    setSelectedRecord(null);
    const map = mapRef.current;
    if (map) fitBoundaryOnMap(map, area.boundary);
    setPanelOpen(true);
  }, []);

  function clearSelection() {
    setSelectedRecord(null);
    setSelectedArea(null);
  }

  function toggleSpatialLayer(layerId: string) {
    setSpatialVisibility((current) => ({
      ...current,
      [layerId]: !(current[layerId] ?? true),
    }));
    setSelectedDatasetIds((current) =>
      toggleSpatialDatasetSelection(current, spatialLayers, layerId)
    );
  }

  function toggleBoundaryLayer(key: BoundaryKey) {
    setBoundaryVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // Auto-select ward from deep link — runs after map init
  useEffect(() => {
    if (!initialWard || !mapRef.current) return;
    const match = boundaries.find((b) => b.slug === initialWard);
    if (match) selectArea(match);
  }, [initialWard, boundaries, selectArea]);

  // Init map — runs once on mount. boundaries is intentionally excluded from
  // deps: it is read once at init time. Adding it would destroy and recreate
  // the Leaflet instance on every parent render that produces a new array ref.
  // biome-ignore lint/correctness/useExhaustiveDependencies: boundaries and initialWard excluded intentionally — read once at init time
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    loadLeafletCss();
    let cancelled = false;

    import('leaflet').then((Leaf) => {
      if (cancelled || !containerRef.current) return;
      const coverage = getBoundaryCoverage(Leaf, boundaries);

      const map = coverage.isValid()
        ? initMapWithCoverage(
            Leaf,
            containerRef.current,
            coverage,
            zoom,
            boundaries,
            initialWard
          )
        : createMap(Leaf, containerRef.current, [-27.75, 29.93], zoom, {
            scrollWheelZoom: true,
          });

      mapRef.current = map;
      // Capture the tile layer so switchBasemap can replace it later
      map.eachLayer((l) => {
        if (l instanceof Leaf.TileLayer)
          tileLayerRef.current = l as L.TileLayer;
      });
      requestAnimationFrame(() => {
        if (!cancelled) map.invalidateSize();
      });
      const updateViewport = () => setViewport(clampViewportBounds(map));
      map.on('moveend', updateViewport);
      updateViewport();
      setMapReady(true);
    });

    return () => {
      cancelled = true;
      setMapReady(false);
      setViewport(null);
      mapRef.current?.remove();
      mapRef.current = null;
      renderedLayersRef.current.clear();
    };
  }, [zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;
    import('leaflet').then((Leaf) => {
      renderSpatialMapLayers({
        Leaf,
        map,
        layers: spatialLayers,
        visibility: spatialVisibility,
        renderedLayers: renderedLayersRef.current,
        prefix: 'governance-map:',
      });
    });
  }, [mapReady, spatialLayers, spatialVisibility]);

  // Sync boundary layer visibility — mirrors NoticeStatutoryMap syncLayerVisibility pattern.
  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;
    syncBoundaryLayerVisibility(
      map,
      renderedLayersRef.current,
      spatialLayers,
      boundaryVisibility
    );
  }, [mapReady, boundaryVisibility, spatialLayers]);

  // Basemap switcher — replaces tile layer without affecting spatial overlays
  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;
    import('leaflet').then((Leaf) => {
      switchBasemap(Leaf, map, basemap, tileLayerRef);
    });
  }, [mapReady, basemap]);

  // Ward centroid markers — records/notices/campaigns matched by ward number.
  // Markers are labelled as approximate ward references, not site locations.
  // biome-ignore lint/correctness/useExhaustiveDependencies: boundaries read once at marker build time
  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map || !boundaries.length || !records.length) return;
    const KEY = 'governance-map:ward-markers';
    const existing = renderedLayersRef.current.get(KEY);
    if (existing) {
      map.removeLayer(existing);
      renderedLayersRef.current.delete(KEY);
    }
    import('leaflet').then((Leaf) => {
      const group = buildWardMarkerGroup(Leaf, records, boundaries);
      group.addTo(map);
      renderedLayersRef.current.set(KEY, group);
    });
  }, [mapReady, records]);

  const panelContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Panel header */}
      <div className="p-3 border-b border-gray-100 space-y-2 shrink-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800">
            {selectedArea
              ? selectedArea.name
              : `${filtered.length} of ${records.length} items`}
          </p>
          <div className="flex items-center gap-2">
            {(selectedRecord || selectedArea) && (
              <button
                type="button"
                onClick={clearSelection}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                ← All
              </button>
            )}
            {/* Mobile close button — inside drawer header so always reachable */}
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              className="md:hidden text-gray-400 hover:text-gray-600 text-lg leading-none"
              aria-label="Close panel"
            >
              ×
            </button>
          </div>
        </div>

        {!selectedArea && (
          <>
            <input
              type="search"
              placeholder="Search records, notices…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-gray-400 bg-gray-50"
            />
            <div className="flex flex-wrap gap-1.5">
              {(['record', 'notice', 'project'] as const).map((t) => (
                <TypePill
                  key={t}
                  type={t}
                  active={activeTypes.has(t)}
                  count={counts[t]}
                  onClick={() => toggleType(t)}
                />
              ))}
            </div>
            {municipalities.length > 1 && (
              <select
                value={activeMuni}
                onChange={(e) => setActiveMuni(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 outline-none focus:border-gray-400"
              >
                <option value="">All municipalities</option>
                {municipalities.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            )}
          </>
        )}
      </div>

      {/* Area context panel */}
      {selectedArea ? (
        <AreaPanel area={selectedArea} onClose={clearSelection} />
      ) : selectedRecord ? (
        <RecordDetail rec={selectedRecord} />
      ) : (
        <ItemList
          boundaries={boundaries}
          filtered={filtered}
          onSelectArea={selectArea}
          onSelectRecord={selectRecord}
        />
      )}

      <div className="p-3 border-t border-gray-50 shrink-0">
        <p className="text-[10px] text-gray-400">
          Record locations are shown only when linked to verified spatial
          features.{' '}
          <a href="/records" className="underline">
            All records
          </a>
        </p>
      </div>
    </div>
  );

  return (
    <div
      className="relative w-full flex"
      style={{ height: 'calc(100vh - 12rem)', minHeight: 480 }}
    >
      {/* Desktop panel — left */}
      <div className="hidden md:flex flex-col w-72 shrink-0 border-r border-gray-100 shadow-sm overflow-hidden z-[1000] bg-white">
        {panelContent}
      </div>

      {/* Map — fills remaining space */}
      <div className="relative flex-1">
        <div
          ref={containerRef}
          className="absolute inset-0 overflow-hidden border border-gray-200 shadow-sm"
        />
        {/* Boundary toggle bar — top-right, matches NoticeStatutoryMap LayerToggleBar */}
        {mapReady && (
          <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1">
            {[
              { key: 'ward' as BoundaryKey, label: 'Ward' },
              { key: 'municipality' as BoundaryKey, label: 'Municipality' },
              { key: 'district' as BoundaryKey, label: 'District' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleBoundaryLayer(item.key)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium bg-white/95 border shadow-sm transition-opacity ${
                  boundaryVisibility[item.key]
                    ? 'border-gray-200 opacity-100'
                    : 'border-gray-100 opacity-50'
                }`}
              >
                <span
                  className="shrink-0 w-2.5 h-2.5 rounded-sm border"
                  style={{
                    background: boundaryVisibility[item.key]
                      ? BOUNDARY_COLOURS[item.key]
                      : 'transparent',
                    borderColor: BOUNDARY_COLOURS[item.key],
                  }}
                />
                {item.label}
              </button>
            ))}
          </div>
        )}
        {mapReady && (
          <SpatialLayerControls
            layers={deduplicateBoundaryLayers(spatialLayers).filter((l) => {
              const cat = detectSpatialCategory(l.label, l.category);
              return !cat.startsWith('boundary-');
            })}
            visibility={spatialVisibility}
            onToggle={toggleSpatialLayer}
            error={spatialLayersError}
            onRetry={retrySpatialLayers}
          />
        )}
        {/* Basemap switcher — bottom-right, above attribution */}
        {mapReady && (
          <div className="absolute bottom-8 right-3 z-[1000] flex gap-1">
            {(['osm', 'satellite'] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setBasemap(id)}
                className={`px-2 py-1 text-[10px] font-medium rounded border shadow-sm transition-all ${
                  basemap === id
                    ? 'bg-white border-gray-400 text-gray-800'
                    : 'bg-white/80 border-gray-200 text-gray-500 hover:bg-white'
                }`}
              >
                {id === 'osm' ? 'Map' : 'Satellite'}
              </button>
            ))}
          </div>
        )}
        {(spatialLayersLoading ||
          spatialLayersError ||
          spatialPermissionFiltered) && (
          <div className="absolute left-3 bottom-3 z-[1000] max-w-[min(32rem,60vw)] rounded bg-white/95 px-2.5 py-1.5 text-[10px] text-amber-800 shadow">
            {spatialLayersError
              ? `Spatial layers unavailable: ${spatialLayersError}`
              : spatialLayersLoading
                ? 'Loading spatial layers for this map view…'
                : 'Some spatial data is withheld pending redistribution permission verification.'}
          </div>
        )}

        {/* Mobile — floating toggle button (only when drawer is closed) */}
        {!panelOpen && (
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 bg-white border border-gray-200 shadow-lg rounded-full px-4 py-2 text-sm font-medium text-gray-700"
          >
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#7c3aed',
              }}
            />
            {filtered.length} items ↑
          </button>
        )}

        {/* Mobile — bottom drawer */}
        {panelOpen && (
          <div
            className="md:hidden absolute left-0 right-0 bottom-0 z-[1001] rounded-t-2xl border-t border-gray-200 shadow-2xl overflow-hidden"
            style={{ height: '60vh' }}
          >
            <div className="flex justify-center pt-2 pb-1 bg-white">
              <div className="w-8 h-1 rounded-full bg-gray-300" />
            </div>
            <div
              style={{ height: 'calc(100% - 20px)' }}
              className="bg-white overflow-hidden"
            >
              {panelContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
