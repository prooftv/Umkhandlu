'use client';

import type L from 'leaflet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface MapRecord {
  id: string;
  slug: string;
  label: string;
  type: 'record' | 'notice' | 'project';
  subtype: string;
  lat: number;
  lng: number;
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
  geopoint: { lat: number; lng: number } | null;
}

interface Props {
  records: MapRecord[];
  boundaries: MapBoundary[];
  centre: [number, number];
  zoom: number;
  initialWard?: string | null; // WardLink slug e.g. KZN253_7 — auto-selects on mount
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

function loadLeafletCss() {
  if (document.querySelector('link[href*="leaflet"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);
}

function addBoundaries(
  Leaf: typeof L,
  map: L.Map,
  boundaries: MapBoundary[],
  onSelect: (b: MapBoundary) => void
) {
  for (const b of boundaries) {
    try {
      const layer = Leaf.geoJSON(
        {
          type: 'Feature',
          geometry: b.boundary,
          properties: { name: b.name },
        } as GeoJSON.Feature,
        {
          style: {
            color: '#6b7280',
            weight: 1.5,
            opacity: 0.6,
            fillColor: '#6b7280',
            fillOpacity: 0.04,
          },
        }
      );
      layer.on('click', () => onSelect(b));
      layer.bindTooltip(b.name, { sticky: true });
      layer.addTo(map);
    } catch {
      // invalid boundary — skip
    }
  }
}

function buildMarkers(
  Leaf: typeof L,
  map: L.Map,
  records: MapRecord[],
  onSelect: (r: MapRecord) => void
): L.Marker[] {
  return records.map((rec) => {
    const colour = TYPE_COLOUR[rec.type] ?? '#6b7280';
    const shape = rec.type === 'project' ? '2px' : '50%';
    const icon = Leaf.divIcon({
      className: '',
      html: `<div style="width:12px;height:12px;border-radius:${shape};background:${colour};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });
    const marker = Leaf.marker([rec.lat, rec.lng], { icon });
    marker.on('click', () => onSelect(rec));
    marker.addTo(map);
    return marker;
  });
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

export default function GovernanceMapLeaflet({
  records,
  boundaries,
  centre,
  zoom,
  initialWard,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

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
    return records.filter(
      (r) =>
        activeTypes.has(r.type) &&
        (!activeMuni || r.municipality === activeMuni) &&
        (!q ||
          r.label.toLowerCase().includes(q) ||
          (r.subtype ?? '').toLowerCase().includes(q))
    );
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
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        if (next.size > 1) next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }

  const selectRecord = useCallback((rec: MapRecord) => {
    setSelectedRecord(rec);
    setSelectedArea(null);
    mapRef.current?.flyTo([rec.lat, rec.lng], 13, { duration: 0.8 });
    setPanelOpen(true);
  }, []);

  const selectArea = useCallback((area: MapBoundary) => {
    setSelectedArea(area);
    setSelectedRecord(null);
    if (area.geopoint) {
      mapRef.current?.flyTo([area.geopoint.lat, area.geopoint.lng], 11, {
        duration: 0.8,
      });
    }
    setPanelOpen(true);
  }, []);

  function clearSelection() {
    setSelectedRecord(null);
    setSelectedArea(null);
  }

  // Auto-select ward from deep link — runs after map init
  useEffect(() => {
    if (!initialWard || !mapRef.current) return;
    const match = boundaries.find((b) => b.slug === initialWard);
    if (match) selectArea(match);
  }, [initialWard, boundaries, selectArea]);

  // Init map — runs once; callbacks stable via useCallback
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    loadLeafletCss();
    let cancelled = false;

    import('leaflet').then((Leaf) => {
      if (cancelled || !containerRef.current) return;
      const map = Leaf.map(containerRef.current, {
        scrollWheelZoom: true,
      }).setView(centre, zoom);
      Leaf.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
          subdomains: 'abcd',
        }
      ).addTo(map);
      addBoundaries(Leaf, map, boundaries, selectArea);
      markersRef.current = buildMarkers(Leaf, map, records, selectRecord);
      mapRef.current = map;
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [centre, zoom, boundaries, records, selectRecord, selectArea]);

  // Show/hide markers based on filter
  useEffect(() => {
    if (!mapRef.current) return;
    const filteredIds = new Set(filtered.map((r) => r.id));
    for (let i = 0; i < records.length; i++) {
      const marker = markersRef.current[i];
      if (!marker) continue;
      if (filteredIds.has(records[i].id)) {
        if (!mapRef.current.hasLayer(marker)) marker.addTo(mapRef.current);
      } else {
        marker.remove();
      }
    }
  }, [filtered, records]);

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
          Only georeferenced items shown.{' '}
          <a href="/records" className="underline">
            All records
          </a>
        </p>
      </div>
    </div>
  );

  return (
    <div
      className="relative w-full"
      style={{ height: 'calc(100vh - 12rem)', minHeight: 480 }}
    >
      {/* Map — always full width/height */}
      <div
        ref={containerRef}
        className="absolute inset-0 rounded-xl overflow-hidden border border-gray-200 shadow-sm"
      />

      {/* Desktop panel — right overlay */}
      <div className="hidden md:flex absolute top-3 right-3 bottom-3 w-72 flex-col rounded-xl border border-gray-100 shadow-lg overflow-hidden z-[1000]">
        {panelContent}
      </div>

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

      {/* Mobile — bottom drawer (close button is inside the panel header) */}
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
  );
}
