import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NoticeJourney } from '@/components/modules/GovernanceJourney';
import type { LineageRecord as LR } from '@/components/modules/LineageNode';
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

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const { data } = await sanityFetch({
    query: noticeLineageQuery,
    params: { slug },
  });
  if (!data) return {};
  return {
    title: `Governance Journey — ${data.title}`,
    robots: { index: false },
  };
}

export default async function NoticeJourneyPrintPage(props: Props) {
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

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 1.5cm; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="max-w-3xl mx-auto py-8 px-6 print:max-w-none print:py-0 print:px-0">
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

        {/* Header */}
        <div className="border-2 border-gray-900 rounded-xl p-6 mb-6 print:rounded-none print:border-black">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                {SITE_NAME}
              </p>
              <h1 className="text-2xl font-black text-gray-900 leading-tight">
                Governance Journey
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Institutional Decision Trail
              </p>
            </div>
            <div className="text-right text-xs text-gray-400">
              <p>Generated: {generatedAt}</p>
              <p className="mt-1 font-mono text-[10px] break-all">
                {publicUrl}
              </p>
              {notice._rev && (
                <p className="mt-1 font-mono text-[10px] text-gray-500 break-all">
                  rev: {notice._rev}
                </p>
              )}
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-700 mb-1">
              Originating Notice
            </p>
            <p className="text-base font-bold text-gray-900">{notice.title}</p>
            <p className="text-xs text-gray-500 mt-1">
              {notice.noticeType} · {fmt(notice.date)}
              {notice.relatedArea && ` · ${notice.relatedArea.name}`}
            </p>
          </div>
        </div>

        {/* Journey tree — full width for branching */}
        <div className="overflow-x-auto">
          <NoticeJourney
            notice={{
              _id: notice._id,
              title: notice.title,
              slug: notice.slug,
              noticeType: notice.noticeType,
              date: notice.date,
            }}
            producedRecords={producedRecords}
            followUpNotices={followUpNotices}
          />
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-400">
          <p>
            Generated from the {SITE_NAME} governance platform. Verifiable at{' '}
            <span className="font-mono">{publicUrl}</span>
          </p>
          {notice._rev && (
            <p className="mt-1 font-mono text-[10px] break-all">
              Document revision: {notice._rev}
            </p>
          )}
        </div>

        <div className="no-print text-center mt-8">
          <PrintButton />
        </div>
      </div>
    </>
  );
}
