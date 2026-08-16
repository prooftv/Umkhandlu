import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from 'next-sanity';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import EventContext from '@/components/modules/EventContext';
import { RecordJourney } from '@/components/modules/GovernanceJourney';
import JourneyDrawer from '@/components/modules/JourneyDrawer';
import type { LineageRecord as LR } from '@/components/modules/LineageNode';
import { LineageChain } from '@/components/modules/LineageNode';
import LineageTabs from '@/components/modules/LineageTabs';
import CustomPortableText from '@/components/modules/PortableText';
import ShareWhatsApp from '@/components/modules/ShareWhatsApp';
import { Badge } from '@/components/ui/Badge';
import { clientEnv } from '@/env/clientEnv';
import { sanityFetch } from '@/lib/sanity/client/live';
import {
  recordDetailQuery,
  settingsOgImageQuery,
} from '@/lib/sanity/queries/queries';
import { NODE_GEOPOINT } from '@/lib/siteConfig';
import { fetchWeather, type WeatherSnapshot } from '@/lib/weather';
import RecordGem from '@/components/gem/RecordGem';
import type { GemRecord } from '@/components/gem/RecordGem.types';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
};

type RecordData = NonNullable<
  Awaited<ReturnType<typeof sanityFetch<typeof recordDetailQuery>>>['data']
>;

const statusLabels: Record<string, { label: string; variant: string }> = {
  adopted: { label: '✓ Adopted', variant: 'default' },
  approved: { label: '✓ Approved', variant: 'default' },
  pending: { label: '⏳ Pending', variant: 'secondary' },
  open: { label: '◯ Open', variant: 'secondary' },
  rejected: { label: '✗ Rejected', variant: 'destructive' },
  resolved: { label: '✓ Resolved', variant: 'default' },
};

const typeLabels: Record<string, string> = {
  agenda: 'Agenda',
  minutes: 'Meeting Minutes',
  resolution: 'Resolution',
  'land-allocation': 'Land Allocation',
  'dispute-resolution': 'Dispute Resolution',
  'public-notice': 'Public Notice',
  policy: 'Policy',
  report: 'Report',
  'infrastructure-concern': 'Infrastructure Concern',
  'project-outcome': 'Project Outcome',
  'community-decision': 'Community Decision',
  'external-resource': 'External Resource',
};

function RecordHeader({ record }: { record: RecordData }) {
  const statusInfo = statusLabels[record.status ?? ''];
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Badge>
          {typeLabels[record.recordType ?? ''] || record.recordType}
        </Badge>
        {statusInfo && (
          <Badge
            variant={
              statusInfo.variant as 'default' | 'secondary' | 'destructive'
            }
          >
            {statusInfo.label}
          </Badge>
        )}
        {record.date && (
          <time dateTime={record.date} className="text-sm text-gray-500">
            {new Date(record.date).toLocaleDateString('en-ZA', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
        )}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{record.title}</h1>
      {record.summary && (
        <p className="text-lg text-gray-600">{record.summary}</p>
      )}
    </div>
  );
}

function RecordMeta({ record }: { record: RecordData }) {
  const hasApproval = record.approvedBy;
  const hasArea = record.relatedArea;
  const hasCampaign = record.relatedCampaign;
  const hasSource = record.source;

  if (!hasApproval && !hasArea && !hasCampaign && !hasSource) return null;

  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-8 space-y-3">
      {record.approvedBy && (
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-500">Approved By</span>
          <Link
            href={`/people/${record.approvedBy.slug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            {record.approvedBy.firstName} {record.approvedBy.lastName}
            {record.approvedBy.role && (
              <span className="text-gray-400"> — {record.approvedBy.role}</span>
            )}
          </Link>
        </div>
      )}
      {record.relatedArea && (
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-500">Related Area</span>
          <Link
            href={`/areas/${record.relatedArea.slug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            {record.relatedArea.name}
          </Link>
        </div>
      )}
      {record.relatedCampaign && (
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-500">Related Project</span>
          <Link
            href={`/campaigns/${record.relatedCampaign.slug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            {record.relatedCampaign.title}
          </Link>
        </div>
      )}
      {record.source && (
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-500">Source</span>
          <span className="text-sm font-medium text-gray-900">
            {record.source}
          </span>
        </div>
      )}
    </div>
  );
}

function RecordLineage({
  record,
  currentSlug,
}: {
  record: RecordData;
  currentSlug: string;
}) {
  const hasOrigin = record.originNotice;
  const hasParent = record.parentRecord;
  const hasChildren = (record.childRecords?.length ?? 0) > 0;
  const hasVerification = record.verificationNote;

  if (!hasOrigin && !hasParent && !hasChildren && !hasVerification) return null;

  const ancestors: { label: string; href: string; title: string | null }[] = [];
  if (record.originNotice) {
    ancestors.push({
      label: 'Origin Notice',
      href: `/notices/${record.originNotice.slug}`,
      title: record.originNotice.title,
    });
  }
  if (record.parentRecord) {
    ancestors.push({
      label: 'Produced From',
      href: `/records/${record.parentRecord.slug}`,
      title: record.parentRecord.title,
    });
  }

  return (
    <div className="mt-10 pt-8 border-t border-gray-100 mb-8">
      <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-4">
        Governance Lineage
      </p>
      <LineageChain
        ancestors={ancestors}
        current={{ label: 'This Record', title: record.title }}
        records={(record.childRecords ?? []) as LR[]}
        verificationNote={record.verificationNote}
        currentSlug={currentSlug}
      />
    </div>
  );
}

function RecordEvidence({ record }: { record: RecordData }) {
  const hasEvidence = record.evidence && record.evidence.length > 0;
  if (!hasEvidence && !record.externalUrl) return null;

  return (
    <div className="mb-8">
      {record.evidence && record.evidence.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
            Evidence & Attachments
          </p>
          {record.evidence.map((item) => (
            <a
              key={item._key}
              href={item.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              📎 {item.title}
            </a>
          ))}
        </div>
      )}
      {record.externalUrl && (
        <a
          href={record.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 mt-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
        >
          🔗 View External Resource
        </a>
      )}
    </div>
  );
}

type Geopoint = { lat: number; lng: number } | null | undefined;

async function resolveWeather(
  _id: string,
  date: string | null,
  geo: Geopoint,
  hasStoredContext: boolean
) {
  if (!date) return null;
  const { lat, lng } = geo ?? NODE_GEOPOINT;
  const weather = await fetchWeather(date, lat, lng);
  if (!weather) return null;
  if (!hasStoredContext) {
    fetch(`${clientEnv.NEXT_PUBLIC_SITE_URL}/api/weather-patch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id, date, lat, lng }),
    }).catch(() => null);
  }
  return weather;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const [{ data }, { data: fallbackOgUrl }] = await Promise.all([
    sanityFetch({ query: recordDetailQuery, params: { slug } }),
    sanityFetch({ query: settingsOgImageQuery }),
  ]);
  if (!data) return {};
  const imageUrl = fallbackOgUrl ?? undefined;
  return {
    title: data.title,
    description: data.summary || undefined,
    alternates: { canonical: `/records/${slug}` },
    openGraph: {
      title: data.title ?? undefined,
      description: data.summary ?? undefined,
      type: 'article',
      publishedTime: data.date ?? undefined,
      url: `/records/${slug}`,
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630 }]
        : undefined,
    },
  };
}

