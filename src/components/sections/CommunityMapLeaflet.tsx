'use client';

import type L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import SpatialLayerControls from '@/components/modules/SpatialLayerControls';
import { createMap, loadLeafletCss } from '@/lib/map/leaflet-utils';
import type {
  SpatialMapBounds,
  SpatialMapFeature,
  SpatialMapLayer,
} from '@/lib/spatial/map-layers';
import { toggleSpatialDatasetSelection } from '@/lib/spatial/map-layers';
import { renderSpatialMapLayers } from '@/lib/spatial/render-map-layers';
import { useSpatialMapLayers } from '@/lib/spatial/use-spatial-map-layers';

type Listing = {
  _id: string;
  name: string;
  slug: string;
  listingType: string;
  spatialFeatureId?: string | null;
  location?: string;
  contactInfo?: string;
  featured?: boolean;
  verifiedByInduna?: string;
  areaName?: string;
  imageUrl?: string;
};

type Props = {
  listings: Listing[];
  centerLat: number;
  centerLng: number;
  zoom: number;
  typeColors: Record<string, string>;
  typeIcons: Record<string, string>;
  controlCentreUrl: string;
};

function listingPopup(listing: Listing, typeColor: string): HTMLElement {
  const popup = document.createElement('div');
  const title = document.createElement('strong');
  title.textContent = listing.name;
  popup.append(title);

  for (const value of [
    listing.areaName,
    listing.location,
    listing.contactInfo,
    listing.verifiedByInduna,
  ]) {
    if (!value) continue;
    const detail = document.createElement('p');
    detail.className = 'text-xs text-gray-600';
    detail.textContent = value;
    popup.append(detail);
  }

  const link = document.createElement('a');
  link.href =
    listing.listingType === 'area'
      ? `/areas/${listing.slug}`
      : `/directory/${listing.slug}`;
  link.className = 'mt-2 inline-block text-xs font-semibold';
  link.style.color = typeColor;
  link.textContent = 'View details →';
  popup.append(link);
  return popup;
}

function renderLinkedListings({
  Leaf,
  map,
  layers,
  listings,
  typeColors,
  typeIcons,
  renderedLayers,
}: {
  Leaf: typeof L;
  map: L.Map;
  layers: SpatialMapLayer[];
  listings: Listing[];
  typeColors: Record<string, string>;
  typeIcons: Record<string, string>;
  renderedLayers: Map<string, L.Layer>;
}) {
  for (const [key, layer] of renderedLayers) {
    if (!key.startsWith('linked:')) continue;
    map.removeLayer(layer);
    renderedLayers.delete(key);
  }

  const listingsByFeatureId = new Map(
    listings.flatMap((listing) =>
      listing.spatialFeatureId
        ? [[listing.spatialFeatureId, listing] as const]
        : []
    )
  );
  for (const spatialLayer of layers) {
    for (const feature of spatialLayer.features) {
      if (!feature.id) continue;
      const listing = listingsByFeatureId.get(feature.id);
      if (!listing) continue;
      const colour = typeColors[listing.listingType] ?? spatialLayer.colour;
      const icon = typeIcons[listing.listingType] ?? '';
      const geoJsonFeature: GeoJSON.Feature = {
        type: 'Feature',
        id: feature.id,
        geometry: feature.geometry as GeoJSON.Geometry,
        properties: feature.properties as GeoJSON.GeoJsonProperties,
      };
      const layer = Leaf.geoJSON(geoJsonFeature, {
        style: {
          color: colour,
          weight: 3,
          fillColor: colour,
          fillOpacity: 0.25,
        },
        pointToLayer: (_geoFeature, point) =>
          Leaf.marker(point, {
            icon: Leaf.divIcon({
              className: '',
              html: `<div style="width:32px;height:32px;border-radius:50%;border:2px solid #fff;background:${colour};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.3)">${icon}</div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            }),
          }),
        onEachFeature: (_geoFeature, featureLayer) => {
          featureLayer.bindTooltip(listing.name);
          featureLayer.bindPopup(listingPopup(listing, colour));
        },
      }).addTo(map);
      renderedLayers.set(`linked:${listing._id}`, layer);
    }
  }
}

export default function CommunityMapLeaflet({
  listings,
  centerLat,
  centerLng,
  zoom,
  typeColors,
  typeIcons,
  controlCentreUrl,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const renderedLayersRef = useRef<Map<string, L.Layer>>(new Map());
  const [mapReady, setMapReady] = useState(false);
  const [bounds, setBounds] = useState<SpatialMapBounds | null>(null);
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [selectedDatasetIds, setSelectedDatasetIds] = useState<
    string[] | undefined
  >(undefined);
  const { layers, loading, error, permissionFiltered, retry } =
    useSpatialMapLayers({
      controlCentreUrl,
      bounds,
      datasetIds: selectedDatasetIds,
      enabled: mapReady,
    });

  useEffect(() => {
    if (!mapRef.current) return;
    loadLeafletCss();
    let cancelled = false;

    import('leaflet').then((Leaf) => {
      if (cancelled || !mapRef.current) return;
      const map = createMap(
        Leaf,
        mapRef.current,
        [centerLat, centerLng],
        zoom,
        { scrollWheelZoom: true }
      );
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
  }, [centerLat, centerLng, zoom]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!mapReady || !map) return;
    import('leaflet').then((Leaf) => {
      const linkedFeatureIds = new Set(
        listings.map((listing) => listing.spatialFeatureId)
      );
      const contextLayers = layers
        .map((layer) => ({
          ...layer,
          features: layer.features.filter(
            (feature) => !feature.id || !linkedFeatureIds.has(feature.id)
          ),
        }))
        .filter((layer) => layer.features.length > 0);
      renderSpatialMapLayers({
        Leaf,
        map,
        layers: contextLayers,
        visibility,
        renderedLayers: renderedLayersRef.current,
        prefix: 'context:',
      });
      renderLinkedListings({
        Leaf,
        map,
        layers,
        listings,
        typeColors,
        typeIcons,
        renderedLayers: renderedLayersRef.current,
      });
    });
  }, [layers, listings, mapReady, typeColors, typeIcons, visibility]);

  function toggleLayer(layerId: string) {
    setVisibility((current) => ({
      ...current,
      [layerId]: !(current[layerId] ?? true),
    }));
    setSelectedDatasetIds((current) =>
      toggleSpatialDatasetSelection(current, layers, layerId)
    );
  }

  const linkedFeatureIds = new Set(
    listings.flatMap((listing) =>
      listing.spatialFeatureId ? [listing.spatialFeatureId] : []
    )
  );
  const controlLayers = layers.map((layer) => ({
    ...layer,
    features: layer.features.filter(
      (feature: SpatialMapFeature) =>
        !feature.id || !linkedFeatureIds.has(feature.id)
    ),
  }));

  return (
    <div className="relative h-[500px] w-full md:h-[600px]">
      <div ref={mapRef} className="absolute inset-0" />
      {mapReady && (
        <SpatialLayerControls
          layers={controlLayers}
          visibility={visibility}
          onToggle={toggleLayer}
          error={error}
          onRetry={retry}
        />
      )}
      {(loading || error || permissionFiltered) && (
        <div className="absolute bottom-3 left-3 z-[1000] max-w-[min(32rem,70%)] rounded bg-white/95 px-2.5 py-1.5 text-xs text-amber-800 shadow">
          {error
            ? `Spatial layers unavailable: ${error}`
            : loading
              ? 'Loading spatial layers for this map view…'
              : 'Some spatial data is withheld pending redistribution permission verification.'}
        </div>
      )}
    </div>
  );
}
