import type { Metadata } from 'next';
import Link from 'next/link';
import { ArchivePagination } from '@/components/modules/ArchivePagination';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { DEV_NOTICES_PER_PAGE } from '@/lib/constants';
import { paginatedData } from '@/lib/pagination';
import { sanityFetch } from '@/lib/sanity/client/live';
import { devNoticesArchiveQuery } from '@/lib/sanity/queries/queries';

export const metadata: Metadata = {
  title: 'Development & Statutory Notices',
  description:
    'Public participation notices — EIA, SPLUMA, liquor licensing, mining permits, deceased estates, and more.',
  alternates: { canonical: '/development-notices' },
};

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
      className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow block"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant={isOpen ? 'default' : 'secondary'}>
              {isOpen ? '🟢 Open' : '🔴 Closed'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {typeLabels[notice.noticeType ?? ''] || notice.noticeType}
            </Badge>
          </div>
          <h3 className="font-semibold leading-snug">{notice.title}</h3>
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
          {notice.commentDeadline && (
            <p
              className={`text-xs mt-2 font-medium ${
                isOpen ? 'text-red-600' : 'text-gray-400'
              }`}
            >
              {isOpen ? 'Deadline: ' : 'Closed: '}
              {new Date(notice.commentDeadline).toLocaleDateString('en-ZA', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
          {notice.referenceNumber && (
            <span className="text-xs text-gray-400 font-mono mt-1 block">
              Ref: {notice.referenceNumber}
            </span>
          )}
        </div>
        <span className="text-primary text-sm shrink-0 mt-0.5">→</span>
      </div>
    </Link>
  );
}

export default async function DevelopmentNoticesPage() {
  const { data } = await sanityFetch({
    query: devNoticesArchiveQuery,
    params: { from: 0, to: DEV_NOTICES_PER_PAGE - 1 },
  });

  const paginated = paginatedData(
    data ?? { total: 0, results: [] },
    1,
    DEV_NOTICES_PER_PAGE
  );
  const open = paginated.data.results.filter((n) => n.status === 'open');
  const closed = paginated.data.results.filter((n) => n.status !== 'open');

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <Breadcrumbs
        items={[{ label: 'Home', href: '/' }, { label: 'Development Notices' }]}
      />
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Development & Statutory Notices
        </h1>
        <p className="text-gray-600 max-w-2xl text-sm md:text-base">
          Public participation notices for developments within the traditional
          authority area. Submit comments or objections before the deadline.
        </p>
      </header>
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
      {paginated.data.results.length === 0 && (
        <p className="text-gray-500">No development notices published yet.</p>
      )}
      <ArchivePagination
        totalPages={paginated.totalPages}
        currentPage={1}
        linkBase="/development-notices"
      />
    </div>
  );
}
