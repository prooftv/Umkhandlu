'use client';

import type L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { createMap, loadLeafletCss } from '@/lib/map/leaflet-utils';

type SpatialFeature = {
  type: 'Feature';
  geometry: GeoJSON.Geometry;
  properties: Record<string, unknown>;
};

type MapLayer = {
  id: string;
  datasetId: string;
  label: string;
  colour: string;
  featureCount: number;
  returnedCount: number;
  loadOnDemand: boolean;
  truncated: boolean;
  radiusKm: number | null;
  features: SpatialFeature[];
  attribution: string | null;
  datasetDate: string | null;
  radiusFiltered: boolean;
};

type MapLayersResponse = {
  layers: MapLayer[];
  filterLat: number | null;
  filterLng: number | null;
  permissionFiltered?: boolean;
  generatedAt: string;
};

type Props = {
  lat: number;
  lng: number;
  controlCentreUrl: string;
  listingName: string;
  listingType?: string;
};

// Layers relevant to directory listings (community facilities focus)
const DIRECTORY_LAYER_IDS = new Set([
  'giga-schools',
  'hot-osm-education',
  'hot-osm-health',
  'hot-osm-cultural',
  'hot-osm-financial',
  'hot-osm-populated-places',
  'hot-osm-points-of-interest',
]);

const LAYER_ICONS: Record<string, string> = {
  'giga-schools': '🏫',
  'hot-osm-education': '🏫',
  'hot-osm-health': '🏥',
  'hot-osm-cultural': '⛪',
  'hot-osm-financial': '🏦',
  'hot-osm-populated-places': '🏘️',
};

function featureName(f: SpatialFeature): string {
  const p = f.properties;
  const stringValue = (value: unknown) =>
    typeof value === 'string' && value.trim() ? value : null;
  return (
    stringValue(p.name) ??
    stringValue(p.NAME) ??
    stringValue(p.amenity) ??
    stringValue(p.school_name) ??
    'Unnamed'
  );
}

function NearbyFacilitiesMap({
  lat,
  lng,
  listingName,
  layers,
}: {
  lat: number;
  lng: number;
  listingName: string;
  layers: MapLayer[];
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    loadLeafletCss();
    let cancelled = false;

    import('leaflet').then((Leaf) => {
      if (cancelled || !mapRef.current) return;
      mapInstanceRef.current?.remove();

      const map = createMap(Leaf, mapRef.current, [lat, lng], 13, {
        scrollWheelZoom: false,
      });
      mapInstanceRef.current = map;

      const listingMarker = Leaf.circleMarker([lat, lng], {
        radius: 8,
        color: '#fff',
        weight: 2,
        fillColor: '#1d4ed8',
        fillOpacity: 1,
      }).addTo(map);
      const listingTooltip = document.createElement('span');
      listingTooltip.textContent = `${listingName} · community listing`;
      listingMarker.bindTooltip(listingTooltip);

      const bounds = Leaf.latLngBounds([Leaf.latLng(lat, lng)]);
      for (const layer of layers) {
        const collection: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: layer.features,
        };
        const geoJson = Leaf.geoJSON(collection, {
          style: {
            color: layer.colour,
            fillColor: layer.colour,
            weight: 1.5,
            fillOpacity: 0.35,
          },
          pointToLayer: (_feature, point) =>
            Leaf.circleMarker(point, {
              radius: 5,
              color: '#fff',
              weight: 1,
              fillColor: layer.colour,
              fillOpacity: 0.9,
            }),
          onEachFeature: (feature, featureLayer) => {
            const label = document.createElement('span');
            label.textContent = featureName({
              type: 'Feature',
              geometry: feature.geometry,
              properties: (feature.properties ?? {}) as Record<string, unknown>,
            });
            featureLayer.bindTooltip(label);
          },
        }).addTo(map);
        if (geoJson.getBounds().isValid()) bounds.extend(geoJson.getBounds());
      }

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [24, 24], maxZoom: 14 });
      }
    });

    return () => {
      cancelled = true;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [lat, lng, listingName, layers]);

  return <div ref={mapRef} className="h-[240px] w-full rounded-lg" />;
}

