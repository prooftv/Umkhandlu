/**
 * Shared Leaflet primitives.
 * No domain knowledge. No CC types. No React.
 * Consumed by: NoticeStatutoryMap, GovernanceMapLeaflet, AreaBoundaryLeaflet, LocationPinLeaflet.
 */

import type L from 'leaflet';

export type GeoJSONGeometry = { type: string; coordinates: unknown };

export const OSM_TILE_URL =
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const OSM_ATTRIBUTION =
  '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/** Inject Leaflet CSS once per page. */
export function loadLeafletCss() {
  if (document.querySelector('link[href*="leaflet"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);
}

/** Create a map with OSM tiles. scrollWheelZoom defaults to false. */
export function createMap(
  Leaf: typeof L,
  container: HTMLDivElement,
  centre: [number, number],
  zoom: number,
  options: {
    scrollWheelZoom?: boolean;
    dragging?: boolean;
    zoomControl?: boolean;
  } = {}
): L.Map {
  const map = Leaf.map(container, {
    scrollWheelZoom: options.scrollWheelZoom ?? false,
    dragging: options.dragging ?? true,
    zoomControl: options.zoomControl ?? true,
  }).setView(centre, zoom);
  Leaf.tileLayer(OSM_TILE_URL, {
    attribution: OSM_ATTRIBUTION,
    maxZoom: 19,
  }).addTo(map);
  return map;
}

/** Add a GeoJSON polygon/line layer. Returns null on invalid geometry. */
export function addGeoJSON(
  Leaf: typeof L,
  map: L.Map,
  geometry: GeoJSONGeometry,
  style: L.PathOptions,
  tooltip?: string,
  onEachFeature?: L.GeoJSONOptions['onEachFeature']
): L.GeoJSON | null {
  try {
    const layer = Leaf.geoJSON(
      { type: 'Feature', geometry, properties: {} } as GeoJSON.Feature,
      { style, onEachFeature }
    );
    if (tooltip) layer.bindTooltip(tooltip, { sticky: true });
    layer.addTo(map);
    return layer;
  } catch {
    return null;
  }
}

/** Add a GeoJSON FeatureCollection. Returns null on error. */
export function addFeatureCollection(
  Leaf: typeof L,
  map: L.Map,
  features: Array<{
    type: string;
    geometry: { type: string; coordinates: unknown };
    properties: Record<string, unknown>;
  }>,
  style: L.PathOptions,
  onEachFeature?: L.GeoJSONOptions['onEachFeature']
): L.GeoJSON | null {
  try {
    const layer = Leaf.geoJSON(
      { type: 'FeatureCollection', features } as GeoJSON.FeatureCollection,
      { style, onEachFeature }
    );
    layer.addTo(map);
    return layer;
  } catch {
    return null;
  }
}

/** Fit map to a GeoJSON layer's bounds with padding. */
export function fitToLayer(
  map: L.Map,
  layer: L.GeoJSON,
  padding: [number, number] = [40, 40],
  maxZoom = 14
) {
  try {
    const bounds = layer.getBounds();
    if (bounds.isValid()) map.fitBounds(bounds, { padding, maxZoom });
  } catch {}
}

/** Fit map to an array of lat/lng points. */
export function fitToPoints(
  Leaf: typeof L,
  map: L.Map,
  points: [number, number][],
  padding: [number, number] = [60, 60],
  maxZoom = 13
) {
  try {
    const bounds = Leaf.latLngBounds(points);
    if (bounds.isValid()) map.fitBounds(bounds, { padding, maxZoom });
  } catch {}
}

/** Coloured dot marker for a site point. */
export function addSiteMarker(
  Leaf: typeof L,
  map: L.Map,
  lat: number,
  lng: number,
  popupContent: string | HTMLElement,
  colour = '#dc2626'
): L.Marker {
  const icon = Leaf.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${colour};border:2.5px solid white;box-shadow:0 1px 6px rgba(0,0,0,0.4)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
  return Leaf.marker([lat, lng], { icon }).addTo(map).bindPopup(popupContent);
}

/** Dashed circle overlay (proximity context). */
export function addProximityCircle(
  Leaf: typeof L,
  map: L.Map,
  lat: number,
  lng: number,
  radiusMetres: number,
  tooltip: string,
  colour = '#7c3aed'
): L.Circle {
  return Leaf.circle([lat, lng], {
    radius: radiusMetres,
    color: colour,
    fillColor: colour,
    fillOpacity: 0.07,
    weight: 3,
    dashArray: '10 6',
  })
    .addTo(map)
    .bindTooltip(tooltip, { sticky: true });
}

/** Toggle a layer on/off without recreating it. */
export function syncLayerVisibility(
  map: L.Map,
  layer: L.Layer,
  visible: boolean
) {
  if (visible && !map.hasLayer(layer)) layer.addTo(map);
  else if (!visible && map.hasLayer(layer)) layer.remove();
}