export default async function RecordPage(props: Props) {
  const { slug } = await props.params;
  const { data: record } = await sanityFetch({
    query: recordDetailQuery,
    params: { slug },
  });

  if (!record) notFound();

  const geo = record.relatedArea?.geopoint;
  const weather = await resolveWeather(
    record._id,
    record.date ?? null,
    geo,
    !!record.weatherContext
  ) ?? (record.weatherContext as WeatherSnapshot | null) ?? null;

  const lineageCount =
    (record.childRecords?.length ?? 0) +
    (record.originNotice ? 1 : 0) +
    (record.parentRecord ? 1 : 0);

  const recordTab = (
    <>
      <RecordMeta record={record} />
      <RecordEvidence record={record} />
      {record.content && (
        <div className="mb-8 prose max-w-none">
          <CustomPortableText value={record.content as PortableTextBlock[]} />
        </div>
      )}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <ShareWhatsApp title={record.title || ''} />
      </div>
    </>
  );

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Breadcrumbs
        items={[
          { label: 'Records', href: '/records' },
          { label: record.title || '' },
        ]}
      />
      <RecordHeader record={record} />
      <EventContext
        weather={weather}
        location={record.location}
        attendance={record.attendance}
        variant="strip"
      />
      {/* Record GEM — additive: remove this block and the page is unchanged. */}
      {(() => {
        const gemRecord: GemRecord = {
          _id: record._id,
          _type: 'record',
          title: record.title ?? '',
          slug: record.slug ?? '',
          recordType: record.recordType,
          status: record.status ?? null,
          date: record.date ?? null,
          location: record.location ?? null,
          externalUrl: record.externalUrl ?? null,
          lineageCount,
          evidence: record.evidence ?? [],
        }
        return <div className="mt-4"><RecordGem record={gemRecord} variant="card" /></div>
      })()}
      <LineageTabs
        noticeTab={recordTab}
        lineageTab={
          <>
            <RecordLineage record={record} currentSlug={slug} />
            {lineageCount > 0 && (
              <div className="mt-4">
                <JourneyDrawer slug={slug}>
                  <RecordJourney
                    originNotice={record.originNotice}
                    parentRecord={record.parentRecord}
                    current={{
                      title: record.title,
                      slug: record.slug,
                      recordType: record.recordType,
                      date: record.date,
                      status: record.status,
                      verificationNote: record.verificationNote,
                    }}
                    childRecords={(record.childRecords ?? []) as LR[]}
                    currentSlug={slug}
                  />
                </JourneyDrawer>
              </div>
            )}
          </>
        }
        lineageCount={lineageCount}
      />
    </div>
  );
}
