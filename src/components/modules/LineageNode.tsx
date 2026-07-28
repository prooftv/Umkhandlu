'use client';

import VisitedLink from './VisitedLink';

export type LineageRecord = {
  _id: string;
  title: string | null;
  slug: string | null;
  recordType: string | null;
  date: string | null;
  status: string | null;
  summary?: string | null;
  verificationNote?: string | null;
  evidence?:
    | { _key: string; title: string | null; url: string | null }[]
    | null;
  childRecords?: LineageRecord[] | null;
};

const typeLabels: Record<string, string> = {
  agenda: 'Agenda',
  minutes: 'Meeting Minutes',
  resolution: 'Resolution',
  'land-allocation': 'Land Allocation',
  'dispute-resolution': 'Dispute Resolution',
  'public-notice': 'Public Notice',
  policy: 'Policy',
  report: 'Report',
  'infrastructure-concern': 'Infrastructure Concern',
  'project-outcome': 'Project Outcome',
  'community-decision': 'Community Decision',
  'external-resource': 'External Resource',
};

function fmt(date: string | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function NodeLabel({ prefix, type }: { prefix: string; type: string | null }) {
  return (
    <p className="text-xs text-gray-400 mt-0.5">
      <span className="font-bold text-gray-300 tabular-nums mr-1.5">
        {prefix}
      </span>
      {typeLabels[type ?? ''] || type}
    </p>
  );
}

function Connector() {
  return (
    <div className="text-gray-200 text-xs leading-none my-1 ml-1 select-none">
      ↓
    </div>
  );
}

export function LineageNode({
  record,
  prefix,
  currentSlug,
  showEvidence = false,
}: {
  record: LineageRecord;
  prefix: string;
  currentSlug?: string;
  showEvidence?: boolean;
}) {
  const hasChildren = (record.childRecords?.length ?? 0) > 0;

  return (
    <div>
      <NodeLabel prefix={prefix} type={record.recordType} />
      <div className="flex items-baseline gap-1.5">
        <VisitedLink
          href={`/records/${record.slug}`}
          isCurrent={record.slug === currentSlug}
        >
          {record.title}
        </VisitedLink>
      </div>
      {record.date && (
        <p className="text-xs text-gray-400 ml-0">{fmt(record.date)}</p>
      )}
      {record.status && (
        <p className="text-xs text-gray-400">
          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
        </p>
      )}
      {record.verificationNote && (
        <p className="text-xs text-amber-700 italic mt-0.5">
          ✓ {record.verificationNote}
        </p>
      )}
      {showEvidence && record.evidence && record.evidence.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-2">
          {record.evidence.map((e) => (
            <span key={e._key} className="text-xs text-blue-700">
              {e.url ? (
                <a href={e.url} target="_blank" rel="noopener noreferrer">
                  📎 {e.title}
                </a>
              ) : (
                <>📎 {e.title}</>
              )}
            </span>
          ))}
        </div>
      )}
      {hasChildren && (
        <div className="ml-3 border-l border-gray-100 pl-3 mt-1">
          {record.childRecords?.map((child, i) => (
            <div key={child._id}>
              {i > 0 && <Connector />}
              <LineageNode
                record={child}
                prefix={`${prefix}.${i + 1}`}
                currentSlug={currentSlug}
                showEvidence={showEvidence}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function LineageList({
  records,
  currentSlug,
  showEvidence = false,
}: {
  records: LineageRecord[];
  currentSlug?: string;
  showEvidence?: boolean;
}) {
  if (!records.length) return null;
  return (
    <div className="border-l-2 border-amber-100 pl-3 space-y-0">
      {records.map((r, i) => (
        <div key={r._id}>
          {i > 0 && <Connector />}
          <LineageNode
            record={r}
            prefix={`${i + 1}`}
            currentSlug={currentSlug}
            showEvidence={showEvidence}
          />
        </div>
      ))}
    </div>
  );
}

export function LineageAncestor({
  label,
  href,
  title,
  isCurrent,
}: {
  label: string;
  href: string;
  title: string | null;
  isCurrent?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">
        {label}
      </span>
      <VisitedLink href={href} isCurrent={isCurrent}>
        {title}
      </VisitedLink>
    </div>
  );
}
