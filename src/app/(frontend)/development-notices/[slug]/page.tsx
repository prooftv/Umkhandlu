import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from 'next-sanity';
import { defineQuery } from 'next-sanity';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import {
  DeadlineCountdownClient,
  NoticeStatutoryMapClient,
} from '@/components/modules/NoticeMapClients';
import CustomPortableText from '@/components/modules/PortableText';
import PublicCommentForm from '@/components/modules/PublicCommentForm';
import ShareWhatsApp from '@/components/modules/ShareWhatsApp';
import { Badge } from '@/components/ui/Badge';
import { serverEnv } from '@/env/serverEnv';
import { client } from '@/lib/sanity/client/client';
import { sanityFetch } from '@/lib/sanity/client/live';
import { devNoticeSlugs } from '@/lib/sanity/queries/queries';

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
    siteFeatureId,
    ccNoticeRef,
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

type RiskItem = {
  id: string;
  identifier: string;
  title: string;
  category: string;
  exposure: number;
  status: string;
  treatment: string;
};

type ObligationItem = {
  id: string;
  identifier: string;
  title: string;
  source: string;
  due_date: string | null;
  status: string;
};

type FindingItem = {
  id: string;
  title: string;
  finding_type: string;
  severity: string;
  status: string;
  identified_at: string;
};

type NoticeIntelligence = {
  risks: RiskItem[];
  obligations: ObligationItem[];
  findings: FindingItem[];
  summary: {
    riskCount: number;
    criticalRisks: number;
    highRisks: number;
    obligationCount: number;
    nonCompliant: number;
    underReview: number;
    findingCount: number;
    openFindings: number;
    dataConfidence: string;
  };
} | null;

