import { Image } from 'next-sanity/image';
import { urlForImage } from '@/lib/sanity/client/utils';

type Props = {
  section: {
    title?: string;
    image?: { asset?: { _ref?: string }; alt?: string };
    link?: string;
    sponsorName?: string;
    sponsor?: {
      firstName: string;
      lastName: string;
      organization?: string;
      website?: string;
    };
    startDate?: string;
    endDate?: string;
    size?: 'full' | 'half';
  };
};

export default function AdBanner({ section }: Props) {
  const {
    image,
    link: manualLink,
    sponsorName: manualName,
    sponsor,
    startDate,
    endDate,
    size = 'full',
  } = section;

  if (!image?.asset?._ref) return null;

  const now = new Date().toISOString().split('T')[0];
  if (startDate && now < startDate) return null;
  if (endDate && now > endDate) return null;

  const displayName = sponsor
    ? sponsor.organization || `${sponsor.firstName} ${sponsor.lastName}`
    : manualName;
  const displayLink = sponsor?.website || manualLink;

  const width = size === 'half' ? 600 : 1200;
  const height = size === 'half' ? 150 : 200;

  const banner = (
    <Image
      src={
        urlForImage(image)
          ?.width(width)
          .height(height)
          .fit('crop')
          .url() as string
      }
      alt={image.alt || displayName || 'Sponsored content'}
      width={width}
      height={height}
      sizes={size === 'half' ? '50vw' : '100vw'}
      className="rounded-xl object-cover w-full"
    />
  );

  return (
    <section className="py-4">
      <div
        className={`container mx-auto px-4 ${size === 'half' ? 'max-w-xl' : ''}`}
      >
        {displayLink ? (
          <a
            href={displayLink}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block"
          >
            {banner}
          </a>
        ) : (
          banner
        )}
        {displayName && (
          <p className="text-xs text-gray-400 text-center mt-1">
            Sponsored by {displayName}
          </p>
        )}
      </div>
    </section>
  );
}
