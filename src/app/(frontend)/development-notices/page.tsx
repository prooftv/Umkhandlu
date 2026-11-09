import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ArchiveHeader } from '@/components/modules/ArchiveHeader';
import { ArchivePagination } from '@/components/modules/ArchivePagination';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import { EmptyState } from '@/components/modules/EmptyState';
import { NoticeListItem } from '@/components/modules/NoticeListItem';
import { DEV_NOTICES_PER_PAGE } from '@/lib/constants';
import { DEV_NOTICE_TYPE_LABELS } from '@/lib/governance-labels';
import { paginatedData } from '@/lib/pagination';
import { sanityFetch } from '@/lib/sanity/client/live';
import {
  devNoticesArchiveFilteredQuery,
  devNoticesArchiveQuery,
} from '@/lib/sanity/queries/queries';

export const metadata: Metadata = {
  title: 'Development & Statutory Notices',
  description:
    'Public participation notices — EIA, SPLUMA, liquor licensing, mining permits, deceased estates, and more.',
  alternates: { canonical: '/development-notices' },
};

type Props = { searchParams: Promise<{ type?: string }> };

export default async function DevelopmentNoticesPage({ searchParams }: Props) {
  const { type } = await searchParams;

  const { data } = await sanityFetch(
    type
      ? {
          query: devNoticesArchiveFilteredQuery,
          params: { from: 0, to: DEV_NOTICES_PER_PAGE - 1, type },
        }
      : {
          query: devNoticesArchiveQuery,
          params: { from: 0, to: DEV_NOTICES_PER_PAGE - 1 },
        }
  );

  const paginated = paginatedData(
    data ?? { total: 0, results: [] },
    1,
    DEV_NOTICES_PER_PAGE
  );

  const results = paginated.data.results;
  const total = paginated.data.total ?? results.length;
  const open = results.filter((n) => n.status === 'open');
  const closed = results.filter((n) => n.status !== 'open');

  // Build type filter options from unfiltered counts
  const { data: allData } = type
    ? await sanityFetch({
        query: devNoticesArchiveQuery,
        params: { from: 0, to: 999 },
      })
    : { data: data };

  const typeCounts: Record<string, number> = {};
  for (const n of allData?.results ?? results) {
    if (n.noticeType)
      typeCounts[n.noticeType] = (typeCounts[n.noticeType] ?? 0) + 1;
  }
  const filterOptions = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([value, count]) => ({
      value,
      label: DEV_NOTICE_TYPE_LABELS[value] ?? value,
      count,
    }));

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <Breadcrumbs
        items={[{ label: 'Home', href: '/' }, { label: 'Development Notices' }]}
      />
      <Suspense>
        <ArchiveHeader
          title="Development & Statutory Notices"
          description="Public participation notices for developments within the traditional authority area. Submit comments or objections before the deadline."
          total={total}
          noun="notice"
          filters={filterOptions}
        />
      </Suspense>

      {results.length === 0 ? (
        <EmptyState
          title={
            type
              ? `No ${DEV_NOTICE_TYPE_LABELS[type] ?? type} notices`
              : 'No development notices published yet'
          }
          description="Public participation notices will appear here once published."
          icon="📋"
        />
      ) : (
        <>
          {open.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Open for Comment
                </h2>
                <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">
                  {open.length}
                </span>
              </div>
              <div className="space-y-2">
                {open.map((n) => (
                  <NoticeListItem key={n._id} notice={n} />
                ))}
              </div>
            </section>
          )}

          {closed.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Closed & Archived
                </h2>
                <span className="text-xs bg-gray-100 text-gray-500 font-medium px-2 py-0.5 rounded-full">
                  {closed.length}
                </span>
              </div>
              <div className="space-y-2">
                {closed.map((n) => (
                  <NoticeListItem key={n._id} notice={n} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <ArchivePagination
        totalPages={paginated.totalPages}
        currentPage={1}
        linkBase="/development-notices"
      />
    </div>
  );
}
