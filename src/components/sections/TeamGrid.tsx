import Link from 'next/link';
import { Image } from 'next-sanity/image';
import { urlForImage } from '@/lib/sanity/client/utils';

type Member = {
  _id: string;
  firstName: string;
  lastName: string;
  role?: string;
  slug: string;
  image?: { asset?: { _ref?: string }; alt?: string };
};

type Props = {
  section: {
    heading?: string;
    description?: string;
    members?: Member[];
  };
};

function Initials({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-400 to-blue-400 text-white text-3xl font-bold">
      {firstName[0]}
      {lastName[0]}
    </div>
  );
}

export default function TeamGrid({ section }: Props) {
  const { heading, description, members } = section;

  if (!members?.length) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          {description && (
            <p className="text-xl text-gray-600">{description}</p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {members.map((member) => (
            <Link
              key={member._id}
              href={`/author/${member.slug}`}
              className="group text-center"
            >
              <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                {member.image?.asset?._ref ? (
                  <Image
                    src={
                      urlForImage(member.image)
                        ?.width(320)
                        .height(320)
                        .fit('crop')
                        .url() as string
                    }
                    alt={
                      member.image?.alt ||
                      `${member.firstName} ${member.lastName}`
                    }
                    width={320}
                    height={320}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <Initials
                    firstName={member.firstName}
                    lastName={member.lastName}
                  />
                )}
              </div>
              <h3 className="text-lg font-semibold group-hover:text-pink-600 transition-colors">
                {member.firstName} {member.lastName}
              </h3>
              {member.role && (
                <p className="text-sm text-gray-500 mt-1">{member.role}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
