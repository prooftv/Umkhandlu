type Props = {
  siteName: string;
  noticeTitle: string;
  noticeType: string;
  legalMandate?: string | null;
  referenceNumber?: string | null;
  applicant: string;
  publishDate?: string | null;
  commentDeadline?: string | null;
  retentionPeriod?: string | null;
  location: string;
  geopoint?: { lat: number; lng: number } | null;
  status?: string | null;
  documents?: { title: string }[];
  publicUrl: string;
  revisionId?: string | null;
};

const typeLabels: Record<string, string> = {
  eia: 'Environmental Impact Assessment (EIA)',
  rezoning: 'Rezoning Application (SPLUMA)',
  'land-use': 'Land Use Change (SPLUMA)',
  township: 'Township Establishment (SPLUMA)',
  building: 'Building Plan Approval',
  mining: 'Mining / Excavation Permit',
  liquor: 'Liquor License Application',
  telecom: 'Cell Tower / Mast Installation',
  estate: 'Deceased Estate Notice (Form J187)',
  liquidation: 'Liquidation / Insolvency Notice',
  pto: 'PTO / Land Transfer Notice',
  other: 'Public Notice',
};

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function daysBetween(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
}

export default function ProofOfPublication(props: Props) {
  const today = new Date().toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const daysPublished = props.publishDate
    ? daysBetween(
        props.publishDate,
        props.commentDeadline || new Date().toISOString()
      )
    : null;

  return (
    <div className="max-w-2xl mx-auto border-2 border-gray-900 p-8 my-8 print:border-black print:my-0 print:p-6">
      <div className="text-center mb-8">
        <h1 className="text-lg font-black uppercase tracking-widest mb-1">
          Proof of Publication Certificate
        </h1>
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {props.siteName}
        </p>
      </div>

      <div className="flex justify-between text-xs text-gray-600 mb-6 border-b border-gray-300 pb-4">
        <span>
          Certificate No:{' '}
          <strong className="text-gray-900">
            POP-{props.publishDate?.replace(/-/g, '') || 'DRAFT'}
          </strong>
        </span>
        <span>
          Date Issued: <strong className="text-gray-900">{today}</strong>
        </span>
      </div>

      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">
          Notice Details
        </h2>
        <table className="w-full text-sm">
          <tbody>
            <Row label="Title" value={props.noticeTitle} />
            <Row
              label="Type"
              value={typeLabels[props.noticeType] || props.noticeType}
            />
            {props.legalMandate && (
              <Row label="Legal Mandate" value={props.legalMandate} />
            )}
            {props.referenceNumber && (
              <Row label="Reference No" value={props.referenceNumber} />
            )}
            <Row label="Applicant" value={props.applicant} />
          </tbody>
        </table>
      </section>

      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">
          Publication Record
        </h2>
        <table className="w-full text-sm">
          <tbody>
            {props.publishDate && (
              <Row label="Published" value={formatDate(props.publishDate)} />
            )}
            {props.commentDeadline && (
              <Row
                label="Comment Deadline"
                value={formatDate(props.commentDeadline)}
              />
            )}
            {daysPublished !== null && (
              <Row label="Days Published" value={`${daysPublished} days`} />
            )}
            {props.retentionPeriod && (
              <Row label="Retention Period" value={props.retentionPeriod} />
            )}
            <Row label="Public URL" value={props.publicUrl} />
            {props.status && (
              <Row label="Status" value={props.status.toUpperCase()} />
            )}
            {props.revisionId && (
              <Row label="Document Revision" value={props.revisionId} mono />
            )}
          </tbody>
        </table>
      </section>

      {props.documents && props.documents.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">
            Documents Hosted
          </h2>
          <ul className="text-sm space-y-1">
            {props.documents.map((doc, i) => (
              <li key={doc.title} className="text-gray-700">
                {i + 1}. {doc.title} — available for public download
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">
          Site Location
        </h2>
        <table className="w-full text-sm">
          <tbody>
            <Row label="Address" value={props.location} />
            {props.geopoint && (
              <Row
                label="Coordinates"
                value={`${props.geopoint.lat.toFixed(5)}, ${props.geopoint.lng.toFixed(5)}`}
              />
            )}
            <Row label="Map" value="Publicly visible on community map" />
          </tbody>
        </table>
      </section>

      <div className="border-t-2 border-gray-900 pt-6 mt-8">
        <p className="text-xs text-gray-700 leading-relaxed">
          This certificate confirms that the above notice was published on the{' '}
          {props.siteName} community platform and remained publicly accessible
          for the stated duration. The notice, supporting documents, and site
          location were available for public inspection at the URL above.
        </p>
        <p className="text-xs text-gray-500 mt-4">
          Issued by: Unami Foundation (Platform Operator)
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <tr>
      <td className="py-1.5 pr-4 text-gray-500 font-medium align-top whitespace-nowrap">
        {label}:
      </td>
      <td
        className={`py-1.5 text-gray-900 font-semibold break-all${mono ? ' font-mono text-xs' : ''}`}
      >
        {value}
      </td>
    </tr>
  );
}
