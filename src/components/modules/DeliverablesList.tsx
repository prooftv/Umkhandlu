type CertifiedDeliverable = {
  _key: string;
  task: string;
  status: 'pending' | 'certified' | 'disputed';
  percentageComplete?: number;
  weightage?: number;
  certifiedBy?: string;
  certificationDate?: string;
  notes?: string;
};

function statusPill(status: CertifiedDeliverable['status']) {
  const styles = {
    certified:
      'inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700',
    disputed:
      'inline-flex items-center rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700',
    pending:
      'inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700',
  };
  const labels = {
    certified: 'Certified',
    disputed: 'Disputed',
    pending: 'Pending',
  };
  return <span className={styles[status]}>{labels[status]}</span>;
}

function computeOverallProgress(items: CertifiedDeliverable[]): number {
  if (items.length === 0) return 0;
  const hasWeights = items.some((i) => i.weightage && i.weightage > 0);
  if (hasWeights) {
    const totalWeight = items.reduce((sum, i) => sum + (i.weightage || 0), 0);
    if (totalWeight === 0) return 0;
    const weighted = items.reduce(
      (sum, i) => sum + (i.percentageComplete || 0) * (i.weightage || 0),
      0
    );
    return Math.round(weighted / totalWeight);
  }
  const total = items.reduce((sum, i) => sum + (i.percentageComplete || 0), 0);
  return Math.round(total / items.length);
}

function ProgressBar({
  pct,
  size = 'md',
}: {
  pct: number;
  size?: 'sm' | 'md';
}) {
  const h = size === 'sm' ? 'h-2' : 'h-3';
  return (
    <div className={`w-full ${h} bg-gray-200 rounded-full overflow-hidden`}>
      <div
        className="h-full bg-primary rounded-full transition-all"
        style={{ width: `${Math.min(100, pct)}%` }}
      />
    </div>
  );
}

function CertifiedItem({ item }: { item: CertifiedDeliverable }) {
  const pct = item.percentageComplete || 0;
  return (
    <div className="rounded-xl border border-gray-200 p-4 bg-white">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{item.task}</p>
          {item.certifiedBy && (
            <p className="text-xs text-gray-500">
              Verified by {item.certifiedBy}
              {item.certificationDate
                ? ` on ${new Date(item.certificationDate).toLocaleDateString()}`
                : ''}
            </p>
          )}
        </div>
        {statusPill(item.status)}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <ProgressBar pct={pct} size="sm" />
        </div>
        <span className="text-xs font-bold text-gray-600 shrink-0">{pct}%</span>
      </div>
      {item.notes && <p className="mt-2 text-sm text-gray-600">{item.notes}</p>}
    </div>
  );
}

export default function DeliverablesList({
  deliverables,
  deliverablesCertified,
  total,
}: {
  deliverables?: string[];
  deliverablesCertified?: CertifiedDeliverable[];
  total?: number | null | undefined;
}) {
  const certified = deliverablesCertified?.length
    ? deliverablesCertified
    : undefined;
  const certifiedCount =
    certified?.filter((i) => i.status === 'certified').length ?? 0;
  const completed = certifiedCount || (deliverables?.length ?? 0);
  if (!certified?.length && !deliverables?.length) return null;

  // Use per-item progress if certified items have percentageComplete data
  const hasItemProgress = certified?.some(
    (i) => (i.percentageComplete ?? 0) > 0
  );
  const overallPct =
    hasItemProgress && certified
      ? computeOverallProgress(certified)
      : total && total > 0
        ? Math.round((completed / total) * 100)
        : null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-3">Deliverables</h2>
      {overallPct !== null && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">
              {hasItemProgress
                ? 'Overall Verified Progress'
                : `${completed} of ${total} completed`}
            </span>
            <span className="font-bold text-primary">{overallPct}%</span>
          </div>
          <ProgressBar pct={overallPct} />
        </div>
      )}
      <div className="space-y-3">
        {certified
          ? certified.map((item) => (
              <CertifiedItem key={item._key} item={item} />
            ))
          : deliverables?.map((d) => (
              <div
                key={d}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <span className="text-green-600">✓</span>
                <span>{d}</span>
              </div>
            ))}
      </div>
    </div>
  );
}
