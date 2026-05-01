'use client';

import type L from 'leaflet';
import { useEffect, useRef } from 'react';

type Listing = {
  _id: string;
  name: string;
  slug: string;
  listingType: string;
  description?: string;
  location?: string;
  geopoint?: { lat: number; lng: number } | null;
  contactInfo?: string;
  featured?: boolean;
  verifiedByInduna?: string;
  areaName?: string;
};

type Props = {
  listings: Listing[];
  centerLat: number;
  centerLng: number;
  zoom: number;
  typeColors: Record<string, string>;
  typeIcons: Record<string, string>;
};

function buildPopup(
  listing: Listing,
  icon: string,
  color: string,
  href: string
) {
  const area = listing.areaName
    ? `<br/><small style="color:#666">${listing.areaName}</small>`
    : '';
  const verify =
    listing.verifiedByInduna === 'council'
      ? '<br/><small style="color:#16a34a">✓✓ Council Verified</small>'
      : listing.verifiedByInduna === 'induna'
        ? '<br/><small style="color:#16a34a">✓ Verified by Induna</small>'
        : '';
  const loc = listing.location
    ? `<br/><small>📍 ${listing.location}</small>`
    : '';
  const phone = listing.contactInfo
    ? `<br/><small>📞 ${listing.contactInfo}</small>`
    : '';
  const gmaps = `https://www.google.com/maps?q=${listing.geopoint?.lat},${listing.geopoint?.lng}`;
  return `<div style="min-width:180px"><strong>${icon} ${listing.name}</strong>${area}${verify}${loc}${phone}<br/><div style="display:flex;gap:8px;margin-top:6px"><a href="${href}" style="color:${color};font-weight:600;font-size:13px">➡ Details</a><a href="${gmaps}" target="_blank" rel="noopener" style="color:#6b7280;font-size:13px">🗺️ Directions</a></div></div>`;
}

function addMarkers(
  Leaf: typeof L,
  map: L.Map,
  listings: Listing[],
  typeColors: Record<string, string>,
  typeIcons: Record<string, string>
) {
  for (const listing of listings) {
    if (!listing.geopoint?.lat || !listing.geopoint?.lng) continue;

    const color = typeColors[listing.listingType] || '#6b7280';
    const icon = typeIcons[listing.listingType] || '📍';
    const href =
      listing.listingType === 'area'
        ? `/areas/${listing.slug}`
        : `/directory/${listing.slug}`;

    Leaf.circleMarker([listing.geopoint.lat, listing.geopoint.lng], {
      radius: listing.featured ? 10 : 7,
      fillColor: color,
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.85,
    })
      .addTo(map)
      .bindPopup(buildPopup(listing, icon, color, href));
  }
}

function fitMapBounds(Leaf: typeof L, map: L.Map, listings: Listing[]) {
  const points = listings
    .filter((l) => l.geopoint?.lat && l.geopoint?.lng)
    .map(
      (l) => [l.geopoint?.lat ?? 0, l.geopoint?.lng ?? 0] as [number, number]
    );
  if (points.length > 1) {
    map.fitBounds(Leaf.latLngBounds(points), { padding: [40, 40] });
  }
}

function loadLeafletCss() {
  if (document.querySelector('link[href*="leaflet"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);
}

export default function CommunityMapLeaflet({
  listings,
  centerLat,
  centerLng,
  zoom,
  typeColors,
  typeIcons,
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

      const map = Leaf.map(mapRef.current).setView(
        [centerLat, centerLng],
        zoom
      );
      mapInstanceRef.current = map;

      Leaf.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      addMarkers(Leaf, map, listings, typeColors, typeIcons);
      if (listings.length > 0) fitMapBounds(Leaf, map, listings);
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [listings, centerLat, centerLng, zoom, typeColors, typeIcons]);

  return <div ref={mapRef} className="h-[500px] md:h-[600px] w-full" />;
}
