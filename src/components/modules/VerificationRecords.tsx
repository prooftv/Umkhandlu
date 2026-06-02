import type { FC } from 'react';

type VerificationClaim = {
  source: string;
  value: string;
  date?: string;
  evidence?: string;
};

type VerificationRecord = {
  _id: string;
  field: string;
  conflictType?: string;
  displayTruth?: string;
  resolutionState: 'pending' | 'partial' | 'resolved' | 'escalated';
  resolutionNote?: string;
  detectedAt: string;
  resolvedAt?: string;
  claims?: VerificationClaim[];
};

const verificationStatePill = (
  state: VerificationRecord['resolutionState']
) => {
  switch (state) {
    case 'resolved':
      return {
        label: 'Verified',
        className:
          'inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700',
      };
    case 'escalated':
      return {
        label: 'Escalated',
        className:
          'inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700',
      };
    case 'partial':
      return {
        label: 'Under Review',
        className:
          'inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700',
      };
    default:
      return {
        label: 'Pending',
        className:
          'inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700',
      };
  }
};

const getVerificationFieldLabel = (field: string) => {
  const labels: Record<string, string> = {
    progress: 'Progress %',
    phase: 'Project Phase',
    workforce: 'Workforce / EPWP Numbers',
    timeline: 'Timeline / Dates',
    status: 'Project Status',
    budget: 'Budget / Expenditure',
    other: 'Other',
  };
  return labels[field] || field;
};

const getClaimKey = (claim: VerificationClaim, index: number) =>
  `${claim.source}-${claim.value}-${claim.date ?? index}`;

function VerificationClaimItem({ claim }: { claim: VerificationClaim }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-sm text-slate-700">
        <span className="font-semibold">{claim.source}</span> reported{' '}
        <span className="font-semibold">{claim.value}</span>
        {claim.date ? ` on ${new Date(claim.date).toLocaleDateString()}` : ''}
      </p>
      {claim.evidence && (
        <p className="text-xs text-slate-500 mt-1">
          Evidence: {claim.evidence}
        </p>
      )}
    </div>
  );
}

function VerificationRecordItem({ record }: { record: VerificationRecord }) {
  const pill = verificationStatePill(record.resolutionState);
  const fieldText = getVerificationFieldLabel(record.field);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <p className="text-sm text-slate-500 uppercase tracking-wide">
            {fieldText}
            {record.conflictType ? ` • ${record.conflictType}` : ''}
          </p>
          {record.displayTruth ? (
            <p className="mt-1 text-lg font-semibold text-slate-900">
              Public report: {record.displayTruth}
            </p>
          ) : (
            <p className="mt-1 text-lg font-semibold text-slate-900">
              Under review
            </p>
          )}
        </div>
        <span className={pill.className}>{pill.label}</span>
      </div>
      {record.resolutionNote && (
        <p className="text-sm text-slate-600 mb-2">{record.resolutionNote}</p>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="text-xs uppercase tracking-wide text-slate-500">
          Detected: {new Date(record.detectedAt).toLocaleDateString()}
        </div>
        {record.resolvedAt && (
          <div className="text-xs uppercase tracking-wide text-slate-500">
            Verified: {new Date(record.resolvedAt).toLocaleDateString()}
          </div>
        )}
      </div>
      {record.claims?.length ? (
        <div className="mt-4">
          <p className="text-sm font-semibold text-slate-800 mb-2">
            Source claims
          </p>
          <div className="space-y-3">
            {record.claims.map((claim, index) => (
              <VerificationClaimItem
                key={getClaimKey(claim, index)}
                claim={claim}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

const VerificationRecords: FC<{ records: VerificationRecord[] }> = ({
  records,
}) => {
  if (!records?.length) return null;
  return (
    <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold">Verification Records</h2>
          <p className="text-sm text-slate-600">
            Public reporting is aligned with verified evidence from the TCRS
            conflict log.
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {records.map((record) => (
          <VerificationRecordItem key={record._id} record={record} />
        ))}
      </div>
    </div>
  );
};

export default VerificationRecords;
