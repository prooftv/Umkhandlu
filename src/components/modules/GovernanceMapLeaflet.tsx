'use client';

import type L from 'leaflet';
import { useEffect, useRef, useState } from 'react';

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
      const sourceNote = [
        b.boundarySource && `Source: ${b.boundarySource}`,
        b.boundaryDate && `Date: ${b.boundaryDate}`,
        b.boundaryPermission && `Permission: ${b.boundaryPermission}`,
      ]
        .filter(Boolean)
        .join(' · ');
      layer.bindTooltip(`${b.name}${sourceNote ? `\n${sourceNote}` : ''}`, {
        sticky: true,
      });
      layer.addTo(map);
    } catch {
      // invalid boundary — skip silently
    }
  }
}

function addMarkers(
  Leaf: typeof L,
  map: L.Map,
  records: MapRecord[],
  onSelect: (r: MapRecord) => void
) {
  for (const rec of records) {
    const colour = TYPE_COLOUR[rec.type] ?? '#6b7280';
    const shape = rec.type === 'project' ? '2px' : '50%';
    const icon = Leaf.divIcon({
      className: '',
      html: `<div style="width:11px;height:11px;border-radius:${shape};background:${colour};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.35)"></div>`,
      iconSize: [11, 11],
      iconAnchor: [5, 5],
    });
    const marker = Leaf.marker([rec.lat, rec.lng], { icon });
    marker.on('click', () => onSelect(rec));
    marker.addTo(map);
  }
}

export default function GovernanceMapLeaflet({
  records,
  boundaries,
  centre,
  zoom,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [selected, setSelected] = useState<MapRecord | null>(null);

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
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);
      addBoundaries(Leaf, map, boundaries);
      addMarkers(Leaf, map, records, setSelected);
      mapRef.current = map;
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [records, boundaries, centre, zoom]);

  return (
    <div className="flex gap-4 h-[calc(100vh-16rem)] min-h-[480px]">
      {/* Map */}
      <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* Sidebar */}
      <div className="w-64 shrink-0 flex flex-col gap-3 overflow-y-auto">
        {/* Legend */}
        <div className="rounded-xl border border-gray-100 bg-white p-3 space-y-2 shadow-sm">
          <p className="text-xs font-semibold text-gray-700">Activity</p>
          {(
            [
              { type: 'record', label: 'Records', shape: 'circle' },
              { type: 'notice', label: 'Dev notices', shape: 'circle' },
              { type: 'project', label: 'Campaigns', shape: 'square' },
            ] as const
          ).map(({ type, label, shape }) => (
            <div
              key={type}
              className="flex items-center gap-2 text-xs text-gray-600"
            >
              <span
                className="inline-block shrink-0"
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: shape === 'circle' ? '50%' : 2,
                  background: TYPE_COLOUR[type],
                }}
              />
              {label}
            </div>
          ))}
          <p className="text-xs text-gray-400 pt-1">
            {records.length} georeferenced items
          </p>
        </div>

        {/* Selected item */}
        {selected && (
          <div className="rounded-xl border border-gray-100 bg-white p-3 space-y-2 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span
                  className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded mb-1"
                  style={{
                    background: `${TYPE_COLOUR[selected.type]}20`,
                    color: TYPE_COLOUR[selected.type],
                  }}
                >
                  {selected.subtype}
                </span>
                <p className="text-sm font-medium leading-snug">
                  {selected.label}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 shrink-0 text-xs"
              >
                ✕
              </button>
            </div>
            <div className="space-y-0.5 text-xs text-gray-500">
              {selected.municipality && <p>{selected.municipality}</p>}
              {selected.ward != null && <p>Ward {selected.ward}</p>}
              {selected.status && (
                <p className="capitalize">{selected.status}</p>
              )}
              {selected.date && (
                <p>{new Date(selected.date).toLocaleDateString()}</p>
              )}
            </div>
            <a
              href={`${TYPE_PATH[selected.type]}/${selected.slug}`}
              className="block text-xs font-medium text-primary hover:underline"
            >
              View record →
            </a>
          </div>
        )}

        {/* Boundary attribution */}
        {boundaries.length > 0 && (
          <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
            <p className="text-xs font-semibold text-gray-700 mb-1">
              Boundaries
            </p>
            {boundaries.map((b) => (
              <div
                key={b.slug}
                className="text-xs text-gray-500 space-y-0.5 mb-2"
              >
                <p className="font-medium text-gray-700">{b.name}</p>
                {b.boundarySource && <p>{b.boundarySource}</p>}
                {b.boundaryDate && <p>{b.boundaryDate}</p>}
                {b.boundaryPermission && (
                  <p className="text-amber-700">
                    Permission: {b.boundaryPermission}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Data quality note */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
          <p className="text-xs text-gray-500">
            Only records with geographic coordinates are shown. Records without
            coordinates are accessible via the{' '}
            <a href="/areas" className="text-primary hover:underline">
              Areas
            </a>{' '}
            and{' '}
            <a href="/records" className="text-primary hover:underline">
              Records
            </a>{' '}
            pages.
          </p>
        </div>
      </div>
    </div>
  );
}
