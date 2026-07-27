import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from 'next-sanity';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import CustomPortableText from '@/components/modules/PortableText';
import ShareWhatsApp from '@/components/modules/ShareWhatsApp';
import { Badge } from '@/components/ui/Badge';
import { serverEnv } from '@/env/serverEnv';
import { client } from '@/lib/sanity/client/client';
import { sanityFetch } from '@/lib/sanity/client/live';
import { recordDetailQuery, recordSlugs } from '@/lib/sanity/queries/queries';

type Props = {
  params: Promise<{ slug: string }>;
};

type RecordData = NonNullable<
  Awaited<ReturnType<typeof sanityFetch<typeof recordDetailQuery>>>['data']
>;

const typeLabels: Record<string, string> = {
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

const statusLabels: Record<string, { label: string; variant: string }> = {
  adopted: { label: '✓ Adopted', variant: 'default' },
  approved: { label: '✓ Approved', variant: 'default' },
  pending: { label: '⏳ Pending', variant: 'secondary' },
  open: { label: '◯ Open', variant: 'secondary' },
  rejected: { label: '✗ Rejected', variant: 'destructive' },
  resolved: { label: '✓ Resolved', variant: 'default' },
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
  const hasVerification = record.verificationNote;
  const hasSource = record.source;

  if (
    !hasApproval &&
    !hasArea &&
    !hasCampaign &&
    !hasVerification &&
    !hasSource
  )
    return null;

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
            🏘️ {record.relatedArea.name}
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
            💚 {record.relatedCampaign.title}
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
      {record.verificationNote && (
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Verification
          </p>
          <p className="text-sm text-gray-700">{record.verificationNote}</p>
        </div>
      )}
    </div>
  );
}

type ChildRecord = {
  _id: string;
  title: string | null;
  slug: string | null;
  recordType: string | null;
  date: string | null;
  status: string | null;
  childRecords?: ChildRecord[] | null;
};

function RecordChildNode({ child }: { child: ChildRecord }) {
  return (
    <li>
      <Link
        href={`/records/${child.slug}`}
        className="text-sm text-primary hover:underline"
      >
        {typeLabels[child.recordType ?? ''] || child.recordType} → {child.title}
      </Link>
      {child.status && (
        <span className="text-xs text-gray-400 ml-1">— {child.status}</span>
      )}
      {child.childRecords && child.childRecords.length > 0 && (
        <ul className="ml-4 mt-1 space-y-1 border-l border-amber-100 pl-3">
          {child.childRecords.map((grandchild) => (
            <RecordChildNode key={grandchild._id} child={grandchild} />
          ))}
        </ul>
      )}
    </li>
  );
}

function RecordLineage({ record }: { record: RecordData }) {
  const hasOrigin = record.originNotice;
  const hasParent = record.parentRecord;
  const hasChildren = record.childRecords && record.childRecords.length > 0;

  if (!hasOrigin && !hasParent && !hasChildren) return null;

  return (
    <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 mb-8 space-y-3">
      <p className="text-xs text-amber-700 uppercase tracking-wide font-semibold mb-2">
        Governance Lineage
      </p>
      {record.originNotice && (
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-500">Origin Notice</span>
          <Link
            href={`/notices/${record.originNotice.slug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            📢 {record.originNotice.title}
          </Link>
        </div>
      )}
      {record.parentRecord && (
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-500">Produced From</span>
          <Link
            href={`/records/${record.parentRecord.slug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            📄 {record.parentRecord.title}
          </Link>
        </div>
      )}
      {record.childRecords && record.childRecords.length > 0 && (
        <div className="pt-2 border-t border-amber-200">
          <p className="text-xs text-gray-500 mb-2">Produced Records</p>
          <ul className="space-y-1">
            {record.childRecords.map((child) => (
              <RecordChildNode key={child._id} child={child as ChildRecord} />
            ))}
          </ul>
        </div>
      )}
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

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const { data } = await sanityFetch({
    query: recordDetailQuery,
    params: { slug },
  });
  if (!data) return {};
  return {
    title: data.title,
    description: data.summary || undefined,
    alternates: { canonical: `/records/${slug}` },
  };
}

export async function generateStaticParams() {
  const slugs = await client.fetch(recordSlugs, {
    limit: serverEnv.MAX_STATIC_PARAMS,
  });
  return slugs ? slugs.filter((s) => s !== null).map((slug) => ({ slug })) : [];
}

export default async function RecordPage(props: Props) {
  const { slug } = await props.params;
  const { data: record } = await sanityFetch({
    query: recordDetailQuery,
    params: { slug },
  });

  if (!record) notFound();

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Breadcrumbs
        items={[
          { label: 'Records', href: '/records' },
          { label: record.title || '' },
        ]}
      />

      <RecordHeader record={record} />
      <RecordLineage record={record} />
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
    </div>
  );
}
