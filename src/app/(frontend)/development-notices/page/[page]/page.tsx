import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArchivePagination } from '@/components/modules/ArchivePagination';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
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
    alternates: {
      canonical: `/development-notices/page/${pageNumber}`,
    },
    robots: pageNumber > 1 ? { index: false, follow: true } : undefined,
  };
}

export async function generateStaticParams() {
  return [];
}

const typeLabels: Record<string, string> = {
  eia: 'Environmental Impact Assessment',
  rezoning: 'Rezoning (SPLUMA)',
  'land-use': 'Land Use Change (SPLUMA)',
  township: 'Township Establishment (SPLUMA)',
  building: 'Building Plan Approval',
  mining: 'Mining / Excavation',
  liquor: 'Liquor License',
  telecom: 'Cell Tower / Mast',
  estate: 'Deceased Estate',
  liquidation: 'Liquidation / Insolvency',
  pto: 'PTO / Land Transfer',
  other: 'Public Notice',
};

type NoticeItem = NonNullable<
  Awaited<ReturnType<typeof sanityFetch<typeof devNoticesArchiveQuery>>>['data']
>['results'][number];

function NoticeCard({ notice }: { notice: NoticeItem }) {
  const isOpen = notice.status === 'open';
  return (
    <Link
      href={`/development-notices/${notice.slug}`}
      className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-start gap-4 block"
    >
      <div>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Badge variant={isOpen ? 'default' : 'secondary'}>
            {isOpen ? '🟢 Open' : '🔴 Closed'}
          </Badge>
          <Badge variant="outline">
            {typeLabels[notice.noticeType ?? ''] || notice.noticeType}
          </Badge>
        </div>
        <h3 className="font-semibold">{notice.title}</h3>
        {notice.applicant && (
          <p className="text-sm text-gray-500 mt-1">
            Applicant: {notice.applicant}
          </p>
        )}
        {notice.location && (
          <p className="text-xs text-gray-500 mt-1">📍 {notice.location}</p>
        )}
        {notice.relatedArea && (
          <p className="text-xs text-gray-500">🏘️ {notice.relatedArea.name}</p>
        )}
      </div>
      <div className="text-right shrink-0">
        {notice.commentDeadline && (
          <time
            dateTime={notice.commentDeadline}
            className={`text-xs block ${isOpen ? 'text-red-600 font-medium' : 'text-gray-400'}`}
          >
            {isOpen ? 'Deadline: ' : 'Closed: '}
            {new Date(notice.commentDeadline).toLocaleDateString('en-ZA', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
        )}
        {notice.referenceNumber && (
          <span className="text-xs text-gray-400 block mt-1 font-mono">
            {notice.referenceNumber}
          </span>
        )}
      </div>
    </Link>
  );
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
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        Development & Statutory Notices
      </h1>
      {open.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">
            🟢 Open for Comment ({open.length})
          </h2>
          <div className="space-y-3">
            {open.map((n) => (
              <NoticeCard key={n._id} notice={n} />
            ))}
          </div>
        </section>
      )}
      {closed.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-4">
            Closed & Archived ({closed.length})
          </h2>
          <div className="space-y-3">
            {closed.map((n) => (
              <NoticeCard key={n._id} notice={n} />
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
