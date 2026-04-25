'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/i18n/LocaleContext';

export default function NotFound() {
  const { t } = useLocale();

  return (
    <div className="container mx-auto max-w-2xl py-24 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">{t('notFound.description')}</p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
      >
        {t('notFound.goHome')}
      </Link>
    </div>
  );
}
