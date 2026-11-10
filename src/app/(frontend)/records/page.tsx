import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ArchiveHeader } from '@/components/modules/ArchiveHeader';
import { ArchivePagination } from '@/components/modules/ArchivePagination';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import { EmptyState } from '@/components/modules/EmptyState';
import { RecordListItem } from '@/components/modules/RecordListItem';
import { RECORDS_PER_PAGE } from '@/lib/constants';
import { RECORD_TYPE_LABELS } from '@/lib/governance-labels';
import { paginatedData } from '@/lib/pagination';
import { sanityFetch } from '@/lib/sanity/client/live';
import {
  recordsArchiveFilteredQuery,
  recordsArchiveQuery,
} from '@/lib/sanity/queries/queries';

export const metadata: Metadata = {
  title: 'Documents & Records',
  description:
    'Governance records, resolutions, minutes, and institutional documents.',
  alternates: { canonical: '/records' },
  openGraph: {
    title: 'Documents & Records',
    description:
      'Governance records, resolutions, minutes, and institutional documents.',
    type: 'website',
  },
};

type Props = { searchParams: Promise<{ type?: string; size?: string }> };

export default async function RecordsPage({ searchParams }: Props) {
  const { type, size } = await searchParams;
  const perPage = size === '20' ? 20 : RECORDS_PER_PAGE;

  const { data } = await sanityFetch(
    type
      ? {
          query: recordsArchiveFilteredQuery,
          params: { from: 0, to: perPage - 1, type },
        }
      : {
          query: recordsArchiveQuery,
          params: { from: 0, to: perPage - 1 },
        }
  );

  const paginated = paginatedData(
    data ?? { total: 0, results: [] },
    1,
    perPage
  );
  const results = paginated.data.results;
  const total = paginated.data.total ?? results.length;

  // Filter pill counts always reflect full dataset
  const { data: allData } = type
    ? await sanityFetch({
        query: recordsArchiveQuery,
        params: { from: 0, to: 999 },
      })
    : { data: data };

  const typeCounts: Record<string, number> = {};
  for (const r of allData?.results ?? results) {
    if (r.recordType)
      typeCounts[r.recordType] = (typeCounts[r.recordType] ?? 0) + 1;
  }
  const filterOptions = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([value, count]) => ({
      value,
      label: RECORD_TYPE_LABELS[value] ?? value,
      count,
    }));

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Breadcrumbs items={[{ label: 'Documents & Records' }]} />
      <Suspense>
        <ArchiveHeader
          title="Documents & Records"
          description="Governance records, resolutions, minutes and institutional documents from the traditional authority."
          total={total}
          noun="record"
          filters={filterOptions}
        />
      </Suspense>

      {results.length === 0 ? (
        <EmptyState
          title={
            type
              ? `No ${RECORD_TYPE_LABELS[type] ?? type} records`
              : 'No records published yet'
          }
          description="Governance records will appear here once published."
          icon="📄"
        />
      ) : (
        <div className="space-y-2">
          {results.map((record) => (
            <RecordListItem key={record._id} record={record} />
          ))}
        </div>
      )}

      <ArchivePagination
        totalPages={paginated.totalPages}
        currentPage={1}
        linkBase="/records"
        perPage={perPage}
      />
    </div>
  );
}
