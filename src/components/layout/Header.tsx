import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity/client/live';
import {
  latestContentQuery,
  settingsQuery,
} from '@/lib/sanity/queries/queries';
import { SITE_NAME } from '@/lib/siteConfig';
import Logo from '../icons/Logo';
import LanguageToggle from '../modules/LanguageToggle';
import NewContentIndicator from '../modules/NewContentIndicator';
import SearchDialog from '../modules/SearchDialog';
import NavBar from './NavBar';

export default async function Header() {
  try {
    const [{ data: settings }, { data: latestUpdate }] = await Promise.all([
      sanityFetch({ query: settingsQuery }),
      sanityFetch({ query: latestContentQuery }),
    ]);

    return (
      <header className="bg-white text-gray-800 py-4 relative z-50">
        <div className="container max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link className="flex items-center space-x-4" href="/">
              <Logo />
              <span className="text-lg md:text-2xl font-bold">
                {settings?.title || SITE_NAME}
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <NewContentIndicator latestUpdate={latestUpdate} />
            <SearchDialog />
            <LanguageToggle />
            {settings?.menu && <NavBar menuItems={settings.menu} />}
          </div>
        </div>
      </header>
    );
  } catch {
    return (
      <header className="bg-white text-gray-800 py-4 relative z-50">
        <div className="container max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link className="flex items-center space-x-4" href="/">
            <Logo />
            <span className="text-lg md:text-2xl font-bold">Umkhandlu</span>
          </Link>
        </div>
      </header>
    );
  }
}
