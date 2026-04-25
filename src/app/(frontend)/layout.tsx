import '../globals.css';

import dynamic from 'next/dynamic';
import { draftMode } from 'next/headers';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Main from '@/components/layout/Main';
import { SanityLive } from '@/lib/sanity/client/live';
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

  return (
    <body className="font-inter bg-white text-black">
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
