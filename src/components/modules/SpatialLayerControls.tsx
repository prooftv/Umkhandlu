'use client';

import type { SpatialMapLayer } from '@/lib/spatial/map-layers';

function getLayerStatusLabel(layer: SpatialMapLayer): string {
  if (layer.requestStatus === 'loading') return 'Loading…';
  if (layer.requestStatus === 'error') return 'Unavailable';
  if (layer.requestStatus === 'permission-required')
    return 'Permission required';
  if (layer.requestStatus === 'not-requested') return 'Not loaded';
  if (layer.status === 'empty') return 'No features in dataset';
  return `${layer.returnedCount.toLocaleString()} in view`;
}

export default function SpatialLayerControls({
  layers,
  visibility,
  onToggle,
  error,
  onRetry,
}: {
  layers: SpatialMapLayer[];
  visibility: Record<string, boolean>;
  onToggle: (layerId: string) => void;
  error?: string | null;
  onRetry?: () => void;
}) {
  const groupedLayers = new Map<string, SpatialMapLayer[]>();
  for (const layer of layers) {
    const source = layer.sourceInstitution ?? layer.sourceName ?? '';
    const group = groupedLayers.get(source) ?? [];
    group.push(layer);
    groupedLayers.set(source, group);
  }

  return (
    <details className="absolute left-3 top-3 z-[1000] max-h-[min(60vh,28rem)] w-[min(18rem,calc(100vw-1.5rem))] overflow-y-auto rounded-lg border border-gray-200 bg-white/95 text-gray-800 shadow-lg backdrop-blur">
      <summary className="sticky top-0 cursor-pointer list-none bg-white/95 px-3 py-2 text-xs font-semibold shadow-sm">
        Spatial layers{' '}
        <span className="font-normal text-gray-500">({layers.length})</span>
      </summary>
      <div className="space-y-3 p-3">
        {error && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="w-full rounded border border-amber-300 px-2 py-1.5 text-left text-xs text-amber-800 hover:bg-amber-50"
          >
            Spatial layers unavailable. Retry
          </button>
        )}
        {[...groupedLayers.entries()].map(([source, sourceLayers]) => (
          <fieldset key={source || 'unattributed'} className="space-y-2">
            {source && (
              <legend className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                {source}
              </legend>
            )}
            {sourceLayers.map((layer) => (
              <label
                key={layer.id}
                className="flex cursor-pointer gap-2 text-xs"
              >
                <input
                  type="checkbox"
                  checked={visibility[layer.id] ?? true}
                  onChange={() => onToggle(layer.id)}
                  className="mt-0.5 shrink-0"
                />
                <span
                  className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: layer.colour }}
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="block leading-snug">{layer.label}</span>
                  <span className="block text-[10px] text-gray-500">
                    {getLayerStatusLabel(layer)}
                    {layer.truncated ? ' · results limited' : ''}
                    {layer.datasetDate ? ` · ${layer.datasetDate}` : ''}
                  </span>
                  {layer.attribution && (
                    <span className="block text-[10px] leading-snug text-gray-500">
                      {layer.attribution}
                    </span>
                  )}
                </span>
              </label>
            ))}
          </fieldset>
        ))}
      </div>
    </details>
  );
}
