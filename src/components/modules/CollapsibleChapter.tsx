'use client';

import { useState } from 'react';
import SectionNarrator from '@/components/modules/SectionNarrator';

export default function CollapsibleChapter({
  number,
  title,
  children,
  defaultOpen = false,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const sectionId = `chapter-${number}`;

  return (
    <section className="mb-4 border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-primary uppercase tracking-wide shrink-0">
            Chapter {number}
          </span>
          <span className="font-bold text-gray-900">{title}</span>
        </div>
        <span className="text-gray-400 text-sm ml-4 shrink-0">
          {open ? '▲' : '▼'}
        </span>
      </button>
      {open && (
        <div id={sectionId} className="px-6 py-6 prose prose-gray max-w-none">
          <SectionNarrator sectionId={sectionId} />
          {children}
        </div>
      )}
    </section>
  );
}
