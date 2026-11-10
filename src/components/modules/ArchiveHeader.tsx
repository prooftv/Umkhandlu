'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type FilterOption = {
  value: string;
  label: string;
  count?: number;
};

type Props = {
  title: string;
  description?: string;
  total: number;
  noun?: string;
  filters?: FilterOption[];
  filterParam?: string;
};

export function ArchiveHeader({
  title,
  description,
  total,
  noun = 'item',
  filters,
  filterParam = 'type',
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeFilter = searchParams.get(filterParam) ?? undefined;

  const setFilter = useCallback(
    (value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(filterParam, value);
      } else {
        params.delete(filterParam);
      }
      params.delete('page');
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, filterParam]
  );

  return (
    <header className="mb-8">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        {total > 0 && (
          <span className="text-sm text-gray-400 shrink-0 tabular-nums">
            {total} {total === 1 ? noun : `${noun}s`}
          </span>
        )}
      </div>
      {description && (
        <p className="text-gray-500 text-sm md:text-base max-w-2xl mb-5">
          {description}
        </p>
      )}
      {filters && filters.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              !activeFilter
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            All
            {total > 0 && <span className="ml-1.5 opacity-60">{total}</span>}
          </button>
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() =>
                setFilter(activeFilter === f.value ? null : f.value)
              }
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                activeFilter === f.value
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {f.label}
              {f.count != null && (
                <span className="ml-1.5 opacity-60">{f.count}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
