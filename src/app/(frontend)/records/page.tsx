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
import { recordsArchiveQuery } from '@/lib/sanity/queries/queries';

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

export default async function RecordsPage() {
  const { data } = await sanityFetch({
    query: recordsArchiveQuery,
    params: { from: 0, to: RECORDS_PER_PAGE - 1 },
  });

  const paginated = paginatedData(
    data ?? { total: 0, results: [] },
    1,
    RECORDS_PER_PAGE
  );

  const results = paginated.data.results;
  const total = paginated.data.total ?? results.length;

  // Build type filter options from results
  const typeCounts: Record<string, number> = {};
  for (const r of results) {
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
          title="No records published yet"
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
      />
    </div>
  );
}
