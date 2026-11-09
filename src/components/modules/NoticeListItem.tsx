import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { DEV_NOTICE_TYPE_LABELS, formatDateZA } from '@/lib/governance-labels';

export type NoticeListItemData = {
  _id: string;
  slug: string | null;
  title: string | null;
  noticeType?: string | null;
  status?: string | null;
  applicant?: string | null;
  location?: string | null;
  commentDeadline?: string | null;
  referenceNumber?: string | null;
  relatedArea?: { name: string | null; slug: string | null } | null;
};

type Props = {
  notice: NoticeListItemData;
};

export function NoticeListItem({ notice }: Props) {
  if (!notice.slug) return null;
  const isOpen = notice.status === 'open';
  const typeLabel =
    DEV_NOTICE_TYPE_LABELS[notice.noticeType ?? ''] ?? notice.noticeType;

  return (
    <Link
      href={`/development-notices/${notice.slug}`}
      className="group flex items-start justify-between gap-4 px-4 py-3.5 bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <Badge
            variant={isOpen ? 'default' : 'secondary'}
            className="text-xs shrink-0"
          >
            {isOpen ? '🟢 Open' : '🔴 Closed'}
          </Badge>
          {typeLabel && (
            <Badge variant="outline" className="text-xs shrink-0">
              {typeLabel}
            </Badge>
          )}
        </div>
        <p className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors">
          {notice.title}
        </p>
        <div className="flex flex-wrap gap-x-3 mt-1">
          {notice.applicant && (
            <p className="text-xs text-gray-500">{notice.applicant}</p>
          )}
          {notice.relatedArea && (
            <p className="text-xs text-gray-400">
              📍 {notice.relatedArea.name}
            </p>
          )}
          {notice.referenceNumber && (
            <p className="text-xs text-gray-400 font-mono">
              {notice.referenceNumber}
            </p>
          )}
        </div>
      </div>
      <div className="shrink-0 text-right">
        {notice.commentDeadline && (
          <time
            dateTime={notice.commentDeadline}
            className={`text-xs whitespace-nowrap block ${isOpen ? 'text-red-600 font-medium' : 'text-gray-400'}`}
          >
            {isOpen ? 'Closes ' : 'Closed '}
            {formatDateZA(notice.commentDeadline)}
          </time>
        )}
        <span className="text-primary text-xs mt-1 block opacity-0 group-hover:opacity-100 transition-opacity">
          View →
        </span>
      </div>
    </Link>
  );
}
