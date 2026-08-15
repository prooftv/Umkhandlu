import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from 'next-sanity';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import EventContext from '@/components/modules/EventContext';
import RecordGem from '@/components/gem/RecordGem';
import type { GemRecord } from '@/components/gem/RecordGem.types';
import { NoticeJourney } from '@/components/modules/GovernanceJourney';
import JourneyDrawer from '@/components/modules/JourneyDrawer';
import type { LineageRecord as LR } from '@/components/modules/LineageNode';
import { LineageChain } from '@/components/modules/LineageNode';
import LineageTabs from '@/components/modules/LineageTabs';
import CustomPortableText from '@/components/modules/PortableText';
import ShareWhatsApp from '@/components/modules/ShareWhatsApp';
import VisitedLink from '@/components/modules/VisitedLink';
import { Badge } from '@/components/ui/Badge';
import { clientEnv } from '@/env/clientEnv';
import { sanityFetch } from '@/lib/sanity/client/live';
import { urlForImage } from '@/lib/sanity/client/utils';
import {
  noticeDetailQuery,
  settingsOgImageQuery,
} from '@/lib/sanity/queries/queries';
import { NODE_GEOPOINT } from '@/lib/siteConfig';
import { fetchWeather } from '@/lib/weather';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
};

type FollowUpNotice = {
  _id: string;
  title: string | null;
  slug: string | null;
  noticeType: string | null;
  date: string | null;
};

type OriginNotice = {
  title: string | null;
  slug: string | null;
  noticeType: string | null;
  date: string | null;
};

const campaignTypeLabel: Record<string, string> = {
  csr: 'Related Initiative',
  activation: 'Related Activation',
  ad: 'Related Campaign',
};

