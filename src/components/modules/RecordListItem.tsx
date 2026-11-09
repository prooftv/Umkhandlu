import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import {
  capitalise,
  formatDateZA,
  RECORD_STATUS_VARIANTS,
  RECORD_TYPE_LABELS,
} from '@/lib/governance-labels';

export type RecordListItemData = {
  _id: string;
  slug: string | null;
  title: string | null;
  summary?: string | null;
  recordType?: string | null;
  status?: string | null;
  date?: string | null;
  relatedArea?: { name: string | null; slug: string | null } | null;
};

type Props = {
  record: RecordListItemData;
};

export function RecordListItem({ record }: Props) {
  if (!record.slug) return null;
  const typeLabel =
    RECORD_TYPE_LABELS[record.recordType ?? ''] ?? record.recordType;
  const statusVariant =
    RECORD_STATUS_VARIANTS[record.status ?? ''] ?? 'outline';

  return (
    <Link
      href={`/records/${record.slug}`}
      className="group flex items-start justify-between gap-4 px-4 py-3.5 bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          {typeLabel && (
            <Badge variant="outline" className="text-xs shrink-0">
              {typeLabel}
            </Badge>
          )}
          {record.status && (
            <Badge variant={statusVariant} className="text-xs shrink-0">
              {capitalise(record.status)}
            </Badge>
          )}
        </div>
        <p className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors">
          {record.title}
        </p>
        {record.summary && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
            {record.summary}
          </p>
        )}
        {record.relatedArea && (
          <p className="text-xs text-gray-400 mt-1">
            📍 {record.relatedArea.name}
          </p>
        )}
      </div>
      <div className="shrink-0 text-right">
        {record.date && (
          <time
            dateTime={record.date}
            className="text-xs text-gray-400 whitespace-nowrap block"
          >
            {formatDateZA(record.date)}
          </time>
        )}
        <span className="text-primary text-xs mt-1 block opacity-0 group-hover:opacity-100 transition-opacity">
          View →
        </span>
      </div>
    </Link>
  );
}