export default function ListingSpatialContext({
  lat,
  lng,
  controlCentreUrl,
  listingName,
}: Props) {
  const [layers, setLayers] = useState<MapLayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [ccUnavailable, setCcUnavailable] = useState(false);
  const [permissionFiltered, setPermissionFiltered] = useState(false);

  useEffect(() => {
    setLoading(true);
    setCcUnavailable(false);
    setPermissionFiltered(false);
    setLayers([]);
    const params = new URLSearchParams();
    params.set('lat', String(lat));
    params.set('lng', String(lng));
    const controller = new AbortController();
    fetch(`${controlCentreUrl}/api/spatial/map-layers?${params}`, {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok)
          throw new Error(`Spatial layer request failed (${r.status})`);
        return r.json() as Promise<MapLayersResponse>;
      })
      .then((data) => {
        setPermissionFiltered(data.permissionFiltered === true);
        setLayers(
          data.layers.filter(
            (layer) =>
              DIRECTORY_LAYER_IDS.has(layer.id) &&
              layer.returnedCount > 0 &&
              layer.features.length > 0
          )
        );
      })
      .catch((e) => {
        if (!(e instanceof Error) || e.name !== 'AbortError') {
          setCcUnavailable(true);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [lat, lng, controlCentreUrl]);

  if (loading) {
    return (
      <p className="text-xs text-gray-400 animate-pulse">
        Loading nearby facilities…
      </p>
    );
  }

  if (ccUnavailable) {
    return (
      <p className="text-xs text-gray-400">
        Nearby facility data temporarily unavailable.
      </p>
    );
  }

  if (!layers.length) {
    return (
      <p className="text-xs text-gray-400">
        {permissionFiltered
          ? 'Some nearby spatial data is withheld pending redistribution permission verification. Missing data does not indicate that no facilities are present.'
          : 'No published facility data found within 5 km of this listing.'}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {permissionFiltered && (
        <p className="text-[10px] text-amber-700">
          Some nearby spatial data is withheld pending redistribution permission
          verification.
        </p>
      )}
      <NearbyFacilitiesMap
        lat={lat}
        lng={lng}
        listingName={listingName}
        layers={layers}
      />
      {layers.map((layer) => (
        <div key={layer.id}>
          <p className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <span>{LAYER_ICONS[layer.id] ?? '📍'}</span>
            {layer.label}
            <span className="text-[10px] font-normal text-gray-400">
              (
              {layer.truncated
                ? `at least ${layer.returnedCount}`
                : layer.returnedCount}
              {layer.radiusKm !== null ? ` within ${layer.radiusKm} km` : ''})
            </span>
          </p>
          <div className="space-y-1">
            {layer.features.slice(0, 5).map((f, i) => (
              <p
                // biome-ignore lint/suspicious/noArrayIndexKey: stable ordered list
                key={i}
                className="text-xs text-gray-600 pl-5 truncate"
              >
                {featureName(f)}
              </p>
            ))}
            {layer.returnedCount > 5 && (
              <p className="text-[10px] text-gray-400 pl-5">
                +{layer.returnedCount - 5} more
              </p>
            )}
            {layer.truncated && (
              <p className="text-[10px] text-amber-700 pl-5">
                Nearby results are capped; coverage is incomplete.
              </p>
            )}
          </div>
          {layer.attribution && (
            <p className="text-[10px] text-gray-400 mt-1 pl-5">
              {layer.attribution}
              {layer.datasetDate ? ` · ${layer.datasetDate}` : ''}
            </p>
          )}
        </div>
      ))}
      <p className="text-[10px] text-gray-400 pt-1 border-t border-gray-100">
        External facility data from Unami Control Centre spatial catalogue.
        These are externally sourced features — not verified community directory
        listings.
      </p>
    </div>
  );
}
