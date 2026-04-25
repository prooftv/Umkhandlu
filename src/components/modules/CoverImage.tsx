import { stegaClean } from '@sanity/client/stega';
import { Image } from 'next-sanity/image';

import { urlForImage } from '@/lib/sanity/client/utils';

interface CoverImageProps {
  image: { asset?: { _ref?: string }; alt?: string };
  priority?: boolean;
}

export default function CoverImage(props: CoverImageProps) {
  const { image: source, priority } = props;

  const image = source?.asset?._ref ? (
    <Image
      className="rounded-2xl shadow-md transition-shadow object-cover"
      fill={true}
      alt={stegaClean(source?.alt) || ''}
      src={
        urlForImage(source)
          ?.height(720)
          .width(1280)
          .auto('format')
          .url() as string
      }
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1280px"
      priority={priority}
    />
  ) : (
    <div className="bg-slate-50" style={{ paddingTop: '100%' }} />
  );

  return <div className="relative aspect-video">{image}</div>;
}
