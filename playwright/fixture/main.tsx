import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/app/globals.css';
import SpatialLayerControls from '@/components/modules/SpatialLayerControls';
import type { SpatialMapLayer } from '@/lib/spatial/map-layers';

const layer: SpatialMapLayer = {
  id: 'fixture-schools',
  datasetId: 'fixture-schools',
  status: 'available',
  label: 'Schools',
  colour: '#2563eb',
  weight: 2,
  fillOpacity: 0.2,
  featureCount: 2,
  returnedCount: 2,
  loadOnDemand: false,
  truncated: false,
  radiusKm: null,
  features: [],
  attribution: 'OpenStreetMap contributors — ODbL.',
  sourceId: 'fixture-source',
  sourceName: 'OpenStreetMap',
  sourceInstitution: 'Humanitarian OpenStreetMap Team',
  publishedAt: '2026-10-16T00:00:00Z',
  datasetDate: '2026-10-16',
  radiusFiltered: false,
};

function Fixture() {
  const [visible, setVisible] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  return (
    <div className="relative min-h-screen p-4">
      <div
        role="img"
        aria-label="Map fixture"
        className="h-[70vh] rounded bg-gray-100"
      />
      <SpatialLayerControls
        layers={[layer]}
        visibility={{ 'fixture-schools': visible }}
        onToggle={() => setVisible((current) => !current)}
        error="Fixture spatial service unavailable"
        onRetry={() => setRetryCount((current) => current + 1)}
      />
      <p role="status" className="mt-4">
        Layer {visible ? 'active' : 'inactive'}; retries {retryCount}
      </p>
    </div>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Spatial browser fixture root element is missing');
createRoot(root).render(<Fixture />);
