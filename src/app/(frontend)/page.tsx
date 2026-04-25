import { notFound } from 'next/navigation';
import PageSections from '@/components/sections/PageSections';
import { getDocumentLink } from '@/lib/links';
import { generateWebSiteJsonLd } from '@/lib/sanity/client/jsonLd';
import { sanityFetch } from '@/lib/sanity/client/live';
import { formatMetaData } from '@/lib/sanity/client/seo';
import { homePageQuery, settingsQuery } from '@/lib/sanity/queries/queries';

export async function generateMetadata() {
  const { data: homePage } = await sanityFetch({
    query: homePageQuery,
  });

  if (!homePage?.seo) {
    return {};
  }

  return {
    ...formatMetaData(homePage.seo, homePage?.name || ''),
    alternates: {
      canonical: getDocumentLink({ _type: 'homePage', slug: null }, true),
    },
  };
}

export default async function Page() {
  const [{ data: homePage }, { data: settings }] = await Promise.all([
    sanityFetch({ query: homePageQuery }),
    sanityFetch({ query: settingsQuery }),
  ]);

  if (!homePage) {
    notFound();
  }

  const { _id, _type, pageSections } = homePage;
  const jsonLd = generateWebSiteJsonLd(
    settings?.title || 'Umkhandlu',
    settings?.description || undefined
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageSections
        documentId={_id}
        documentType={_type}
        sections={pageSections}
      />
    </>
  );
}
