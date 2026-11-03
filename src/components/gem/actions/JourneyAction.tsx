import Link from 'next/link';
import type { GemRecord } from '../RecordGem.types';

type Props = {
  slug: string;
  _type: GemRecord['_type'];
};

export default function JourneyAction({ slug, _type }: Props) {
  const href =
    _type === 'notice'
      ? `/notices/journey/${slug}`
      : `/records/${slug}#lineage`;
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
    >
      🗺 View Governance Journey
    </Link>
  );
}