function NoticeSeriesLinks({
  originNotice,
  relatedCampaign,
}: {
  originNotice: OriginNotice | null;
  relatedCampaign: {
    slug: string | null;
    title: string | null;
    campaignType: string | null;
    status: string | null;
  } | null;
}) {
  if (!originNotice && !relatedCampaign) return null;
  const campaignLabel =
    campaignTypeLabel[relatedCampaign?.campaignType ?? ''] ??
    'Related Campaign';
  const campaignTypeDisplay =
    relatedCampaign?.campaignType === 'csr'
      ? 'Initiative'
      : (relatedCampaign?.campaignType ?? '');
  return (
    <>
      {originNotice && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-xs text-blue-600 uppercase tracking-widest font-semibold mb-1">
            Part of a series
          </p>
          <Link
            href={`/notices/${originNotice.slug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            ← {originNotice.title}
          </Link>
          <p className="text-xs text-gray-400 mt-0.5">
            {originNotice.noticeType}
            {originNotice.date &&
              ` · ${new Date(originNotice.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}`}
          </p>
        </div>
      )}
      {relatedCampaign && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            {campaignLabel}
          </p>
          <Link
            href={`/campaigns/${relatedCampaign.slug}`}
            className="text-lg font-semibold hover:text-primary transition-colors"
          >
            {relatedCampaign.title} →
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{campaignTypeDisplay}</Badge>
            <Badge variant="secondary">{relatedCampaign.status}</Badge>
          </div>
        </div>
      )}
    </>
  );
}

function NoticeLineage({
  notice,
  followUpNotices,
}: {
  notice: {
    _id: string;
    title: string | null;
    slug: string | null;
    noticeType: string | null;
    date: string | null;
    producedRecords?: LR[] | null;
  };
  followUpNotices: FollowUpNotice[] | null;
}) {
  const hasLineage =
    (notice.producedRecords && notice.producedRecords.length > 0) ||
    (followUpNotices && followUpNotices.length > 0);

  if (!hasLineage) return null;

  return (
    <div className="mt-10 pt-8 border-t border-gray-100">
      <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-4">
        Governance Lineage
      </p>
      <LineageChain
        ancestors={[]}
        current={{ label: 'This Notice', title: notice.title }}
        records={notice.producedRecords ?? []}
      />
      {followUpNotices && followUpNotices.length > 0 && (
        <div className="mt-4 border-l-2 border-blue-300 pl-4 space-y-3">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">
            Follow-up Notices
          </p>
          {followUpNotices.map((fu) => (
            <div key={fu._id} className="py-1">
              <VisitedLink href={`/notices/${fu.slug}`}>{fu.title}</VisitedLink>
              <p className="text-xs text-gray-500 mt-0.5">
                Follow-up meeting
                {fu.date &&
                  ` · ${new Date(fu.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type Geopoint = { lat: number; lng: number } | null | undefined;

async function resolveWeather(
  _id: string,
  date: string | null,
  geo: Geopoint,
  hasStoredContext: boolean
) {
  if (!date) return null;
  const { lat, lng } = geo ?? NODE_GEOPOINT;
  const weather = await fetchWeather(date, lat, lng);
  if (!weather) return null;
  const isFuture = new Date(date) >= new Date();
  if (isFuture || !hasStoredContext) {
    fetch(`${clientEnv.NEXT_PUBLIC_SITE_URL}/api/weather-patch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id, date, lat, lng }),
    }).catch(() => null);
  }
  return weather;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const [{ data }, { data: fallbackOgUrl }] = await Promise.all([
    sanityFetch({ query: noticeDetailQuery, params: { slug } }),
    sanityFetch({ query: settingsOgImageQuery }),
  ]);
  if (!data) return {};
  const imageUrl =
    (data.image
      ? urlForImage(data.image)?.width(1200).height(630).fit('crop').url()
      : null) ??
    fallbackOgUrl ??
    undefined;
  return {
    title: data.title,
    description: data.excerpt || undefined,
    alternates: { canonical: `/notices/${slug}` },
    openGraph: {
      title: data.title ?? undefined,
      description: data.excerpt ?? undefined,
      type: 'article',
      publishedTime: data.date ?? undefined,
      url: `/notices/${slug}`,
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630 }]
        : undefined,
    },
  };
}

function LineageTabContent({
  notice,
  followUpNotices,
  lineageCount,
  slug,
}: {
  notice: {
    _id: string;
    title: string | null;
    slug: string | null;
    noticeType: string | null;
    date: string | null;
    producedRecords?: LR[] | null;
    relatedCampaign?: {
      slug: string | null;
      title: string | null;
      campaignType: string | null;
      status: string | null;
    } | null;
  };
  followUpNotices: FollowUpNotice[] | null;
  lineageCount: number;
  slug: string;
}) {
  return (
    <>
      <NoticeLineage notice={notice} followUpNotices={followUpNotices} />
      {lineageCount === 0 && (
        <div className="py-6">
          <p className="text-sm font-semibold text-gray-700 mb-1">
            No governance records linked yet.
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            Governance lineage appears here when formal records — meeting
            minutes, resolutions, or decisions — are produced from this notice
            and linked to it in the CMS. This notice may be the origin of a
            chain that has not yet been recorded.
          </p>
          {notice.relatedCampaign && (
            <p className="text-sm text-gray-400 mt-3">
              Related project:{' '}
              <Link
                href={`/campaigns/${notice.relatedCampaign.slug}`}
                className="text-primary hover:underline"
              >
                {notice.relatedCampaign.title}
              </Link>
            </p>
          )}
        </div>
      )}
      <div className="mt-6 flex flex-col gap-2">
        <Link
          href={`/notices/lineage/${slug}`}
          className="text-sm text-primary font-medium hover:underline"
        >
          🖸 Print Lineage Certificate →
        </Link>
        {lineageCount > 0 && (
          <JourneyDrawer slug={slug}>
            <NoticeJourney
              notice={notice}
              producedRecords={notice.producedRecords ?? []}
              followUpNotices={followUpNotices ?? []}
            />
          </JourneyDrawer>
        )}
      </div>
    </>
  );
}

export default async function NoticePage(props: Props) {
  const { slug } = await props.params;
  const { data: notice } = await sanityFetch({
    query: noticeDetailQuery,
    params: { slug },
  });

  if (!notice) notFound();

  const originNotice = notice.originNotice as OriginNotice | null;
  const followUpNotices = notice.followUpNotices as FollowUpNotice[] | null;
  const lineageCount =
    (notice.producedRecords?.length ?? 0) + (followUpNotices?.length ?? 0);

  // Weather — fetch live on every visit
  const geo = notice.relatedArea?.geopoint;
  const weather = await resolveWeather(
    notice._id,
    notice.date ?? null,
    geo,
    !!notice.weatherContext
  );

  const noticeTab = (
    <>
      {notice.excerpt && (
        <p className="text-xl text-gray-600 mb-8">{notice.excerpt}</p>
      )}
      {notice.content && (
        <CustomPortableText value={notice.content as PortableTextBlock[]} />
      )}
      <NoticeSeriesLinks
        originNotice={originNotice}
        relatedCampaign={notice.relatedCampaign ?? null}
      />
      <div className="mt-8 pt-6 border-t border-gray-100">
        <ShareWhatsApp title={notice.title || ''} />
      </div>
    </>
  );

  const lineageTab = (
    <LineageTabContent
      notice={notice}
      followUpNotices={followUpNotices}
      lineageCount={lineageCount}
      slug={slug}
    />
  );

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Breadcrumbs
        items={[
          { label: 'Notices', href: '/notices' },
          { label: notice.title || '' },
        ]}
      />
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <Badge>{notice.noticeType}</Badge>
          {notice.date && (
            <time dateTime={notice.date} className="text-sm text-gray-500">
              {new Date(notice.date).toLocaleDateString('en-ZA', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          )}
          {notice.relatedArea && (
            <Link
              href={`/areas/${notice.relatedArea.slug}`}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              📍 {notice.relatedArea.name}
            </Link>
          )}
          {notice.pinned && (
            <span className="text-sm text-primary">📌 Pinned</span>
          )}
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-6">{notice.title}</h1>
        <EventContext
          weather={weather}
          location={notice.location}
          attendance={notice.attendance}
          variant="strip"
        />
        {/* Record GEM — meeting notices only. Additive: remove this block and the page is unchanged. */}
        {notice.noticeType === 'meeting' && (() => {
          const gemRecord: GemRecord = {
            _id: notice._id,
            _type: 'notice',
            title: notice.title ?? '',
            slug: notice.slug ?? '',
            noticeType: notice.noticeType,
            date: notice.date ?? null,
            location: notice.location ?? null,
            attendance: notice.attendance ?? null,
            relatedArea: notice.relatedArea ?? null,
            relatedCampaign: notice.relatedCampaign ?? null,
            originNotice: notice.originNotice as GemRecord['originNotice'] ?? null,
            lineageCount,
          }
          return <div className="mt-4"><RecordGem record={gemRecord} variant="card" /></div>
        })()}
      </div>
      <LineageTabs
        noticeTab={noticeTab}
        lineageTab={lineageTab}
        lineageCount={lineageCount}
      />
    </div>
  );
}
