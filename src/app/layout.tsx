/**
 * Do not import Sanity or front-end specific code into this
 * file, it will not be tree shaken effectively across routes
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import GoogleTagManager from '@/components/modules/GoogleTagManager';
import { LocaleProvider } from '@/lib/i18n/LocaleContext';
import type { Locale } from '@/lib/i18n/translations';
import { defaultLocale, locales } from '@/lib/i18n/translations';
import { getBaseUrl } from '@/utils/getBaseUrl';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('locale')?.value as Locale | undefined;
  const locale =
    localeCookie && locales.includes(localeCookie)
      ? localeCookie
      : defaultLocale;

  return (
    <html lang={locale} className={`${inter.variable}`}>
      <GoogleTagManager />
      <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
    </html>
  );
}
