'use client';

import { type ReactNode, useState } from 'react';

type Props = {
  noticeTab: ReactNode;
  lineageTab: ReactNode;
  lineageCount: number;
};

export default function LineageTabs({
  noticeTab,
  lineageTab,
  lineageCount,
}: Props) {
  const [active, setActive] = useState<'notice' | 'lineage'>('notice');

  return (
    <div>
      <div className="flex gap-0 border-b border-gray-200 mb-8">
        <button
          type="button"
          onClick={() => setActive('notice')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            active === 'notice'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Notice
        </button>
        <button
          type="button"
          onClick={() => setActive('lineage')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            active === 'lineage'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Governance Lineage
          {lineageCount > 0 && (
            <span className="ml-1.5 text-xs bg-amber-100 text-amber-700 rounded-full px-1.5 py-0.5 font-semibold">
              {lineageCount}
            </span>
          )}
        </button>
      </div>
      <div>{active === 'notice' ? noticeTab : lineageTab}</div>
    </div>
  );
}
