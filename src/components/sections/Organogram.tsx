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
  image?: { asset?: { _ref?: string }; alt?: string };
};

type Props = {
  section: {
    heading?: string;
    description?: string;
    inkosi?: Person;
    izinduna?: Person[];
    council?: Person[];
  };
};

function Initials({ first, last }: { first: string; last: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/80 to-secondary/80 text-white text-xl font-bold rounded-full">
      {first[0]}
      {last[0]}
    </div>
  );
}

function PersonNode({
  person,
  size = 'md',
}: {
  person: Person;
  size?: 'lg' | 'md' | 'sm';
}) {
  const dims = { lg: 'w-24 h-24', md: 'w-16 h-16', sm: 'w-12 h-12' }[size];
  const textSize = { lg: 'text-lg', md: 'text-sm', sm: 'text-xs' }[size];
  const imgPx = { lg: 192, md: 128, sm: 96 }[size];

  return (
    <Link
      href={`/people/${person.slug}`}
      className="flex flex-col items-center text-center group"
    >
      <div
        className={`${dims} rounded-full overflow-hidden bg-gray-100 mb-2 ring-2 ring-white shadow-md group-hover:ring-primary transition-all`}
      >
        {person.image?.asset?._ref ? (
          <Image
            src={
              urlForImage(person.image)
                ?.width(imgPx)
                .height(imgPx)
                .fit('crop')
                .url() as string
            }
            alt={`${person.firstName} ${person.lastName}`}
            width={imgPx}
            height={imgPx}
            className="object-cover w-full h-full"
          />
        ) : (
          <Initials first={person.firstName} last={person.lastName} />
        )}
      </div>
      <p
        className={`${textSize} font-semibold group-hover:text-primary transition-colors`}
      >
        {person.firstName} {person.lastName}
      </p>
      {person.role && (
        <p className="text-xs text-gray-500 mt-0.5">{person.role}</p>
      )}
    </Link>
  );
}

function Connector({ type }: { type: 'vertical' | 'branch' }) {
  if (type === 'vertical') {
    return (
      <div className="flex justify-center my-3">
        <div className="w-0.5 h-8 bg-gray-300" />
      </div>
    );
  }
  return (
    <div className="flex justify-center my-3">
      <div className="w-0.5 h-4 bg-gray-300" />
    </div>
  );
}

export default function Organogram({ section }: Props) {
  const { heading, description, inkosi, izinduna, council } = section;

  if (!inkosi && !izinduna?.length && !council?.length) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          {description && (
            <p className="text-xl text-gray-600">{description}</p>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Inkosi — top of hierarchy */}
          {inkosi && (
            <div className="flex flex-col items-center">
              <div className="bg-gray-50 rounded-2xl px-8 py-6 inline-flex flex-col items-center">
                <PersonNode person={inkosi} size="lg" />
              </div>
            </div>
          )}

          {/* Connector to Izinduna */}
          {inkosi && izinduna && izinduna.length > 0 && (
            <Connector type="vertical" />
          )}

          {/* Izinduna — second level */}
          {izinduna && izinduna.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="bg-gray-50 rounded-2xl px-6 py-5 inline-block">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide text-center mb-4">
                  Izinduna
                </p>
                <div className="flex flex-wrap justify-center gap-8">
                  {izinduna.map((person) => (
                    <PersonNode key={person._id} person={person} size="md" />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Connector to Council */}
          {izinduna && izinduna.length > 0 && council && council.length > 0 && (
            <Connector type="branch" />
          )}

          {/* Council — third level */}
          {council && council.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="bg-gray-50 rounded-2xl px-6 py-5 inline-block">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide text-center mb-4">
                  Council Members
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  {council.map((person) => (
                    <PersonNode key={person._id} person={person} size="sm" />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
