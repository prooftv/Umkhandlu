import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArchivePagination } from '@/components/modules/ArchivePagination';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import { NoticeListItem } from '@/components/modules/NoticeListItem';
import { DEV_NOTICES_PER_PAGE } from '@/lib/constants';
import { paginatedData } from '@/lib/pagination';
import { sanityFetch } from '@/lib/sanity/client/live';
import { devNoticesArchiveQuery } from '@/lib/sanity/queries/queries';

type Props = { params: Promise<{ page: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { page } = await props.params;
  const pageNumber = parseInt(page, 10);
  return {
    title: `Development & Statutory Notices — Page ${pageNumber}`,
    alternates: { canonical: `/development-notices/page/${pageNumber}` },
    robots: pageNumber > 1 ? { index: false, follow: true } : undefined,
  };
}

export async function generateStaticParams() {
  return [];
}

export default async function DevelopmentNoticesPageN(props: Props) {
  const { page } = await props.params;
  const pageNumber = parseInt(page, 10);
  if (!pageNumber || pageNumber < 2) notFound();

  const { data } = await sanityFetch({
    query: devNoticesArchiveQuery,
    params: {
      from: (pageNumber - 1) * DEV_NOTICES_PER_PAGE,
      to: pageNumber * DEV_NOTICES_PER_PAGE - 1,
    },
  });

  const paginated = paginatedData(
    data ?? { total: 0, results: [] },
    pageNumber,
    DEV_NOTICES_PER_PAGE
  );
  if (pageNumber > paginated.totalPages) notFound();

  const open = paginated.data.results.filter((n) => n.status === 'open');
  const closed = paginated.data.results.filter((n) => n.status !== 'open');

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <Breadcrumbs
        items={[
          { label: 'Development Notices', href: '/development-notices' },
          { label: `Page ${pageNumber}` },
        ]}
      />
      <div className="flex items-baseline justify-between gap-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          Development & Statutory Notices
        </h1>
        <span className="text-sm text-gray-400 shrink-0">
          Page {pageNumber} of {paginated.totalPages}
        </span>
      </div>

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

      <ArchivePagination
        totalPages={paginated.totalPages}
        currentPage={pageNumber}
        linkBase="/development-notices"
      />
    </div>
  );
}
