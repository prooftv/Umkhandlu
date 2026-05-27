import type { PortableTextBlock } from 'next-sanity';
import { Image } from 'next-sanity/image';
import PortableText from '@/components/modules/PortableText';
import { urlForImage } from '@/lib/sanity/client/utils';
import type { HeroSectionFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';
import ButtonsGroup from '../modules/ButtonsGroup';

export default function HeroSection({
  section,
}: {
  section: HeroSectionFragmentType;
}) {
  const hasImage = section.image?.asset;

  if (hasImage) {
    return (
      <section className="relative min-h-[400px] md:min-h-[500px] flex items-center">
        <Image
          src={
            urlForImage(section.image!)
              ?.width(1920)
              .height(800)
              .fit('crop')
              .url() as string
          }
          alt={section?.image?.alt || ''}
          width={1920}
          height={800}
          sizes="100vw"
          priority
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto relative z-10 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              {section?.heading}
            </h1>
            <div className="text-lg md:text-xl text-white drop-shadow-md [&_p]:text-white [&_p]:drop-shadow-md">
              <PortableText value={section.text as PortableTextBlock[]} />
            </div>
            {section?.buttons && section?.buttons.length > 0 && (
              <div className="mt-8">
                <ButtonsGroup
                  className="w-full md:w-auto"
                  buttons={section.buttons}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            {section?.heading}
          </h1>
          <div className="text-lg md:text-xl text-white/90 [&_p]:text-white/90">
            <PortableText value={section.text as PortableTextBlock[]} />
          </div>
          {section?.buttons && section?.buttons.length > 0 && (
            <div className="mt-8">
              <ButtonsGroup
                className="w-full md:w-auto"
                buttons={section.buttons}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
