type CertifiedDeliverable = {
  _key: string;
  task: string;
  status: 'pending' | 'certified' | 'disputed';
  certifiedBy?: string;
  certificationDate?: string;
  notes?: string;
};

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
  const completed = certified?.length ?? deliverables?.length ?? 0;
  if (completed === 0) return null;

  const pct = total && total > 0 ? Math.round((completed / total) * 100) : null;

  function CertifiedItem({ item }: { item: CertifiedDeliverable }) {
    return (
      <div
        key={item._key}
        className="rounded-xl border border-gray-200 p-4 bg-white"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
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
          <span
            className={
              item.status === 'certified'
                ? 'inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700'
                : item.status === 'disputed'
                  ? 'inline-flex items-center rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700'
                  : 'inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700'
            }
          >
            {item.status === 'certified'
              ? 'Certified'
              : item.status === 'disputed'
                ? 'Disputed'
                : 'Pending'}
          </span>
        </div>
        {item.notes && (
          <p className="mt-2 text-sm text-gray-600">{item.notes}</p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-3">Deliverables</h2>
      {pct !== null && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">
              {completed} of {total} completed
            </span>
            <span className="font-bold text-primary">{pct}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${Math.min(100, pct ?? 0)}%` }}
            />
          </div>
        </div>
      )}
      <div className="space-y-1.5">
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
