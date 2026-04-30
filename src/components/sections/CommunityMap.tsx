'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';

type Listing = {
  _id: string;
  name: string;
  slug: string;
  listingType: string;
  description?: string;
  location?: string;
  geopoint?: { lat: number; lng: number } | null;
  contactInfo?: string;
  featured?: boolean;
};

type Props = {
  section: {
    heading?: string;
    description?: string;
    centerLat?: number;
    centerLng?: number;
    zoom?: number;
    listings?: Listing[];
  };
};

const typeIcons: Record<string, string> = {
  school: '🏫',
  clinic: '🏥',
  business: '💼',
  accommodation: '🏠',
  church: '⛪',
  facility: '🏛️',
  area: '🏘️',
};

const typeLabels: Record<string, string> = {
  school: 'Schools',
  clinic: 'Clinics',
  business: 'Businesses',
  accommodation: 'Accommodation',
  church: 'Churches',
  facility: 'Facilities',
  area: 'Villages / Areas',
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

const LeafletMap = dynamic(() => import('./CommunityMapLeaflet'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
      Loading map…
    </div>
  ),
});

export default function CommunityMap({ section }: Props) {
  const { heading, description, centerLat, centerLng, zoom, listings } =
    section;

  const geoListings = useMemo(
    () => listings?.filter((l) => l.geopoint?.lat && l.geopoint?.lng) ?? [],
    [listings]
  );

  const types = useMemo(() => {
    const set = new Set(geoListings.map((l) => l.listingType));
    return Array.from(set).sort();
  }, [geoListings]);

  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filtered = activeFilter
    ? geoListings.filter((l) => l.listingType === activeFilter)
    : geoListings;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          {description && (
            <p className="text-xl text-gray-600">{description}</p>
          )}
        </div>

        {types.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <button
              type="button"
              onClick={() => setActiveFilter(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !activeFilter
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({geoListings.length})
            </button>
            {types.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  setActiveFilter(activeFilter === type ? null : type)
                }
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === type
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={
                  activeFilter === type
                    ? { backgroundColor: typeColors[type] || '#6b7280' }
                    : undefined
                }
              >
                {typeIcons[type]} {typeLabels[type] || type} (
                {geoListings.filter((l) => l.listingType === type).length})
              </button>
            ))}
          </div>
        )}

        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <LeafletMap
            listings={filtered}
            centerLat={centerLat ?? -28.7}
            centerLng={centerLng ?? 30.5}
            zoom={zoom ?? 12}
            typeColors={typeColors}
            typeIcons={typeIcons}
          />
        </div>

        {geoListings.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No listings with map coordinates yet.
          </p>
        )}
      </div>
    </section>
  );
}
