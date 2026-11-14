import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { SpatialMapLayer } from '@/lib/spatial/map-layers';
import SpatialLayerControls from './SpatialLayerControls';

const spatialLayer: SpatialMapLayer = {
  id: 'schools-layer',
  datasetId: 'schools-dataset',
  status: 'available',
  requestStatus: 'error',
  label: 'Schools',
  colour: '#2563eb',
  weight: 2,
  fillOpacity: 0.2,
  featureCount: 1,
  returnedCount: 0,
  loadOnDemand: false,
  truncated: false,
  radiusKm: null,
  features: [],
  attribution: 'OpenStreetMap contributors',
  sourceId: 'osm',
  sourceName: 'OpenStreetMap',
  sourceInstitution: 'Humanitarian OpenStreetMap Team',
  publishedAt: null,
  datasetDate: '2026-01-01',
  radiusFiltered: false,
};

describe('SpatialLayerControls', () => {
  it('shows source attribution and failure state and connects layer and retry controls', () => {
    const onToggle = vi.fn();
    const onRetry = vi.fn();
    const { container } = render(
      <SpatialLayerControls
        layers={[spatialLayer]}
        visibility={{ 'schools-layer': true }}
        onToggle={onToggle}
        error="Spatial API is unavailable"
        onRetry={onRetry}
      />
    );

    const summary = container.querySelector('summary');
    if (!summary) throw new Error('Spatial layer disclosure is missing');
    fireEvent.click(summary);
    expect(container.textContent).toContain('Unavailable');
    expect(screen.getByText('OpenStreetMap contributors')).toBeTruthy();
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith('schools-layer');
    fireEvent.click(screen.getByRole('button', { name: /Retry/ }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
