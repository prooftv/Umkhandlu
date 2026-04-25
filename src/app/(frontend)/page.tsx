import PageSections from '@/components/sections/PageSections';
import { getDocumentLink } from '@/lib/links';
import { generateWebSiteJsonLd } from '@/lib/sanity/client/jsonLd';
import { sanityFetch } from '@/lib/sanity/client/live';
import { formatMetaData } from '@/lib/sanity/client/seo';
import { homePageQuery, settingsQuery } from '@/lib/sanity/queries/queries';
import { SITE_NAME } from '@/lib/siteConfig';

export const revalidate = 60;

export async function generateMetadata() {
  try {
    const { data: homePage } = await sanityFetch({
      query: homePageQuery,
    });

    if (!homePage?.seo) {
      return { title: SITE_NAME };
    }

    return {
      ...formatMetaData(homePage.seo, homePage?.name || ''),
      alternates: {
        canonical: getDocumentLink({ _type: 'homePage', slug: null }, true),
      },
    };
  } catch {
    return { title: SITE_NAME };
  }
}

function EmptyState() {
  return (
    <div className="container mx-auto py-24 text-center max-w-2xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">Umkhandlu</h1>
      <p className="text-xl text-gray-600 mb-8">
        Community digital platform for traditional councils.
      </p>
      <p className="text-gray-500 mb-4">
        This site is ready. Open{' '}
        <a href="/studio" className="text-primary underline">
          Sanity Studio
        </a>{' '}
        to start adding content.
      </p>
      <div className="text-left bg-gray-50 rounded-xl p-6 text-sm text-gray-600 space-y-2">
        <p className="font-semibold text-gray-800">Getting started:</p>
        <p>1. Go to /studio and sign in</p>
        <p>2. Create a Home Page document</p>
        <p>3. Add sections (hero, notices, leadership, etc.)</p>
        <p>4. Create Site Settings (title, description, contact info)</p>
      </div>
    </div>
  );
}

export default async function Page() {
  try {
    const [{ data: homePage }, { data: settings }] = await Promise.all([
      sanityFetch({ query: homePageQuery }),
      sanityFetch({ query: settingsQuery }),
    ]);

    if (!homePage) {
      return <EmptyState />;
    }

    const { _id, _type, pageSections } = homePage;
    const jsonLd = generateWebSiteJsonLd(
      settings?.title || SITE_NAME,
      settings?.description || undefined
    );

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
        <PageSections
          documentId={_id}
          documentType={_type}
          sections={pageSections}
        />
      </>
    );
  } catch (error) {
    console.error('Homepage fetch failed:', error);
    return <EmptyState />;
  }
}
