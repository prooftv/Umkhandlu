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

function addBoundaries(Leaf: typeof L, map: L.Map, boundaries: MapBoundary[]) {
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

export default function GovernanceMapLeaflet({
  records,
  boundaries,
  centre,
  zoom,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const [selected, setSelected] = useState<MapRecord | null>(null);
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
    setSelected(rec);
    mapRef.current?.flyTo([rec.lat, rec.lng], 13, { duration: 0.8 });
    setPanelOpen(true);
  }, []);

  // Init map — runs once; marker click handler stable via useCallback
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    loadLeafletCss();
    let cancelled = false;

    import('leaflet').then((Leaf) => {
      if (cancelled || !containerRef.current) return;
      const map = Leaf.map(containerRef.current, {
        scrollWheelZoom: true,
      }).setView(centre, zoom);
      Leaf.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);
      addBoundaries(Leaf, map, boundaries);
      markersRef.current = buildMarkers(Leaf, map, records, selectRecord);
      mapRef.current = map;
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [centre, zoom, boundaries, records, selectRecord]);

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

  const panel = (
    <div className="flex flex-col h-full bg-white">
      {/* Panel header */}
      <div className="p-3 border-b border-gray-100 space-y-2 shrink-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800">
            {filtered.length} of {records.length} items
          </p>
          {selected && (
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              ← All
            </button>
          )}
        </div>

        {/* Search */}
        <input
          type="search"
          placeholder="Search records, notices…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-gray-400 bg-gray-50"
        />

        {/* Type filters */}
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

        {/* Municipality filter */}
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
      </div>

      {/* Selected detail */}
      {selected ? (
        <div className="p-3 space-y-2 overflow-y-auto">
          <span
            className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded"
            style={{
              background: `${TYPE_COLOUR[selected.type]}18`,
              color: TYPE_COLOUR[selected.type],
            }}
          >
            {selected.subtype}
          </span>
          <p className="text-sm font-semibold leading-snug">{selected.label}</p>
          <div className="space-y-0.5 text-xs text-gray-500">
            {selected.municipality && <p>{selected.municipality}</p>}
            {selected.ward != null && <p>Ward {selected.ward}</p>}
            {selected.status && <p className="capitalize">{selected.status}</p>}
            {selected.date && (
              <p>{new Date(selected.date).toLocaleDateString()}</p>
            )}
          </div>
          <a
            href={`${TYPE_PATH[selected.type]}/${selected.slug}`}
            className="inline-block mt-1 text-xs font-medium text-primary hover:underline"
          >
            View full record →
          </a>

          {/* Boundary attribution */}
          {boundaries.length > 0 && (
            <div className="pt-3 border-t border-gray-100 space-y-1">
              <p className="text-xs font-semibold text-gray-600">Boundaries</p>
              {boundaries.map((b) => (
                <div key={b.slug} className="text-xs text-gray-400 space-y-0.5">
                  <p className="text-gray-600 font-medium">{b.name}</p>
                  {b.boundarySource && <p>{b.boundarySource}</p>}
                  {b.boundaryPermission && (
                    <p className="text-amber-600">
                      Permission: {b.boundaryPermission}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Item list */
        <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <p className="p-4 text-xs text-gray-400 text-center">
              No items match your filters.
            </p>
          ) : (
            filtered.map((rec) => (
              <button
                key={rec.id}
                type="button"
                onClick={() => selectRecord(rec)}
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
      )}

      {/* Data quality note */}
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
        {panel}
      </div>

      {/* Mobile — bottom drawer toggle button */}
      <button
        type="button"
        onClick={() => setPanelOpen((v) => !v)}
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
        {filtered.length} items
        <span className="text-gray-400">{panelOpen ? '↓' : '↑'}</span>
      </button>

      {/* Mobile — bottom drawer */}
      {panelOpen && (
        <div
          className="md:hidden absolute left-0 right-0 bottom-0 z-[1001] rounded-t-2xl border-t border-gray-200 shadow-2xl overflow-hidden"
          style={{ height: '55vh' }}
        >
          <div className="flex justify-center pt-2 pb-1 bg-white">
            <div className="w-8 h-1 rounded-full bg-gray-300" />
          </div>
          <div className="h-full bg-white overflow-hidden">{panel}</div>
        </div>
      )}
    </div>
  );
}
