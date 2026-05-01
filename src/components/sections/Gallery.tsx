import { Image } from 'next-sanity/image';
import { urlForImage } from '@/lib/sanity/client/utils';

type GalleryImage = {
  _key: string;
  alt: string;
  caption?: string;
  asset?: { _ref?: string };
};

type Props = {
  section: {
    heading?: string;
    description?: string;
    images?: GalleryImage[];
  };
};

export default function Gallery({ section }: Props) {
  const { heading, description, images } = section;

  if (!images?.length) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          {description && (
            <p className="text-xl text-gray-600">{description}</p>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <figure
              key={image._key}
              className="group relative overflow-hidden rounded-xl"
            >
              {image.asset?._ref && (
                <Image
                  src={
                    urlForImage(image)
                      ?.width(600)
                      .height(600)
                      .fit('crop')
                      .url() as string
                  }
                  alt={image.alt || ''}
                  width={600}
                  height={600}
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover aspect-square group-hover:scale-105 transition-transform duration-300"
                />
              )}
              {image.caption && (
                <figcaption className="bg-black/60 px-3 py-2 text-white text-sm">
                  {image.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
