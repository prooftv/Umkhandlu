'use client';

import type L from 'leaflet';
import { useEffect, useRef } from 'react';
import {
  addGeoJSON,
  createMap,
  fitToLayer,
  type GeoJSONGeometry,
  loadLeafletCss,
} from '@/lib/map/leaflet-utils';

type Props = {
  boundary: GeoJSONGeometry;
  name: string;
  boundarySource?: string | null;
  boundaryDate?: string | null;
  boundaryPermission?: string | null;
  mapDeepLink?: string | null;
};

function initAreaMap(
  Leaf: typeof L,
  container: HTMLDivElement,
  boundary: GeoJSONGeometry,
  _name: string
): L.Map {
  const geometryLayer = Leaf.geoJSON({
    type: 'Feature',
    geometry: boundary as GeoJSON.Geometry,
    properties: {},
  } as GeoJSON.Feature);
  const bounds = geometryLayer.getBounds();
  const centre = bounds.getCenter();
  const map = createMap(Leaf, container, [centre.lat, centre.lng], 11);
  const layer = addGeoJSON(Leaf, map, boundary, {
    color: '#16a34a',
    weight: 2,
    opacity: 0.8,
    fillColor: '#16a34a',
    fillOpacity: 0.08,
  });
  if (layer) fitToLayer(map, layer, [20, 20]);
  return map;
}

export default function AreaBoundaryLeaflet({
  boundary,
  name,
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
      mapInstanceRef.current = initAreaMap(
        Leaf,
        mapRef.current,
        boundary,
        name
      );
    });
    return () => {
      cancelled = true;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [boundary, name]);

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
