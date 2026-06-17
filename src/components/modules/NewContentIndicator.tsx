'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'umkhandlu-last-seen';

export default function NewContentIndicator({
  latestUpdate,
}: {
  latestUpdate: string | null;
}) {
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    if (!latestUpdate) return;
    const lastSeen = localStorage.getItem(STORAGE_KEY);
    if (!lastSeen || new Date(latestUpdate) > new Date(lastSeen)) {
      setHasNew(true);
    }
  }, [latestUpdate]);

  function markSeen() {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    setHasNew(false);
  }

  if (!hasNew) return null;

  return (
    <Link
      href="/development-notices"
      onClick={markSeen}
      className="relative flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 rounded-lg text-xs font-medium text-primary transition-colors"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
      </span>
      New
    </Link>
  );
}
