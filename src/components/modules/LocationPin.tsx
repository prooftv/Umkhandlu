'use client';

import dynamic from 'next/dynamic';

type Props = {
  lat: number;
  lng: number;
  name: string;
  listingType?: string;
};

const typeColors: Record<string, string> = {
  school: '#3b82f6',
  clinic: '#ef4444',
  business: '#f59e0b',
  accommodation: '#8b5cf6',
  church: '#6366f1',
  facility: '#14b8a6',
  area: '#22c55e',
};

const LeafletPin = dynamic(() => import('./LocationPinLeaflet'), {
  ssr: false,
  loading: () => (
    <div className="h-[250px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
      Loading map…
    </div>
  ),
});

export default function LocationPin({ lat, lng, name, listingType }: Props) {
  const color = typeColors[listingType ?? ''] || '#6b7280';
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <LeafletPin lat={lat} lng={lng} name={name} color={color} />
    </div>
  );
}
