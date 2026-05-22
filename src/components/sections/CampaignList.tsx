import Link from 'next/link';
import { Image } from 'next-sanity/image';
import { Badge } from '@/components/ui/Badge';
import { urlForImage } from '@/lib/sanity/client/utils';

type Campaign = {
  _id: string;
  title: string;
  slug: string;
  campaignType: string;
  status: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  image?: { asset?: { _ref?: string }; alt?: string };
  link?: string;
  budget?: number;
  beneficiaries?: number;
  impactSummary?: string;
  deliverables?: string[];
  sponsor?: {
    name: string;
    slug?: string;
    logo?: { asset?: { _ref?: string } };
    website?: string;
    sponsorType?: string;
  };
  relatedAreas?: { name: string; slug: string }[];
  relatedProgram?: { title: string; slug: string };
};

type Props = {
  section: {
    heading?: string;
    description?: string;
    campaigns?: Campaign[];
  };
};

const typeConfig: Record<string, { icon: string; label: string }> = {
  ad: { icon: '📢', label: 'Sponsorship' },
  activation: { icon: '🎯', label: 'Activation' },
  csr: { icon: '💚', label: 'Initiative' },
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-600',
  approved: 'bg-blue-100 text-blue-800',
  reported: 'bg-purple-100 text-purple-800',
};

export default function CampaignList({ section }: Props) {
  const { heading, description, campaigns } = section;

  if (!campaigns?.length)
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          {heading && (
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          )}
          <p className="text-gray-500">No campaigns yet.</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {campaigns.map((campaign) => {
            const config = typeConfig[campaign.campaignType] || {
              icon: '📋',
              label: campaign.campaignType,
            };
            return (
              <Link
                key={campaign._id}
                href={`/campaigns/${campaign.slug}`}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden block"
              >
                {campaign.image?.asset?._ref && (
                  <div className="relative">
                    <Image
                      src={
                        urlForImage(campaign.image)
                          ?.width(600)
                          .height(400)
                          .fit('max')
                          .url() as string
                      }
                      alt={campaign.image?.alt || campaign.title}
                      width={600}
                      height={400}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full h-auto"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-sm">
                      {config.icon} {config.label}
                    </span>
                    <Badge
                      className={
                        statusColors[campaign.status] ||
                        'bg-gray-100 text-gray-600'
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">
                    {campaign.title}
                  </h3>
                  {campaign.sponsor && (
                    <p className="text-sm text-gray-500 mb-2">
                      by {campaign.sponsor.name}
                    </p>
                  )}
                  {campaign.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {campaign.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                    {campaign.startDate && (
                      <span>
                        📅 {new Date(campaign.startDate).toLocaleDateString()}
                        {campaign.endDate &&
                          ` – ${new Date(campaign.endDate).toLocaleDateString()}`}
                      </span>
                    )}
                    {campaign.beneficiaries && (
                      <span>
                        👥 {campaign.beneficiaries.toLocaleString()} reached
                      </span>
                    )}
                  </div>
                  {campaign.deliverables &&
                    campaign.deliverables.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {campaign.deliverables.slice(0, 3).map((d) => (
                          <span
                            key={d}
                            className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
