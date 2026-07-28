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

/** A single record row with optional nested children */
export function LineageNode({
  record,
  depth = 0,
  prefix,
  currentSlug,
  showEvidence = false,
}: {
  record: LineageRecord;
  depth?: number;
  prefix: string;
  currentSlug?: string;
  showEvidence?: boolean;
}) {
  const hasChildren = (record.childRecords?.length ?? 0) > 0;
  const meta = [
    typeLabels[record.recordType ?? ''] || record.recordType,
    record.status
      ? record.status.charAt(0).toUpperCase() + record.status.slice(1)
      : null,
    fmt(record.date),
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className={depth > 0 ? 'border-l-2 border-amber-400 pl-3 mt-1' : ''}>
      <div className="flex items-start gap-2 py-1">
        <span className="text-xs font-mono font-bold text-amber-500 shrink-0 pt-0.5 min-w-[2.5rem] text-right">
          {prefix}
        </span>
        <div className="flex-1 min-w-0">
          <VisitedLink
            href={`/records/${record.slug}`}
            isCurrent={record.slug === currentSlug}
          >
            {record.title}
          </VisitedLink>
          {meta && <p className="text-xs text-gray-500 mt-0.5">{meta}</p>}
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
        </div>
      </div>
      {hasChildren && (
        <div className="ml-6">
          {record.childRecords?.map((child, i) => (
            <LineageNode
              key={child._id}
              record={child}
              depth={depth + 1}
              prefix={`${prefix}.${i + 1}`}
              currentSlug={currentSlug}
              showEvidence={showEvidence}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Flat list of top-level records, each numbered */
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
    <div>
      {records.map((r, i) => (
        <LineageNode
          key={r._id}
          record={r}
          depth={0}
          prefix={`${i + 1}`}
          currentSlug={currentSlug}
          showEvidence={showEvidence}
        />
      ))}
    </div>
  );
}

/**
 * Full vertical chain: ancestors (notices/records above) → current node → children.
 * All rendered as one continuous tree with a single left border rail.
 */
export function LineageChain({
  ancestors,
  current,
  records,
  verificationNote,
  currentSlug,
}: {
  ancestors: { label: string; href: string; title: string | null }[];
  current: { label: string; title: string | null };
  records?: LineageRecord[];
  verificationNote?: string | null;
  currentSlug?: string;
}) {
  return (
    <div className="border-l-2 border-amber-400 pl-4 space-y-0">
      {/* Ancestors */}
      {ancestors.map((a) => (
        <div key={a.href} className="py-1">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-none mb-0.5">
            {a.label}
          </p>
          <VisitedLink href={a.href}>{a.title}</VisitedLink>
        </div>
      ))}

      {/* Current node — highlighted */}
      <div className="py-1 border-l-2 border-amber-500 -ml-4 pl-3 bg-amber-50/50">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-none mb-0.5">
          {current.label}
        </p>
        <span className="text-sm font-semibold text-gray-900">
          {current.title}
        </span>
      </div>

      {/* Children */}
      {records && records.length > 0 && (
        <div className="pt-1">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-none mb-1">
            Produced Records
          </p>
          <LineageList records={records} currentSlug={currentSlug} />
        </div>
      )}

      {verificationNote && (
        <p className="pt-2 text-xs text-amber-700 italic">
          ✓ Verification: {verificationNote}
        </p>
      )}
    </div>
  );
}

/** Single ancestor row used standalone (kept for lineage certificate page) */
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
    <div className="flex flex-col py-1">
      <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">
        {label}
      </span>
      <VisitedLink href={href} isCurrent={isCurrent}>
        {title}
      </VisitedLink>
    </div>
  );
}
