import { Image } from 'next-sanity/image';
import { urlForImage } from '@/lib/sanity/client/utils';

type LogoItem = {
  _key: string;
  name: string;
  url?: string;
  logo?: { asset?: { _ref?: string } };
};

type Props = {
  section: {
    heading?: string;
    description?: string;
    logos?: LogoItem[];
  };
};

function LogoImage({ logo, name }: { logo: LogoItem['logo']; name: string }) {
  return (
    <Image
      src={urlForImage(logo)?.width(200).height(80).fit('max').url() as string}
      alt={name}
      width={200}
      height={80}
      className="object-contain max-h-16 grayscale hover:grayscale-0 transition-all duration-300"
    />
  );
}

export default function LogoGrid({ section }: Props) {
  const { heading, description, logos } = section;

  if (!logos?.length) return null;

  const validLogos = logos.filter((item) => item.logo?.asset?._ref);

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
          {validLogos.map((item) =>
            item.url ? (
              <a
                key={item._key}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
                title={item.name}
              >
                <LogoImage logo={item.logo} name={item.name} />
              </a>
            ) : (
              <div key={item._key} className="shrink-0" title={item.name}>
                <LogoImage logo={item.logo} name={item.name} />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
