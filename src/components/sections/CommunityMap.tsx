'use client';

import { ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';

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
  verifiedByInduna?: string;
  areaName?: string;
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
    <div className="h-[500px] bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
      Loading map…
    </div>
  ),
});

function FilterBar({
  types,
  counts,
  total,
  active,
  onFilter,
}: {
  types: string[];
  counts: Record<string, number>;
  total: number;
  active: string | null;
  onFilter: (type: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6 max-w-4xl mx-auto">
      <button
        type="button"
        onClick={() => onFilter(null)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          !active
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        All ({total})
      </button>
      {types.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onFilter(active === type ? null : type)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            active === type
              ? 'text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          style={
            active === type
              ? { backgroundColor: typeColors[type] || '#6b7280' }
              : undefined
          }
        >
          {typeIcons[type]} {typeLabels[type] || type} ({counts[type] || 0})
        </button>
      ))}
    </div>
  );
}

function MapLegend({ types }: { types: string[] }) {
  if (types.length <= 1) return null;
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4">
      {types.map((type) => (
        <div key={type} className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: typeColors[type] || '#6b7280' }}
          />
          <span className="text-xs text-gray-500">
            {typeLabels[type] || type}
          </span>
        </div>
      ))}
    </div>
  );
}

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

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const l of geoListings) {
      map[l.listingType] = (map[l.listingType] || 0) + 1;
    }
    return map;
  }, [geoListings]);

  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filtered = activeFilter
    ? geoListings.filter((l) => l.listingType === activeFilter)
    : geoListings;

  if (geoListings.length === 0)
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          {heading && (
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          )}
          <p className="text-gray-500">No listings with map coordinates yet.</p>
        </div>
      </section>
    );

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
          <FilterBar
            types={types}
            counts={counts}
            total={geoListings.length}
            active={activeFilter}
            onFilter={setActiveFilter}
          />
        )}

        <div className="max-w-6xl mx-auto">
          <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            <LeafletMap
              listings={filtered}
              centerLat={centerLat ?? -28.7}
              centerLng={centerLng ?? 30.5}
              zoom={zoom ?? 12}
              typeColors={typeColors}
              typeIcons={typeIcons}
            />
          </div>

          <MapLegend types={types} />

          <p className="text-center text-sm text-gray-400 mt-3">
            {filtered.length} {filtered.length === 1 ? 'listing' : 'listings'}{' '}
            shown
            {activeFilter
              ? ` · Filtered by ${typeLabels[activeFilter] || activeFilter}`
              : ''}
          </p>
        </div>

        <div className="text-center mt-8">
          <Button asChild variant="outline" size="lg">
            <Link href="/directory">
              View Full Directory <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
