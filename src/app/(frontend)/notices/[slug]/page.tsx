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

type AuditRecord = {
  _id: string;
  title: string | null;
  slug: string | null;
  recordType: string | null;
  date: string | null;
  status: string | null;
  childRecords?: AuditRecord[] | null;
};

function AuditNode({ record }: { record: AuditRecord }) {
  return (
    <div className="ml-4 border-l-2 border-amber-200 pl-3 py-0.5">
      <Link
        href={`/records/${record.slug}`}
        className="text-sm font-medium text-primary hover:underline"
      >
        📄 {record.title}
      </Link>
      <span className="text-xs text-gray-400 ml-2">
        {record.recordType}
        {record.status && ` — ${record.status}`}
        {record.date && ` — ${new Date(record.date).toLocaleDateString()}`}
      </span>
      {record.childRecords && record.childRecords.length > 0 && (
        <div className="mt-1 space-y-0.5">
          {record.childRecords.map((child) => (
            <AuditNode key={child._id} record={child} />
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

      {notice.producedRecords && notice.producedRecords.length > 0 && (
        <div className="mt-8 p-5 bg-amber-50 border border-amber-100 rounded-xl">
          <p className="text-xs text-amber-700 uppercase tracking-wide font-semibold mb-4">
            Governance Audit Trail
          </p>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-amber-800 font-medium mb-3">
              <span>📢</span>
              <span>{notice.title}</span>
              {notice.date && (
                <span className="text-xs text-gray-400">
                  {new Date(notice.date).toLocaleDateString()}
                </span>
              )}
            </div>
            {notice.producedRecords.map((record) => (
              <AuditNode key={record._id} record={record} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-100">
        <ShareWhatsApp title={notice.title || ''} />
      </div>
    </div>
  );
}
