import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArchivePagination } from '@/components/modules/ArchivePagination';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import { RecordListItem } from '@/components/modules/RecordListItem';
import { RECORDS_PER_PAGE } from '@/lib/constants';
import { paginatedData } from '@/lib/pagination';
import { sanityFetch } from '@/lib/sanity/client/live';
import { recordsArchiveQuery } from '@/lib/sanity/queries/queries';

type Props = {
  params: Promise<{ page: string }>;
  searchParams: Promise<{ size?: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { page } = await props.params;
  const pageNumber = parseInt(page, 10);
  return {
    title: `Documents & Records — Page ${pageNumber}`,
    alternates: { canonical: `/records/page/${pageNumber}` },
    robots: pageNumber > 1 ? { index: false, follow: true } : undefined,
  };
}

export async function generateStaticParams() {
  return [];
}

export default async function RecordsPageN(props: Props) {
  const { page } = await props.params;
  const { size } = await props.searchParams;
  const pageNumber = parseInt(page, 10);
  if (!pageNumber || pageNumber < 2) notFound();

  const perPage = size === '20' ? 20 : RECORDS_PER_PAGE;

  const { data } = await sanityFetch({
    query: recordsArchiveQuery,
    params: {
      from: (pageNumber - 1) * perPage,
      to: pageNumber * perPage - 1,
    },
  });

  const paginated = paginatedData(
    data ?? { total: 0, results: [] },
    pageNumber,
    perPage
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
      <div className="flex items-baseline justify-between gap-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Documents & Records</h1>
        <span className="text-sm text-gray-400 shrink-0">
          Page {pageNumber} of {paginated.totalPages}
        </span>
      </div>
      <div className="space-y-2">
        {paginated.data.results.map((record) => (
          <RecordListItem key={record._id} record={record} />
        ))}
      </div>
      <ArchivePagination
        totalPages={paginated.totalPages}
        currentPage={pageNumber}
        linkBase="/records"
        perPage={perPage}
      />
    </div>
  );
}
