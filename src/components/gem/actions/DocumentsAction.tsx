import type { EvidenceItem } from '../RecordGem.types';

type Props = {
  items: EvidenceItem[];
};

export default function DocumentsAction({ items }: Props) {
  if (!items.length) return null;
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
        Supporting Documents
      </p>
      <div className="space-y-2">
        {items.map((doc) => (
          <a
            key={doc._key}
            href={doc.url ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px]"
          >
            <span className="text-base shrink-0">📄</span>
            <span className="text-sm font-medium flex-1 min-w-0 break-words">
              {doc.title || 'Document'}
            </span>
            <span className="text-xs text-primary ml-auto shrink-0">
              Download →
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
