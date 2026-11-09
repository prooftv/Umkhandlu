'use client';

import dynamic from 'next/dynamic';
import type { MapBoundary, MapRecord } from './GovernanceMapLeaflet';

const GovernanceMapLeaflet = dynamic(() => import('./GovernanceMapLeaflet'), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
      Loading map…
    </div>
  ),
});

export default function GovernanceMapClient(props: {
  records: MapRecord[];
  boundaries: MapBoundary[];
  centre: [number, number];
  zoom: number;
}) {
  return <GovernanceMapLeaflet {...props} />;
}
