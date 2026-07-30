'use client';

import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

export type JourneyRecord = {
  _id: string;
  title: string | null;
  slug: string | null;
  recordType: string | null;
  date: string | null;
  status: string | null;
  verificationNote?: string | null;
  childRecords?: JourneyRecord[] | null;
};

export type JourneyNotice = {
  _id: string;
  title: string | null;
  slug: string | null;
  noticeType?: string | null;
  date: string | null;
};

type NodeKind = 'notice' | 'record' | 'followup';

type JourneyNode = {
  id: string;
  kind: NodeKind;
  title: string | null;
  href: string;
  type: string | null;
  date: string | null;
  status: string | null;
  verificationNote?: string | null;
  isCurrent?: boolean;
  children: JourneyNode[];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const typeLabels: Record<string, string> = {
  agenda: 'Agenda',
  minutes: 'Minutes',
  resolution: 'Resolution',
  'land-allocation': 'Land Allocation',
  'dispute-resolution': 'Dispute Resolution',
  'public-notice': 'Public Notice',
  policy: 'Policy',
  report: 'Report',
  'infrastructure-concern': 'Infrastructure',
  'project-outcome': 'Project Outcome',
  'community-decision': 'Community Decision',
  'external-resource': 'External Resource',
};

const typeIcons: Record<string, string> = {
  agenda: '📋',
  minutes: '📝',
  resolution: '🏛',
  'land-allocation': '🗺',
  'dispute-resolution': '⚖️',
  'public-notice': '📢',
  policy: '📜',
  report: '📊',
  'infrastructure-concern': '🚧',
  'project-outcome': '✅',
  'community-decision': '👥',
  'external-resource': '🔗',
};

const statusColors: Record<string, string> = {
  adopted: 'bg-green-100 text-green-700',
  approved: 'bg-green-100 text-green-700',
  resolved: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  open: 'bg-blue-100 text-blue-700',
  rejected: 'bg-red-100 text-red-700',
};

function fmt(date: string | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function recordToNode(r: JourneyRecord, currentSlug?: string): JourneyNode {
  return {
    id: r._id,
    kind: 'record',
    title: r.title,
    href: `/records/${r.slug}`,
    type: typeLabels[r.recordType ?? ''] || r.recordType,
    date: r.date,
    status: r.status,
    verificationNote: r.verificationNote,
    isCurrent: r.slug === currentSlug,
    children: (r.childRecords ?? []).map((c) => recordToNode(c, currentSlug)),
  };
}

// ─── Single node card ─────────────────────────────────────────────────────────

function nodeIcon(node: JourneyNode): string {
  if (node.kind === 'notice' || node.kind === 'followup') return '📢';
  return (
    typeIcons[
      Object.keys(typeLabels).find((k) => typeLabels[k] === node.type) ?? ''
    ] ?? '📄'
  );
}

function nodeCardCls(node: JourneyNode, isRoot: boolean): string {
  const base = 'rounded-xl p-3 text-center min-w-[140px] max-w-[200px]';
  if (isRoot) return `bg-amber-50 border-2 border-amber-400 ${base}`;
  if (node.isCurrent) return `bg-primary/5 border-2 border-primary ${base}`;
  return `bg-white border border-gray-200 hover:border-amber-300 hover:shadow-sm transition-all ${base}`;
}

function NodeCardInner({
  node,
  isRoot,
}: {
  node: JourneyNode;
  isRoot: boolean;
}) {
  const statusCls =
    statusColors[node.status ?? ''] ?? 'bg-gray-100 text-gray-600';
  return (
    <div className={nodeCardCls(node, isRoot)}>
      <span className="text-xl block mb-1">{nodeIcon(node)}</span>
      {node.type && (
        <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-widest leading-none mb-1">
          {node.type}
        </p>
      )}
      <p className="text-xs font-semibold text-gray-900 leading-snug line-clamp-3">
        {node.title}
      </p>
      {node.date && (
        <p className="text-[10px] text-gray-400 mt-1">{fmt(node.date)}</p>
      )}
      {node.status && (
        <span
          className={`inline-block mt-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusCls}`}
        >
          {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
        </span>
      )}
      {node.isCurrent && (
        <p className="text-[10px] text-primary font-bold mt-1">
          ← You are here
        </p>
      )}
    </div>
  );
}

function NodeCard({
  node,
  isRoot = false,
}: {
  node: JourneyNode;
  isRoot?: boolean;
}) {
  if (node.isCurrent) return <NodeCardInner node={node} isRoot={isRoot} />;
  return (
    <Link href={node.href}>
      <NodeCardInner node={node} isRoot={isRoot} />
    </Link>
  );
}

// ─── Recursive tree level ─────────────────────────────────────────────────────

function JourneyLevel({ nodes }: { nodes: JourneyNode[] }) {
  if (!nodes.length) return null;

  const hasBranch = nodes.length > 1;

  return (
    <div className="flex flex-col items-center w-full">
      {/* connector down from parent */}
      <div className="w-px h-8 bg-amber-300" />

      {hasBranch ? (
        // ── branching: horizontal spread ──────────────────────────────────────
        <div className="flex flex-col items-center w-full">
          <div className="relative flex items-start justify-center w-full gap-6">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-amber-300"
              style={{ width: `${(nodes.length - 1) * 50}%` }}
            />
            {nodes.map((node) => (
              <div key={node.id} className="flex flex-col items-center">
                <div className="w-px h-6 bg-amber-300" />
                <NodeCard node={node} />
                {node.children.length > 0 && (
                  <JourneyLevel nodes={node.children} />
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        // ── single child: straight down ───────────────────────────────────────
        <div className="flex flex-col items-center">
          <NodeCard node={nodes[0]} />
          {nodes[0].children.length > 0 && (
            <JourneyLevel nodes={nodes[0].children} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Journey view for a notice page.
 * Root = the notice itself. Children = producedRecords (with their childRecords).
 * Follow-up notices appear as a second branch off the root.
 */
export function NoticeJourney({
  notice,
  producedRecords,
  followUpNotices,
}: {
  notice: JourneyNotice;
  producedRecords: JourneyRecord[];
  followUpNotices: (JourneyNotice & {
    producedRecords?: JourneyRecord[] | null;
  })[];
}) {
  const root: JourneyNode = {
    id: notice._id,
    kind: 'notice',
    title: notice.title,
    href: `/notices/${notice.slug}`,
    type: notice.noticeType ?? 'Notice',
    date: notice.date,
    status: null,
    children: [
      ...producedRecords.map((r) => recordToNode(r)),
      ...followUpNotices.map((fu) => ({
        id: fu._id,
        kind: 'followup' as NodeKind,
        title: fu.title,
        href: `/notices/${fu.slug}`,
        type: 'Follow-up Meeting',
        date: fu.date,
        status: null,
        children: (fu.producedRecords ?? []).map((r) => recordToNode(r)),
      })),
    ],
  };

  return <JourneyTree root={root} />;
}

/**
 * Journey view for a record page.
 * Ancestors (originNotice, parentRecord) shown above current.
 * childRecords shown below.
 */
export function RecordJourney({
  originNotice,
  parentRecord,
  current,
  childRecords,
  currentSlug,
}: {
  originNotice?: { title: string | null; slug: string | null } | null;
  parentRecord?: {
    title: string | null;
    slug: string | null;
    recordType: string | null;
  } | null;
  current: {
    title: string | null;
    slug: string | null;
    recordType: string | null;
    date: string | null;
    status: string | null;
    verificationNote?: string | null;
  };
  childRecords: JourneyRecord[];
  currentSlug: string;
}) {
  // Build from the top down
  const currentNode: JourneyNode = {
    id: currentSlug,
    kind: 'record',
    title: current.title,
    href: `/records/${current.slug}`,
    type: typeLabels[current.recordType ?? ''] || current.recordType,
    date: current.date,
    status: current.status,
    verificationNote: current.verificationNote,
    isCurrent: true,
    children: childRecords.map((r) => recordToNode(r, currentSlug)),
  };

  // Wrap in ancestors
  let root: JourneyNode = currentNode;

  if (parentRecord) {
    root = {
      id: `parent-${parentRecord.slug}`,
      kind: 'record',
      title: parentRecord.title,
      href: `/records/${parentRecord.slug}`,
      type:
        typeLabels[parentRecord.recordType ?? ''] || parentRecord.recordType,
      date: null,
      status: null,
      children: [currentNode],
    };
  }

  if (originNotice) {
    root = {
      id: `origin-${originNotice.slug}`,
      kind: 'notice',
      title: originNotice.title,
      href: `/notices/${originNotice.slug}`,
      type: 'Origin Notice',
      date: null,
      status: null,
      children: [root],
    };
  }

  return <JourneyTree root={root} />;
}

function JourneyTree({ root }: { root: JourneyNode }) {
  const isRootNotice = root.kind === 'notice' || root.kind === 'followup';

  return (
    <div className="flex flex-col items-center w-full overflow-x-auto py-4">
      <NodeCard node={root} isRoot={isRootNotice} />
      {root.children.length > 0 && <JourneyLevel nodes={root.children} />}
      {/* terminal dot */}
      <div className="w-px h-6 bg-amber-300 mt-0" />
      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-0" />
    </div>
  );
}
