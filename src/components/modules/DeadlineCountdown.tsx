'use client';

import { useEffect, useState } from 'react';

type Props = {
  deadline: string; // ISO date string e.g. "2026-06-30"
  isOpen: boolean;
};

function daysRemaining(deadline: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const end = new Date(deadline);
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function DeadlineCountdown({ deadline, isOpen }: Props) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(daysRemaining(deadline));
  }, [deadline]);

  if (days === null) return null;

  if (!isOpen || days < 0) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
        <span className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
        Comment period closed
      </div>
    );
  }

  if (days === 0) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
        Closes today
        <span className="opacity-60 font-normal ml-1">· calendar days</span>
      </div>
    );
  }

  const urgent = days <= 7;
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
        urgent ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${urgent ? 'bg-orange-500' : 'bg-green-500'}`}
      />
      {days} day{days !== 1 ? 's' : ''} remaining
      <span className="opacity-60 font-normal ml-1">· calendar days</span>
    </div>
  );
}
