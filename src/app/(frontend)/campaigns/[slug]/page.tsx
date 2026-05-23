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

function CampaignSponsor({ sponsor }: { sponsor: CampaignData['sponsor'] }) {
  if (!sponsor) return null;
  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-8">
      {sponsor.logo?.asset?._ref && (
        <Image
          src={
            urlForImage(sponsor.logo)
              ?.width(80)
              .height(40)
              .fit('max')
              .url() as string
          }
          alt={sponsor.name}
          width={80}
          height={40}
          className="object-contain"
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
  const hasVideo = campaign.videoUrl;
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

function ProgressLog({ log }: { log: CampaignData['progressLog'] }) {
  if (!log?.length) return null;
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-3">Progress Updates</h2>
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

function getStakeholderLogos(campaign: CampaignData) {
  const logos: { url: string; name: string }[] = [];
  if (campaign.sponsor?.logoUrl) {
    logos.push({ url: campaign.sponsor.logoUrl, name: campaign.sponsor.name });
  }
  if (campaign.stakeholderLogos) {
    for (const l of campaign.stakeholderLogos) {
      if (l.url) logos.push({ url: l.url, name: l.name ?? '' });
    }
  }
  return logos;
}

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

  const jsonLd = buildCampaignJsonLd(campaign);

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: 'Campaigns', href: '/' },
          { label: campaign.title || '' },
        ]}
      />

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

      <CampaignCover campaign={campaign} />

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

      {campaign.content && (
        <div className="mb-8 prose max-w-none">
          <CustomPortableText value={campaign.content as PortableTextBlock[]} />
        </div>
      )}

      {campaign.deliverables && campaign.deliverables.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3">Deliverables</h2>
          <div className="flex flex-wrap gap-2">
            {campaign.deliverables.map((d) => (
              <span
                key={d}
                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
              >
                ✓ {d}
              </span>
            ))}
          </div>
        </div>
      )}

      <ProgressLog log={campaign.progressLog} />
      {campaign.impactSummary && (
        <div className="mb-8 p-6 bg-green-50 rounded-xl border border-green-100">
          <h2 className="text-xl font-bold mb-2 text-green-800">
            💚 Impact Summary
          </h2>
          <p className="text-green-700">{campaign.impactSummary}</p>
        </div>
      )}

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

      <CampaignGallery gallery={campaign.gallery} />
      <CampaignMedia campaign={campaign} />

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

      <div className="mt-8 pt-6 border-t border-gray-100">
        <ShareWhatsApp title={campaign.title || ''} />
      </div>
    </div>
  );
}
