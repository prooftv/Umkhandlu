import type { PortableTextBlock } from 'next-sanity';
import { Image } from 'next-sanity/image';
import CustomPortableText from '@/components/modules/PortableText';
import { Badge } from '@/components/ui/Badge';
import { urlForImage } from '@/lib/sanity/client/utils';
import type { PersonFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';

const typeLabels: Record<string, string> = {
  inkosi: 'Inkosi',
  induna: 'Induna',
  council: 'Council Member',
  youth: 'Youth Representative',
  sponsor: 'Sponsor / Partner',
  community: 'Community Member',
  author: 'Author',
};

export default function PersonArchiveByline({
  person,
}: {
  person: PersonFragmentType;
}) {
  return (
    <div className="mb-12">
      <div className="flex flex-col items-center md:items-start md:flex-row gap-8 md:gap-12">
        <div className="relative max-w-[300px] w-full h-[300px]">
          {person.image ? (
            <Image
              src={
                urlForImage(person.image)
                  ?.width(800)
                  .height(800)
                  .url() as string
              }
              alt={`Photo of ${person.firstName} ${person.lastName}`}
              style={{
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              width={800}
              height={800}
              className="rounded-full object-cover"
            />
          ) : null}
        </div>

        <div className="flex flex-col justify-center w-full">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {person.firstName} {person.lastName}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              {person.personType && (
                <Badge variant="secondary">
                  {typeLabels[person.personType] || person.personType}
                </Badge>
              )}
              {person.role ? <Badge>{person.role}</Badge> : null}
              {person.organization ? (
                <Badge variant="outline">{person.organization}</Badge>
              ) : null}
            </div>
          </div>

          {(person.email || person.phone) && (
            <div className="flex gap-4 mb-6 text-sm text-gray-600">
              {person.email && (
                <a
                  href={`mailto:${person.email}`}
                  className="hover:text-pink-600"
                >
                  ✉ {person.email}
                </a>
              )}
              {person.phone && (
                <a href={`tel:${person.phone}`} className="hover:text-pink-600">
                  📞 {person.phone}
                </a>
              )}
            </div>
          )}

          {person.skills && person.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {person.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {person.biography ? (
            <CustomPortableText
              value={person.biography as PortableTextBlock[]}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
