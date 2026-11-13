'use client';

import { useEffect, useState } from 'react';

type SpatialFeature = {
  type: 'Feature';
  geometry: { type: string; coordinates: unknown };
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
  features: SpatialFeature[];
  attribution: string | null;
  radiusFiltered: boolean;
};

type MapLayersResponse = {
  layers: MapLayer[];
  filterLat: number | null;
  filterLng: number | null;
  generatedAt: string;
};

type Props = {
  lat: number;
  lng: number;
  controlCentreUrl: string;
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
  return (
    (p.name as string) ??
    (p.NAME as string) ??
    (p.amenity as string) ??
    (p.school_name as string) ??
    'Unnamed'
  );
}

export default function ListingSpatialContext({
  lat,
  lng,
  controlCentreUrl,
}: Props) {
  const [layers, setLayers] = useState<MapLayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [ccUnavailable, setCcUnavailable] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('lat', String(lat));
    params.set('lng', String(lng));
    const controller = new AbortController();
    fetch(`${controlCentreUrl}/api/spatial/map-layers?${params}`, {
      signal: controller.signal,
    })
      .then((r) => (r.ok ? (r.json() as Promise<MapLayersResponse>) : null))
      .then((data) => {
        if (data) {
          setLayers(
            data.layers.filter(
              (l) =>
                DIRECTORY_LAYER_IDS.has(l.id) &&
                !l.loadOnDemand &&
                l.returnedCount > 0
            )
          );
        } else {
          setCcUnavailable(true);
        }
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setCcUnavailable(true);
      })
      .finally(() => setLoading(false));
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
        No published facility data found within 5 km of this listing.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {layers.map((layer) => (
        <div key={layer.id}>
          <p className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <span>{LAYER_ICONS[layer.id] ?? '📍'}</span>
            {layer.label}
            <span className="text-[10px] font-normal text-gray-400">
              ({layer.returnedCount} within 5 km)
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
          </div>
          {layer.attribution && (
            <p className="text-[10px] text-gray-400 mt-1 pl-5">
              {layer.attribution}
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
