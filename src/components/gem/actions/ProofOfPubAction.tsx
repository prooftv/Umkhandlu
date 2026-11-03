import Link from 'next/link';

type Props = {
  _id: string;
};

export default function ProofOfPubAction({ _id }: Props) {
  return (
    <Link
      href={`/notices/certificate/${_id}`}
      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
    >
      📋 View Proof of Publication
    </Link>
  );
}
