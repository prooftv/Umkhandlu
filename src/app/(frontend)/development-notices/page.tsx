import type { Metadata } from 'next';
import Link from 'next/link';
import { defineQuery } from 'next-sanity';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { sanityFetch } from '@/lib/sanity/client/live';

export const metadata: Metadata = {
  title: 'Development & Statutory Notices',
  description:
    'Public participation notices — EIA, SPLUMA, liquor licensing, mining permits, deceased estates, and more.',
  alternates: { canonical: '/development-notices' },
};

const devNoticeListQuery = defineQuery(`
  *[_type == "developmentNotice" && defined(slug.current)] | order(commentDeadline desc) {
    _id,
    title,
    "slug": slug.current,
    noticeType,
    status,
    applicant,
    referenceNumber,
    location,
    commentDeadline,
    legalMandate,
    "relatedArea": relatedArea->{ name, "slug": slug.current }
  }
`);

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

function formatDateZA(date: string) {
  return new Date(date).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function DevelopmentNoticesPage() {
  const { data: notices } = await sanityFetch({ query: devNoticeListQuery });

  const open = notices?.filter((n) => n.status === 'open') ?? [];
  const closed = notices?.filter((n) => n.status !== 'open') ?? [];

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <Breadcrumbs
        items={[{ label: 'Home', href: '/' }, { label: 'Development Notices' }]}
      />

      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Development & Statutory Notices
        </h1>
        <p className="text-gray-600 max-w-2xl">
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
            {open.map((notice) => (
              <NoticeCard key={notice._id} notice={notice} />
            ))}
          </div>
        </section>
      )}

      {closed.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">
            Closed & Archived ({closed.length})
          </h2>
          <div className="space-y-3">
            {closed.map((notice) => (
              <NoticeCard key={notice._id} notice={notice} />
            ))}
          </div>
        </section>
      )}

      {(!notices || notices.length === 0) && (
        <p className="text-gray-500">No development notices published yet.</p>
      )}
    </div>
  );
}

type NoticeItem = NonNullable<
  Awaited<ReturnType<typeof sanityFetch<typeof devNoticeListQuery>>>['data']
>[number];

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
            {formatDateZA(notice.commentDeadline)}
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
