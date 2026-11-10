'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type DeadlineCountdownType from './DeadlineCountdown';
import type NoticeStatutoryMapType from './NoticeStatutoryMap';
import type SiteContextMapType from './SiteContextMap';

export const DeadlineCountdownClient = dynamic(
  () => import('@/components/modules/DeadlineCountdown'),
  { ssr: false }
) as React.ComponentType<ComponentProps<typeof DeadlineCountdownType>>;

export const SiteContextMapClient = dynamic(
  () => import('@/components/modules/SiteContextMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
        Loading map…
      </div>
    ),
  }
) as React.ComponentType<ComponentProps<typeof SiteContextMapType>>;

export const NoticeStatutoryMapClient = dynamic(
  () => import('@/components/modules/NoticeStatutoryMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[380px] rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
        Loading spatial map…
      </div>
    ),
  }
) as React.ComponentType<ComponentProps<typeof NoticeStatutoryMapType>>;
