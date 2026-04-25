import Link from 'next/link';
import { Image } from 'next-sanity/image';
import { urlForImage } from '@/lib/sanity/client/utils';

type Sponsor = {
  _id: string;
  firstName: string;
  lastName: string;
  organization?: string;
  website?: string;
  logo?: { asset?: { _ref?: string } };
  image?: { asset?: { _ref?: string } };
};

type InlineLogo = {
  _key: string;
  name: string;
  url?: string;
  logo?: { asset?: { _ref?: string } };
};

type Props = {
  section: {
    heading?: string;
    description?: string;
    sponsors?: Sponsor[];
    logos?: InlineLogo[];
  };
};

function LogoImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={200}
      height={80}
      className="object-contain max-h-16 grayscale hover:grayscale-0 transition-all duration-300"
    />
  );
}

function getSponsorImage(sponsor: Sponsor): string | null {
  const source = sponsor.logo?.asset?._ref
    ? sponsor.logo
    : sponsor.image?.asset?._ref
      ? sponsor.image
      : null;
  if (!source) return null;
  return urlForImage(source)?.width(200).height(80).fit('max').url() ?? null;
}

export default function LogoGrid({ section }: Props) {
  const { heading, description, sponsors, logos } = section;

  const validSponsors =
    sponsors?.filter((s) => s.logo?.asset?._ref || s.image?.asset?._ref) ?? [];
  const validLogos = logos?.filter((l) => l.logo?.asset?._ref) ?? [];

  if (validSponsors.length === 0 && validLogos.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          {description && (
            <p className="text-xl text-gray-600">{description}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 max-w-4xl mx-auto">
          {validSponsors.map((sponsor) => {
            const src = getSponsorImage(sponsor);
            if (!src) return null;
            const alt =
              sponsor.organization ||
              `${sponsor.firstName} ${sponsor.lastName}`;

            return sponsor.website ? (
              <a
                key={sponsor._id}
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
                title={alt}
              >
                <LogoImage src={src} alt={alt} />
              </a>
            ) : (
              <Link
                key={sponsor._id}
                href={`/people/${sponsor._id}`}
                className="shrink-0"
                title={alt}
              >
                <LogoImage src={src} alt={alt} />
              </Link>
            );
          })}

          {validLogos.map((item) => {
            const src = urlForImage(item.logo as { asset?: { _ref?: string } })
              ?.width(200)
              .height(80)
              .fit('max')
              .url() as string;

            return item.url ? (
              <a
                key={item._key}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
                title={item.name}
              >
                <LogoImage src={src} alt={item.name} />
              </a>
            ) : (
              <div key={item._key} className="shrink-0" title={item.name}>
                <LogoImage src={src} alt={item.name} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
