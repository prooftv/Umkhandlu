import type { Metadata } from 'next';
import Link from 'next/link';
import { Image } from 'next-sanity/image';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { sanityFetch } from '@/lib/sanity/client/live';
import { urlForImage } from '@/lib/sanity/client/utils';
import { areaListPageQuery } from '@/lib/sanity/queries/queries';

export const metadata: Metadata = {
  title: 'Areas — Amajuba District',
  description:
    'Geographic areas, wards, traditional authorities and settlements across the Amajuba District.',
};

const LEVEL_ORDER = [
  'district',
  'municipality',
  'ward',
  'traditional-authority',
  'isigodi',
  'settlement',
] as const;

const LEVEL_LABELS: Record<string, string> = {
  district: 'District Municipality',
  municipality: 'Local Municipality',
  ward: 'Ward',
  'traditional-authority': 'Traditional Authority',
  isigodi: 'Isigodi',
  settlement: 'Settlement / Locality',
};

const MUNICIPALITY_LABELS: Record<string, string> = {
  newcastle: 'Newcastle Local Municipality',
  dannhauser: 'Dannhauser Local Municipality',
  emadlangeni: 'eMadlangeni Local Municipality',
  amajuba: 'Amajuba District',
};

type AreaItem = NonNullable<
  Awaited<ReturnType<typeof sanityFetch<typeof areaListPageQuery>>>['data']
>[number];

function AreaCard({ area }: { area: AreaItem }) {
  const level = (area as AreaItem & { areaLevel?: string }).areaLevel;
  const wardNumber = (area as AreaItem & { wardNumber?: number }).wardNumber;

  return (
    <Link
      href={`/areas/${area.slug}`}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden block"
    >
      {area.image?.asset?._ref && (
        <div className="relative h-36">
          <Image
            src={
              urlForImage(area.image)
                ?.width(600)
                .height(288)
                .fit('crop')
                .url() as string
            }
            alt={area.name || ''}
            width={600}
            height={288}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {level && (
            <Badge variant="outline" className="text-xs">
              {LEVEL_LABELS[level] ?? level}
            </Badge>
          )}
          {wardNumber != null && (
            <Badge variant="secondary" className="text-xs">
              Ward {wardNumber}
            </Badge>
          )}
        </div>
        <h2 className="font-semibold text-base leading-snug">{area.name}</h2>
        {area.description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {area.description}
          </p>
        )}
        {area.induna && (
          <p className="text-xs text-gray-500 mt-2">
            Induna: {area.induna.firstName} {area.induna.lastName}
          </p>
        )}
        {area.location && (
          <p className="text-xs text-gray-400 mt-1">📍 {area.location}</p>
        )}
      </div>
    </Link>
  );
}

export default async function AreasPage() {
  const { data: areas } = await sanityFetch({ query: areaListPageQuery });

  if (!areas || areas.length === 0) {
    return (
      <div className="container mx-auto py-12">
        <Breadcrumbs items={[{ label: 'Areas' }]} />
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Areas</h1>
        <p className="text-gray-500">No areas listed yet.</p>
      </div>
    );
  }

  // Separate areas that have areaLevel from those that don't (legacy)
  const typed = areas.filter(
    (a) => !!(a as AreaItem & { areaLevel?: string }).areaLevel
  );
  const untyped = areas.filter(
    (a) => !(a as AreaItem & { areaLevel?: string }).areaLevel
  );

  // Group typed areas by municipality then level
  const byMunicipality: Record<string, typeof typed> = {};
  for (const area of typed) {
    const muni =
      (area as AreaItem & { municipality?: string }).municipality ?? 'other';
    if (!byMunicipality[muni]) byMunicipality[muni] = [];
    byMunicipality[muni].push(area);
  }

  // Sort municipalities: district first, then alphabetical
  const muniOrder = ['amajuba', 'newcastle', 'dannhauser', 'emadlangeni'];
  const sortedMunis = Object.keys(byMunicipality).sort((a, b) => {
    const ai = muniOrder.indexOf(a);
    const bi = muniOrder.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return (
    <div className="container mx-auto py-12">
      <Breadcrumbs items={[{ label: 'Areas' }]} />

      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Amajuba District Areas
        </h1>
        <p className="text-gray-600 max-w-2xl text-sm md:text-base">
          Geographic areas, wards, traditional authorities and settlements
          across Newcastle, Dannhauser and eMadlangeni local municipalities.
        </p>
      </header>

      {/* Grouped by municipality */}
      {sortedMunis.map((muni) => {
        const muniAreas = byMunicipality[muni];
        // Sort within municipality by level order then name
        const sorted = [...muniAreas].sort((a, b) => {
          const al = LEVEL_ORDER.indexOf(
            ((a as AreaItem & { areaLevel?: string }).areaLevel ??
              '') as (typeof LEVEL_ORDER)[number]
          );
          const bl = LEVEL_ORDER.indexOf(
            ((b as AreaItem & { areaLevel?: string }).areaLevel ??
              '') as (typeof LEVEL_ORDER)[number]
          );
          if (al !== bl) return al - bl;
          return (a.name ?? '').localeCompare(b.name ?? '');
        });

        return (
          <section key={muni} className="mb-12">
            <h2 className="text-xl font-bold mb-5 pb-2 border-b border-gray-200">
              {MUNICIPALITY_LABELS[muni] ?? muni}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sorted.map((area) => (
                <AreaCard key={area._id} area={area} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Legacy areas without classification */}
      {untyped.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-5 pb-2 border-b border-gray-200">
            Other Areas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {untyped.map((area) => (
              <AreaCard key={area._id} area={area} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
