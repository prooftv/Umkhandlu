'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'umk_visited_records';

function getVisited(): Set<string> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function markVisited(href: string) {
  try {
    const visited = getVisited();
    visited.add(href);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...visited]));
  } catch {
    // sessionStorage unavailable
  }
}

export default function VisitedLink({
  href,
  children,
  isCurrent = false,
}: {
  href: string;
  children: React.ReactNode;
  isCurrent?: boolean;
}) {
  const [visited, setVisited] = useState(false);

  useEffect(() => {
    setVisited(getVisited().has(href));
  }, [href]);

  if (isCurrent) {
    return (
      <span className="text-sm font-medium text-gray-400 flex items-center gap-1.5">
        {children}
        <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold tracking-wide">
          current
        </span>
      </span>
    );
  }

  return (
    <Link
      href={href}
      onClick={() => markVisited(href)}
      className={
        visited
          ? 'text-sm font-medium text-gray-400 hover:text-gray-600 flex items-center gap-1.5 line-through decoration-gray-300'
          : 'text-sm font-medium text-primary hover:underline flex items-center gap-1.5'
      }
    >
      {children}
      {visited && (
        <span
          className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-semibold tracking-wide no-underline"
          style={{ textDecoration: 'none' }}
        >
          visited
        </span>
      )}
    </Link>
  );
}
