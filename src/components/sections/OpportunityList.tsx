import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Image } from 'next-sanity/image';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { urlForImage } from '@/lib/sanity/client/utils';

type Opportunity = {
  _id: string;
  title: string;
  slug: string;
  opportunityType: string;
  description: string;
  organization?: string;
  deadline?: string;
  link?: string;
  featured?: boolean;
  image?: { asset?: { _ref?: string }; alt?: string };
};

type Props = {
  section: {
    heading?: string;
    description?: string;
    opportunities?: Opportunity[];
  };
};

const typeColors: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  job: 'default',
  training: 'secondary',
  bursary: 'outline',
  funding: 'outline',
};

const typeLabels: Record<string, string> = {
  job: 'Job',
  training: 'Training',
  bursary: 'Bursary',
  funding: 'Funding',
};

function isExpired(deadline?: string): boolean {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

function daysUntil(deadline: string): number {
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function OpportunityList({ section }: Props) {
  const { heading, description, opportunities } = section;

  const active = opportunities?.filter((o) => !isExpired(o.deadline));
  if (!active?.length)
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          {heading && (
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          )}
          <p className="text-gray-500">No opportunities available right now.</p>
        </div>
      </section>
    );

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
            {description && (
              <p className="text-xl text-gray-600">{description}</p>
            )}
          </div>

          <div className="space-y-4">
            {active.map((opp) => {
              const days = opp.deadline ? daysUntil(opp.deadline) : null;

              return (
                <article
                  key={opp._id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="flex">
                    {opp.image?.asset?._ref && (
                      <div className="hidden sm:block w-36 shrink-0">
                        <Image
                          src={
                            urlForImage(opp.image)
                              ?.width(288)
                              .height(200)
                              .fit('crop')
                              .url() as string
                          }
                          alt={opp.image?.alt || opp.title}
                          width={288}
                          height={200}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge
                              variant={
                                typeColors[opp.opportunityType] || 'outline'
                              }
                            >
                              {typeLabels[opp.opportunityType] ||
                                opp.opportunityType}
                            </Badge>
                            {opp.featured && (
                              <span className="text-xs text-primary font-medium">
                                ⭐ Featured
                              </span>
                            )}
                            {opp.organization && (
                              <span className="text-xs text-gray-500">
                                {opp.organization}
                              </span>
                            )}
                          </div>
                          <Link
                            href={`/opportunities/${opp.slug}`}
                            className="text-lg font-semibold mb-1 hover:text-primary transition-colors"
                          >
                            {opp.title}
                          </Link>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {opp.description}
                          </p>
                        </div>
                        <div className="text-right shrink-0 flex flex-col items-end gap-2">
                          {opp.deadline && (
                            <div>
                              <time
                                dateTime={opp.deadline}
                                className="text-xs text-gray-400 block"
                              >
                                Closes{' '}
                                {new Date(opp.deadline).toLocaleDateString()}
                              </time>
                              {days !== null && days <= 7 && days > 0 && (
                                <span className="text-xs text-red-500 font-medium">
                                  {days} day{days !== 1 ? 's' : ''} left
                                </span>
                              )}
                            </div>
                          )}
                          {opp.link && (
                            <Button asChild variant="default" size="sm">
                              <a
                                href={opp.link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Apply
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/opportunities">
                View All Opportunities <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
