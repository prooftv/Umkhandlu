import Link from 'next/link';

type Props = {
  slug: string;
};

export default function LineageCertAction({ slug }: Props) {
  return (
    <Link
      href={`/notices/lineage/${slug}`}
      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
    >
      🖸 Print Lineage Certificate
    </Link>
  );
}
