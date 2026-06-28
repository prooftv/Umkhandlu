import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { sanityFetch } from '@/lib/sanity/client/live';
import { recordListPageQuery } from '@/lib/sanity/queries/queries';

export const metadata: Metadata = {
  title: 'Documents & Records',
  description:
    'Governance records, resolutions, minutes, and institutional documents.',
};

const typeLabels: Record<string, string> = {
  minutes: 'Minutes',
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

const statusVariants: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  adopted: 'default',
  approved: 'default',
  pending: 'outline',
  open: 'secondary',
  rejected: 'destructive',
  resolved: 'secondary',
};

export default async function RecordsPage() {
  const { data: records } = await sanityFetch({
    query: recordListPageQuery,
  });

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Breadcrumbs items={[{ label: 'Documents & Records' }]} />

      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        Documents & Records
      </h1>

      {!records || records.length === 0 ? (
        <p className="text-gray-500">No records yet.</p>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <Link
              key={record._id}
              href={`/records/${record.slug}`}
              className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-start gap-4 block"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge variant="outline">
                    {typeLabels[record.recordType || ''] || record.recordType}
                  </Badge>
                  {record.status && (
                    <Badge variant={statusVariants[record.status] || 'outline'}>
                      {record.status.charAt(0).toUpperCase()}
                      {record.status.slice(1)}
                    </Badge>
                  )}
                </div>
                <h2 className="font-semibold">{record.title}</h2>
                {record.summary && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {record.summary}
                  </p>
                )}
                {record.relatedArea && (
                  <p className="text-xs text-gray-400 mt-1">
                    🏘️ {record.relatedArea.name}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                {record.date && (
                  <time
                    dateTime={record.date}
                    className="text-xs text-gray-400 block"
                  >
                    {new Date(record.date).toLocaleDateString()}
                  </time>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
