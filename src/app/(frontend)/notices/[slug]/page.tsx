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
import { noticeDetailQuery, noticeSlugs } from '@/lib/sanity/queries/queries';

type Props = {
  params: Promise<{ slug: string }>;
};

type FollowUpNotice = {
  _id: string;
  title: string | null;
  slug: string | null;
  noticeType: string | null;
  date: string | null;
};

type OriginNotice = {
  title: string | null;
  slug: string | null;
  noticeType: string | null;
  date: string | null;
};

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

type AuditRecord = {
  _id: string;
  title: string | null;
  slug: string | null;
  recordType: string | null;
  date: string | null;
  status: string | null;
  childRecords?: AuditRecord[] | null;
};

function AuditNode({
  record,
  isLast,
}: {
  record: AuditRecord;
  isLast: boolean;
}) {
  const hasChildren = record.childRecords && record.childRecords.length > 0;
  return (
    <div className="relative pl-6">
      <span className="absolute left-0 top-0 text-gray-300 text-xs font-mono select-none">
        {isLast ? '└──' : '├──'}
      </span>
      <div className="pb-2">
        <Link
          href={`/records/${record.slug}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          📄 {record.title}
        </Link>
        <p className="text-xs text-gray-400 mt-0.5">
          {typeLabels[record.recordType || ''] || record.recordType}
          {record.status &&
            ` • ${record.status.charAt(0).toUpperCase()}${record.status.slice(1)}`}
          {record.date &&
            ` • ${new Date(record.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}`}
        </p>
      </div>
      {hasChildren && (
        <div
          className={`${isLast ? '' : 'border-l border-gray-200'} ml-0 space-y-0`}
        >
          {record.childRecords?.map((child, i) => (
            <AuditNode
              key={child._id}
              record={child}
              isLast={i === (record.childRecords?.length ?? 0) - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NoticeLineage({
  notice,
  followUpNotices,
}: {
  notice: {
    title: string | null;
    noticeType: string | null;
    date: string | null;
    producedRecords?: AuditRecord[] | null;
  };
  followUpNotices: FollowUpNotice[] | null;
}) {
  const hasLineage =
    (notice.producedRecords && notice.producedRecords.length > 0) ||
    (followUpNotices && followUpNotices.length > 0);

  if (!hasLineage) return null;

  return (
    <div className="mt-8 p-5 bg-amber-50 border border-amber-100 rounded-xl">
      <p className="text-xs text-amber-700 uppercase tracking-wide font-semibold mb-5">
        Governance Record Lineage
      </p>
      <div className="mb-4">
        <p className="text-sm font-medium text-amber-800">📢 {notice.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {notice.noticeType &&
            `${notice.noticeType.charAt(0).toUpperCase()}${notice.noticeType.slice(1)}`}
          {notice.date &&
            ` • ${new Date(notice.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}`}
        </p>
      </div>
      {notice.producedRecords && notice.producedRecords.length > 0 && (
        <div className="border-l border-amber-200 ml-2 pl-0 space-y-0">
          {notice.producedRecords.map((record, i) => (
            <AuditNode
              key={record._id}
              record={record}
              isLast={
                i === (notice.producedRecords?.length ?? 0) - 1 &&
                !(followUpNotices && followUpNotices.length > 0)
              }
            />
          ))}
        </div>
      )}
      {followUpNotices && followUpNotices.length > 0 && (
        <div className="border-l border-amber-200 ml-2 pl-0 mt-0 space-y-0">
          {followUpNotices.map((fu, i) => (
            <div key={fu._id} className="relative pl-6">
              <span className="absolute left-0 top-0 text-gray-300 text-xs font-mono select-none">
                {i === (followUpNotices?.length ?? 0) - 1 ? '└──' : '├──'}
              </span>
              <div className="pb-2">
                <Link
                  href={`/notices/${fu.slug}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  📢 {fu.title}
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">
                  Follow-up Meeting
                  {fu.date &&
                    ` • ${new Date(fu.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const { data } = await sanityFetch({
    query: noticeDetailQuery,
    params: { slug },
  });
  if (!data) return {};
  return {
    title: data.title,
    description: data.excerpt || undefined,
    alternates: {
      canonical: `/notices/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await client.fetch(noticeSlugs, {
    limit: serverEnv.MAX_STATIC_PARAMS,
  });
  return slugs ? slugs.filter((s) => s !== null).map((slug) => ({ slug })) : [];
}

export default async function NoticePage(props: Props) {
  const { slug } = await props.params;
  const { data: notice } = await sanityFetch({
    query: noticeDetailQuery,
    params: { slug },
  });

  if (!notice) notFound();

  const originNotice = notice.originNotice as OriginNotice | null;
  const followUpNotices = notice.followUpNotices as FollowUpNotice[] | null;

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Breadcrumbs
        items={[
          { label: 'Notices', href: '/notices' },
          { label: notice.title || '' },
        ]}
      />
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Badge>{notice.noticeType}</Badge>
          {notice.date && (
            <time dateTime={notice.date} className="text-sm text-gray-500">
              {new Date(notice.date).toLocaleDateString()}
            </time>
          )}
          {notice.pinned && (
            <span className="text-sm text-primary">📌 Pinned</span>
          )}
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{notice.title}</h1>
        {notice.relatedArea && (
          <p className="text-gray-500">
            📍{' '}
            <Link
              href={`/areas/${notice.relatedArea.slug}`}
              className="underline hover:text-gray-700"
            >
              {notice.relatedArea.name}
            </Link>
          </p>
        )}
      </div>

      {/* Follow-up banner — this notice is a follow-up to another */}
      {originNotice && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-xs text-blue-700 uppercase tracking-wide font-semibold mb-1">
            Follow-up to
          </p>
          <Link
            href={`/notices/${originNotice.slug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            📢 {originNotice.title}
          </Link>
          <p className="text-xs text-gray-400 mt-0.5">
            {originNotice.noticeType}
            {originNotice.date &&
              ` • ${new Date(originNotice.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}`}
          </p>
        </div>
      )}

      {notice.excerpt && (
        <p className="text-xl text-gray-600 mb-8">{notice.excerpt}</p>
      )}

      {notice.content && (
        <CustomPortableText value={notice.content as PortableTextBlock[]} />
      )}

      {notice.relatedCampaign && (
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            Related Campaign
          </p>
          <Link
            href={`/campaigns/${notice.relatedCampaign.slug}`}
            className="text-lg font-semibold hover:text-primary transition-colors"
          >
            {notice.relatedCampaign.title} →
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">
              {notice.relatedCampaign.campaignType}
            </Badge>
            <Badge variant="secondary">{notice.relatedCampaign.status}</Badge>
          </div>
        </div>
      )}

      {/* Lineage */}
      <NoticeLineage notice={notice} followUpNotices={followUpNotices} />

      <div className="mt-8 pt-6 border-t border-gray-100">
        <ShareWhatsApp title={notice.title || ''} />
      </div>
    </div>
  );
}
