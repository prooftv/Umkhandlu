import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from 'next-sanity';
import { Image } from 'next-sanity/image';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import ClientGallery from '@/components/modules/ClientGallery';
import CustomPortableText from '@/components/modules/PortableText';
import ProjectInfoBoard from '@/components/modules/ProjectInfoBoard';
import ShareWhatsApp from '@/components/modules/ShareWhatsApp';
import { Badge } from '@/components/ui/Badge';
import { serverEnv } from '@/env/serverEnv';
import { client } from '@/lib/sanity/client/client';
import { sanityFetch } from '@/lib/sanity/client/live';
import { formatMetaData } from '@/lib/sanity/client/seo';
import { urlForImage } from '@/lib/sanity/client/utils';
import {
  campaignDetailQuery,
  campaignSlugs,
} from '@/lib/sanity/queries/queries';

type Props = {
  params: Promise<{ slug: string }>;
};

const typeConfig: Record<string, { icon: string; label: string }> = {
  ad: { icon: '📢', label: 'Sponsorship' },
  activation: { icon: '🎯', label: 'Activation' },
  csr: { icon: '💚', label: 'Initiative' },
};

type CampaignData = NonNullable<
  Awaited<ReturnType<typeof sanityFetch<typeof campaignDetailQuery>>>['data']
>;

type CommunityNote = {
  _key: string;
  date: string;
  issuedBy: string;
  message: string;
};

type ProjectUpdate = {
  _key: string;
  date: string;
  title: string;
  content?: PortableTextBlock[];
  gallery?: {
    _key: string;
    alt?: string | null;
    caption?: string | null;
    asset?: { _id: string; url: string | null } | null;
  }[];
  videoUrl?: string | null;
};

type CertifiedDeliverable = {
  _key: string;
  task: string;
  status: 'pending' | 'certified' | 'disputed';
  certifiedBy?: string;
  certificationDate?: string;
  notes?: string;
};

type VerificationClaim = {
  source: string;
  value: string;
  date?: string;
  evidence?: string;
};

type VerificationRecord = {
  _id: string;
  field: string;
  conflictType?: string;
  displayTruth?: string;
  resolutionState: 'pending' | 'partial' | 'resolved' | 'escalated';
  resolutionNote?: string;
  detectedAt: string;
  resolvedAt?: string;
  claims?: VerificationClaim[];
};

type CampaignWithVerification = CampaignData & {
  deliverablesCertified?: CertifiedDeliverable[];
  verificationRecords?: VerificationRecord[];
};

const certificationPill = (status: CertifiedDeliverable['status']) => {
  switch (status) {
    case 'certified':
      return {
        label: 'Certified',
        className:
          'inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700',
      };
    case 'disputed':
      return {
        label: 'Disputed',
        className:
          'inline-flex items-center rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700',
      };
    default:
      return {
        label: 'Pending',
        className:
          'inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700',
      };
  }
};

const verificationStatePill = (
  state: VerificationRecord['resolutionState']
) => {
  switch (state) {
    case 'resolved':
      return {
        label: 'Verified',
        className:
          'inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700',
      };
    case 'escalated':
      return {
        label: 'Escalated',
        className:
          'inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700',
      };
    case 'partial':
      return {
        label: 'Under Review',
        className:
          'inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700',
      };
    default:
      return {
        label: 'Pending',
        className:
          'inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700',
      };
  }
};

const getVerificationFieldLabel = (field: string) => {
  const labels: Record<string, string> = {
    progress: 'Progress %',
    phase: 'Project Phase',
    workforce: 'Workforce / EPWP Numbers',
    timeline: 'Timeline / Dates',
    status: 'Project Status',
    budget: 'Budget / Expenditure',
    other: 'Other',
  };
  return labels[field] || field;
};

const getClaimKey = (claim: VerificationClaim, index: number) =>
  `${claim.source}-${claim.value}-${claim.date ?? index}`;

// ─── Sub-components ───────────────────────────────────────────────────────────

function CampaignSponsor({ sponsor }: { sponsor: CampaignData['sponsor'] }) {
  if (!sponsor) return null;
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-8">
      {sponsor.logo?.asset?._ref && (
        <Image
          src={urlForImage(sponsor.logo)?.width(160).fit('max').url() as string}
          alt={sponsor.name}
          width={160}
          height={64}
          className="h-12 w-auto object-contain"
        />
      )}
      <div>
        <p className="font-semibold">{sponsor.name}</p>
        {sponsor.sponsorType && (
          <p className="text-sm text-gray-500">{sponsor.sponsorType}</p>
        )}
      </div>
    </div>
  );
}

