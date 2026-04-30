import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Image } from 'next-sanity/image';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import ShareWhatsApp from '@/components/modules/ShareWhatsApp';
import { Badge } from '@/components/ui/Badge';
import { serverEnv } from '@/env/serverEnv';
import { client } from '@/lib/sanity/client/client';
import { generateLocalBusinessJsonLd } from '@/lib/sanity/client/jsonLd';
import { sanityFetch } from '@/lib/sanity/client/live';
import { urlForImage } from '@/lib/sanity/client/utils';
import { listingDetailQuery, listingSlugs } from '@/lib/sanity/queries/queries';

type Props = {
  params: Promise<{ slug: string }>;
};

const typeLabels: Record<string, string> = {
  school: 'School',
  clinic: 'Clinic',
  business: 'Business',
  accommodation: 'Accommodation',
  church: 'Church',
  facility: 'Facility',
};

const verifyLabels: Record<string, string> = {
  induna: 'Verified by Induna',
  council: 'Council Approved',
};

type ListingData = NonNullable<
  Awaited<ReturnType<typeof sanityFetch<typeof listingDetailQuery>>>['data']
>;

function ListingDetails({ listing }: { listing: ListingData }) {
  return (
    <div className="grid md:grid-cols-2 gap-8 mb-8">
      <div className="space-y-3">
        {listing.location && (
          <p className="text-gray-600">📍 {listing.location}</p>
        )}
        {listing.contactInfo && (
          <p className="text-gray-600">
            📞{' '}
            <a
              href={`tel:${listing.contactInfo}`}
              className="hover:text-primary"
            >
              {listing.contactInfo}
            </a>
          </p>
        )}
        {listing.whatsappContact && (
          <p>
            <a
              href={`https://wa.me/${listing.whatsappContact.replace(/[^0-9+]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              💬 WhatsApp
            </a>
          </p>
        )}
        {listing.website && (
          <p>
            <a
              href={listing.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              🌐 Website
            </a>
          </p>
        )}
        {listing.operatingHours && (
          <p className="text-gray-600">🕐 {listing.operatingHours}</p>
        )}
      </div>
      {listing.servicesOffered && listing.servicesOffered.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3">Services</h2>
          <div className="flex flex-wrap gap-2">
            {listing.servicesOffered.map((service) => (
              <span
                key={service}
                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type ListingImage = {
  _key: string;
  alt?: string | null;
  caption?: string | null;
  asset?: { _id: string; url: string | null } | null;
};

function ListingGallery({ images }: { images: ListingImage[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Photos</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img) => (
          <figure
            key={img._key}
            className="group relative overflow-hidden rounded-xl"
          >
            {img.asset?.url && (
              <Image
                src={img.asset.url}
                alt={img.alt || ''}
                width={400}
                height={400}
                className="object-cover aspect-square group-hover:scale-105 transition-transform duration-300"
              />
            )}
            {img.caption && (
              <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const { data } = await sanityFetch({
    query: listingDetailQuery,
    params: { slug },
  });
  if (!data) return {};
  return {
    title: data.name,
    description: data.description || undefined,
    alternates: {
      canonical: `/directory/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await client.fetch(listingSlugs, {
    limit: serverEnv.MAX_STATIC_PARAMS,
  });
  return slugs ? slugs.filter((s) => s !== null).map((slug) => ({ slug })) : [];
}

export default async function ListingPage(props: Props) {
  const { slug } = await props.params;
  const { data: listing } = await sanityFetch({
    query: listingDetailQuery,
    params: { slug },
  });

  if (!listing) notFound();

  const jsonLd = generateLocalBusinessJsonLd({
    name: listing.name,
    slug: listing.slug,
    listingType: listing.listingType,
    description: listing.description ?? undefined,
    location: listing.location ?? undefined,
    contactInfo: listing.contactInfo ?? undefined,
    operatingHours: listing.operatingHours ?? undefined,
  });

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: 'Directory', href: '/directory' },
          { label: listing.name || '' },
        ]}
      />
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <Badge>
            {typeLabels[listing.listingType] || listing.listingType}
          </Badge>
          {listing.verifiedByInduna &&
            listing.verifiedByInduna !== 'community' && (
              <Badge variant="secondary">
                {verifyLabels[listing.verifiedByInduna] ||
                  listing.verifiedByInduna}
              </Badge>
            )}
          {listing.featured && (
            <span className="text-sm text-primary">⭐ Featured</span>
          )}
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{listing.name}</h1>
        {listing.description && (
          <p className="text-xl text-gray-600">{listing.description}</p>
        )}
      </div>

      {/* Cover image */}
      {listing.image?.asset?._ref && (
        <div className="mb-8 rounded-2xl overflow-hidden">
          <Image
            src={
              urlForImage(listing.image)
                ?.width(1200)
                .height(600)
                .fit('crop')
                .url() as string
            }
            alt={listing.image?.alt || listing.name}
            width={1200}
            height={600}
            className="w-full object-cover"
          />
        </div>
      )}

      {/* Details grid */}
      <ListingDetails listing={listing} />

      {/* Gallery */}
      {listing.images && listing.images.length > 0 && (
        <ListingGallery images={listing.images} />
      )}

      <div className="mt-8 pt-6 border-t border-gray-100">
        <ShareWhatsApp title={listing.name || ''} />
      </div>
    </div>
  );
}
