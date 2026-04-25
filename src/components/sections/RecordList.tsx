import { Badge } from '@/components/ui/Badge';

type Record = {
  _id: string;
  title: string;
  recordType: string;
  date: string;
  summary?: string;
  fileUrl?: string;
};

type Props = {
  section: {
    heading?: string;
    records?: Record[];
  };
};

const typeLabels: globalThis.Record<string, string> = {
  minutes: 'Minutes',
  resolution: 'Resolution',
  'public-notice': 'Public Notice',
  policy: 'Policy',
  report: 'Report',
};

export default function RecordList({ section }: Props) {
  const { heading, records } = section;

  if (!records?.length) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {heading}
          </h2>
          <div className="space-y-3">
            {records.map((record) => (
              <article
                key={record._id}
                className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">
                      {typeLabels[record.recordType] || record.recordType}
                    </Badge>
                    <time
                      dateTime={record.date}
                      className="text-xs text-gray-400"
                    >
                      {new Date(record.date).toLocaleDateString()}
                    </time>
                  </div>
                  <h3 className="font-semibold">{record.title}</h3>
                  {record.summary && (
                    <p className="text-gray-600 text-sm mt-1">
                      {record.summary}
                    </p>
                  )}
                </div>
                {record.fileUrl && (
                  <a
                    href={record.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm font-medium hover:text-primary shrink-0"
                  >
                    📄 Download
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
