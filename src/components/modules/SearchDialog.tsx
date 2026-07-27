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

const TYPE_LABELS: Record<string, string> = {
  page: 'Page',
  post: 'Story',
  person: 'Person',
  listing: 'Directory',
  notice: 'Notice',
  opportunity: 'Opportunity',
  program: 'Program',
  record: 'Record',
  campaign: 'Campaign',
  developmentNotice: 'Dev Notice',
  sponsor: 'Partner',
  category: 'Category',
};

const TYPE_COLOURS: Record<string, string> = {
  notice: 'bg-amber-100 text-amber-700',
  developmentNotice: 'bg-red-100 text-red-700',
  record: 'bg-blue-100 text-blue-700',
  opportunity: 'bg-green-100 text-green-700',
  program: 'bg-purple-100 text-purple-700',
  campaign: 'bg-teal-100 text-teal-700',
  person: 'bg-pink-100 text-pink-700',
  listing: 'bg-orange-100 text-orange-700',
  post: 'bg-indigo-100 text-indigo-700',
  page: 'bg-gray-100 text-gray-600',
  sponsor: 'bg-gray-100 text-gray-600',
  category: 'bg-gray-100 text-gray-600',
};

function getResultHref(result: SearchResult): string {
  const { _type, slug, listingType } = result;
  if (!slug) return '#';
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
    case 'developmentNotice':
      return `/development-notices/${slug}`;
    case 'opportunity':
      return `/opportunities/${slug}`;
    case 'program':
      return `/programs/${slug}`;
    case 'campaign':
      return `/campaigns/${slug}`;
    case 'record':
      return `/records/${slug}`;
    case 'sponsor':
      return `/directory`;
    case 'category':
      return `/blog`;
    default:
      return '#';
  }
}

function getSubLabel(result: SearchResult): string | null {
  if (result.noticeType) return result.noticeType;
  if (result.recordType) return result.recordType;
  if (result.opportunityType) return result.opportunityType;
  if (result.status) return result.status;
  return null;
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

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Group results by type
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r._type]) acc[r._type] = [];
    acc[r._type].push(r);
    return acc;
  }, {});

  const groupOrder = [
    'notice',
    'developmentNotice',
    'record',
    'opportunity',
    'program',
    'campaign',
    'listing',
    'person',
    'post',
    'page',
    'sponsor',
    'category',
  ];
  const sortedGroups = Object.keys(grouped).sort(
    (a, b) => groupOrder.indexOf(a) - groupOrder.indexOf(b)
  );

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
              <div className="space-y-4">
                {sortedGroups.map((type) => (
                  <div key={type}>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 px-2">
                      {TYPE_LABELS[type] || type}
                    </p>
                    <ul className="divide-y divide-gray-50">
                      {grouped[type].map((result) => {
                        const subLabel = getSubLabel(result);
                        const href = getResultHref(result);
                        return (
                          <li key={result._id}>
                            <Link
                              href={href}
                              onClick={() => setOpen(false)}
                              className="flex items-start gap-3 py-2.5 px-2 hover:bg-gray-50 rounded-md"
                            >
                              <span
                                className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${TYPE_COLOURS[result._type] ?? 'bg-gray-100 text-gray-600'}`}
                              >
                                {subLabel ??
                                  TYPE_LABELS[result._type] ??
                                  result._type}
                              </span>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 leading-snug">
                                  {result.title}
                                </p>
                                {result.excerpt && (
                                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                    {result.excerpt}
                                  </p>
                                )}
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
