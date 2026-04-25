import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { serverEnv } from '@/env/serverEnv';
import { client } from '@/lib/sanity/client/client';
import { sanityFetch } from '@/lib/sanity/client/live';
import {
  opportunityDetailQuery,
  opportunitySlugs,
} from '@/lib/sanity/queries/queries';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const { data } = await sanityFetch({
    query: opportunityDetailQuery,
    params: { slug },
  });
  if (!data) return {};
  return {
    title: data.title,
    description: data.description || undefined,
  };
}

export async function generateStaticParams() {
  const slugs = await client.fetch(opportunitySlugs, {
    limit: serverEnv.MAX_STATIC_PARAMS,
  });
  return slugs ? slugs.filter((s) => s !== null).map((slug) => ({ slug })) : [];
}

export default async function OpportunityPage(props: Props) {
  const { slug } = await props.params;
  const { data: opp } = await sanityFetch({
    query: opportunityDetailQuery,
    params: { slug },
  });

  if (!opp) notFound();

  const isExpired = opp.deadline ? new Date(opp.deadline) < new Date() : false;

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <Badge>{opp.opportunityType}</Badge>
          {opp.organization && (
            <span className="text-sm text-gray-500">{opp.organization}</span>
          )}
          {opp.featured && (
            <span className="text-sm text-pink-600">⭐ Featured</span>
          )}
          {isExpired && <Badge variant="destructive">Closed</Badge>}
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{opp.title}</h1>
        {opp.relatedArea && (
          <p className="text-gray-500 mb-2">
            📍{' '}
            <Link
              href={`/areas/${opp.relatedArea.slug}`}
              className="underline hover:text-gray-700"
            >
              {opp.relatedArea.name}
            </Link>
          </p>
        )}
        {opp.deadline && (
          <p className="text-gray-500">
            Deadline:{' '}
            <time dateTime={opp.deadline} className="font-medium">
              {new Date(opp.deadline).toLocaleDateString()}
            </time>
          </p>
        )}
      </div>

      <div className="prose max-w-none mb-8">
        <p className="text-lg text-gray-700 whitespace-pre-line">
          {opp.description}
        </p>
      </div>

      {opp.link && !isExpired && (
        <Button asChild variant="default" size="lg">
          <a href={opp.link} target="_blank" rel="noopener noreferrer">
            Apply Now
          </a>
        </Button>
      )}
    </div>
  );
}
