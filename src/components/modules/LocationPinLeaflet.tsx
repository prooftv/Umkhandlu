'use client';

import type L from 'leaflet';
import { useEffect, useRef } from 'react';

type Props = {
  lat: number;
  lng: number;
  name: string;
  color: string;
  icon?: string;
  verifiedByInduna?: string;
};

function loadLeafletCss() {
  if (document.querySelector('link[href*="leaflet"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);
}

function buildPopup(
  name: string,
  icon: string,
  lat: number,
  lng: number,
  verifiedByInduna?: string
) {
  const verify =
    verifiedByInduna === 'council'
      ? '<br/><small style="color:#16a34a">✓✓ Council Verified</small>'
      : verifiedByInduna === 'induna'
        ? '<br/><small style="color:#16a34a">✓ Verified by Induna</small>'
        : '';
  const gmaps = `https://www.google.com/maps?q=${lat},${lng}`;
  return `<div style="min-width:160px"><strong>${icon} ${name}</strong>${verify}<br/><a href="${gmaps}" target="_blank" rel="noopener" style="color:#6b7280;font-size:13px">🗺️ Get Directions</a></div>`;
}

export default function LocationPinLeaflet({
  lat,
  lng,
  name,
  color,
  icon = '📍',
  verifiedByInduna,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    loadLeafletCss();

    let cancelled = false;

    import('leaflet').then((Leaf) => {
      if (cancelled || !mapRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = Leaf.map(mapRef.current, {
        scrollWheelZoom: false,
        dragging: false,
        zoomControl: false,
      }).setView([lat, lng], 15);
      mapInstanceRef.current = map;

      Leaf.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 18,
      }).addTo(map);

      Leaf.circleMarker([lat, lng], {
        radius: 10,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85,
      })
        .addTo(map)
        .bindPopup(buildPopup(name, icon, lat, lng, verifiedByInduna))
        .openPopup();
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, name, color, icon, verifiedByInduna]);

  return <div ref={mapRef} className="h-[250px] w-full" />;
}
