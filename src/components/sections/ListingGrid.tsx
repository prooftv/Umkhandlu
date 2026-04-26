import { Image } from 'next-sanity/image';
import { urlForImage } from '@/lib/sanity/client/utils';

type Listing = {
  _id: string;
  name: string;
  slug: string;
  listingType: string;
  description?: string;
  location?: string;
  contactInfo?: string;
  whatsappContact?: string;
  website?: string;
  servicesOffered?: string[];
  operatingHours?: string;
  verifiedByInduna?: string;
  featured?: boolean;
  image?: { asset?: { _ref?: string }; alt?: string };
};

type Props = {
  section: {
    heading?: string;
    description?: string;
    listings?: Listing[];
  };
};

const typeIcons: Record<string, string> = {
  school: '🏫',
  clinic: '🏥',
  business: '💼',
  accommodation: '🏠',
  church: '⛪',
  facility: '🏛️',
  area: '🏘️',
};

const typeLabels: Record<string, string> = {
  school: 'School',
  clinic: 'Clinic',
  business: 'Business',
  accommodation: 'Accommodation',
  church: 'Church',
  facility: 'Facility',
  area: 'Village / Area',
};

function VerifiedBadge({ level }: { level?: string }) {
  if (!level || level === 'community') return null;
  const isCouncil = level === 'council';
  return (
    <span
      className="ml-1 text-green-600"
      title={isCouncil ? 'Council Approved' : 'Verified by Induna'}
    >
      {isCouncil ? '✓✓' : '✓'}
    </span>
  );
}

export default function ListingGrid({ section }: Props) {
  const { heading, description, listings } = section;

  if (!listings?.length) return null;

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
          {listings.map((listing) => (
            <article
              key={listing._id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {listing.image?.asset?._ref && (
                <div className="relative h-40">
                  <Image
                    src={
                      urlForImage(listing.image)
                        ?.width(600)
                        .height(300)
                        .fit('crop')
                        .url() as string
                    }
                    alt={listing.image?.alt || listing.name}
                    width={600}
                    height={300}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">
                    {typeIcons[listing.listingType] || '📍'}
                  </span>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {typeLabels[listing.listingType] || listing.listingType}
                  </span>
                  {listing.featured && (
                    <span className="text-xs text-primary font-medium ml-auto">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-1">
                  {listing.name}
                  <VerifiedBadge level={listing.verifiedByInduna} />
                </h3>
                {listing.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {listing.description}
                  </p>
                )}
                {listing.location && (
                  <p className="text-gray-500 text-xs">📍 {listing.location}</p>
                )}
                {listing.contactInfo && (
                  <p className="text-gray-500 text-xs mt-1">
                    📞 {listing.contactInfo}
                  </p>
                )}
                {listing.whatsappContact && (
                  <a
                    href={`https://wa.me/${listing.whatsappContact.replace(/[^0-9+]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 text-xs mt-1 inline-block hover:underline"
                  >
                    💬 WhatsApp
                  </a>
                )}
                {listing.website && (
                  <a
                    href={listing.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-xs mt-1 inline-block hover:underline"
                  >
                    🌐 Website
                  </a>
                )}
                {listing.operatingHours && (
                  <p className="text-gray-500 text-xs mt-1">
                    🕐 {listing.operatingHours}
                  </p>
                )}
                {listing.servicesOffered &&
                  listing.servicesOffered.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {listing.servicesOffered.map((service) => (
                        <span
                          key={service}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
