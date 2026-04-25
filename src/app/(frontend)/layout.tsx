import '../globals.css';

import dynamic from 'next/dynamic';
import { draftMode } from 'next/headers';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Main from '@/components/layout/Main';
import { sanityFetch } from '@/lib/sanity/client/live';
import { settingsQuery } from '@/lib/sanity/queries/queries';
import { handleError } from './client-utils';

const DraftModeToast = dynamic(
  () => import('@/components/modules/DraftModeToast')
);
const Toaster = dynamic(() => import('sonner').then((mod) => mod.Toaster));
const VisualEditing = dynamic(() =>
  import('next-sanity').then((mod) => mod.VisualEditing)
);
const CookieConsent = dynamic(
  () => import('@/components/modules/CookieConsent')
);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraftMode } = await draftMode();

  let brandStyles = '';
  try {
    const { data: settings } = await sanityFetch({
      query: settingsQuery,
    });
    if (settings?.primaryColor || settings?.secondaryColor) {
      const vars: string[] = [];
      if (settings.primaryColor) {
        vars.push(`--primary: ${settings.primaryColor}`);
      }
      if (settings.secondaryColor) {
        vars.push(`--secondary: ${settings.secondaryColor}`);
      }
      brandStyles = `:root { ${vars.join('; ')} }`;
    }
  } catch {
    // Use CSS defaults if settings fetch fails
  }

  return (
    <body className="font-inter bg-white text-black">
      {brandStyles && (
        <style dangerouslySetInnerHTML={{ __html: brandStyles }} />
      )}
      <section className="min-h-screen">
        <Toaster />
        {isDraftMode && (
          <>
            <DraftModeToast />
            <VisualEditing />
          </>
        )}
        <SanityLive onError={handleError} />
        <Header />
        <Main>{children}</Main>
        <Footer />
        <CookieConsent />
      </section>
    </body>
  );
}
