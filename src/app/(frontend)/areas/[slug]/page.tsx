import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Image } from 'next-sanity/image';
import { Badge } from '@/components/ui/Badge';
import { serverEnv } from '@/env/serverEnv';
import { client } from '@/lib/sanity/client/client';
import { sanityFetch } from '@/lib/sanity/client/live';
import { urlForImage } from '@/lib/sanity/client/utils';
import { areaDetailQuery, areaSlugs } from '@/lib/sanity/queries/queries';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const { data: area } = await sanityFetch({
    query: areaDetailQuery,
    params: { slug },
  });

  if (!area) return {};

  return {
    title: area.name,
    description: area.description || undefined,
  };
}

export async function generateStaticParams() {
  const slugs = await client.fetch(areaSlugs, {
    limit: serverEnv.MAX_STATIC_PARAMS,
  });
  return slugs
    ? slugs.filter((slug) => slug !== null).map((slug) => ({ slug }))
    : [];
}

export default async function AreaPage(props: Props) {
  const { slug } = await props.params;
  const { data: area } = await sanityFetch({
    query: areaDetailQuery,
    params: { slug },
  });

  if (!area) notFound();

  return (
    <div className="container mx-auto py-12">
      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{area.name}</h1>
        {area.description && (
          <p className="text-xl text-gray-600 max-w-3xl">{area.description}</p>
        )}
        {area.location && (
          <p className="text-gray-500 mt-2">📍 {area.location}</p>
        )}
      </div>

      {/* Induna */}
      {area.induna && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Induna</h2>
          <Link
            href={`/people/${area.induna.slug}`}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {area.induna.image?.asset?._ref && (
              <Image
                src={
                  urlForImage(area.induna.image)
                    ?.width(96)
                    .height(96)
                    .fit('crop')
                    .url() as string
                }
                alt={`${area.induna.firstName} ${area.induna.lastName}`}
                width={96}
                height={96}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-semibold">
                {area.induna.firstName} {area.induna.lastName}
              </p>
              {area.induna.role && (
                <p className="text-sm text-gray-500">{area.induna.role}</p>
              )}
            </div>
          </Link>
        </section>
      )}

      {/* Related Listings */}
      {area.relatedListings && area.relatedListings.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">In This Area</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {area.relatedListings.map((listing) => (
              <article
                key={listing._id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {listing.image?.asset?._ref && (
                  <div className="relative h-36">
                    <Image
                      src={
                        urlForImage(listing.image)
                          ?.width(400)
                          .height(200)
                          .fit('crop')
                          .url() as string
                      }
                      alt={listing.image?.alt || listing.name}
                      width={400}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {listing.listingType}
                  </p>
                  <h3 className="font-semibold">
                    {listing.name}
                    {listing.verifiedByInduna && (
                      <span className="ml-1 text-green-600" title="Verified">
                        ✓
                      </span>
                    )}
                  </h3>
                  {listing.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {listing.description}
                    </p>
                  )}
                  {listing.location && (
                    <p className="text-xs text-gray-500 mt-2">
                      📍 {listing.location}
                    </p>
                  )}
                  {listing.contactInfo && (
                    <p className="text-xs text-gray-500">
                      📞 {listing.contactInfo}
                    </p>
                  )}
                  {listing.whatsappContact && (
                    <a
                      href={`https://wa.me/${listing.whatsappContact.replace(/[^0-9+]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 text-xs mt-1 inline-block hover:underline"
                    >
                      💬 WhatsApp
                    </a>
                  )}
                  {listing.operatingHours && (
                    <p className="text-xs text-gray-500 mt-1">
                      🕐 {listing.operatingHours}
                    </p>
                  )}
                  {listing.servicesOffered &&
                    listing.servicesOffered.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {listing.servicesOffered.map((service) => (
                          <span
                            key={service}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Notices */}
      {area.notices && area.notices.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Notices</h2>
          <div className="space-y-3">
            {area.notices.map((notice) => (
              <div
                key={notice._id}
                className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex justify-between items-start gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{notice.noticeType}</Badge>
                    {notice.pinned && (
                      <span className="text-xs text-pink-600">📌</span>
                    )}
                  </div>
                  <h3 className="font-semibold">{notice.title}</h3>
                  {notice.excerpt && (
                    <p className="text-sm text-gray-600">{notice.excerpt}</p>
                  )}
                </div>
                {notice.date && (
                  <time
                    dateTime={notice.date}
                    className="text-xs text-gray-400 shrink-0"
                  >
                    {new Date(notice.date).toLocaleDateString()}
                  </time>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Programs */}
      {area.programs && area.programs.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Programs & Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {area.programs.map((program) => (
              <div
                key={program._id}
                className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary">{program.status}</Badge>
                  <span className="text-xs text-gray-500">
                    {program.programType}
                  </span>
                </div>
                <h3 className="font-semibold">{program.title}</h3>
                {program.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {program.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Opportunities */}
      {area.opportunities && area.opportunities.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Opportunities</h2>
          <div className="space-y-3">
            {area.opportunities.map((opp) => (
              <div
                key={opp._id}
                className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex justify-between items-start gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge>{opp.opportunityType}</Badge>
                    {opp.organization && (
                      <span className="text-xs text-gray-500">
                        {opp.organization}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold">{opp.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {opp.description}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {opp.deadline && (
                    <time
                      dateTime={opp.deadline}
                      className="text-xs text-gray-400 block"
                    >
                      Closes {new Date(opp.deadline).toLocaleDateString()}
                    </time>
                  )}
                  {opp.link && (
                    <a
                      href={opp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 text-sm font-medium"
                    >
                      Apply →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
