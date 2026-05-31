import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { defineQuery } from 'next-sanity';
import PrintButton from '@/components/modules/PrintButton';
import ProofOfPublication from '@/components/modules/ProofOfPublication';
import { sanityFetch } from '@/lib/sanity/client/live';
import { SITE_NAME } from '@/lib/siteConfig';

type Props = {
  params: Promise<{ id: string }>;
};

const certificateQuery = defineQuery(`
  *[_type == "developmentNotice" && _id == $id][0]{
    _id,
    title,
    noticeType,
    legalMandate,
    referenceNumber,
    applicant,
    publishDate,
    commentDeadline,
    retentionPeriod,
    location,
    geopoint,
    status,
    "slug": slug.current,
    documents[] { title }
  }
`);

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params;
  const { data } = await sanityFetch({
    query: certificateQuery,
    params: { id },
  });
  if (!data) return {};
  return {
    title: `Proof of Publication — ${data.title}`,
    robots: { index: false },
  };
}

export default async function CertificatePage(props: Props) {
  const { id } = await props.params;
  const { data: notice } = await sanityFetch({
    query: certificateQuery,
    params: { id },
  });

  if (!notice) notFound();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://umkhandlu.vercel.app';
  const publicUrl = `${siteUrl}/notices/${notice.slug}`;

  return (
    <div className="py-8 print:py-0">
      <ProofOfPublication
        siteName={SITE_NAME}
        noticeTitle={notice.title || ''}
        noticeType={notice.noticeType || 'other'}
        legalMandate={notice.legalMandate}
        referenceNumber={notice.referenceNumber}
        applicant={notice.applicant || ''}
        publishDate={notice.publishDate}
        commentDeadline={notice.commentDeadline}
        retentionPeriod={notice.retentionPeriod}
        location={notice.location || ''}
        geopoint={notice.geopoint}
        status={notice.status}
        documents={notice.documents}
        publicUrl={publicUrl}
      />
      <div className="text-center mt-6 no-print">
        <PrintButton />
      </div>
    </div>
  );
}
