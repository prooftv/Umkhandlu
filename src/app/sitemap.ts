import type { MetadataRoute } from 'next';
import { client } from '@/lib/sanity/client/client';
import { getSitemapQuery } from '@/lib/sanity/queries/queries';
import { getBaseUrl } from '@/utils/getBaseUrl';

function getPriority(href: string): number {
  if (href === '/') return 1.0;
  if (href === '/blog') return 0.8;
  if (href.startsWith('/blog/')) return 0.6;
  if (href.startsWith('/category/') || href.startsWith('/author/')) return 0.4;
  return 0.7;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const paths = await client.fetch(getSitemapQuery);

    if (!paths) return [];

    const baseUrl = getBaseUrl();

    return paths.map((path) => ({
      url: new URL(path.href ?? '/', baseUrl).toString(),
      lastModified: new Date(path._updatedAt),
      changeFrequency: path.href === '/' ? 'daily' : 'weekly',
      priority: getPriority(path.href ?? '/'),
    }));
  } catch (error) {
    console.error('Failed to generate sitemap:', error);
    return [];
  }
}
