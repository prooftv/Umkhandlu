'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { SearchResult } from '@/actions/searchAction';
import { searchAction } from '@/actions/searchAction';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/Sheet';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { cn } from '@/lib/utils';

const TYPE_LABELS: Record<string, string> = {
  page: 'Page',
  post: 'Story',
  person: 'Person',
  listing: 'Directory',
  notice: 'Notice',
  opportunity: 'Opportunity',
  program: 'Program',
};

function getResultHref(result: SearchResult): string {
  const { _type, slug, listingType } = result;
  if (!slug) return '/';
  switch (_type) {
    case 'page':
      return `/${slug}`;
    case 'post':
      return `/blog/${slug}`;
    case 'person':
      return `/people/${slug}`;
    case 'listing':
      return listingType === 'area' ? `/areas/${slug}` : `/directory/${slug}`;
    case 'notice':
      return `/notices/${slug}`;
    case 'opportunity':
      return `/opportunities/${slug}`;
    case 'program':
      return `/programs/${slug}`;
    default:
      return '/';
  }
}

export default function SearchDialog() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const data = await searchAction(q);
    setResults(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(query), 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, search]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="text-gray-600 hover:text-gray-900 p-1"
          aria-label={t('search.label')}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>{t('search.label')}</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </SheetTrigger>
      <SheetContent side="top" className="h-auto max-h-[80vh] bg-white">
        <SheetHeader className="pb-0">
          <SheetTitle>{t('search.title')}</SheetTitle>
          <SheetDescription className="sr-only">
            {t('search.description')}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
          />
          <div className="mt-4 overflow-y-auto max-h-[50vh]">
            {loading && (
              <p className="text-sm text-gray-500 py-2">
                {t('search.loading')}
              </p>
            )}
            {!loading && query.length >= 2 && results.length === 0 && (
              <p className="text-sm text-gray-500 py-2">
                {t('search.noResults')}
              </p>
            )}
            {!loading && results.length > 0 && (
              <ul className="divide-y divide-gray-100">
                {results.map((result) => (
                  <li key={result._id}>
                    <Link
                      href={getResultHref(result)}
                      onClick={() => setOpen(false)}
                      className="block py-3 px-2 hover:bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'text-xs font-medium px-2 py-0.5 rounded-full',
                            'bg-gray-100 text-gray-600'
                          )}
                        >
                          {TYPE_LABELS[result._type] || result._type}
                        </span>
                        <span className="font-medium text-sm">
                          {result.title}
                        </span>
                      </div>
                      {result.excerpt && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1 pl-2">
                          {result.excerpt}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
