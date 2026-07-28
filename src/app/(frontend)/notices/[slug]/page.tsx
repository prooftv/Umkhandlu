import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from 'next-sanity';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import LineageTabs from '@/components/modules/LineageTabs';
import CustomPortableText from '@/components/modules/PortableText';
import ShareWhatsApp from '@/components/modules/ShareWhatsApp';
import VisitedLink from '@/components/modules/VisitedLink';
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

type AuditRecord = {
  _id: string;
  title: string | null;
  slug: string | null;
  recordType: string | null;
  date: string | null;
  status: string | null;
  verificationNote?: string | null;
  childRecords?: AuditRecord[] | null;
};

function AuditNode({
  record,
  prefix,
  currentSlug,
}: {
  record: AuditRecord;
  prefix: string;
  currentSlug?: string;
}) {
  const hasChildren = record.childRecords && record.childRecords.length > 0;
  return (
    <div>
      <div className="py-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[10px] font-bold text-gray-300 shrink-0 tabular-nums">
            {prefix}
          </span>
          <VisitedLink
            href={`/records/${record.slug}`}
            isCurrent={record.slug === currentSlug}
          >
            {record.title}
          </VisitedLink>
        </div>
        <p className="text-xs text-gray-400 mt-0.5 ml-5">
          {typeLabels[record.recordType || ''] || record.recordType}
          {record.status &&
            ` · ${record.status.charAt(0).toUpperCase()}${record.status.slice(1)}`}
          {record.date &&
            ` · ${new Date(record.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}`}
        </p>
        {record.verificationNote && (
          <p className="text-xs text-amber-700 italic mt-0.5 ml-5">
            ✓ {record.verificationNote}
          </p>
        )}
      </div>
      {hasChildren && (
        <div className="ml-5 border-l border-gray-100 pl-3">
          {record.childRecords?.map((child, i) => (
            <AuditNode
              key={child._id}
              record={child}
              prefix={`${prefix}.${i + 1}`}
              currentSlug={currentSlug}
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
    <div className="mt-10 pt-8 border-t border-gray-100">
      <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-4">
        Governance Record Lineage
      </p>
      <div className="flex flex-col gap-0">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">
            This Notice
          </span>
          <span className="text-sm font-medium text-gray-900">
            {notice.title}
          </span>
        </div>
        {notice.producedRecords && notice.producedRecords.length > 0 && (
          <>
            <span className="text-gray-300 text-sm leading-none my-1 ml-1">
              ↓
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
                Produced Records
              </span>
              <div className="space-y-1">
                {notice.producedRecords.map((record, i) => (
                  <AuditNode
                    key={record._id}
                    record={record}
                    prefix={`${i + 1}`}
                    currentSlug={undefined}
                  />
                ))}
              </div>
            </div>
          </>
        )}
        {followUpNotices && followUpNotices.length > 0 && (
          <>
            <span className="text-gray-300 text-sm leading-none my-1 ml-1">
              ↓
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
                Follow-up Notices
              </span>
              <div className="space-y-1">
                {followUpNotices.map((fu) => (
                  <div
                    key={fu._id}
                    className="border-l-2 border-blue-200 pl-3 py-2"
                  >
                    <VisitedLink href={`/notices/${fu.slug}`}>
                      {fu.title}
                    </VisitedLink>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Follow-up meeting
                      {fu.date &&
                        ` · ${new Date(fu.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
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
    alternates: { canonical: `/notices/${slug}` },
    openGraph: {
      title: data.title ?? undefined,
      description: data.excerpt ?? undefined,
      type: 'article',
      publishedTime: data.date ?? undefined,
      url: `/notices/${slug}`,
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
  const lineageCount =
    (notice.producedRecords?.length ?? 0) + (followUpNotices?.length ?? 0);

  const noticeTab = (
    <>
      {notice.excerpt && (
        <p className="text-xl text-gray-600 mb-8">{notice.excerpt}</p>
      )}
      {notice.content && (
        <CustomPortableText value={notice.content as PortableTextBlock[]} />
      )}
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
      <div className="mt-8 pt-6 border-t border-gray-100">
        <ShareWhatsApp title={notice.title || ''} />
      </div>
    </>
  );

  const lineageTab = (
    <>
      <NoticeLineage notice={notice} followUpNotices={followUpNotices} />
      <div className="mt-6">
        <Link
          href={`/notices/lineage/${slug}`}
          className="text-sm text-primary font-medium hover:underline"
        >
          🖸 Print Lineage Certificate →
        </Link>
      </div>
    </>
  );

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
        <h1 className="text-3xl md:text-5xl font-bold mb-6">{notice.title}</h1>
      </div>
      <LineageTabs
        noticeTab={noticeTab}
        lineageTab={lineageTab}
        lineageCount={lineageCount}
      />
    </div>
  );
}
