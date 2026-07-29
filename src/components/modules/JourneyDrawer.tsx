'use client';

import { type ReactNode, useState } from 'react';

export default function JourneyDrawer({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-primary font-medium hover:underline"
      >
        🗺 View Journey Map →
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          {/* header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
            <span className="text-sm font-semibold text-gray-700">
              Governance Journey Map
            </span>
            <div className="flex items-center gap-4">
              <a
                href={`/notices/journey/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary font-medium hover:underline"
              >
                🖨 Print →
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-xl leading-none"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* scrollable tree area */}
          <div className="flex-1 overflow-auto p-8">{children}</div>
        </div>
      )}
    </>
  );
}
