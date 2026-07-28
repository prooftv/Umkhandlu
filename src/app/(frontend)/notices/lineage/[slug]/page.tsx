import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { LineageRecord as LR } from '@/components/modules/LineageNode';
import { LineageList } from '@/components/modules/LineageNode';
import PrintButton from '@/components/modules/PrintButton';
import { sanityFetch } from '@/lib/sanity/client/live';
import { noticeLineageQuery } from '@/lib/sanity/queries/queries';
import { SITE_NAME } from '@/lib/siteConfig';

type Props = {
  params: Promise<{ slug: string }>;
};

type FollowUpNotice = {
  _id: string;
  title: string | null;
  slug: string | null;
  noticeType: string | null;
  date: string | null;
  producedRecords?: LR[] | null;
};

function fmt(date: string | null) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function cap(s: string | null) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const { data } = await sanityFetch({
    query: noticeLineageQuery,
    params: { slug },
  });
  if (!data) return {};
  return {
    title: `Governance Lineage — ${data.title}`,
    robots: { index: false },
  };
}

export default async function NoticeLineagePage(props: Props) {
  const { slug } = await props.params;
  const { data: notice } = await sanityFetch({
    query: noticeLineageQuery,
    params: { slug },
  });

  if (!notice) notFound();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://umkhandlu.vercel.app';
  const publicUrl = `${siteUrl}/notices/${slug}`;
  const generatedAt = new Date().toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const producedRecords = (notice.producedRecords ?? []) as LR[];
  const followUpNotices = (notice.followUpNotices ?? []) as FollowUpNotice[];
  const originNotice = notice.originNotice as {
    title: string | null;
    slug: string | null;
    noticeType: string | null;
    date: string | null;
  } | null;

  const totalRecords =
    countRecords(producedRecords) +
    followUpNotices.reduce(
      (acc, fu) => acc + countRecords((fu.producedRecords ?? []) as LR[]),
      0
    );

  const totalEvidence =
    countEvidence(producedRecords) +
    followUpNotices.reduce(
      (acc, fu) => acc + countEvidence((fu.producedRecords ?? []) as LR[]),
      0
    );

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 print:py-0 print:px-0">
      {/* No-print nav */}
      <div className="no-print flex items-center justify-between mb-8">
        <Link
          href={`/notices/${slug}`}
          className="text-sm text-primary hover:underline"
        >
          ← Back to Notice
        </Link>
        <PrintButton />
      </div>

      {/* Certificate header */}
      <div className="border-2 border-gray-900 rounded-xl p-8 mb-6 print:rounded-none print:border-black">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
              {SITE_NAME}
            </p>
            <h1 className="text-2xl font-black text-gray-900 leading-tight">
              Governance Record Lineage
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Evidence Trail Certificate
            </p>
          </div>
          <div className="text-right text-xs text-gray-400">
            <p>Generated: {generatedAt}</p>
            <p className="mt-1 font-mono break-all">{publicUrl}</p>
            {notice._rev && (
              <p className="mt-1 font-mono text-[10px] text-gray-300 break-all">
                rev: {notice._rev}
              </p>
            )}
          </div>
        </div>

        {/* Origin notice block */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-700 mb-2">
            Originating Notice
          </p>
          <h2 className="text-lg font-bold text-gray-900">{notice.title}</h2>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
            <span>
              <span className="font-medium">Type:</span>{' '}
              {cap(notice.noticeType)}
            </span>
            <span>
              <span className="font-medium">Date:</span> {fmt(notice.date)}
            </span>
            {notice.relatedArea && (
              <span>
                <span className="font-medium">Area:</span>{' '}
                {notice.relatedArea.name}
              </span>
            )}
          </div>
          {originNotice && (
            <p className="text-xs text-blue-700 mt-2">
              Follow-up to:{' '}
              <a href={`${siteUrl}/notices/${originNotice.slug}`}>
                {originNotice.title}
              </a>{' '}
              ({fmt(originNotice.date)})
            </p>
          )}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-black text-gray-900">
              {producedRecords.length + followUpNotices.length}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Direct Outputs</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-black text-gray-900">{totalRecords}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total Records</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-black text-gray-900">{totalEvidence}</p>
            <p className="text-xs text-gray-500 mt-0.5">Evidence Files</p>
          </div>
        </div>
      </div>

      {/* Records produced directly from this notice */}
      {producedRecords.length > 0 && (
        <section className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-2">
            Records Produced by This Notice
          </h3>
          <LineageList records={producedRecords} showEvidence />
        </section>
      )}

      {/* Follow-up meetings and their records */}
      {followUpNotices.map((fu) => (
        <section key={fu._id} className="mb-6 border-l-4 border-blue-200 pl-4">
          <div className="mb-2">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
              Follow-up Meeting
            </p>
            <h3 className="text-sm font-bold text-gray-900">{fu.title}</h3>
            <p className="text-xs text-gray-500">
              {cap(fu.noticeType)} · {fmt(fu.date)}
            </p>
          </div>
          {fu.producedRecords && fu.producedRecords.length > 0 && (
            <LineageList records={fu.producedRecords as LR[]} showEvidence />
          )}
        </section>
      ))}

      {producedRecords.length === 0 && followUpNotices.length === 0 && (
        <p className="text-gray-500 text-sm">
          No governance records have been linked to this notice yet.
        </p>
      )}

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-400">
        <p>
          This document was generated from the {SITE_NAME} governance platform.
          All records are publicly verifiable at{' '}
          <span className="font-mono">{publicUrl}</span>
        </p>
        <p className="mt-1">
          Governance Record Lineage is auto-generated from institutional
          references between notices and records. No manual assembly.
        </p>
        {notice._rev && (
          <p className="mt-2 font-mono text-[10px] break-all">
            Document revision at time of generation: {notice._rev}
          </p>
        )}
      </div>

      {/* No-print bottom button */}
      <div className="no-print text-center mt-8">
        <PrintButton />
      </div>
    </div>
  );
}

function countRecords(records: LR[]): number {
  return records.reduce(
    (acc, r) => acc + 1 + countRecords((r.childRecords ?? []) as LR[]),
    0
  );
}

function countEvidence(records: LR[]): number {
  return records.reduce(
    (acc, r) =>
      acc +
      (r.evidence?.length ?? 0) +
      countEvidence((r.childRecords ?? []) as LR[]),
    0
  );
}
