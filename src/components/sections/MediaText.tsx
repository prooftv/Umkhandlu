import type { PortableTextBlock } from 'next-sanity';
import { Image } from 'next-sanity/image';
import ButtonsGroup from '@/components/modules/ButtonsGroup';
import PortableText from '@/components/modules/PortableText';
import { urlForImage } from '@/lib/sanity/client/utils';
import type { MediaTextSectionFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';
import { cn } from '@/lib/utils';

export default function MediaTextSection({
  section,
}: {
  section: MediaTextSectionFragmentType;
}) {
  const isRight = section?.imagePosition === 'right';

  return (
    <div className="container py-10 md:py-14 mx-auto flex flex-col lg:flex-row gap-8">
      <div className={cn('lg:w-1/2', isRight && 'lg:order-2')}>
        {section.image?.asset && (
          <Image
            alt={section.image?.alt || ''}
            className="shadow-md rounded-4xl"
            width={1000}
            height={667}
            sizes="(max-width: 1024px) 100vw, 50vw"
            src={
              urlForImage(section.image)
                ?.width(1000)
                .height(667)
                .url() as string
            }
          />
        )}
      </div>
      <div
        className={cn(
          'lg:w-1/2 lg:p-12 flex flex-col justify-center',
          isRight && 'lg:order-1'
        )}
      >
        <h2 className="text-4xl font-bold leading-tight tracking-tighter lg:text-5xl mb-5">
          {section?.heading}
        </h2>
        <div className="text-xl mb-5">
          <PortableText value={section.content as PortableTextBlock[]} />
        </div>
        {section?.buttons && section.buttons.length > 0 && (
          <ButtonsGroup buttons={section.buttons} size="lg" />
        )}
      </div>
    </div>
  );
}
