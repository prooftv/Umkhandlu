import { Image } from 'next-sanity/image';
import { urlForImage } from '@/lib/sanity/client/utils';

type Sponsor = {
  _id: string;
  name: string;
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

export default function LogoGrid({ section }: Props) {
  const { heading, description, sponsors } = section;

  const valid = sponsors?.filter((s) => s.logo?.asset?._ref) ?? [];
  if (valid.length === 0) return null;

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
          {valid.map((sponsor) => {
            const src = urlForImage(
              sponsor.logo as { asset?: { _ref?: string } }
            )
              ?.width(200)
              .height(80)
              .fit('max')
              .url() as string;

            return sponsor.website ? (
              <a
                key={sponsor._id}
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
                title={sponsor.name}
              >
                <LogoImage src={src} alt={sponsor.name} />
              </a>
            ) : (
              <div key={sponsor._id} className="shrink-0" title={sponsor.name}>
                <LogoImage src={src} alt={sponsor.name} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
