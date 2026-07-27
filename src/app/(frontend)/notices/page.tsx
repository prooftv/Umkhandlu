import type { Metadata } from 'next';
import Link from 'next/link';
import { ArchivePagination } from '@/components/modules/ArchivePagination';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { NOTICES_PER_PAGE } from '@/lib/constants';
import { paginatedData } from '@/lib/pagination';
import { sanityFetch } from '@/lib/sanity/client/live';
import { noticesArchiveQuery } from '@/lib/sanity/queries/queries';

export const metadata: Metadata = {
  title: 'Community Notices',
  description:
    'Meeting notices, announcements, resolutions, and community alerts.',
  alternates: { canonical: '/notices' },
  openGraph: {
    title: 'Community Notices',
    description:
      'Meeting notices, announcements, resolutions, and community alerts.',
    type: 'website',
  },
};

export default async function NoticesPage() {
  const { data } = await sanityFetch({
    query: noticesArchiveQuery,
    params: { from: 0, to: NOTICES_PER_PAGE - 1 },
  });

  const paginated = paginatedData(
    data ?? { total: 0, results: [] },
    1,
    NOTICES_PER_PAGE
  );

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Breadcrumbs items={[{ label: 'Notices' }]} />
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Community Notices</h1>
      {!paginated.data.results || paginated.data.results.length === 0 ? (
        <p className="text-gray-500">No notices yet.</p>
      ) : (
        <div className="space-y-3">
          {paginated.data.results.map((notice) => (
            <NoticeRow key={notice._id} notice={notice} />
          ))}
        </div>
      )}
      <ArchivePagination
        totalPages={paginated.totalPages}
        currentPage={1}
        linkBase="/notices"
      />
    </div>
  );
}

type NoticeItem = NonNullable<
  Awaited<ReturnType<typeof sanityFetch<typeof noticesArchiveQuery>>>['data']
>['results'][number];

function NoticeRow({ notice }: { notice: NoticeItem }) {
  return (
    <Link
      href={`/notices/${notice.slug}`}
      className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-start gap-4 block"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Badge variant="outline">{notice.noticeType}</Badge>
          {notice.pinned && <span className="text-xs text-primary">📌</span>}
          {notice.relatedArea && (
            <span className="text-xs text-gray-400">
              📍 {notice.relatedArea.name}
            </span>
          )}
        </div>
        <h2 className="font-semibold">{notice.title}</h2>
        {notice.excerpt && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {notice.excerpt}
          </p>
        )}
      </div>
      {notice.date && (
        <time dateTime={notice.date} className="text-xs text-gray-400 shrink-0">
          {new Date(notice.date).toLocaleDateString('en-ZA', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </time>
      )}
    </Link>
  );
}
