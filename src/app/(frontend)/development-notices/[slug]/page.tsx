import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from 'next-sanity';
import { defineQuery } from 'next-sanity';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import CustomPortableText from '@/components/modules/PortableText';
import PublicCommentForm from '@/components/modules/PublicCommentForm';
import ShareWhatsApp from '@/components/modules/ShareWhatsApp';
import { Badge } from '@/components/ui/Badge';
import { serverEnv } from '@/env/serverEnv';
import { client } from '@/lib/sanity/client/client';
import { sanityFetch } from '@/lib/sanity/client/live';
import { devNoticeSlugs } from '@/lib/sanity/queries/queries';

const DeadlineCountdown = dynamic(
  () => import('@/components/modules/DeadlineCountdown'),
  { ssr: false }
);

const SiteContextMap = dynamic(
  () => import('@/components/modules/SiteContextMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
        Loading map…
      </div>
    ),
  }
);

type Props = {
  params: Promise<{ slug: string }>;
};

const devNoticeQuery = defineQuery(`
  *[_type == "developmentNotice" && slug.current == $slug][0]{
    _id,
    _rev,
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
    locationPrecision,
    commentDeadline,
    commentContact,
    publishDate,
    image,
    documents[] { _key, title, "url": asset->url },
    "relatedArea": relatedArea->{ name, "slug": slug.current, wardNumber, municipality, areaLevel }
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

const MUNIC_TO_CAT_B: Record<string, string> = {
  newcastle: 'KZN252',
  emadlangeni: 'KZN253',
  dannhauser: 'KZN254',
};

const MUNIC_LABELS: Record<string, string> = {
  newcastle: 'Newcastle LM',
  emadlangeni: 'eMadlangeni LM',
  dannhauser: 'Dannhauser LM',
  amajuba: 'Amajuba District',
};

type NoticeData = NonNullable<
  Awaited<ReturnType<typeof sanityFetch<typeof devNoticeQuery>>>['data']
>;

type WardBoundary = {
  geometry: { type: string; coordinates: unknown };
  source: string | null;
  date: string | null;
} | null;

async function fetchWardBoundary(
  wardNumber: number,
  municipality: string
): Promise<WardBoundary> {
  const baseUrl = process.env.CONTROL_CENTRE_URL;
  if (!baseUrl) return null;
  try {
    const res = await fetch(`${baseUrl}/api/spatial/wards`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      type: string;
      features: Array<{
        geometry: { type: string; coordinates: unknown };
        properties: Record<string, unknown>;
      }>;
      meta?: { dataset?: string; datasetDate?: string };
    };
    if (json.type !== 'FeatureCollection' || !Array.isArray(json.features))
      return null;
    const catB = MUNIC_TO_CAT_B[municipality.toLowerCase()];
    const feature = json.features.find(
      (f) =>
        f.properties.WardNo === wardNumber &&
        (!catB || f.properties.CAT_B === catB)
    );
    if (!feature) return null;
    return {
      geometry: feature.geometry,
      source: json.meta?.dataset ?? 'MDB 2026',
      date: json.meta?.datasetDate ?? '2026',
    };
  } catch {
    return null;
  }
}

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
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5 sm:gap-4">
      <span className="text-xs text-gray-500 uppercase tracking-wide shrink-0">
        {label}
      </span>
      <span
        className={`text-sm font-medium break-words ${
          highlight ? 'text-red-600 font-bold' : 'text-gray-900'
        }`}
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
      <div className="flex items-center gap-2 mb-4 flex-wrap">
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
      <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
        {notice.title}
      </h1>
      {notice.description && (
        <p className="text-base md:text-lg text-gray-600">
          {notice.description}
        </p>
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
    <div className="bg-gray-50 rounded-xl p-4 md:p-6 mb-8 space-y-3">
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5 sm:gap-4">
          <span className="text-xs text-gray-500 uppercase tracking-wide shrink-0">
            Affected Area
          </span>
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
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px]"
          >
            <span className="text-lg shrink-0">📄</span>
            <span className="text-sm font-medium flex-1 min-w-0 break-words">
              {doc.title || 'Document'}
            </span>
            <span className="text-xs text-primary ml-auto shrink-0">
              Download →
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

function LiquorStatutoryNote() {
  return (
    <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
      <h3 className="text-sm font-bold text-blue-800 mb-2">
        ⚖️ KZN Liquor Licensing — Statutory Process
      </h3>
      <div className="text-sm text-blue-700 space-y-2">
        <p>
          Liquor applications in KwaZulu-Natal are governed by the{' '}
          <strong>KZN Liquor Licensing Act 6 of 2010</strong>. The licensing
          authority is the <strong>KZN Liquor Authority</strong> — not the
          traditional council.
        </p>
        <p>
          <strong>Formal objections</strong> must be lodged directly with the
          KZN Liquor Authority within 30 days of publication. Submitting a
          comment through this platform does not constitute a formal objection
          to the licensing authority.
        </p>
        <p>
          Statutory publication requires newspaper advertisement and physical
          site display. This digital notice is an additional community
          information channel — it does not substitute for statutory
          publication.
        </p>
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
            {notice.commentDeadline
              ? formatDateZA(notice.commentDeadline)
              : 'the deadline'}
            . You may also submit directly to: {notice.commentContact}
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
              ? '📬 Where to Submit Formal Comments'
              : '📬 Comments Were Submitted To'}
          </h3>
          <p className="text-sm text-amber-700 whitespace-pre-line break-words">
            {notice.commentContact}
          </p>
          {notice.noticeType === 'liquor' && acceptingComments && (
            <p className="text-xs text-amber-600 mt-2 border-t border-amber-200 pt-2">
              For formal objections under the KZN Liquor Licensing Act, submit
              directly to the KZN Liquor Authority — not to the traditional
              council.
            </p>
          )}
        </div>
      )}
    </>
  );
}

type RelatedArea = {
  name: string | null;
  slug: string | null;
  wardNumber?: number | null;
  municipality?: string | null;
  areaLevel?: string | null;
};

function resolveWardContext(area: RelatedArea | null) {
  if (
    !area ||
    area.areaLevel !== 'ward' ||
    area.wardNumber == null ||
    !area.municipality
  ) {
    return { wardName: null, wardLink: null, catB: null };
  }
  const catB = MUNIC_TO_CAT_B[area.municipality.toLowerCase()] ?? null;
  const wardName = `Ward ${area.wardNumber}${area.municipality ? ` — ${MUNIC_LABELS[area.municipality] ?? area.municipality}` : ''}`;
  const wardLink = catB ? `${catB}_${area.wardNumber}` : null;
  return { wardName, wardLink, catB };
}

export async function generateStaticParams() {
  const slugs = await client.fetch(devNoticeSlugs, {
    limit: serverEnv.MAX_STATIC_PARAMS,
  });
  return slugs ? slugs.filter((s) => s !== null).map((slug) => ({ slug })) : [];
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

  const area = notice.relatedArea as RelatedArea | null;
  const { wardName, wardLink } = resolveWardContext(area);
  const wardBoundary =
    area?.areaLevel === 'ward' && area.wardNumber != null && area.municipality
      ? await fetchWardBoundary(area.wardNumber, area.municipality)
      : null;

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Breadcrumbs
        items={[
          { label: 'Development Notices', href: '/development-notices' },
          { label: notice.title || '' },
        ]}
      />

      <NoticeHeader notice={notice} />

      {/* Deadline countdown */}
      {notice.commentDeadline && (
        <div className="mb-6">
          <DeadlineCountdown
            deadline={notice.commentDeadline}
            isOpen={isOpen}
          />
        </div>
      )}

      <NoticeDetails notice={notice} acceptingComments={acceptingComments} />

      {notice.content && (
        <div className="mb-8 prose max-w-none">
          <CustomPortableText value={notice.content as PortableTextBlock[]} />
        </div>
      )}

      <NoticeDocuments documents={notice.documents} />

      {/* Spatial context map */}
      {notice.geopoint?.lat && notice.geopoint?.lng && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Site Location</h2>
          <SiteContextMap
            lat={notice.geopoint.lat}
            lng={notice.geopoint.lng}
            name={notice.title ?? 'Development Site'}
            locationPrecision={notice.locationPrecision}
            wardBoundary={wardBoundary}
            wardName={wardName}
            municipality={
              area?.municipality
                ? (MUNIC_LABELS[area.municipality] ?? area.municipality)
                : null
            }
            mapDeepLink={wardLink ? `/map?ward=${wardLink}` : `/map`}
          />
        </div>
      )}

      {/* Liquor-specific statutory process note */}
      {notice.noticeType === 'liquor' && <LiquorStatutoryNote />}

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
