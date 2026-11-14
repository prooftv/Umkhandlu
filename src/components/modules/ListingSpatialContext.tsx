'use client';

import type L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { createMap, loadLeafletCss } from '@/lib/map/leaflet-utils';
import type {
  PublishedSpatialFeature,
  SpatialMapBounds,
} from '@/lib/spatial/map-layers';
import {
  isPublishedSpatialFeature,
  toggleSpatialDatasetSelection,
} from '@/lib/spatial/map-layers';
import { renderSpatialMapLayers } from '@/lib/spatial/render-map-layers';
import { useSpatialMapLayers } from '@/lib/spatial/use-spatial-map-layers';
import SpatialLayerControls from './SpatialLayerControls';

function isErrorResponse(value: unknown): value is { error: string } {
  return (
    value !== null &&
    typeof value === 'object' &&
    'error' in value &&
    typeof value.error === 'string'
  );
}

function getSpatialStatusMessage({
  featureError,
  layersError,
  layersLoading,
  permissionFiltered,
}: {
  featureError: string | null;
  layersError: string | null;
  layersLoading: boolean;
  permissionFiltered: boolean;
}): string {
  if (featureError) return `Verified map location unavailable: ${featureError}`;
  if (layersError) return `Nearby spatial layers unavailable: ${layersError}`;
  if (layersLoading) return 'Loading nearby spatial context…';
  if (permissionFiltered) {
    return 'Some spatial data is withheld pending redistribution permission verification.';
  }
  return 'Loading published location…';
}

type Props = {
  spatialFeatureId: string;
  controlCentreUrl: string;
  listingName: string;
};

