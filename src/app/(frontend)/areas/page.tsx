import type { Metadata } from 'next';
import Link from 'next/link';
import { Image } from 'next-sanity/image';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import { sanityFetch } from '@/lib/sanity/client/live';
import { urlForImage } from '@/lib/sanity/client/utils';
import { areaListPageQuery } from '@/lib/sanity/queries/queries';

export const metadata: Metadata = {
  title: 'Areas',
  description: 'Izigodi and areas under the Traditional Council.',
};

export default async function AreasPage() {
  const { data: areas } = await sanityFetch({ query: areaListPageQuery });

  return (
    <div className="container mx-auto py-12">
      <Breadcrumbs items={[{ label: 'Areas' }]} />

      <h1 className="text-3xl md:text-4xl font-bold mb-8">Areas</h1>

      {!areas || areas.length === 0 ? (
        <p className="text-gray-500">No areas listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area) => (
            <Link
              key={area._id}
              href={`/areas/${area.slug}`}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden block"
            >
              {area.image?.asset?._ref && (
                <div className="relative h-40">
                  <Image
                    src={
                      urlForImage(area.image)
                        ?.width(600)
                        .height(300)
                        .fit('crop')
                        .url() as string
                    }
                    alt={area.name || ''}
                    width={600}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="font-semibold text-lg">{area.name}</h2>
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
                {!area.induna && (
                  <p className="text-xs text-amber-600 mt-2">
                    No Induna assigned
                  </p>
                )}
                {area.location && (
                  <p className="text-xs text-gray-400 mt-1">
                    📍 {area.location}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
