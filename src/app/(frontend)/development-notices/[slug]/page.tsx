import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from 'next-sanity';
import { defineQuery } from 'next-sanity';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import LocationPin from '@/components/modules/LocationPin';
import CustomPortableText from '@/components/modules/PortableText';
import PublicCommentForm from '@/components/modules/PublicCommentForm';
import ShareWhatsApp from '@/components/modules/ShareWhatsApp';
import { Badge } from '@/components/ui/Badge';
import { sanityFetch } from '@/lib/sanity/client/live';

type Props = {
  params: Promise<{ slug: string }>;
};

const devNoticeQuery = defineQuery(`
  *[_type == "developmentNotice" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    noticeType,
    status,
    legalMandate,
    retentionPeriod,
    applicant,
    referenceNumber,
    description,
    content,
    location,
    geopoint,
    commentDeadline,
    commentContact,
    publishDate,
    image,
    documents[] { _key, title, "url": asset->url },
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

type NoticeData = NonNullable<
  Awaited<ReturnType<typeof sanityFetch<typeof devNoticeQuery>>>['data']
>;

function formatDateZA(date: string) {
  return new Date(date).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function DetailRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | null | undefined;
  highlight?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={`text-sm font-medium ${highlight ? 'text-red-600 font-bold' : 'text-gray-900'}`}
      >
        {value}
      </span>
    </div>
  );
}

function NoticeHeader({ notice }: { notice: NoticeData }) {
  const isOpen = notice.status === 'open';
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Badge>
          {typeLabels[notice.noticeType ?? ''] || notice.noticeType}
        </Badge>
        <Badge variant={isOpen ? 'default' : 'secondary'}>
          {notice.status === 'open'
            ? '🟢 Open for Comment'
            : notice.status === 'closed'
              ? '🔴 Comment Period Closed'
              : (notice.status?.toUpperCase() ?? '')}
        </Badge>
        {notice.legalMandate && (
          <Badge variant="outline">{notice.legalMandate}</Badge>
        )}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{notice.title}</h1>
      {notice.description && (
        <p className="text-lg text-gray-600">{notice.description}</p>
      )}
    </div>
  );
}

function NoticeDetails({
  notice,
  acceptingComments,
}: {
  notice: NoticeData;
  acceptingComments: boolean;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-8 space-y-3">
      <DetailRow label="Applicant" value={notice.applicant} />
      {notice.referenceNumber && (
        <DetailRow label="Reference No" value={notice.referenceNumber} />
      )}
      <DetailRow label="Site Location" value={notice.location} />
      {notice.publishDate && (
        <DetailRow label="Published" value={formatDateZA(notice.publishDate)} />
      )}
      {notice.commentDeadline && (
        <DetailRow
          label="Comment Deadline"
          value={formatDateZA(notice.commentDeadline)}
          highlight={acceptingComments}
        />
      )}
      {notice.relatedArea && (
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-500">Affected Area</span>
          <Link
            href={`/areas/${notice.relatedArea.slug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            🏘️ {notice.relatedArea.name}
          </Link>
        </div>
      )}
    </div>
  );
}

function NoticeDocuments({
  documents,
}: {
  documents: NoticeData['documents'];
}) {
  if (!documents?.length) return null;
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-3">Supporting Documents</h2>
      <div className="space-y-2">
        {documents.map((doc) => (
          <a
            key={doc._key}
            href={doc.url ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-lg">📄</span>
            <span className="text-sm font-medium">
              {doc.title || 'Document'}
            </span>
            <span className="text-xs text-primary ml-auto">Download →</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function CommentSection({
  notice,
  acceptingComments,
}: {
  notice: NoticeData;
  acceptingComments: boolean;
}) {
  return (
    <>
      {acceptingComments && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">
            Submit Comment or Objection
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Comments must be received before{' '}
            {formatDateZA(notice.commentDeadline!)}. You may also submit
            directly to: {notice.commentContact}
          </p>
          <PublicCommentForm
            noticeId={notice._id}
            noticeTitle={notice.title ?? ''}
          />
        </div>
      )}
      {notice.commentContact && (
        <div className="mb-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <h3 className="text-sm font-bold text-amber-800 mb-1">
            {acceptingComments
              ? '📬 Where to Submit Comments'
              : '📬 Comments Were Submitted To'}
          </h3>
          <p className="text-sm text-amber-700 whitespace-pre-line">
            {notice.commentContact}
          </p>
        </div>
      )}
    </>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const { data } = await sanityFetch({
    query: devNoticeQuery,
    params: { slug },
  });
  if (!data) return {};
  return {
    title: data.title,
    description: data.description || undefined,
    alternates: { canonical: `/development-notices/${slug}` },
  };
}

export default async function DevelopmentNoticePage(props: Props) {
  const { slug } = await props.params;
  const { data: notice } = await sanityFetch({
    query: devNoticeQuery,
    params: { slug },
  });

  if (!notice) notFound();

  const isOpen = notice.status === 'open';
  const deadlinePassed = notice.commentDeadline
    ? new Date(notice.commentDeadline) < new Date()
    : false;
  const acceptingComments = isOpen && !deadlinePassed;

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Breadcrumbs
        items={[
          { label: 'Development Notices', href: '/' },
          { label: notice.title || '' },
        ]}
      />

      <NoticeHeader notice={notice} />
      <NoticeDetails notice={notice} acceptingComments={acceptingComments} />

      {notice.content && (
        <div className="mb-8 prose max-w-none">
          <CustomPortableText value={notice.content as PortableTextBlock[]} />
        </div>
      )}

      <NoticeDocuments documents={notice.documents} />

      {notice.geopoint?.lat && notice.geopoint?.lng && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Site Location</h2>
          <LocationPin
            lat={notice.geopoint.lat}
            lng={notice.geopoint.lng}
            name={notice.title ?? 'Development Site'}
            listingType="facility"
          />
        </div>
      )}

      <CommentSection notice={notice} acceptingComments={acceptingComments} />

      <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          For applicants
        </p>
        <Link
          href={`/notices/certificate/${notice._id}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          View Proof of Publication Certificate →
        </Link>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <ShareWhatsApp title={notice.title || ''} />
      </div>
    </div>
  );
}
