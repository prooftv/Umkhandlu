import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Image } from 'next-sanity/image';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import LocationPin from '@/components/modules/LocationPin';
import ShareWhatsApp from '@/components/modules/ShareWhatsApp';
import { Badge } from '@/components/ui/Badge';
import { serverEnv } from '@/env/serverEnv';
import { client } from '@/lib/sanity/client/client';
import { sanityFetch } from '@/lib/sanity/client/live';
import { urlForImage } from '@/lib/sanity/client/utils';
import { areaDetailQuery, areaSlugs } from '@/lib/sanity/queries/queries';

type Props = {
  params: Promise<{ slug: string }>;
};

type AreaData = NonNullable<
  Awaited<ReturnType<typeof sanityFetch<typeof areaDetailQuery>>>['data']
>;

function AreaInduna({ induna }: { induna: AreaData['induna'] }) {
  if (!induna) return null;
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Induna</h2>
      <Link
        href={`/people/${induna.slug}`}
        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
      >
        {induna.image?.asset?._ref && (
          <Image
            src={
              urlForImage(induna.image)
                ?.width(96)
                .height(96)
                .fit('crop')
                .url() as string
            }
            alt={`${induna.firstName} ${induna.lastName}`}
            width={96}
            height={96}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        <div>
          <p className="font-semibold">
            {induna.firstName} {induna.lastName}
          </p>
          {induna.role && (
            <p className="text-sm text-gray-500">{induna.role}</p>
          )}
        </div>
      </Link>
    </section>
  );
}

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
    alternates: {
      canonical: `/areas/${slug}`,
    },
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
      <Breadcrumbs
        items={[{ label: 'Areas', href: '/' }, { label: area.name || '' }]}
      />

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

      <AreaInduna induna={area.induna} />

      {/* Map */}
      {area.relatedListings && area.relatedListings.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Area Map</h2>
          <LocationPin
            lat={area.geopoint?.lat ?? -27.82}
            lng={area.geopoint?.lng ?? 30.05}
            name={area.name}
            listingType="area"
          />
        </section>
      )}

      {/* Related Listings */}
      {area.relatedListings && area.relatedListings.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">In This Area</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {area.relatedListings.map((listing) => (
              <Link
                href={`/directory/${listing.slug}`}
                key={listing._id}
                className="bg-white block rounded-xl border border-gray-100 shadow-sm overflow-hidden"
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
                    {listing.verifiedByInduna &&
                      listing.verifiedByInduna !== 'community' && (
                        <span
                          className="ml-1 text-green-600"
                          title={
                            listing.verifiedByInduna === 'council'
                              ? 'Council Approved'
                              : 'Verified by Induna'
                          }
                        >
                          {listing.verifiedByInduna === 'council' ? '✓✓' : '✓'}
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
                  {listing.website && (
                    <a
                      href={listing.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-xs mt-1 inline-block hover:underline"
                    >
                      🌐 Website
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
              </Link>
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
              <Link
                href={`/notices/${notice.slug}`}
                key={notice._id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden block"
              >
                <div className="flex">
                  {notice.image?.asset?._ref && (
                    <div className="hidden sm:block w-32 shrink-0">
                      <Image
                        src={
                          urlForImage(notice.image)
                            ?.width(256)
                            .height(256)
                            .fit('crop')
                            .url() as string
                        }
                        alt={notice.image?.alt || notice.title}
                        width={256}
                        height={256}
                        className="object-cover w-full h-full aspect-square"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-4 flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{notice.noticeType}</Badge>
                        {notice.pinned && (
                          <span className="text-xs text-primary">📌</span>
                        )}
                      </div>
                      <h3 className="font-semibold">{notice.title}</h3>
                      {notice.excerpt && (
                        <p className="text-sm text-gray-600">
                          {notice.excerpt}
                        </p>
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
                </div>
              </Link>
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
              <Link
                href={`/programs/${program.slug}`}
                key={program._id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow block overflow-hidden"
              >
                {program.image?.asset?._ref && (
                  <div className="h-36">
                    <Image
                      src={
                        urlForImage(program.image)
                          ?.width(600)
                          .height(280)
                          .fit('crop')
                          .url() as string
                      }
                      alt={program.image?.alt || program.title}
                      width={600}
                      height={280}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="p-4">
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
              </Link>
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
              <Link
                href={`/opportunities/${opp.slug}`}
                key={opp._id}
                className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-start gap-4 block"
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
                      className="text-primary text-sm font-medium"
                    >
                      Apply →
                    </a>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Records */}
      {area.records && area.records.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Documents & Records</h2>
          <div className="space-y-3">
            {area.records.map((record) => (
              <div
                key={record._id}
                className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex justify-between items-start gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{record.recordType}</Badge>
                    {record.status && (
                      <Badge variant="secondary">{record.status}</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold">{record.title}</h3>
                  {record.summary && (
                    <p className="text-sm text-gray-600 mt-1">
                      {record.summary}
                    </p>
                  )}
                  {record.approvedBy && (
                    <p className="text-xs text-gray-500 mt-1">
                      Approved by {record.approvedBy.firstName}{' '}
                      {record.approvedBy.lastName}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  {record.date && (
                    <time
                      dateTime={record.date}
                      className="text-xs text-gray-400 block"
                    >
                      {new Date(record.date).toLocaleDateString()}
                    </time>
                  )}
                  {record.fileUrl && (
                    <a
                      href={record.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-sm font-medium"
                    >
                      Download →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Campaigns */}
      {area.campaigns && area.campaigns.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Campaigns & Initiatives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {area.campaigns.map((campaign) => (
              <Link
                href={`/campaigns/${campaign.slug}`}
                key={campaign._id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow block overflow-hidden"
              >
                {campaign.image?.asset?._ref && (
                  <div className="h-40">
                    <Image
                      src={
                        urlForImage(campaign.image)
                          ?.width(600)
                          .height(300)
                          .fit('crop')
                          .url() as string
                      }
                      alt={campaign.image?.alt || campaign.title}
                      width={600}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary">{campaign.status}</Badge>
                    <span className="text-xs text-gray-500">
                      {campaign.campaignType}
                    </span>
                  </div>
                  <h3 className="font-semibold">{campaign.title}</h3>
                  {campaign.sponsor && (
                    <p className="text-sm text-gray-500 mt-1">
                      by {campaign.sponsor.name}
                    </p>
                  )}
                  {campaign.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {campaign.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 pt-6 border-t border-gray-100">
        <ShareWhatsApp title={area.name || ''} />
      </div>
    </div>
  );
}
