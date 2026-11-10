'use client';

import type L from 'leaflet';
import { useEffect, useRef } from 'react';

type GeoJSONGeometry = {
  type: string;
  coordinates: unknown;
};

type Props = {
  boundary: GeoJSONGeometry;
  name: string;
  geopoint?: { lat: number; lng: number } | null;
  boundarySource?: string | null;
  boundaryDate?: string | null;
  boundaryPermission?: string | null;
  mapDeepLink?: string | null; // e.g. /map?ward=KZN252_7
};

function loadLeafletCss() {
  if (document.querySelector('link[href*="leaflet"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);
}

function initMap(
  Leaf: typeof L,
  container: HTMLDivElement,
  boundary: GeoJSONGeometry,
  name: string,
  geopoint?: { lat: number; lng: number } | null
): L.Map {
  const center: [number, number] = geopoint
    ? [geopoint.lat, geopoint.lng]
    : [-28.05, 29.0];
  const map = Leaf.map(container, { scrollWheelZoom: false }).setView(
    center,
    11
  );

  Leaf.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map);

  const layer = Leaf.geoJSON(
    {
      type: 'Feature',
      geometry: boundary,
      properties: { name },
    } as GeoJSON.Feature,
    {
      style: {
        color: '#16a34a',
        weight: 2,
        opacity: 0.8,
        fillColor: '#16a34a',
        fillOpacity: 0.08,
      },
    }
  ).addTo(map);

  const bounds = layer.getBounds();
  if (bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20] });

  if (geopoint?.lat && geopoint?.lng) {
    Leaf.circleMarker([geopoint.lat, geopoint.lng], {
      radius: 6,
      fillColor: '#16a34a',
      color: '#fff',
      weight: 2,
      fillOpacity: 1,
    })
      .addTo(map)
      .bindTooltip(name, { permanent: false });
  }

  return map;
}

export default function AreaBoundaryLeaflet({
  boundary,
  name,
  geopoint,
  boundarySource,
  boundaryDate,
  boundaryPermission,
  mapDeepLink,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    loadLeafletCss();
    let cancelled = false;

    import('leaflet').then((Leaf) => {
      if (cancelled || !mapRef.current) return;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = initMap(
        Leaf,
        mapRef.current,
        boundary,
        name,
        geopoint
      );
    });

    return () => {
      cancelled = true;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [boundary, name, geopoint]);

  return (
    <div className="space-y-2">
      <div
        ref={mapRef}
        className="h-[320px] w-full rounded-lg overflow-hidden border"
      />
      {(boundarySource || boundaryDate || boundaryPermission) && (
        <p className="text-xs text-muted-foreground">
          {[
            boundarySource && `Source: ${boundarySource}`,
            boundaryDate && `Date: ${boundaryDate}`,
            boundaryPermission && `Permission: ${boundaryPermission}`,
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
      )}
      {mapDeepLink && (
        <a
          href={mapDeepLink}
          className="text-xs text-primary hover:underline font-medium"
        >
          View on full map →
        </a>
      )}
    </div>
  );
}
