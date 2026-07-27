import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArchivePagination } from '@/components/modules/ArchivePagination';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { RECORDS_PER_PAGE } from '@/lib/constants';
import { paginatedData } from '@/lib/pagination';
import { sanityFetch } from '@/lib/sanity/client/live';
import { recordsArchiveQuery } from '@/lib/sanity/queries/queries';

type Props = { params: Promise<{ page: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { page } = await props.params;
  return { title: `Documents & Records — Page ${page}` };
}

export async function generateStaticParams() {
  return [];
}

const typeLabels: Record<string, string> = {
  minutes: 'Minutes',
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

const statusVariants: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  adopted: 'default',
  approved: 'default',
  pending: 'outline',
  open: 'secondary',
  rejected: 'destructive',
  resolved: 'secondary',
};

type RecordItem = NonNullable<
  Awaited<ReturnType<typeof sanityFetch<typeof recordsArchiveQuery>>>['data']
>['results'][number];

function RecordRow({ record }: { record: RecordItem }) {
  return (
    <Link
      href={`/records/${record.slug}`}
      className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-start gap-4 block"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Badge variant="outline">
            {typeLabels[record.recordType || ''] || record.recordType}
          </Badge>
          {record.status && (
            <Badge variant={statusVariants[record.status] || 'outline'}>
              {record.status.charAt(0).toUpperCase()}
              {record.status.slice(1)}
            </Badge>
          )}
        </div>
        <h2 className="font-semibold">{record.title}</h2>
        {record.summary && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {record.summary}
          </p>
        )}
        {record.relatedArea && (
          <p className="text-xs text-gray-400 mt-1">
            📍 {record.relatedArea.name}
          </p>
        )}
      </div>
      {record.date && (
        <time dateTime={record.date} className="text-xs text-gray-400 shrink-0">
          {new Date(record.date).toLocaleDateString('en-ZA', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </time>
      )}
    </Link>
  );
}

export default async function RecordsPageN(props: Props) {
  const { page } = await props.params;
  const pageNumber = parseInt(page, 10);
  if (!pageNumber || pageNumber < 2) notFound();

  const { data } = await sanityFetch({
    query: recordsArchiveQuery,
    params: {
      from: (pageNumber - 1) * RECORDS_PER_PAGE,
      to: pageNumber * RECORDS_PER_PAGE - 1,
    },
  });

  const paginated = paginatedData(
    data ?? { total: 0, results: [] },
    pageNumber,
    RECORDS_PER_PAGE
  );
  if (pageNumber > paginated.totalPages) notFound();

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Breadcrumbs
        items={[
          { label: 'Documents & Records', href: '/records' },
          { label: `Page ${pageNumber}` },
        ]}
      />
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        Documents & Records
      </h1>
      <div className="space-y-3">
        {paginated.data.results.map((record) => (
          <RecordRow key={record._id} record={record} />
        ))}
      </div>
      <ArchivePagination
        totalPages={paginated.totalPages}
        currentPage={pageNumber}
        linkBase="/records"
      />
    </div>
  );
}
