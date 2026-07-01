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
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Induna</h2>
      {induna ? (
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
      ) : (
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <p className="text-sm text-amber-800 font-medium">
            No recognised Induna currently assigned to this area.
          </p>
        </div>
      )}
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

function ListingCard({
  listing,
}: {
  listing: NonNullable<AreaData['relatedListings']>[number];
}) {
  return (
    <Link
      href={`/directory/${listing.slug}`}
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
            alt={listing.image?.alt || listing.name || ''}
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
          <p className="text-xs text-gray-500 mt-2">📍 {listing.location}</p>
        )}
        {listing.contactInfo && (
          <p className="text-xs text-gray-500">📞 {listing.contactInfo}</p>
        )}
        {listing.whatsappContact && (
          <span className="text-green-600 text-xs mt-1 inline-block">
            💬 WhatsApp
          </span>
        )}
        {listing.website && (
          <span className="text-primary text-xs mt-1 inline-block ml-2">
            🌐 Website
          </span>
        )}
        {listing.operatingHours && (
          <p className="text-xs text-gray-500 mt-1">
            🕐 {listing.operatingHours}
          </p>
        )}
        {listing.servicesOffered && listing.servicesOffered.length > 0 && (
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
  );
}

function NoticeCard({
  notice,
}: {
  notice: NonNullable<AreaData['notices']>[number];
}) {
  return (
    <Link
      href={`/notices/${notice.slug}`}
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
              alt={notice.image?.alt || notice.title || ''}
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
      </div>
    </Link>
  );
}

function ProgramCard({
  program,
}: {
  program: NonNullable<AreaData['programs']>[number];
}) {
  return (
    <Link
      href={`/programs/${program.slug}`}
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
            alt={program.image?.alt || program.title || ''}
            width={600}
            height={280}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary">{program.status}</Badge>
          <span className="text-xs text-gray-500">{program.programType}</span>
        </div>
        <h3 className="font-semibold">{program.title}</h3>
        {program.description && (
          <p className="text-sm text-gray-600 mt-1">{program.description}</p>
        )}
      </div>
    </Link>
  );
}

function OpportunityCard({
  opp,
}: {
  opp: NonNullable<AreaData['opportunities']>[number];
}) {
  return (
    <Link
      href={`/opportunities/${opp.slug}`}
      className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-start gap-4 block"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge>{opp.opportunityType}</Badge>
          {opp.organization && (
            <span className="text-xs text-gray-500">{opp.organization}</span>
          )}
        </div>
        <h3 className="font-semibold">{opp.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{opp.description}</p>
      </div>
      <div className="text-right shrink-0">
        {opp.deadline && (
          <time dateTime={opp.deadline} className="text-xs text-gray-400 block">
            Closes {new Date(opp.deadline).toLocaleDateString()}
          </time>
        )}
      </div>
    </Link>
  );
}

function RecordCard({
  record,
}: {
  record: NonNullable<AreaData['records']>[number];
}) {
  return (
    <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex justify-between items-start gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline">{record.recordType}</Badge>
          {record.status && (
            <Badge variant="secondary">
              {record.status.charAt(0).toUpperCase()}
              {record.status.slice(1)}
            </Badge>
          )}
        </div>
        <h3 className="font-semibold">
          {record.slug ? (
            <Link
              href={`/records/${record.slug}`}
              className="hover:text-primary transition-colors"
            >
              {record.title}
            </Link>
          ) : (
            record.title
          )}
        </h3>
        {record.summary && (
          <p className="text-sm text-gray-600 mt-1">{record.summary}</p>
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
          <time dateTime={record.date} className="text-xs text-gray-400 block">
            {new Date(record.date).toLocaleDateString()}
          </time>
        )}
        {record.evidence && record.evidence.length > 0 && (
          <a
            href={record.evidence[0].url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-sm font-medium"
          >
            📎 {record.evidence.length} file
            {record.evidence.length > 1 ? 's' : ''}
          </a>
        )}
      </div>
    </div>
  );
}

function CampaignCard({
  campaign,
}: {
  campaign: NonNullable<AreaData['campaigns']>[number];
}) {
  return (
    <Link
      href={`/campaigns/${campaign.slug}`}
      className="bg-white block rounded-xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {campaign.image?.asset?._ref && (
        <Image
          src={
            urlForImage(campaign.image)?.width(600).fit('max').url() as string
          }
          alt={campaign.image?.alt || campaign.title || ''}
          width={600}
          height={400}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="w-full h-auto"
        />
      )}
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {campaign.campaignType === 'csr'
            ? 'initiative'
            : campaign.campaignType}
        </p>
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
  );
}

function DevNoticeCard({
  notice,
}: {
  notice: NonNullable<AreaData['developmentNotices']>[number];
}) {
  return (
    <Link
      href={`/development-notices/${notice.slug}`}
      className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-start gap-4 block"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant={notice.status === 'open' ? 'default' : 'secondary'}>
            {notice.status === 'open' ? '🟢 Open for Comment' : notice.status}
          </Badge>
          <span className="text-xs text-gray-500">{notice.noticeType}</span>
        </div>
        <h3 className="font-semibold">{notice.title}</h3>
        {notice.applicant && (
          <p className="text-sm text-gray-500 mt-1">
            Applicant: {notice.applicant}
          </p>
        )}
      </div>
      <div className="text-right shrink-0">
        {notice.commentDeadline && (
          <time
            dateTime={notice.commentDeadline}
            className="text-xs text-gray-400 block"
          >
            Deadline: {new Date(notice.commentDeadline).toLocaleDateString()}
          </time>
        )}
      </div>
    </Link>
  );
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
        items={[{ label: 'Areas', href: '/areas' }, { label: area.name || '' }]}
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

      {/* Map + Listings */}
      {area.relatedListings && area.relatedListings.length > 0 && (
        <>
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Area Map</h2>
            <LocationPin
              lat={area.geopoint?.lat ?? -27.82}
              lng={area.geopoint?.lng ?? 30.05}
              name={area.name || ''}
              listingType="area"
            />
          </section>
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">In This Area</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {area.relatedListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* Notices */}
      {area.notices && area.notices.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Notices</h2>
          <div className="space-y-3">
            {area.notices.map((notice) => (
              <NoticeCard key={notice._id} notice={notice} />
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
              <ProgramCard key={program._id} program={program} />
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
              <OpportunityCard key={opp._id} opp={opp} />
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
              <RecordCard key={record._id} record={record} />
            ))}
          </div>
        </section>
      )}

      {/* Campaigns */}
      {area.campaigns && area.campaigns.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Campaigns & Initiatives</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {area.campaigns.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
        </section>
      )}

      {/* Development Notices */}
      {area.developmentNotices && area.developmentNotices.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            Development & Statutory Notices
          </h2>
          <div className="space-y-3">
            {area.developmentNotices.map((notice) => (
              <DevNoticeCard key={notice._id} notice={notice} />
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
