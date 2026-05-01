import Link from 'next/link';
import { Image } from 'next-sanity/image';
import { urlForImage } from '@/lib/sanity/client/utils';

type Person = {
  _id: string;
  firstName: string;
  lastName: string;
  slug: string;
  role?: string;
  personType?: string;
  organization?: string;
  skills?: string[];
  image?: { asset?: { _ref?: string }; alt?: string };
};

type Props = {
  section: {
    heading?: string;
    description?: string;
    people?: Person[];
  };
};

function Initials({ first, last }: { first: string; last: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/80 to-secondary/80 text-white text-2xl font-bold">
      {first[0]}
      {last[0]}
    </div>
  );
}

export default function PeopleGrid({ section }: Props) {
  const { heading, description, people } = section;

  if (!people?.length)
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          {heading && (
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          )}
          <p className="text-gray-500">No people to display yet.</p>
        </div>
      </section>
    );

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          {description && (
            <p className="text-xl text-gray-600">{description}</p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {people.map((person) => (
            <Link
              key={person._id}
              href={`/people/${person.slug}`}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden block"
            >
              <div className="flex items-center gap-4 p-5">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 shrink-0">
                  {person.image?.asset?._ref ? (
                    <Image
                      src={
                        urlForImage(person.image)
                          ?.width(128)
                          .height(128)
                          .fit('crop')
                          .url() as string
                      }
                      alt={`${person.firstName} ${person.lastName}`}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Initials first={person.firstName} last={person.lastName} />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold truncate">
                    {person.firstName} {person.lastName}
                  </h3>
                  {person.role && (
                    <p className="text-sm text-gray-500 truncate">
                      {person.role}
                    </p>
                  )}
                  {person.organization && (
                    <p className="text-xs text-gray-400 truncate">
                      {person.organization}
                    </p>
                  )}
                </div>
              </div>
              {person.skills && person.skills.length > 0 && (
                <div className="px-5 pb-4 flex flex-wrap gap-1">
                  {person.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
