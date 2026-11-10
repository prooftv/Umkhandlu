'use client';

import type L from 'leaflet';
import { useEffect, useRef } from 'react';

type WardBoundary = {
  geometry: { type: string; coordinates: unknown };
  source: string | null;
  date: string | null;
};

type Props = {
  lat: number;
  lng: number;
  name: string;
  locationPrecision?: string | null;
  wardBoundary?: WardBoundary | null;
  wardName?: string | null;
  municipality?: string | null;
  mapDeepLink?: string | null;
};

const PRECISION_LABELS: Record<string, { label: string; colour: string }> = {
  verified: { label: 'Verified coordinates', colour: '#16a34a' },
  'operator-provided': {
    label: 'Operator-provided location',
    colour: '#d97706',
  },
  approximate: { label: 'Approximate location', colour: '#dc2626' },
  'locality-only': { label: 'Locality association only', colour: '#6b7280' },
};

function loadLeafletCss() {
  if (document.querySelector('link[href*="leaflet"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);
}

function addWardBoundary(
  Leaf: typeof L,
  map: L.Map,
  wardBoundary: WardBoundary | null | undefined,
  wardName: string | null | undefined
) {
  if (!wardBoundary) return;
  if (!wardBoundary) return;
  try {
    const layer = Leaf.geoJSON(
      {
        type: 'Feature',
        geometry: wardBoundary.geometry,
        properties: { name: wardName ?? 'Ward' },
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
    ).addTo(map);
    layer.bindTooltip(wardName ?? 'Ward', { sticky: true });
  } catch {
    // invalid boundary — skip
  }
}

function addSiteMarker(
  Leaf: typeof L,
  map: L.Map,
  lat: number,
  lng: number,
  name: string,
  precision: { label: string; colour: string } | null
) {
  const markerColour = precision?.colour ?? '#dc2626';
  const icon = Leaf.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${markerColour};border:2px solid white;box-shadow:0 1px 6px rgba(0,0,0,0.4)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
  Leaf.marker([lat, lng], { icon })
    .addTo(map)
    .bindPopup(
      `<strong>${name}</strong>${precision ? `<br/><small style="color:${markerColour}">${precision.label}</small>` : ''}`
    )
    .openPopup();
}

export default function SiteContextMap({
  lat,
  lng,
  name,
  locationPrecision,
  wardBoundary,
  wardName,
  municipality,
  mapDeepLink,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const precision = PRECISION_LABELS[locationPrecision ?? ''] ?? null;

  useEffect(() => {
    if (!mapRef.current) return;
    loadLeafletCss();
    let cancelled = false;

    import('leaflet').then((Leaf) => {
      if (cancelled || !mapRef.current) return;
      mapInstanceRef.current?.remove();

      const map = Leaf.map(mapRef.current, { scrollWheelZoom: false }).setView(
        [lat, lng],
        14
      );
      mapInstanceRef.current = map;

      Leaf.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Ward boundary layer
      addWardBoundary(Leaf, map, wardBoundary, wardName);

      // Site marker
      addSiteMarker(Leaf, map, lat, lng, name, precision);
    });

    return () => {
      cancelled = true;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [lat, lng, name, wardBoundary, wardName, precision]);

  return (
    <div className="space-y-2">
      <div
        ref={mapRef}
        className="h-[280px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm"
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          {precision && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border"
              style={{
                borderColor: precision.colour,
                color: precision.colour,
                background: `${precision.colour}12`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: precision.colour }}
              />
              {precision.label}
            </span>
          )}
          {wardName && <span className="text-gray-400">{wardName}</span>}
          {municipality && (
            <span className="text-gray-400">{municipality}</span>
          )}
          {wardBoundary?.source && (
            <span className="text-gray-400">
              Boundary: {wardBoundary.source}
              {wardBoundary.date ? ` (${wardBoundary.date})` : ''}
            </span>
          )}
        </div>
        {mapDeepLink && (
          <a
            href={mapDeepLink}
            className="text-xs text-primary hover:underline font-medium shrink-0"
          >
            View on full map →
          </a>
        )}
      </div>
      {locationPrecision !== 'verified' && (
        <p className="text-xs text-gray-400 leading-relaxed">
          The map shows the ward administrative boundary (MDB 2026) and an
          operator-provided site point. No verified site or premises boundary is
          available. The ward polygon is geographic context only — it does not
          represent the affected site.
        </p>
      )}
    </div>
  );
}
