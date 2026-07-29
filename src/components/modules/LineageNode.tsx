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

function RecordMeta({ record }: { record: LineageRecord }) {
  const meta = [
    typeLabels[record.recordType ?? ''] || record.recordType,
    record.status
      ? record.status.charAt(0).toUpperCase() + record.status.slice(1)
      : null,
    fmt(record.date),
  ]
    .filter(Boolean)
    .join(' · ');
  if (!meta) return null;
  return <p className="text-xs text-gray-500 mt-0.5">{meta}</p>;
}

/** One record row + its nested children */
function RecordRow({
  record,
  prefix,
  currentSlug,
  showEvidence,
}: {
  record: LineageRecord;
  prefix: string;
  currentSlug?: string;
  showEvidence?: boolean;
}) {
  const hasChildren = (record.childRecords?.length ?? 0) > 0;

  return (
    <div>
      <div className="flex items-start gap-2 py-1.5">
        <span className="text-xs font-mono font-bold text-amber-500 shrink-0 min-w-[2rem] text-right pt-0.5">
          {prefix}
        </span>
        <div className="flex-1 min-w-0">
          <VisitedLink
            href={`/records/${record.slug}`}
            isCurrent={record.slug === currentSlug}
          >
            {record.title}
          </VisitedLink>
          <RecordMeta record={record} />
          {record.verificationNote && (
            <p className="text-xs text-amber-700 italic mt-0.5">
              ✓ {record.verificationNote}
            </p>
          )}
          {showEvidence && (record.evidence?.length ?? 0) > 0 && (
            <div className="mt-1 flex flex-wrap gap-2">
              {record.evidence?.map((e) => (
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
        <div className="ml-8 border-l-2 border-amber-300 pl-3">
          {record.childRecords?.map((child, i) => (
            <RecordRow
              key={child._id}
              record={child}
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

/** Numbered list of top-level records with nested children */
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
        <RecordRow
          key={r._id}
          record={r}
          prefix={`${i + 1}`}
          currentSlug={currentSlug}
          showEvidence={showEvidence}
        />
      ))}
    </div>
  );
}

/**
 * Full vertical chain rendered as one continuous tree.
 * ancestors → current (highlighted) → produced records (numbered, nested)
 * All rows share the same left rail.
 */
export function LineageChain({
  ancestors,
  current,
  records,
  verificationNote,
  currentSlug,
  showEvidence = false,
}: {
  ancestors: { label: string; href: string; title: string | null }[];
  current: { label: string; title: string | null };
  records?: LineageRecord[];
  verificationNote?: string | null;
  currentSlug?: string;
  showEvidence?: boolean;
}) {
  return (
    <div className="border-l-2 border-amber-400 pl-4">
      {/* Ancestor rows */}
      {ancestors.map((a) => (
        <div key={a.href} className="py-1.5">
          <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-widest leading-none mb-1">
            {a.label}
          </p>
          <VisitedLink href={a.href}>{a.title}</VisitedLink>
        </div>
      ))}

      {/* Current node — visually distinct */}
      <div className="my-1 -ml-4 border-l-4 border-amber-500 pl-3 py-1.5 bg-amber-50">
        <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-widest leading-none mb-1">
          {current.label}
        </p>
        <span className="text-sm font-semibold text-gray-900">
          {current.title}
        </span>
      </div>

      {/* Produced records */}
      {records && records.length > 0 && (
        <div className="pt-1">
          <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-widest leading-none mb-1">
            Produced Records
          </p>
          <LineageList
            records={records}
            currentSlug={currentSlug}
            showEvidence={showEvidence}
          />
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

/** Standalone ancestor row — used by lineage certificate page */
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
    <div className="py-1.5">
      <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-widest leading-none mb-1">
        {label}
      </p>
      <VisitedLink href={href} isCurrent={isCurrent}>
        {title}
      </VisitedLink>
    </div>
  );
}
