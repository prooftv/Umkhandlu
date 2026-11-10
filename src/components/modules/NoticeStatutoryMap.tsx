'use client';

import type L from 'leaflet';
import { useCallback, useEffect, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type GeoJSONGeometry = { type: string; coordinates: unknown };

type LayerEntry = {
  id: string;
  label: string;
  role: string;
  geometryType: string;
  sourceOrg: string;
  availability: 'available' | 'pending-permission' | 'not-available';
  permissionNote: string | null;
  attribution: string | null;
  statutoryRelevance: string;
  features?: {
    type: 'FeatureCollection';
    features: Array<{
      type: 'Feature';
      geometry: GeoJSONGeometry;
      properties: Record<string, unknown>;
    }>;
    meta: { dataset: string; attribution: string | null; count: number };
  } | null;
};

type NoticeLayersResponse = {
  noticeType: string;
  layers: LayerEntry[];
  generatedAt: string;
  disclaimer: string;
};

export type Props = {
  lat: number;
  lng: number;
  name: string;
  noticeType: string;
  locationPrecision?: string | null;
  wardBoundary?: {
    geometry: GeoJSONGeometry;
    source: string | null;
    date: string | null;
  } | null;
  siteBoundary?: {
    geometry: GeoJSONGeometry;
    source: string | null;
    date: string | null;
  } | null;
  wardName?: string | null;
  municipality?: string | null;
  mapDeepLink?: string | null;
  controlCentreUrl: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const PRECISION_META: Record<string, { label: string; colour: string }> = {
  verified: { label: 'Verified coordinates', colour: '#16a34a' },
  'operator-provided': {
    label: 'Operator-provided location',
    colour: '#d97706',
  },
  approximate: { label: 'Approximate location', colour: '#dc2626' },
  'locality-only': { label: 'Locality association only', colour: '#6b7280' },
};

const ROLE_STYLE: Record<
  string,
  { color: string; fillColor: string; weight: number; fillOpacity: number }
> = {
  administrative: {
    color: '#6b7280',
    fillColor: '#6b7280',
    weight: 1.5,
    fillOpacity: 0.04,
  },
  community: {
    color: '#7c3aed',
    fillColor: '#7c3aed',
    weight: 1.5,
    fillOpacity: 0.05,
  },
  site: {
    color: '#2563eb',
    fillColor: '#2563eb',
    weight: 2,
    fillOpacity: 0.06,
  },
  proximity: {
    color: '#dc2626',
    fillColor: '#dc2626',
    weight: 1,
    fillOpacity: 0.08,
  },
  context: {
    color: '#d97706',
    fillColor: '#d97706',
    weight: 1,
    fillOpacity: 0.05,
  },
};

const AVAIL_COLOUR: Record<string, string> = {
  available: 'bg-green-100 text-green-800',
  'pending-permission': 'bg-amber-100 text-amber-800',
  'not-available': 'bg-gray-100 text-gray-500',
};

const AVAIL_LABEL: Record<string, string> = {
  available: 'Available',
  'pending-permission': 'Pending permission',
  'not-available': 'Not available',
};

// ─── Leaflet helpers ──────────────────────────────────────────────────────────

function loadLeafletCss() {
  if (document.querySelector('link[href*="leaflet"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);
}

function addGeoJSONLayer(
  Leaf: typeof L,
  map: L.Map,
  geometry: GeoJSONGeometry,
  style: L.PathOptions,
  tooltip: string,
  onClick?: (e: L.LeafletMouseEvent) => void
): L.GeoJSON | null {
  try {
    const layer = Leaf.geoJSON(
      { type: 'Feature', geometry, properties: {} } as GeoJSON.Feature,
      { style }
    );
    layer.bindTooltip(tooltip, { sticky: true });
    if (onClick) layer.on('click', onClick);
    layer.addTo(map);
    return layer;
  } catch {
    return null;
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LayerToggle({
  layer,
  visible,
  onToggle,
}: {
  layer: LayerEntry;
  visible: boolean;
  onToggle: () => void;
}) {
  const style = ROLE_STYLE[layer.role] ?? ROLE_STYLE.administrative;
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
        visible ? 'bg-gray-100' : 'opacity-50 hover:opacity-75'
      }`}
    >
      <span
        className="shrink-0 w-3 h-3 rounded-sm border"
        style={{
          background: visible ? `${style.fillColor}30` : 'transparent',
          borderColor: style.color,
        }}
      />
      <span className="flex-1 min-w-0 truncate font-medium">{layer.label}</span>
      {layer.availability !== 'available' && (
        <span
          className={`shrink-0 text-[10px] px-1 py-0.5 rounded ${AVAIL_COLOUR[layer.availability]}`}
        >
          {layer.availability === 'pending-permission' ? 'pending' : 'n/a'}
        </span>
      )}
    </button>
  );
}

function LayerCatalogue({ layers }: { layers: LayerEntry[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1"
      >
        Layer catalogue {open ? '▴' : '▾'}
      </button>
      {open && (
        <div className="mt-2 space-y-3">
          {layers.map((l) => (
            <div key={l.id} className="text-xs space-y-0.5">
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-gray-800">{l.label}</span>
                <span
                  className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded font-medium ${AVAIL_COLOUR[l.availability]}`}
                >
                  {AVAIL_LABEL[l.availability]}
                </span>
              </div>
              <p className="text-gray-500">{l.sourceOrg}</p>
              <p className="text-gray-400 italic">{l.statutoryRelevance}</p>
              {l.permissionNote && (
                <p className="text-amber-600">{l.permissionNote}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FeaturePanel({
  feature,
  onClose,
}: {
  feature: {
    label: string;
    props: Record<string, unknown>;
    role: string;
  } | null;
  onClose: () => void;
}) {
  if (!feature) return null;
  const displayProps = Object.entries(feature.props).filter(
    ([k]) =>
      ![
        'FID',
        'Shape_Area',
        'Shape_Leng',
        'Shape__Area',
        'Shape__Length',
        'DATE',
      ].includes(k)
  );
  return (
    <div className="mt-3 border border-gray-200 rounded-lg p-3 bg-white text-xs space-y-2">
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-gray-800">{feature.label}</p>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 shrink-0"
        >
          ✕
        </button>
      </div>
      <div className="space-y-0.5">
        {displayProps.map(([k, v]) => (
          <div key={k} className="flex gap-2">
            <span className="text-gray-400 shrink-0 w-24 truncate">{k}</span>
            <span className="text-gray-700 break-all">{String(v)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Map init helpers (extracted to reduce cognitive complexity) ─────────────

function initBasemap(
  Leaf: typeof L,
  container: HTMLDivElement,
  lat: number,
  lng: number
): L.Map {
  const map = Leaf.map(container, { scrollWheelZoom: false }).setView(
    [lat, lng],
    13
  );
  Leaf.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);
  return map;
}

function addWardLayer(
  Leaf: typeof L,
  map: L.Map,
  wardBoundary: { geometry: GeoJSONGeometry } | null | undefined,
  wardName: string | null | undefined,
  layerRefs: Map<string, L.GeoJSON>
) {
  if (!wardBoundary) return;
  const style = { ...ROLE_STYLE.administrative, opacity: 0.7 };
  const l = addGeoJSONLayer(
    Leaf,
    map,
    wardBoundary.geometry,
    style,
    wardName ?? 'Ward'
  );
  if (!l) return;
  layerRefs.set('wards-direct', l);
  try {
    map.fitBounds(l.getBounds(), { padding: [30, 30], maxZoom: 14 });
  } catch {}
}

function addSiteMarker(
  Leaf: typeof L,
  map: L.Map,
  lat: number,
  lng: number,
  name: string,
  precision: { label: string; colour: string } | null
) {
  const markerColour = precision?.colour ?? '#dc2626';
  const icon = Leaf.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${markerColour};border:2.5px solid white;box-shadow:0 1px 6px rgba(0,0,0,0.4)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
  Leaf.marker([lat, lng], { icon })
    .addTo(map)
    .bindPopup(
      `<strong>${name}</strong>${precision ? `<br/><small style="color:${markerColour}">${precision.label}</small>` : ''}`
    );
}

function syncCCLayer(
  Leaf: typeof L,
  map: L.Map,
  layer: LayerEntry,
  shouldShow: boolean,
  layerRefs: Map<string, L.GeoJSON>,
  onFeatureClick: (props: Record<string, unknown>, role: string) => void
) {
  const key = `cc-${layer.id}`;
  const existing = layerRefs.get(key);
  if (shouldShow && !existing && layer.features?.features.length) {
    const style = ROLE_STYLE[layer.role] ?? ROLE_STYLE.administrative;
    const group = Leaf.geoJSON(
      {
        type: 'FeatureCollection',
        features: layer.features.features,
      } as GeoJSON.FeatureCollection,
      {
        style,
        onEachFeature: (feature, featureLayer) => {
          const props = (feature.properties ?? {}) as Record<string, unknown>;
          const label =
            (props.WardLink as string) ??
            (props.MUNICNAME as string) ??
            (props.name as string) ??
            layer.label;
          featureLayer.bindTooltip(label, { sticky: true });
          featureLayer.on('click', () => onFeatureClick(props, layer.role));
        },
      }
    ).addTo(map);
    layerRefs.set(key, group);
  } else if (!shouldShow && existing) {
    existing.remove();
    layerRefs.delete(key);
  }
}

function SidePanel({
  panelTab,
  setPanelTab,
  precision,
  siteBoundary,
  loading,
  availableLayers,
  unavailableLayers,
  allLayers,
  visibleLayers,
  toggleLayer,
  selectedFeature,
  onCloseFeature,
}: {
  panelTab: 'layers' | 'info';
  setPanelTab: (t: 'layers' | 'info') => void;
  precision: { label: string; colour: string } | null;
  siteBoundary: unknown;
  loading: boolean;
  availableLayers: LayerEntry[];
  unavailableLayers: LayerEntry[];
  allLayers: LayerEntry[];
  visibleLayers: Set<string>;
  toggleLayer: (id: string) => void;
  selectedFeature: {
    label: string;
    props: Record<string, unknown>;
    role: string;
  } | null;
  onCloseFeature: () => void;
}) {
  return (
    <div className="md:w-64 flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white text-xs">
      <div className="flex border-b border-gray-100">
        {(['layers', 'info'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setPanelTab(tab)}
            className={`flex-1 py-2 text-xs font-medium capitalize transition-colors ${
              panelTab === tab
                ? 'bg-white text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab === 'layers' ? 'Layers' : 'Feature'}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {panelTab === 'layers' ? (
          <>
            <div className="flex items-center gap-2 px-2 py-1.5 mb-1">
              <span
                className="shrink-0 w-3 h-3 rounded-full border-2 border-white shadow"
                style={{ background: precision?.colour ?? '#dc2626' }}
              />
              <span className="text-gray-600">
                {precision?.label ?? 'Site location'}
              </span>
            </div>
            {siteBoundary && (
              <div className="flex items-center gap-2 px-2 py-1.5 mb-1">
                <span className="shrink-0 w-3 h-3 rounded-sm border-2 border-blue-500 bg-blue-50" />
                <span className="text-gray-600">Verified site boundary</span>
              </div>
            )}
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-2 pt-2 pb-1">
              Available layers
            </p>
            {loading && <p className="px-2 text-gray-400">Loading layers…</p>}
            {availableLayers.map((l) => (
              <LayerToggle
                key={l.id}
                layer={l}
                visible={visibleLayers.has(l.id)}
                onToggle={() => toggleLayer(l.id)}
              />
            ))}
            {unavailableLayers.length > 0 && (
              <>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-2 pt-3 pb-1">
                  Pending / unavailable
                </p>
                {unavailableLayers.map((l) => (
                  <LayerToggle
                    key={l.id}
                    layer={l}
                    visible={false}
                    onToggle={() => {}}
                  />
                ))}
              </>
            )}
            <LayerCatalogue layers={allLayers} />
          </>
        ) : selectedFeature ? (
          <FeaturePanel feature={selectedFeature} onClose={onCloseFeature} />
        ) : (
          <p className="px-2 py-4 text-gray-400 text-center">
            Click a feature on the map to see its details.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function NoticeStatutoryMap({
  lat,
  lng,
  name,
  noticeType,
  locationPrecision,
  wardBoundary,
  siteBoundary,
  wardName,
  municipality,
  mapDeepLink,
  controlCentreUrl,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerRefs = useRef<Map<string, L.GeoJSON>>(new Map());

  const [layers, setLayers] = useState<LayerEntry[]>([]);
  const [visibleLayers, setVisibleLayers] = useState<Set<string>>(
    new Set(['wards', 'municipalities', 'district'])
  );
  const [selectedFeature, setSelectedFeature] = useState<{
    label: string;
    props: Record<string, unknown>;
    role: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [panelTab, setPanelTab] = useState<'layers' | 'info'>('layers');

  const precision = PRECISION_META[locationPrecision ?? ''] ?? null;

  // Fetch layer profile from CC
  useEffect(() => {
    setLoading(true);
    fetch(
      `${controlCentreUrl}/api/spatial/notice-layers?noticeType=${encodeURIComponent(noticeType)}`
    )
      .then((r) => (r.ok ? (r.json() as Promise<NoticeLayersResponse>) : null))
      .then((data) => {
        if (data?.layers) setLayers(data.layers);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [noticeType, controlCentreUrl]);

  const handleFeatureClick = useCallback(
    (props: Record<string, unknown>, role: string) => {
      const label =
        (props.WardLink as string) ??
        (props.MUNICNAME as string) ??
        (props.name as string) ??
        'Feature';
      setSelectedFeature({ label, props, role });
      setPanelTab('info');
    },
    []
  );

  // Init map
  useEffect(() => {
    if (!mapRef.current) return;
    loadLeafletCss();
    let cancelled = false;
    import('leaflet').then((Leaf) => {
      if (cancelled || !mapRef.current) return;
      mapInstanceRef.current?.remove();
      layerRefs.current.clear();
      const map = initBasemap(Leaf, mapRef.current, lat, lng);
      mapInstanceRef.current = map;
      addWardLayer(Leaf, map, wardBoundary, wardName, layerRefs.current);
      if (siteBoundary) {
        const l = addGeoJSONLayer(
          Leaf,
          map,
          siteBoundary.geometry,
          ROLE_STYLE.site,
          'Verified site boundary'
        );
        if (l) layerRefs.current.set('site-boundary', l);
      }
      addSiteMarker(Leaf, map, lat, lng, name, precision);
    });
    return () => {
      cancelled = true;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
      layerRefs.current.clear();
    };
  }, [lat, lng, name, wardBoundary, siteBoundary, wardName, precision]);

  // Add/remove CC layers when layers data or visibility changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !layers.length) return;
    import('leaflet').then((Leaf) => {
      for (const layer of layers) {
        syncCCLayer(
          Leaf,
          map,
          layer,
          visibleLayers.has(layer.id),
          layerRefs.current,
          handleFeatureClick
        );
      }
    });
  }, [layers, visibleLayers, handleFeatureClick]);

  function toggleLayer(id: string) {
    setVisibleLayers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const availableLayers = layers.filter((l) => l.availability === 'available');
  const unavailableLayers = layers.filter(
    (l) => l.availability !== 'available'
  );

  return (
    <div className="space-y-3">
      {/* Map + side panel */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Map */}
        <div
          ref={mapRef}
          className="flex-1 rounded-xl overflow-hidden border border-gray-200 shadow-sm"
          style={{ height: 380, minHeight: 320 }}
        />

        {/* Side panel */}
        <SidePanel
          panelTab={panelTab}
          setPanelTab={setPanelTab}
          precision={precision}
          siteBoundary={siteBoundary}
          loading={loading}
          availableLayers={availableLayers}
          unavailableLayers={unavailableLayers}
          allLayers={layers}
          visibleLayers={visibleLayers}
          toggleLayer={toggleLayer}
          selectedFeature={selectedFeature}
          onCloseFeature={() => {
            setSelectedFeature(null);
            setPanelTab('layers');
          }}
        />
      </div>

      {/* Attribution and context row */}
      <div className="flex flex-wrap items-start justify-between gap-2 text-xs text-gray-400">
        <div className="flex flex-wrap gap-2">
          {precision && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border"
              style={{
                borderColor: precision.colour,
                color: precision.colour,
                background: `${precision.colour}12`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: precision.colour }}
              />
              {precision.label}
            </span>
          )}
          {wardName && <span>{wardName}</span>}
          {municipality && <span>{municipality}</span>}
          {wardBoundary?.source && (
            <span>
              Ward boundary: {wardBoundary.source}
              {wardBoundary.date ? ` (${wardBoundary.date})` : ''}
            </span>
          )}
          {siteBoundary && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-blue-300 text-blue-600 bg-blue-50">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
              Verified site boundary
            </span>
          )}
        </div>
        {mapDeepLink && (
          <a
            href={mapDeepLink}
            className="text-primary hover:underline font-medium shrink-0"
          >
            View on full map →
          </a>
        )}
      </div>

      {/* Disclaimer */}
      {!siteBoundary && locationPrecision !== 'verified' && (
        <p className="text-xs text-gray-400 leading-relaxed">
          The map shows the ward administrative boundary (MDB 2026) and an
          operator-provided site point. No verified site or premises boundary is
          available. The ward polygon is geographic context only — it does not
          represent the affected site.
        </p>
      )}

      {unavailableLayers.length > 0 && (
        <p className="text-xs text-amber-600 leading-relaxed">
          {
            unavailableLayers.filter(
              (l) => l.availability === 'pending-permission'
            ).length
          }{' '}
          statutory layer
          {unavailableLayers.filter(
            (l) => l.availability === 'pending-permission'
          ).length !== 1
            ? 's'
            : ''}{' '}
          (
          {unavailableLayers
            .filter((l) => l.availability === 'pending-permission')
            .map((l) => l.label)
            .join(', ')}
          ) are not yet available — data access or redistribution permission is
          pending. Absence of these layers does not imply absence of relevant
          features.
        </p>
      )}
    </div>
  );
}
