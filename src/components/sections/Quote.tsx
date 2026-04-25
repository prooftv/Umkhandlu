import { Image } from 'next-sanity/image';
import { urlForImage } from '@/lib/sanity/client/utils';

type Props = {
  section: {
    text?: string;
    author?: {
      firstName: string;
      lastName: string;
      role?: string;
      image?: { asset?: { _ref?: string }; alt?: string };
    };
    authorName?: string;
    authorRole?: string;
    image?: { asset?: { _ref?: string }; alt?: string };
  };
};

export default function Quote({ section }: Props) {
  const { text, author, authorName, authorRole, image } = section;

  if (!text) return null;

  const name = author ? `${author.firstName} ${author.lastName}` : authorName;
  const role = author?.role || authorRole;
  const photo = author?.image || image;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <blockquote className="text-center">
          <p className="text-2xl md:text-3xl font-medium italic text-gray-800 leading-relaxed mb-8">
            &ldquo;{text}&rdquo;
          </p>
          {(name || photo) && (
            <footer className="flex items-center justify-center gap-4">
              {photo?.asset?._ref && (
                <Image
                  src={
                    urlForImage(photo)
                      ?.width(96)
                      .height(96)
                      .fit('crop')
                      .url() as string
                  }
                  alt={name || ''}
                  width={96}
                  height={96}
                  className="w-14 h-14 rounded-full object-cover"
                />
              )}
              <div className="text-left">
                {name && <p className="font-semibold text-gray-900">{name}</p>}
                {role && <p className="text-sm text-gray-500">{role}</p>}
              </div>
            </footer>
          )}
        </blockquote>
      </div>
    </section>
  );
}
