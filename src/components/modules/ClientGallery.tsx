'use client';

import { Image } from 'next-sanity/image';
import Lightbox from '@/components/modules/Lightbox';

type GalleryImage = {
  _key: string;
  alt?: string | null;
  caption?: string | null;
  url: string;
};

type Props = {
  images: GalleryImage[];
  heading?: string;
};

export default function ClientGallery({ images, heading = 'Photos' }: Props) {
  if (!images.length) return null;

  const lightboxImages = images.map((img) => ({
    src: img.url,
    alt: img.alt || '',
    caption: img.caption ?? undefined,
  }));

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{heading}</h2>
      <Lightbox images={lightboxImages}>
        {(openAt) => (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <figure
                onKeyDown={() => {}}
                key={img._key}
                className="group relative overflow-hidden rounded-xl cursor-pointer"
                onClick={() => openAt(i)}
              >
                <Image
                  src={img.url}
                  alt={img.alt || ''}
                  width={400}
                  height={400}
                  className="object-cover aspect-square group-hover:scale-105 transition-transform duration-300"
                />
                {img.caption && (
                  <figcaption className="bg-black/60 px-3 py-2 text-white text-sm">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </Lightbox>
    </div>
  );
}
