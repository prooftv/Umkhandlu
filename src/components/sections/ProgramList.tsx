import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Image } from 'next-sanity/image';
import { Badge } from '@/components/ui/Badge';
import { urlForImage } from '@/lib/sanity/client/utils';

type Program = {
  _id: string;
  title: string;
  programType: string;
  status: string;
  date?: string;
  description?: string;
  image?: { asset?: { _ref?: string }; alt?: string };
};

type Props = {
  section: {
    heading?: string;
    description?: string;
    programs?: Program[];
  };
};

const statusColors: Record<string, 'default' | 'secondary' | 'outline'> = {
  upcoming: 'default',
  active: 'secondary',
  completed: 'outline',
};

export default function ProgramList({ section }: Props) {
  const { heading, description, programs } = section;

  if (!programs?.length) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          {description && (
            <p className="text-xl text-gray-600">{description}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {programs.map((program) => (
            <article
              key={program._id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {program.image?.asset?._ref && (
                <div className="relative h-40">
                  <Image
                    src={
                      urlForImage(program.image)
                        ?.width(600)
                        .height(300)
                        .fit('crop')
                        .url() as string
                    }
                    alt={program.image?.alt || program.title}
                    width={600}
                    height={300}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={statusColors[program.status] || 'outline'}>
                    {program.status}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {program.programType}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-1">{program.title}</h3>
                {program.description && (
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {program.description}
                  </p>
                )}
                {program.date && (
                  <time
                    dateTime={program.date}
                    className="text-xs text-gray-400"
                  >
                    {new Date(program.date).toLocaleDateString()}
                  </time>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild variant="outline" size="lg">
            <Link href="/programs">
              View All Programs <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
