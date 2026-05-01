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

function injectMapStyles() {
  if (document.getElementById('umkhandlu-map-styles')) return;
  const style = document.createElement('style');
  style.id = 'umkhandlu-map-styles';
  style.textContent = `
    .map-marker{display:flex;align-items:center;justify-content:center;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);cursor:pointer;transition:transform .15s}
    .map-marker:hover{transform:scale(1.3);z-index:999!important}
    .map-marker-featured{animation:pulse 2s infinite}
    @keyframes pulse{0%,100%{box-shadow:0 2px 6px rgba(0,0,0,.3)}50%{box-shadow:0 0 0 8px rgba(0,0,0,.08)}}
    .map-popup .leaflet-popup-content-wrapper{border-radius:12px;padding:0;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.15)}
    .map-popup .leaflet-popup-content{margin:0;min-width:200px}
    .map-popup .leaflet-popup-tip{display:none}
    .popup-inner{padding:12px 14px}
    .popup-name{font-weight:700;font-size:14px;margin-bottom:2px}
    .popup-meta{font-size:12px;color:#666;line-height:1.6}
    .popup-verify{color:#16a34a;font-weight:600}
    .popup-actions{display:flex;gap:10px;margin-top:8px;padding-top:8px;border-top:1px solid #f0f0f0}
    .popup-actions a{font-size:12px;font-weight:600;text-decoration:none}
  `;
  document.head.appendChild(style);
}

function loadLeafletCss() {
  if (document.querySelector('link[href*="leaflet"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);
}

function createMarkerIcon(
  Leaf: typeof L,
  icon: string,
  color: string,
  featured: boolean,
  size: number
) {
  return Leaf.divIcon({
    className: '',
    html: `<div class="map-marker ${featured ? 'map-marker-featured' : ''}" style="width:${size}px;height:${size}px;background:${color};font-size:${size * 0.5}px">${icon}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

function buildPopup(
  listing: Listing,
  icon: string,
  color: string,
  href: string
) {
  const area = listing.areaName
    ? `<div class="popup-meta">${listing.areaName}</div>`
    : '';
  const verify =
    listing.verifiedByInduna === 'council'
      ? '<div class="popup-meta popup-verify">✓✓ Council Verified</div>'
      : listing.verifiedByInduna === 'induna'
        ? '<div class="popup-meta popup-verify">✓ Verified by Induna</div>'
        : '';
  const loc = listing.location
    ? `<div class="popup-meta">📍 ${listing.location}</div>`
    : '';
  const phone = listing.contactInfo
    ? `<div class="popup-meta">📞 ${listing.contactInfo}</div>`
    : '';
  const gmaps = `https://www.google.com/maps?q=${listing.geopoint?.lat},${listing.geopoint?.lng}`;
  return `<div class="popup-inner"><div class="popup-name">${icon} ${listing.name}</div>${area}${verify}${loc}${phone}<div class="popup-actions"><a href="${href}" style="color:${color}">View details →</a><a href="${gmaps}" target="_blank" rel="noopener" style="color:#6b7280">🗺️ Directions</a></div></div>`;
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
    const featured = listing.featured ?? false;
    const size = featured ? 40 : 32;
    const href =
      listing.listingType === 'area'
        ? `/areas/${listing.slug}`
        : `/directory/${listing.slug}`;

    const markerIcon = createMarkerIcon(Leaf, icon, color, featured, size);

    Leaf.marker([listing.geopoint.lat, listing.geopoint.lng], {
      icon: markerIcon,
    })
      .addTo(map)
      .bindTooltip(listing.name, {
        direction: 'top',
        offset: [0, -(size / 2 + 2)],
        className: 'map-tooltip',
      })
      .bindPopup(buildPopup(listing, icon, color, href), {
        className: 'map-popup',
        maxWidth: 280,
      });
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
    injectMapStyles();

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
