import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from 'next-sanity';
import { Image } from 'next-sanity/image';
import Breadcrumbs from '@/components/modules/Breadcrumbs';
import CustomPortableText from '@/components/modules/PortableText';
import ShareWhatsApp from '@/components/modules/ShareWhatsApp';
import { Badge } from '@/components/ui/Badge';
import { serverEnv } from '@/env/serverEnv';
import { client } from '@/lib/sanity/client/client';
import { generateEventJsonLd } from '@/lib/sanity/client/jsonLd';
import { sanityFetch } from '@/lib/sanity/client/live';
import { urlForImage } from '@/lib/sanity/client/utils';
import { programDetailQuery, programSlugs } from '@/lib/sanity/queries/queries';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const { data } = await sanityFetch({
    query: programDetailQuery,
    params: { slug },
  });
  if (!data) return {};
  return {
    title: data.title,
    description: data.description || undefined,
    alternates: {
      canonical: `/programs/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await client.fetch(programSlugs, {
    limit: serverEnv.MAX_STATIC_PARAMS,
  });
  return slugs ? slugs.filter((s) => s !== null).map((slug) => ({ slug })) : [];
}

export default async function ProgramPage(props: Props) {
  const { slug } = await props.params;
  const { data: program } = await sanityFetch({
    query: programDetailQuery,
    params: { slug },
  });

  if (!program) notFound();

  const jsonLd = generateEventJsonLd(program);

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: 'Programs', href: '/programs' },
          { label: program.title || '' },
        ]}
      />
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <Badge>{program.programType}</Badge>
          <Badge variant="secondary">{program.status}</Badge>
          {program.date && (
            <time dateTime={program.date} className="text-sm text-gray-500">
              {new Date(program.date).toLocaleDateString()}
            </time>
          )}
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{program.title}</h1>
        {program.relatedArea && (
          <p className="text-gray-500">
            📍{' '}
            <Link
              href={`/areas/${program.relatedArea.slug}`}
              className="underline hover:text-gray-700"
            >
              {program.relatedArea.name}
            </Link>
          </p>
        )}
      </div>

      {program.image?.asset?._ref && (
        <div className="mb-8 rounded-2xl overflow-hidden">
          <Image
            src={
              urlForImage(program.image)
                ?.width(1200)
                .height(600)
                .fit('crop')
                .url() as string
            }
            alt={program.image?.alt || program.title}
            width={1200}
            height={600}
            className="w-full object-cover"
          />
        </div>
      )}

      {program.description && (
        <p className="text-xl text-gray-600 mb-8">{program.description}</p>
      )}

      {program.content && (
        <CustomPortableText value={program.content as PortableTextBlock[]} />
      )}

      <div className="mt-8 pt-6 border-t border-gray-100">
        <ShareWhatsApp title={program.title || ''} />
      </div>
    </div>
  );
}
