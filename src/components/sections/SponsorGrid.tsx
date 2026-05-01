import { Image } from 'next-sanity/image';
import { Badge } from '@/components/ui/Badge';
import { urlForImage } from '@/lib/sanity/client/utils';

type Sponsor = {
  _id: string;
  name: string;
  slug?: string;
  sponsorType?: string;
  description?: string;
  website?: string;
  logo?: { asset?: { _ref?: string } };
};

type Props = {
  section: {
    heading?: string;
    description?: string;
    sponsors?: Sponsor[];
  };
};

const typeLabels: Record<string, string> = {
  ngo: 'NGO',
  business: 'Business',
  government: 'Government',
  community: 'Community',
  individual: 'Individual',
};

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const inner = (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden p-5">
      <div className="flex items-center gap-4 mb-3">
        {sponsor.logo?.asset?._ref && (
          <Image
            src={
              urlForImage(sponsor.logo)
                ?.width(80)
                .height(40)
                .fit('max')
                .url() as string
            }
            alt={sponsor.name}
            width={80}
            height={40}
            className="object-contain max-h-10"
          />
        )}
        <div className="min-w-0">
          <h3 className="text-lg font-semibold truncate">{sponsor.name}</h3>
          {sponsor.sponsorType && (
            <Badge variant="outline" className="mt-1">
              {typeLabels[sponsor.sponsorType] || sponsor.sponsorType}
            </Badge>
          )}
        </div>
      </div>
      {sponsor.description && (
        <p className="text-gray-600 text-sm line-clamp-2">
          {sponsor.description}
        </p>
      )}
      {sponsor.website && (
        <p className="text-primary text-xs mt-2">
          🌐 {new URL(sponsor.website).hostname}
        </p>
      )}
    </div>
  );

  if (sponsor.website) {
    return (
      <a
        href={sponsor.website}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {inner}
      </a>
    );
  }

  return inner;
}

export default function SponsorGrid({ section }: Props) {
  const { heading, description, sponsors } = section;

  if (!sponsors?.length)
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          {heading && (
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          )}
          <p className="text-gray-500">No sponsors yet.</p>
        </div>
      </section>
    );

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          {description && (
            <p className="text-xl text-gray-600">{description}</p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sponsors.map((sponsor) => (
            <SponsorCard key={sponsor._id} sponsor={sponsor} />
          ))}
        </div>
      </div>
    </section>
  );
}
