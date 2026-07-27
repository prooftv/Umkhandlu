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
  depth = 0,
}: {
  record: AuditRecord;
  depth?: number;
}) {
  return (
    <div className={depth > 0 ? 'pl-4' : ''}>
      <p className="py-1 text-sm leading-snug">
        <span className="text-xs text-gray-400 mr-1">
          {typeLabels[record.recordType || ''] || record.recordType}
        </span>
        <Link
          href={`/records/${record.slug}`}
          className="text-primary hover:underline font-medium"
        >
          {record.title}
        </Link>
        {record.status && (
          <span className="text-xs text-gray-400 ml-1">
            · {record.status.charAt(0).toUpperCase()}
            {record.status.slice(1)}
          </span>
        )}
        {record.date && (
          <span className="text-xs text-gray-400 ml-1">
            ·{' '}
            {new Date(record.date).toLocaleDateString('en-ZA', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        )}
      </p>
      {record.childRecords?.map((child) => (
        <AuditNode key={child._id} record={child} depth={depth + 1} />
      ))}
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
    <div className="mt-10 pt-8 border-t border-gray-100">
      <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">
        Governance Record Lineage
      </p>
      {notice.producedRecords && notice.producedRecords.length > 0 && (
        <div className="border-l-2 border-amber-100 pl-3 mb-4">
          {notice.producedRecords.map((record) => (
            <AuditNode key={record._id} record={record} depth={0} />
          ))}
        </div>
      )}
      {followUpNotices && followUpNotices.length > 0 && (
        <div className="border-l-2 border-blue-100 pl-3">
          {followUpNotices.map((fu) => (
            <p key={fu._id} className="py-1 text-sm leading-snug">
              <span className="text-xs text-gray-400 mr-1">Follow-up</span>
              <Link
                href={`/notices/${fu.slug}`}
                className="text-primary hover:underline font-medium"
              >
                {fu.title}
              </Link>
              {fu.date && (
                <span className="text-xs text-gray-400 ml-1">
                  ·{' '}
                  {new Date(fu.date).toLocaleDateString('en-ZA', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              )}
            </p>
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
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <Badge>{notice.noticeType}</Badge>
          {notice.date && (
            <time dateTime={notice.date} className="text-sm text-gray-500">
              {new Date(notice.date).toLocaleDateString('en-ZA', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          )}
          {notice.relatedArea && (
            <Link
              href={`/areas/${notice.relatedArea.slug}`}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              📍 {notice.relatedArea.name}
            </Link>
          )}
          {notice.pinned && (
            <span className="text-sm text-primary">📌 Pinned</span>
          )}
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{notice.title}</h1>
      </div>

      {notice.excerpt && (
        <p className="text-xl text-gray-600 mb-8">{notice.excerpt}</p>
      )}

      {notice.content && (
        <CustomPortableText value={notice.content as PortableTextBlock[]} />
      )}

      {/* Follow-up series context — below content */}
      {originNotice && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-xs text-blue-600 uppercase tracking-widest font-semibold mb-1">
            Part of a series
          </p>
          <Link
            href={`/notices/${originNotice.slug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            ← {originNotice.title}
          </Link>
          <p className="text-xs text-gray-400 mt-0.5">
            {originNotice.noticeType}
            {originNotice.date &&
              ` · ${new Date(originNotice.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}`}
          </p>
        </div>
      )}

      {notice.relatedCampaign && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
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

      {/* Lineage — always at bottom */}
      <NoticeLineage notice={notice} followUpNotices={followUpNotices} />

      <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
        <ShareWhatsApp title={notice.title || ''} />
        <Link
          href={`/notices/lineage/${slug}`}
          className="text-sm text-primary font-medium hover:underline no-print"
        >
          🖨 Print Lineage Certificate →
        </Link>
      </div>
    </div>
  );
}