export default function ListingSpatialContext({
  spatialFeatureId,
  controlCentreUrl,
  listingName,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const renderedLayersRef = useRef<Map<string, L.Layer>>(new Map());
  const [feature, setFeature] = useState<PublishedSpatialFeature | null>(null);
  const [featureError, setFeatureError] = useState<string | null>(null);
  const [featureRetry, setFeatureRetry] = useState(0);
  const [mapReady, setMapReady] = useState(false);
  const [bounds, setBounds] = useState<SpatialMapBounds | null>(null);
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [selectedDatasetIds, setSelectedDatasetIds] = useState<
    string[] | undefined
  >(undefined);
  const {
    layers,
    loading: layersLoading,
    error: layersError,
    permissionFiltered,
    retry: retryLayers,
  } = useSpatialMapLayers({
    controlCentreUrl,
    bounds,
    datasetIds: selectedDatasetIds,
    enabled: mapReady,
  });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setFeature(null);
    setFeatureError(null);
    const featureUrl = new URL(
      `${controlCentreUrl.replace(/\/$/, '')}/api/spatial/features/${encodeURIComponent(spatialFeatureId)}`
    );
    if (featureRetry > 0) {
      featureUrl.searchParams.set('_retry', String(featureRetry));
    }
    void fetch(featureUrl.toString(), { signal: controller.signal })
      .then(async (response) => {
        const body: unknown = await response.json();
        if (!response.ok) {
          throw new Error(
            isErrorResponse(body)
              ? body.error
              : `Published feature request failed (${response.status})`
          );
        }
        if (!isPublishedSpatialFeature(body)) {
          throw new Error('Published feature response has an invalid format');
        }
        return body;
      })
      .then((data) => {
        if (active) setFeature(data);
      })
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === 'AbortError')
          return;
        if (active) {
          setFeatureError(
            cause instanceof Error
              ? cause.message
              : 'Published feature unavailable'
          );
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [controlCentreUrl, spatialFeatureId, featureRetry]);

  useEffect(() => {
    if (!mapRef.current || !feature) return;
    loadLeafletCss();
    let cancelled = false;

    import('leaflet').then((Leaf) => {
      if (cancelled || !mapRef.current) return;
      mapInstanceRef.current?.remove();

      const sourceLayer = Leaf.geoJSON(
        {
          type: 'Feature',
          id: feature.id,
          geometry: feature.geometry as GeoJSON.Geometry,
          properties: feature.properties,
        } as GeoJSON.Feature,
        {
          style: {
            color: '#1d4ed8',
            weight: 3,
            fillColor: '#1d4ed8',
            fillOpacity: 0.18,
          },
          pointToLayer: (_geoFeature, point) =>
            Leaf.circleMarker(point, {
              radius: 8,
              color: '#ffffff',
              weight: 2,
              fillColor: '#1d4ed8',
              fillOpacity: 1,
            }),
          onEachFeature: (_geoFeature, featureLayer) => {
            const popup = document.createElement('div');
            const title = document.createElement('strong');
            title.textContent = listingName;
            const dataset = document.createElement('p');
            dataset.className = 'text-xs';
            dataset.textContent = feature.meta.dataset;
            const properties = document.createElement('pre');
            properties.className =
              'mt-1 max-h-40 overflow-auto whitespace-pre-wrap text-xs';
            properties.textContent = JSON.stringify(
              feature.properties,
              null,
              2
            );
            popup.append(title, dataset, properties);
            featureLayer.bindPopup(popup);
          },
        }
      );
      const featureBounds = sourceLayer.getBounds();
      if (!featureBounds.isValid()) {
        setFeatureError('The linked spatial feature has no mappable geometry.');
        return;
      }

      const centre = featureBounds.getCenter();
      const map = createMap(
        Leaf,
        mapRef.current,
        [centre.lat, centre.lng],
        13,
        { scrollWheelZoom: false }
      );
      sourceLayer.addTo(map);
      map.fitBounds(featureBounds, { padding: [28, 28], maxZoom: 14 });
      mapInstanceRef.current = map;

      const updateBounds = () => {
        const viewport = map.getBounds();
        setBounds({
          west: viewport.getWest(),
          south: viewport.getSouth(),
          east: viewport.getEast(),
          north: viewport.getNorth(),
        });
      };
      map.on('moveend', updateBounds);
      updateBounds();
      setMapReady(true);
    });

    return () => {
      cancelled = true;
      setMapReady(false);
      setBounds(null);
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
      renderedLayersRef.current.clear();
    };
  }, [feature, listingName]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!mapReady || !map) return;
    import('leaflet').then((Leaf) => {
      renderSpatialMapLayers({
        Leaf,
        map,
        layers,
        visibility,
        renderedLayers: renderedLayersRef.current,
        prefix: 'directory:',
      });
    });
  }, [layers, mapReady, visibility]);

  function toggleLayer(layerId: string) {
    setVisibility((current) => ({
      ...current,
      [layerId]: !(current[layerId] ?? true),
    }));
    setSelectedDatasetIds((current) =>
      toggleSpatialDatasetSelection(current, layers, layerId)
    );
  }

  return (
    <div className="relative h-[280px] w-full overflow-hidden rounded-lg">
      <div ref={mapRef} className="absolute inset-0" />
      {mapReady && (
        <SpatialLayerControls
          layers={layers}
          visibility={visibility}
          onToggle={toggleLayer}
          error={layersError}
          onRetry={retryLayers}
        />
      )}
      {(featureError ||
        layersError ||
        layersLoading ||
        permissionFiltered ||
        !feature) && (
        <div className="absolute bottom-2 left-2 z-[1000] max-w-[70%] rounded bg-white/95 px-2 py-1 text-[10px] text-amber-800 shadow">
          {getSpatialStatusMessage({
            featureError,
            layersError,
            layersLoading,
            permissionFiltered,
          })}
          {featureError && (
            <button
              type="button"
              onClick={() => setFeatureRetry((current) => current + 1)}
              className="ml-2 underline"
            >
              Retry
            </button>
          )}
        </div>
      )}
      {feature?.meta.attribution && mapReady && (
        <div className="absolute bottom-2 right-2 z-[1000] max-w-[45%] rounded bg-white/90 px-2 py-1 text-[9px] text-gray-600 shadow">
          {feature.meta.attribution}
          {feature.meta.datasetDate ? ` · ${feature.meta.datasetDate}` : ''}
        </div>
      )}
    </div>
  );
}