async function fetchNoticeIntelligence(
  sanityId: string
): Promise<NoticeIntelligence> {
  const baseUrl = process.env.CONTROL_CENTRE_URL;
  if (!baseUrl) return null;
  try {
    const res = await fetch(
      `${baseUrl}/api/notices/by-ref/${encodeURIComponent(sanityId)}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    return (await res.json()) as NoticeIntelligence;
  } catch {
    return null;
  }
}

async function fetchSiteBoundary(siteFeatureId: string): Promise<WardBoundary> {
  const baseUrl = process.env.CONTROL_CENTRE_URL;
  if (!baseUrl) return null;
  try {
    const res = await fetch(
      `${baseUrl}/api/spatial/features/${siteFeatureId}`,
      {
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return null;
    const json = (await res.json()) as {
      type: string;
      geometry: { type: string; coordinates: unknown };
      meta?: { dataset?: string; datasetDate?: string };
    };
    if (json.type !== 'Feature' || !json.geometry) return null;
    return {
      geometry: json.geometry,
      source: json.meta?.dataset ?? 'Control Centre',
      date: json.meta?.datasetDate ?? null,
    };
  } catch {
    return null;
  }
}

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

const EXPOSURE_LABEL: Record<string, { label: string; colour: string }> = {
  critical: {
    label: 'Critical',
    colour: 'text-red-700 bg-red-50 border-red-200',
  },
  high: {
    label: 'High',
    colour: 'text-amber-700 bg-amber-50 border-amber-200',
  },
  moderate: {
    label: 'Moderate',
    colour: 'text-gray-600 bg-gray-50 border-gray-200',
  },
};

function exposureBand(score: number) {
  if (score >= 15) return EXPOSURE_LABEL.critical;
  if (score >= 8) return EXPOSURE_LABEL.high;
  return EXPOSURE_LABEL.moderate;
}

function RiskPanel({ intelligence }: { intelligence: NoticeIntelligence }) {
  if (!intelligence) return null;
  const { risks, obligations, findings, summary } = intelligence;
  if (summary.dataConfidence === 'no-assessment') return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">
        Risk &amp; Planning Considerations
      </h2>

      {risks.length > 0 && (
        <div className="mb-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Identified Risks
          </h3>
          {risks.map((r) => {
            const band = exposureBand(r.exposure);
            return (
              <div
                key={r.id}
                className={`rounded-lg border p-3 ${band.colour}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {r.identifier} — {r.title}
                    </p>
                    <p className="text-xs mt-0.5 opacity-75 capitalize">
                      {r.category} · Treatment: {r.treatment}
                    </p>
                  </div>
                  <span className="text-xs font-semibold shrink-0">
                    {band.label} ({r.exposure})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {obligations.length > 0 && (
        <div className="mb-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Compliance Obligations
          </h3>
          {obligations.map((o) => {
            const isNonCompliant = o.status === 'non-compliant';
            const isUnderReview = o.status === 'under-review';
            return (
              <div
                key={o.id}
                className={`rounded-lg border p-3 ${
                  isNonCompliant
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : isUnderReview
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {o.identifier} — {o.title}
                    </p>
                    <p className="text-xs mt-0.5 opacity-75">{o.source}</p>
                  </div>
                  <span className="text-xs font-semibold shrink-0 capitalize">
                    {o.status.replace(/-/g, ' ')}
                  </span>
                </div>
                {o.due_date && (
                  <p className="text-xs mt-1 opacity-60">
                    Due:{' '}
                    {new Date(o.due_date).toLocaleDateString('en-ZA', {
                      dateStyle: 'medium',
                    })}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {findings.length > 0 && (
        <div className="mb-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Outstanding Matters
          </h3>
          {findings.map((f) => (
            <div
              key={f.id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-gray-800">{f.title}</p>
                <span className="text-xs font-semibold shrink-0 capitalize text-gray-600">
                  {f.severity}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 capitalize">
                {f.finding_type.replace(/-/g, ' ')}
              </p>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">
        Risk and compliance assessment by the platform operator. These are
        evidence and assessment states — not findings that the application is
        legally compliant or non-compliant. The responsible authority retains
        all decision-making power.
      </p>
    </div>
  );
}

function LiquorStatutoryNote() {
  return (
    <details className="mb-8 rounded-xl border border-blue-100 bg-blue-50 group">
      <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-bold text-blue-800 list-none">
        <span>⚖️ About this notice</span>
        <span className="text-blue-400 text-xs group-open:hidden">Show ▾</span>
        <span className="text-blue-400 text-xs hidden group-open:inline">
          Hide ▴
        </span>
      </summary>
      <div className="px-4 pb-4 text-sm text-blue-700 space-y-2">
        <p>
          This notice is published by the traditional council as a community
          information and consultation record. Your comment is captured as part
          of the community&apos;s structured response to this application — it
          forms part of the consultation evidence submitted to the{' '}
          <strong>KwaZulu-Natal Economic Regulatory Authority (KZNERA)</strong>.
        </p>
        <p>
          If you wish to lodge a formal statutory objection under the{' '}
          <strong>KZN Liquor Licensing Act 6 of 2010</strong>, that must be
          served in writing on the relevant KZNERA local committee and on the
          applicant, with proof of service (section 43). The statutory objection
          period is <strong>21 business days</strong> from newspaper
          publication. The statutory objection address is shown below.
        </p>
      </div>
    </details>
  );
}

function CommentSection({
  notice,
  acceptingComments,
}: {
  notice: NoticeData;
  acceptingComments: boolean;
}) {
  const isLiquor = notice.noticeType === 'liquor';
  return (
    <>
      {acceptingComments && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Community Comment</h2>
          <p className="text-sm text-gray-500 mb-4">
            Your comment is recorded as part of the community consultation
            evidence for this application.
          </p>
          <PublicCommentForm
            noticeId={notice._id}
            noticeTitle={notice.title ?? ''}
          />
        </div>
      )}
      {acceptingComments && notice.commentContact && (
        <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-sm font-bold text-gray-700 mb-1">
            {isLiquor
              ? '⚖️ Statutory objection address (KZNERA)'
              : '📬 Statutory objection address'}
          </h3>
          <p className="text-sm text-gray-600 whitespace-pre-line break-words">
            {notice.commentContact}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Formal objections under the applicable legislation must be served at
            this address — separate from the community comment above.
          </p>
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
  if (!area || area.wardNumber == null || !area.municipality) {
    return { wardName: null, wardLink: null, catB: null };
  }
  const catB = MUNIC_TO_CAT_B[area.municipality.toLowerCase()] ?? null;
  const wardName = `Ward ${area.wardNumber} — ${MUNIC_LABELS[area.municipality] ?? area.municipality}`;
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

function NoticeSpatialSection({
  notice,
  wardBoundary,
  siteBoundary,
  wardName,
  wardLink,
  mapMunicipality,
  mapCatB,
  mapControlCentreUrl,
  wardNumber,
}: {
  notice: NoticeData;
  wardBoundary: WardBoundary;
  siteBoundary: WardBoundary;
  wardName: string | null;
  wardLink: string | null;
  mapMunicipality: string | null;
  mapCatB: string | null;
  mapControlCentreUrl: string;
  wardNumber: number | null | undefined;
}) {
  const geopoint = notice.geopoint;
  if (
    !geopoint ||
    !Number.isFinite(geopoint.lat) ||
    !Number.isFinite(geopoint.lng)
  ) {
    return null;
  }
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Spatial Context</h2>
      <NoticeStatutoryMapClient
        lat={geopoint.lat}
        lng={geopoint.lng}
        name={notice.title ?? 'Development Site'}
        noticeType={notice.noticeType ?? 'other'}
        locationPrecision={notice.locationPrecision}
        wardBoundary={wardBoundary}
        siteBoundary={siteBoundary}
        wardName={wardName}
        municipality={mapMunicipality}
        mapDeepLink={wardLink ? `/map?ward=${wardLink}` : '/map'}
        wardNumber={wardNumber ?? null}
        catB={mapCatB}
        controlCentreUrl={mapControlCentreUrl}
      />
    </div>
  );
}

async function resolveNoticeSpatial(notice: NoticeData) {
  const area = notice.relatedArea as RelatedArea | null;
  const { wardName, wardLink } = resolveWardContext(area);
  const [wardBoundary, siteBoundary, intelligence] = await Promise.all([
    area?.wardNumber != null && area.municipality
      ? fetchWardBoundary(area.wardNumber, area.municipality)
      : Promise.resolve(null),
    notice.siteFeatureId
      ? fetchSiteBoundary(notice.siteFeatureId)
      : Promise.resolve(null),
    // Use Sanity _id as the stable node reference — CC looks up by node_notice_ref
    fetchNoticeIntelligence(notice._id),
  ]);
  return { area, wardName, wardLink, wardBoundary, siteBoundary, intelligence };
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

  const { area, wardName, wardLink, wardBoundary, siteBoundary, intelligence } =
    await resolveNoticeSpatial(notice);

  const mapMunicipality = area?.municipality
    ? (MUNIC_LABELS[area.municipality] ?? area.municipality)
    : null;
  const mapCatB = area?.municipality
    ? (MUNIC_TO_CAT_B[area.municipality.toLowerCase()] ?? null)
    : null;
  const mapControlCentreUrl =
    process.env.NEXT_PUBLIC_CONTROL_CENTRE_URL ??
    'https://unami-platform-core-umkhandlu.vercel.app';

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
          <DeadlineCountdownClient
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
      <NoticeSpatialSection
        notice={notice}
        wardBoundary={wardBoundary}
        siteBoundary={siteBoundary}
        wardName={wardName}
        wardLink={wardLink}
        mapMunicipality={mapMunicipality}
        mapCatB={mapCatB}
        mapControlCentreUrl={mapControlCentreUrl}
        wardNumber={area?.wardNumber}
      />

      {/* Risk and planning considerations — from Control Centre */}
      <RiskPanel intelligence={intelligence} />

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
          View Digital Publication Evidence Record →
        </Link>
        <p className="text-xs text-gray-400 mt-1">
          Records platform publication activity only. Does not certify statutory
          compliance.
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <ShareWhatsApp title={notice.title || ''} />
      </div>
    </div>
  );
}