function CampaignStats({ campaign }: { campaign: CampaignData }) {
  if (campaign.campaignType === 'csr') return null;
  const items: { label: string; value: string }[] = [];
  if (campaign.startDate)
    items.push({
      label: 'Start',
      value: new Date(campaign.startDate).toLocaleDateString(),
    });
  if (campaign.endDate)
    items.push({
      label: 'End',
      value: new Date(campaign.endDate).toLocaleDateString(),
    });
  if (campaign.beneficiaries)
    items.push({
      label: 'Beneficiaries',
      value: campaign.beneficiaries.toLocaleString(),
    });
  if (campaign.targetAudience)
    items.push({ label: 'Audience', value: campaign.targetAudience });
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {items.map((item) => (
        <div key={item.label} className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">{item.label}</p>
          <p className="font-semibold">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function CampaignCover({ campaign }: { campaign: CampaignData }) {
  if (campaign.hideCoverImage) return null;
  if (!campaign.image?.asset?._ref) return null;
  return (
    <div className="mb-8 rounded-2xl overflow-hidden">
      <Image
        src={urlForImage(campaign.image)?.width(1200).url() as string}
        alt={campaign.image?.alt || campaign.title}
        width={1200}
        height={675}
        sizes="(max-width: 896px) 100vw, 896px"
        className="w-full h-auto"
      />
    </div>
  );
}

function CampaignGallery({ gallery }: { gallery: CampaignData['gallery'] }) {
  if (!gallery?.length) return null;
  const images = gallery
    .filter((img) => img.asset?.url)
    .map((img) => ({
      _key: img._key,
      alt: img.alt,
      caption: img.caption,
      url: img.asset?.url ?? '',
    }));
  return <ClientGallery images={images} />;
}

function CampaignMedia({ campaign }: { campaign: CampaignData }) {
  // For CSR campaigns, video lives in projectUpdates entries
  const hasVideo = campaign.videoUrl && campaign.campaignType !== 'csr';
  const hasAudio = campaign.audioFileUrl;
  const hasDocs = campaign.documents && campaign.documents.length > 0;
  if (!hasVideo && !hasAudio && !hasDocs) return null;
  return (
    <>
      {hasVideo && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Video</h2>
          <div className="rounded-xl overflow-hidden aspect-video">
            <iframe
              src={campaign.videoUrl ?? undefined}
              width="100%"
              height="100%"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              title={campaign.title || 'Campaign video'}
              className="w-full h-full"
            />
          </div>
        </div>
      )}
      {hasAudio && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Audio</h2>
          <audio
            controls
            preload="metadata"
            className="w-full rounded-lg"
            src={campaign.audioFileUrl ?? undefined}
          >
            <track kind="captions" />
          </audio>
        </div>
      )}
      {hasDocs && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Documents</h2>
          <div className="space-y-2">
            {campaign.documents?.map((doc) => (
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
      )}
    </>
  );
}

function ProjectUpdateEntry({ update }: { update: ProjectUpdate }) {
  const images =
    update.gallery
      ?.filter((img) => img.asset?.url)
      .map((img) => ({
        _key: img._key,
        alt: img.alt,
        caption: img.caption,
        url: img.asset?.url ?? '',
      })) ?? [];
  return (
    <div className="border-l-2 border-primary/20 pl-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-3 h-3 rounded-full bg-primary -ml-[1.625rem] shrink-0" />
        <time className="text-xs text-gray-400 font-medium">
          {new Date(update.date).toLocaleDateString('en-ZA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </time>
      </div>
      <h3 className="text-lg font-bold mb-3">{update.title}</h3>
      {update.content && (
        <div className="prose max-w-none mb-4">
          <CustomPortableText value={update.content} />
        </div>
      )}
      {images.length > 0 && <ClientGallery images={images} />}
      {update.videoUrl && (
        <div className="mt-4 rounded-xl overflow-hidden aspect-video">
          <iframe
            src={update.videoUrl}
            width="100%"
            height="100%"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            title={update.title}
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
}

function CampaignUpdatesTimeline({ campaign }: { campaign: CampaignData }) {
  const updates = (campaign as unknown as { projectUpdates?: ProjectUpdate[] })
    .projectUpdates;
  if (!updates?.length) return null;
  const sorted = [...updates].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-6">Project Updates</h2>
      <div className="space-y-10">
        {sorted.map((update) => (
          <ProjectUpdateEntry key={update._key} update={update} />
        ))}
      </div>
    </div>
  );
}

function CommunityNotices({ campaign }: { campaign: CampaignData }) {
  const notes = (campaign as unknown as { communityNote?: CommunityNote[] })
    .communityNote;
  if (!notes?.length) return null;
  return (
    <div className="mb-8 space-y-3">
      {notes.map((note) => (
        <div
          key={note._key}
          className="p-5 bg-amber-50 rounded-xl border border-amber-200"
        >
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <h2 className="text-sm font-bold text-amber-800 uppercase tracking-wide">
              📢 Community Notice — Jobs & SMME Opportunities
            </h2>
            <div className="flex items-center gap-2 text-xs text-amber-600">
              {note.date && (
                <time dateTime={note.date}>
                  {new Date(note.date).toLocaleDateString('en-ZA', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              )}
              {note.issuedBy && (
                <span className="font-medium">— {note.issuedBy}</span>
              )}
            </div>
          </div>
          <p className="text-amber-900 text-sm">{note.message}</p>
        </div>
      ))}
    </div>
  );
}

function Deliverables({ campaign }: { campaign: CampaignWithVerification }) {
  const certified = campaign.deliverablesCertified?.length
    ? campaign.deliverablesCertified
    : undefined;
  const completed = certified?.length ?? campaign.deliverables?.length ?? 0;
  if (completed === 0) return null;

  const total = campaign.totalDeliverables;
  const pct = total && total > 0 ? Math.round((completed / total) * 100) : null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-3">Deliverables</h2>
      {pct !== null && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">
              {completed} of {total} completed
            </span>
            <span className="font-bold text-primary">{pct}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${Math.min(100, pct)}%` }}
            />
          </div>
        </div>
      )}
      <div className="space-y-1.5">
        {certified
          ? certified.map((item) => (
              <div
                key={item._key}
                className="rounded-xl border border-gray-200 p-4 bg-white"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{item.task}</p>
                    {item.certifiedBy && (
                      <p className="text-xs text-gray-500">
                        Verified by {item.certifiedBy}
                        {item.certificationDate && (
                          <>
                            {' '}
                            on{' '}
                            {new Date(
                              item.certificationDate
                            ).toLocaleDateString()}
                          </>
                        )}
                      </p>
                    )}
                  </div>
                  {(() => {
                    const pill = certificationPill(item.status);
                    return <span className={pill.className}>{pill.label}</span>;
                  })()}
                </div>
                {item.notes && (
                  <p className="mt-2 text-sm text-gray-600">{item.notes}</p>
                )}
              </div>
            ))
          : campaign.deliverables?.map((d) => (
              <div
                key={d}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <span className="text-green-600">✓</span>
                <span>{d}</span>
              </div>
            ))}
      </div>
    </div>
  );
}

function ProgressLog({ log }: { log: CampaignData['progressLog'] }) {
  if (!log?.length) return null;
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-3">Progress Log</h2>
      <div className="border-l-2 border-primary/30 pl-4 space-y-4">
        {log.map((entry) => (
          <div key={entry._key}>
            <time className="text-xs text-gray-400 font-medium">
              {new Date(entry.date).toLocaleDateString()}
            </time>
            <p className="text-sm text-gray-700 mt-0.5">{entry.update}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function VerificationClaimItem({ claim }: { claim: VerificationClaim }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-sm text-slate-700">
        <span className="font-semibold">{claim.source}</span> reported{' '}
        <span className="font-semibold">{claim.value}</span>
        {claim.date ? ` on ${new Date(claim.date).toLocaleDateString()}` : ''}
      </p>
      {claim.evidence && (
        <p className="text-xs text-slate-500 mt-1">
          Evidence: {claim.evidence}
        </p>
      )}
    </div>
  );
}

function VerificationRecordItem({ record }: { record: VerificationRecord }) {
  const pill = verificationStatePill(record.resolutionState);
  const fieldText = getVerificationFieldLabel(record.field);
  return (
    <div
      key={record._id}
      className="rounded-xl border border-slate-200 bg-white p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <p className="text-sm text-slate-500 uppercase tracking-wide">
            {fieldText}
            {record.conflictType ? ` • ${record.conflictType}` : ''}
          </p>
          {record.displayTruth ? (
            <p className="mt-1 text-lg font-semibold text-slate-900">
              Public report: {record.displayTruth}
            </p>
          ) : (
            <p className="mt-1 text-lg font-semibold text-slate-900">
              Under review
            </p>
          )}
        </div>
        <span className={pill.className}>{pill.label}</span>
      </div>
      {record.resolutionNote && (
        <p className="text-sm text-slate-600 mb-2">{record.resolutionNote}</p>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="text-xs uppercase tracking-wide text-slate-500">
          Detected: {new Date(record.detectedAt).toLocaleDateString()}
        </div>
        {record.resolvedAt && (
          <div className="text-xs uppercase tracking-wide text-slate-500">
            Verified: {new Date(record.resolvedAt).toLocaleDateString()}
          </div>
        )}
      </div>
      {record.claims?.length ? (
        <div className="mt-4">
          <p className="text-sm font-semibold text-slate-800 mb-2">
            Source claims
          </p>
          <div className="space-y-3">
            {record.claims.map((claim, index) => (
              <VerificationClaimItem
                key={getClaimKey(claim, index)}
                claim={claim}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function VerificationRecords({ records }: { records: VerificationRecord[] }) {
  if (!records?.length) return null;

  return (
    <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold">Verification Records</h2>
          <p className="text-sm text-slate-600">
            Public reporting is aligned with verified evidence from the TCRS
            conflict log.
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {records.map((record) => (
          <VerificationRecordItem key={record._id} record={record} />
        ))}
      </div>
    </div>
  );
}

function CampaignRelations({ campaign }: { campaign: CampaignData }) {
  return (
    <>
      {campaign.relatedAreas && campaign.relatedAreas.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3">Target Areas</h2>
          <div className="space-y-2">
            {campaign.relatedAreas.map((area) => (
              <Link
                key={area.slug}
                href={`/areas/${area.slug}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-medium">🏘️ {area.name}</span>
                {area.induna && (
                  <span className="text-xs text-gray-500">
                    Induna: {area.induna.firstName} {area.induna.lastName}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
      {campaign.relatedProgram && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3">Related Program</h2>
          <Link
            href={`/programs/${campaign.relatedProgram.slug}`}
            className="inline-block text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            🚀 {campaign.relatedProgram.title}
          </Link>
        </div>
      )}
      {campaign.relatedNotices && campaign.relatedNotices.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3">Community Notices</h2>
          <div className="space-y-2">
            {campaign.relatedNotices.map((notice) => (
              <Link
                key={notice._id}
                href={`/notices/${notice.slug}`}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{notice.noticeType}</Badge>
                  <span className="font-medium text-sm">{notice.title}</span>
                </div>
                {notice.date && (
                  <time
                    dateTime={notice.date}
                    className="text-xs text-gray-400"
                  >
                    {new Date(notice.date).toLocaleDateString()}
                  </time>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
      {campaign.link && (
        <div className="mb-8">
          <a
            href={campaign.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Visit Campaign Page →
          </a>
        </div>
      )}
    </>
  );
}

function CampaignHeader({
  campaign,
  config,
}: {
  campaign: CampaignData;
  config: { icon: string; label: string };
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Badge>
          {config.icon} {config.label}
        </Badge>
        <Badge variant="secondary">{campaign.status}</Badge>
        {campaign.tags?.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
      <h1 className="text-3xl md:text-5xl font-bold mb-4">{campaign.title}</h1>
      {campaign.description && (
        <p className="text-xl text-gray-600">{campaign.description}</p>
      )}
    </div>
  );
}

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

function buildCampaignJsonLd(campaign: CampaignData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: campaign.title,
    ...(campaign.description && { description: campaign.description }),
    ...(campaign.startDate && { startDate: campaign.startDate }),
    ...(campaign.endDate && { endDate: campaign.endDate }),
    ...(campaign.status && {
      eventStatus:
        campaign.status === 'active'
          ? 'https://schema.org/EventScheduled'
          : campaign.status === 'completed'
            ? 'https://schema.org/EventPostponed'
            : undefined,
    }),
    ...(campaign.sponsor && {
      organizer: {
        '@type': 'Organization',
        name: campaign.sponsor.name,
        ...(campaign.sponsor.website && { url: campaign.sponsor.website }),
      },
    }),
    ...(campaign.relatedAreas &&
      campaign.relatedAreas.length > 0 && {
        location: campaign.relatedAreas.map((a) => ({
          '@type': 'Place',
          name: a.name,
        })),
      }),
  };
}

// ─── Stakeholder logos ────────────────────────────────────────────────────────

function getStakeholderLogos(campaign: CampaignData) {
  const logos: { url: string; name: string; website?: string }[] = [];
  if (campaign.stakeholderLogos) {
    for (const l of campaign.stakeholderLogos) {
      if (l.url) logos.push({ url: l.url, name: l.name ?? '' });
    }
  }
  if (logos.length === 0 && campaign.sponsor?.logoUrl) {
    logos.push({
      url: campaign.sponsor.logoUrl,
      name: campaign.sponsor.name,
      website: campaign.sponsor.website ?? undefined,
    });
  }
  return logos;
}

// ─── Metadata + Static params ─────────────────────────────────────────────────

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const { data } = await sanityFetch({
    query: campaignDetailQuery,
    params: { slug },
  });
  if (!data) return {};
  if (data.seo) {
    return {
      ...formatMetaData(data.seo, data.title),
      alternates: { canonical: `/campaigns/${slug}` },
    };
  }
  return {
    title: data.title,
    description: data.description || undefined,
    alternates: { canonical: `/campaigns/${slug}` },
  };
}

export async function generateStaticParams() {
  const slugs = await client.fetch(campaignSlugs, {
    limit: serverEnv.MAX_STATIC_PARAMS,
  });
  return slugs ? slugs.filter((s) => s !== null).map((slug) => ({ slug })) : [];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CampaignPage(props: Props) {
  const { slug } = await props.params;
  const { data: campaign } = await sanityFetch({
    query: campaignDetailQuery,
    params: { slug },
  });

  if (!campaign) notFound();

  const config = typeConfig[campaign.campaignType ?? ''] || {
    icon: '📋',
    label: campaign.campaignType,
  };

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <script
        type="application/ld+json"
        // biome-disable-next-line lint/security/noDangerouslySetInnerHtml: structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildCampaignJsonLd(campaign)),
        }}
      />
      <Breadcrumbs
        items={[
          { label: 'Campaigns', href: '/' },
          { label: campaign.title || '' },
        ]}
      />

      {/* Header */}
      <CampaignHeader campaign={campaign} config={config} />
      <CampaignSponsor sponsor={campaign.sponsor} />

      {campaign.contactPerson && (
        <div className="mb-8">
          <Link
            href={`/people/${campaign.contactPerson.slug}`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            👤 Contact: {campaign.contactPerson.firstName}{' '}
            {campaign.contactPerson.lastName}
            {campaign.contactPerson.role && (
              <span className="text-gray-400">
                — {campaign.contactPerson.role}
              </span>
            )}
          </Link>
        </div>
      )}

      {/* Cover image */}
      <CampaignCover campaign={campaign} />

      {/* Digital Project Information Board */}
      <ProjectInfoBoard
        title={campaign.title}
        campaignType={campaign.campaignType}
        sponsor={campaign.sponsor?.name}
        sponsorLogos={getStakeholderLogos(campaign)}
        fundingSource={campaign.fundingSource}
        contractor={campaign.contractor}
        contractNumber={campaign.contractNumber}
        consultingEngineer={campaign.consultingEngineer}
        projectPhase={campaign.projectPhase}
        startDate={campaign.startDate}
        endDate={campaign.endDate}
        beneficiaries={campaign.beneficiaries}
        localSMMEs={campaign.localSMMEs}
        ward={campaign.relatedAreas?.map((a) => a.name).join(', ') ?? undefined}
      />

      <CampaignStats campaign={campaign} />

      {/* Project overview (permanent description) */}
      {campaign.content && (
        <div className="mb-8 mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold mb-4">About This Project</h2>
          <div className="prose max-w-none">
            <CustomPortableText
              value={campaign.content as PortableTextBlock[]}
            />
          </div>
        </div>
      )}

      {/* Community notices (hiring / SMME) */}
      <CommunityNotices campaign={campaign} />

      {/* Deliverables progress */}
      <Deliverables campaign={campaign as CampaignWithVerification} />

      {/* Technical progress log (engineer/PMU verified) */}
      <ProgressLog log={campaign.progressLog} />

      {/* Verified evidence / conflict records */}
      <VerificationRecords
        records={
          (campaign as CampaignWithVerification).verificationRecords ?? []
        }
      />

      {/* Impact summary */}
      {campaign.impactSummary && (
        <div className="mb-8 p-6 bg-green-50 rounded-xl border border-green-100">
          <h2 className="text-xl font-bold mb-2 text-green-800">
            💚 Impact Summary
          </h2>
          <p className="text-green-700">{campaign.impactSummary}</p>
        </div>
      )}

      {/* Project updates timeline (sod turning, phase completions, etc.) */}
      <CampaignUpdatesTimeline campaign={campaign} />

      {/* Sponsorship/activation gallery + media */}
      <CampaignGallery
        gallery={campaign.campaignType !== 'csr' ? campaign.gallery : null}
      />
      <CampaignMedia campaign={campaign} />

      {/* Relations */}
      <CampaignRelations campaign={campaign} />

      <div className="mt-8 pt-6 border-t border-gray-100">
        <ShareWhatsApp title={campaign.title || ''} />
      </div>
    </div>
  );
}
